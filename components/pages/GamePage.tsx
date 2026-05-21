'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
const CENTER = new THREE.Vector2(0, 0);
import { useGameStore, BLOCKS } from '@/stores/gameStore';
import GameHUD from '@/components/game/GameHUD';
import ChatBox from '@/components/game/ChatBox';
import GameMenu from '@/components/game/GameMenu';
import ServerBrowser from '@/components/game/ServerBrowser';
import { GAME_MODES } from '@/lib/gameData';

// ─── Voxel World ─────────────────────────────────────────────────────────────

const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;
const SEA_LEVEL = 32;

type VoxelMap = Map<string, number>;

function key(x: number, y: number, z: number) { return `${x},${y},${z}`; }

function generateTerrain(): VoxelMap {
  const map: VoxelMap = new Map();
  for (let x = -24; x < 24; x++) {
    for (let z = -24; z < 24; z++) {
      const height = Math.floor(
        SEA_LEVEL +
        4 * Math.sin(x * 0.15) * Math.cos(z * 0.15) +
        2 * Math.sin(x * 0.3 + z * 0.2) +
        Math.random() * 2
      );
      for (let y = 0; y <= height; y++) {
        if (y === height) map.set(key(x, y, z), 1);        // grass
        else if (y >= height - 3) map.set(key(x, y, z), 2); // dirt
        else map.set(key(x, y, z), 3);                       // stone
      }
      // Trees
      if (Math.random() < 0.03 && height > SEA_LEVEL) {
        const th = 3 + Math.floor(Math.random() * 3);
        for (let ty = 1; ty <= th; ty++) map.set(key(x, height + ty, z), 4); // wood
        for (let lx = -2; lx <= 2; lx++) for (let lz = -2; lz <= 2; lz++)
          for (let ly = th - 1; ly <= th + 1; ly++)
            if (!map.has(key(x + lx, height + ly, z + lz)))
              map.set(key(x + lx, height + ly, z + lz), 1);
      }
    }
  }
  return map;
}

const BLOCK_COLORS: Record<number, number> = {
  1: 0x4ade80, 2: 0x92400e, 3: 0x6b7280,
  4: 0xa16207, 5: 0xfbbf24, 6: 0x3b82f6,
  7: 0xef4444, 8: 0x1e1b4b, 9: 0xe0f2fe,
};

function buildChunkMesh(voxels: VoxelMap, scene: THREE.Scene): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const matCache: Record<number, THREE.MeshLambertMaterial> = {};

  for (const [k, id] of voxels) {
    const [x, y, z] = k.split(',').map(Number);
    // Skip if all 6 neighbors are filled (interior block)
    const neighbors = [
      voxels.has(key(x+1,y,z)), voxels.has(key(x-1,y,z)),
      voxels.has(key(x,y+1,z)), voxels.has(key(x,y-1,z)),
      voxels.has(key(x,y,z+1)), voxels.has(key(x,y,z-1)),
    ];
    if (neighbors.every(Boolean)) continue;

    if (!matCache[id]) {
      matCache[id] = new THREE.MeshLambertMaterial({
        color: BLOCK_COLORS[id] ?? 0xffffff,
        transparent: id === 6 || id === 9,
        opacity: id === 6 ? 0.7 : id === 9 ? 0.5 : 1,
      });
    }
    const mesh = new THREE.Mesh(geo, matCache[id]);
    mesh.position.set(x, y, z);
    mesh.userData = { blockId: id, voxelKey: k, x, y, z };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshes.push(mesh);
  }
  return meshes;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GamePage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const voxelsRef = useRef<VoxelMap>(new Map());
  const frameRef = useRef<number>(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const playerRef = useRef({ x: 0, y: SEA_LEVEL + 5, z: 0, velY: 0, onGround: false, yaw: 0, pitch: 0 });
  const pointerLockedRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const highlightRef = useRef<THREE.Mesh | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const {
    activeGameMode, setCurrentPage, selectedSlot, setSelectedSlot,
    inventory, health, hunger, score, updateScore, takeDamage, settings,
    addChatMessage, chatOpen, setChatOpen,
  } = useGameStore();

  const [fps, setFps] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showServerBrowser, setShowServerBrowser] = useState(false);
  const [started, setStarted] = useState(false);
  const [loadingPct, setLoadingPct] = useState(0);

  const modeInfo = GAME_MODES.find(m => m.id === activeGameMode);

  // ── Init Three.js ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !started) return;
    const container = canvasRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 20, settings.renderDistance * 4);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(settings.fov, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, SEA_LEVEL + 5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(50, 100, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 300;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x404060, 0.6));
    scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4ade80, 0.4));

    // Block highlight
    const hlGeo = new THREE.BoxGeometry(1.01, 1.01, 1.01);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 });
    const highlight = new THREE.Mesh(hlGeo, hlMat);
    highlight.visible = false;
    scene.add(highlight);
    highlightRef.current = highlight;

    // Sky particles (clouds)
    const cloudGeo = new THREE.BoxGeometry(1, 0.4, 1);
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 30; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.scale.set(4 + Math.random() * 8, 1, 3 + Math.random() * 5);
      cloud.position.set(
        (Math.random() - 0.5) * 100,
        SEA_LEVEL + 25 + Math.random() * 10,
        (Math.random() - 0.5) * 100,
      );
      scene.add(cloud);
    }

    // Terrain generation with loading progress
    let pct = 0;
    const loadInterval = setInterval(() => {
      pct = Math.min(pct + 8, 90);
      setLoadingPct(pct);
    }, 80);

    setTimeout(() => {
      const voxels = generateTerrain();
      voxelsRef.current = voxels;
      clearInterval(loadInterval);
      setLoadingPct(95);
      const meshes = buildChunkMesh(voxels, scene);
      meshesRef.current = meshes;
      setLoadingPct(100);
      addChatMessage({ player: 'System', message: `Joined ${modeInfo?.name ?? 'Game'} server!`, color: '#22c55e', type: 'system' });
    }, 800);

    // Handle resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      cancelAnimationFrame(frameRef.current);
    };
  }, [started]);

  // ── Game Loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started) return;
    const GRAVITY = -18;
    const JUMP = 7;
    const SPEED = 4.5;
    let fpsFrames = 0;
    let fpsTime = 0;

    function isVoxel(x: number, y: number, z: number) {
      return voxelsRef.current.has(key(Math.floor(x), Math.floor(y), Math.floor(z)));
    }

    function loop() {
      frameRef.current = requestAnimationFrame(loop);
      const dt = Math.min(clockRef.current.getDelta(), 0.05);
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!scene || !camera || !renderer) return;

      const p = playerRef.current;
      const keys = keysRef.current;

      // FPS
      fpsFrames++;
      fpsTime += dt;
      if (fpsTime >= 0.5) { setFps(Math.round(fpsFrames / fpsTime)); fpsFrames = 0; fpsTime = 0; }

      // Movement
      const yaw = p.yaw;
      const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const move = new THREE.Vector3();

      if (keys['KeyW'] || keys['ArrowUp'])    move.addScaledVector(forward, SPEED * dt);
      if (keys['KeyS'] || keys['ArrowDown'])  move.addScaledVector(forward, -SPEED * dt);
      if (keys['KeyA'] || keys['ArrowLeft'])  move.addScaledVector(right, -SPEED * dt);
      if (keys['KeyD'] || keys['ArrowRight']) move.addScaledVector(right, SPEED * dt);

      if ((keys['Space']) && p.onGround) { p.velY = JUMP; p.onGround = false; }

      p.velY += GRAVITY * dt;
      const nextY = p.y + p.velY * dt;

      // Simple ground collision
      const groundY = Math.floor(p.y - 1.8);
      if (p.velY < 0 && isVoxel(Math.floor(p.x), groundY, Math.floor(p.z))) {
        p.y = groundY + 1 + 1.8;
        p.velY = 0;
        p.onGround = true;
      } else {
        p.y = nextY;
        p.onGround = false;
      }

      // Horizontal movement with simple collision
      const nx = p.x + move.x;
      if (!isVoxel(Math.floor(nx), Math.floor(p.y - 0.5), Math.floor(p.z)) &&
          !isVoxel(Math.floor(nx), Math.floor(p.y - 1.5), Math.floor(p.z))) p.x = nx;
      const nz = p.z + move.z;
      if (!isVoxel(Math.floor(p.x), Math.floor(p.y - 0.5), Math.floor(nz)) &&
          !isVoxel(Math.floor(p.x), Math.floor(p.y - 1.5), Math.floor(nz))) p.z = nz;

      // Keep above bedrock
      if (p.y < 1) { p.y = 1; p.velY = 0; }

      // Camera
      camera.position.set(p.x, p.y, p.z);
      camera.rotation.order = 'YXZ';
      camera.rotation.y = p.yaw;
      camera.rotation.x = p.pitch;

      // Raycasting for block highlight + interaction
      if (highlightRef.current) {
        raycasterRef.current.setFromCamera(CENTER, camera);
        const hits = raycasterRef.current.intersectObjects(meshesRef.current);
        if (hits.length > 0 && hits[0].distance < 6) {
          const hit = hits[0];
          const pos = hit.object.position;
          highlightRef.current.position.copy(pos);
          highlightRef.current.visible = true;
        } else {
          highlightRef.current.visible = false;
        }
      }

      // Animate clouds slowly
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry
            && child.position.y > SEA_LEVEL + 20) {
          child.position.x += 0.005;
          if (child.position.x > 60) child.position.x = -60;
        }
      });

      renderer.render(scene, camera);
    }

    loop();
    return () => cancelAnimationFrame(frameRef.current);
  }, [started]);

  // ── Controls ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (chatOpen) return;
      keysRef.current[e.code] = down;
      if (down) {
        if (e.code === 'Escape') { setShowMenu(m => !m); document.exitPointerLock(); }
        if (e.code === 'KeyT') { e.preventDefault(); setChatOpen(true); }
        if (e.code === 'KeyB') setShowServerBrowser(s => !s);
        const digit = parseInt(e.code.replace('Digit',''));
        if (digit >= 1 && digit <= 9) setSelectedSlot(digit - 1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY > 0 ? 1 : -1;
      setSelectedSlot((useGameStore.getState().selectedSlot + delta + 9) % 9);
    };

    const onMouse = (e: MouseEvent) => {
      if (!pointerLockedRef.current || chatOpen) return;
      const sens = settings.sensitivity / 5000;
      playerRef.current.yaw -= e.movementX * sens;
      playerRef.current.pitch = Math.max(-Math.PI/2 + 0.01, Math.min(Math.PI/2 - 0.01, playerRef.current.pitch - e.movementY * sens));
    };

    const onClick = (e: MouseEvent) => {
      if (chatOpen) return;
      if (!pointerLockedRef.current) {
        canvasRef.current?.requestPointerLock();
        return;
      }
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (!camera || !scene) return;

      raycasterRef.current.setFromCamera(CENTER, camera);
      const hits = raycasterRef.current.intersectObjects(meshesRef.current);
      if (!hits.length || hits[0].distance > 6) return;

      const hit = hits[0];
      if (e.button === 0) {
        // Break block
        const vkey = (hit.object as THREE.Mesh).userData.voxelKey;
        if (vkey) {
          voxelsRef.current.delete(vkey);
          scene.remove(hit.object);
          meshesRef.current = meshesRef.current.filter(m => m !== hit.object);
          updateScore(1);
          addChatMessage({ player: 'System', message: 'Block broken!', color: '#f97316', type: 'system' });
        }
      } else if (e.button === 2) {
        // Place block
        const normal = hit.face?.normal ?? new THREE.Vector3(0,1,0);
        const pos = hit.object.position.clone().add(normal);
        const px = Math.round(pos.x), py = Math.round(pos.y), pz = Math.round(pos.z);
        const vk = key(px, py, pz);
        if (!voxelsRef.current.has(vk)) {
          const block = inventory[selectedSlot];
          const blockId = block?.id ?? 1;
          voxelsRef.current.set(vk, blockId);
          const geo = new THREE.BoxGeometry(1,1,1);
          const mat = new THREE.MeshLambertMaterial({ color: BLOCK_COLORS[blockId] ?? 0xffffff });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(px, py, pz);
          mesh.userData = { blockId, voxelKey: vk, x: px, y: py, z: pz };
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);
          meshesRef.current.push(mesh);
        }
      }
    };

    const onPointerChange = () => {
      pointerLockedRef.current = document.pointerLockElement === canvasRef.current?.querySelector('canvas');
    };

    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('wheel', onWheel);
    document.addEventListener('pointerlockchange', onPointerChange);

    return () => {
      window.removeEventListener('keydown', e => onKey(e, true));
      window.removeEventListener('keyup', e => onKey(e, false));
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('pointerlockchange', onPointerChange);
    };
  }, [started, chatOpen, selectedSlot, inventory, settings.sensitivity]);

  // ── Pre-game lobby screen ──────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6"
        style={{ background: 'var(--bg-dark)' }}>
        <button onClick={() => setCurrentPage('home')}
          className="absolute top-4 left-4 px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition-colors"
          style={{ background: '#111827', border: '1px solid #1e293b' }}>
          ← Back
        </button>

        <div className="text-center animate-bounce-in">
          <div className="text-7xl mb-4">{modeInfo?.emoji ?? '🎮'}</div>
          <h1 className="font-game text-4xl text-white mb-2">{modeInfo?.name ?? 'Game'}</h1>
          <p className="text-slate-400 mb-1">{modeInfo?.description}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-8 mt-3">
            {modeInfo?.features.map(f => (
              <span key={f} className="px-3 py-1 rounded-full text-xs font-bold text-blue-400"
                style={{ background: '#3b82f622', border: '1px solid #3b82f644' }}>✓ {f}</span>
            ))}
          </div>

          {/* Controls reference */}
          <div className="p-5 rounded-2xl mb-6 text-left max-w-sm mx-auto"
            style={{ background: '#111827', border: '1px solid #1e293b' }}>
            <div className="text-sm font-bold text-white mb-3">⌨️ Controls</div>
            <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-400">
              <span>WASD / Arrows</span><span className="text-slate-300">Move</span>
              <span>Space</span><span className="text-slate-300">Jump</span>
              <span>Left Click</span><span className="text-slate-300">Break Block</span>
              <span>Right Click</span><span className="text-slate-300">Place Block</span>
              <span>Scroll / 1-9</span><span className="text-slate-300">Select Block</span>
              <span>T</span><span className="text-slate-300">Chat</span>
              <span>B</span><span className="text-slate-300">Server Browser</span>
              <span>Esc</span><span className="text-slate-300">Menu</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => setStarted(true)}
              className="px-10 py-4 rounded-xl font-game text-xl text-white transition-all hover:scale-105 glow-green"
              style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
              ▶ Start Game
            </button>
            <button onClick={() => setShowServerBrowser(true)}
              className="px-6 py-4 rounded-xl font-bold text-slate-300 transition-all hover:bg-white/10"
              style={{ border: '1px solid #334155' }}>
              🌐 Server Browser
            </button>
          </div>
        </div>

        {showServerBrowser && <ServerBrowser onClose={() => setShowServerBrowser(false)} />}
      </div>
    );
  }

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loadingPct < 100) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: '#0a0e1a' }}>
        <div className="text-6xl animate-spin-slow">⛏️</div>
        <div className="font-game text-2xl text-white">Generating World…</div>
        <div className="w-64 h-3 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
          <div className="h-full rounded-full transition-all progress-bar" style={{ width: `${loadingPct}%` }} />
        </div>
        <div className="text-slate-400 text-sm">{loadingPct}%</div>
        <div className="text-slate-500 text-xs mt-2 font-pixel">TIP: Right-click to place blocks!</div>
      </div>
    );
  }

  // ── Game view ──────────────────────────────────────────────────────────────
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Three.js canvas container */}
      <div ref={canvasRef} className="absolute inset-0 cursor-crosshair"
        onContextMenu={e => e.preventDefault()} />

      {/* Crosshair */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-6 h-6 crosshair" />
      </div>

      {/* HUD */}
      <GameHUD fps={fps} />

      {/* Chat */}
      <ChatBox />

      {/* Game Menu */}
      {showMenu && <GameMenu onClose={() => setShowMenu(false)} />}

      {/* Server Browser */}
      {showServerBrowser && <ServerBrowser onClose={() => setShowServerBrowser(false)} />}

      {/* Pointer lock click-to-play overlay */}
      {!pointerLockedRef.current && !showMenu && !showServerBrowser && !chatOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
          onClick={() => canvasRef.current?.querySelector('canvas')?.requestPointerLock?.() || canvasRef.current?.requestPointerLock?.()}>
          <div className="text-center">
            <div className="text-4xl mb-3">🖱️</div>
            <div className="font-bold text-white text-lg">Click to capture mouse</div>
            <div className="text-slate-400 text-sm mt-1">Press Esc to release · T to chat · B for servers</div>
          </div>
        </div>
      )}
    </div>
  );
}
