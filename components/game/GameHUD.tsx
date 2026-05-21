'use client';
import { useGameStore, BLOCKS } from '@/stores/gameStore';

interface Props { fps: number; }

export default function GameHUD({ fps }: Props) {
  const { health, maxHealth, hunger, score, selectedSlot, setSelectedSlot, inventory, settings, setCurrentPage, activeGameMode } = useGameStore();

  const hearts = Array.from({ length: maxHealth / 2 }, (_, i) => {
    const filled = health / 2 > i ? (health / 2 >= i + 1 ? 'full' : 'half') : 'empty';
    return filled;
  });

  const hungerBars = Array.from({ length: hunger / 2 }, (_, i) => {
    const filled = hunger / 2 > i ? (hunger / 2 >= i + 1 ? 'full' : 'half') : 'empty';
    return filled;
  });

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button className="pointer-events-auto px-3 py-1 rounded-lg text-xs font-bold text-white transition-all hover:bg-white/20"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={() => setCurrentPage('home')}>
            ← Exit
          </button>
          {/* Mode */}
          <span className="text-white text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            🎮 {activeGameMode?.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Score */}
          <div className="text-white text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            💎 {score}
          </div>
          {/* FPS */}
          {settings.showFPS && (
            <div className="text-xs font-bold px-2 py-1 rounded"
              style={{ background: 'rgba(0,0,0,0.7)', color: fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444' }}>
              {fps} FPS
            </div>
          )}
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-3 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', paddingTop: '40px' }}>

        {/* Health & Hunger */}
        <div className="flex items-center justify-between w-full max-w-sm px-4 mb-2">
          {/* Health hearts */}
          <div className="flex gap-0.5">
            {hearts.slice(0, 10).map((h, i) => (
              <span key={i} className="text-sm leading-none select-none" style={{
                filter: h === 'empty' ? 'grayscale(1) opacity(0.4)' : 'none',
              }}>
                {h === 'half' ? '🖤' : '❤️'}
              </span>
            ))}
          </div>
          {/* Hunger */}
          <div className="flex gap-0.5 flex-row-reverse">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="text-sm leading-none select-none"
                style={{ filter: i >= hunger / 2 ? 'grayscale(1) opacity(0.4)' : 'none' }}>
                🍗
              </span>
            ))}
          </div>
        </div>

        {/* Hotbar */}
        <div className="flex gap-1">
          {inventory.slice(0, 9).map((block, i) => (
            <button key={i}
              className={`hotbar-slot pointer-events-auto rounded ${selectedSlot === i ? 'active' : ''}`}
              onClick={() => setSelectedSlot(i)}
              style={{ background: block ? `${block.color}33` : 'rgba(0,0,0,0.5)' }}>
              {block && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-xl leading-none">{block.emoji}</span>
                  <span className="text-white/60" style={{ fontSize: '9px' }}>{block.name.slice(0,4)}</span>
                </div>
              )}
              <span className="absolute bottom-0 right-0.5 text-white/60 font-bold" style={{ fontSize: '9px' }}>
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Selected block name */}
        {inventory[selectedSlot] && (
          <div className="mt-1.5 text-white/70 text-xs font-bold select-none">
            {inventory[selectedSlot]?.name}
          </div>
        )}
      </div>
    </>
  );
}
