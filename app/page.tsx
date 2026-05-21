import { create } from 'zustand';

export type GameMode = 'doodlecube' | 'bedwars' | 'bloxdhop' | 'survival' | 'creative' | 'pvp' | 'towerdefense' | 'deathrun';

export interface Player {
  id: string;
  name: string;
  skin: string;
  kills: number;
  deaths: number;
  level: number;
  coins: number;
  online: boolean;
  ping: number;
}

export interface ChatMessage {
  id: string;
  player: string;
  message: string;
  color: string;
  timestamp: number;
  type: 'chat' | 'system' | 'kill';
}

export interface GameServer {
  id: string;
  mode: GameMode;
  players: number;
  maxPlayers: number;
  map: string;
  ping: number;
  region: string;
}

interface GameState {
  // UI State
  currentPage: 'home' | 'game' | 'profile' | 'leaderboard' | 'shop' | 'settings';
  activeGameMode: GameMode | null;
  
  // Player
  localPlayer: Player;
  players: Player[];
  
  // Game
  gameStarted: boolean;
  gameMode: GameMode | null;
  score: number;
  health: number;
  maxHealth: number;
  hunger: number;
  selectedSlot: number;
  inventory: (BlockType | null)[];
  
  // Chat
  chatMessages: ChatMessage[];
  chatOpen: boolean;
  
  // Servers
  servers: GameServer[];
  
  // Settings
  settings: {
    fov: number;
    sensitivity: number;
    renderDistance: number;
    musicVolume: number;
    sfxVolume: number;
    showFPS: boolean;
    crosshair: string;
    skin: string;
  };
  
  // Actions
  setCurrentPage: (page: GameState['currentPage']) => void;
  setActiveGameMode: (mode: GameMode | null) => void;
  startGame: (mode: GameMode) => void;
  stopGame: () => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setChatOpen: (open: boolean) => void;
  setSelectedSlot: (slot: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  updateScore: (delta: number) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  setLocalPlayerName: (name: string) => void;
}

export type BlockType = {
  id: number;
  name: string;
  color: string;
  emoji: string;
  hardness: number;
};

export const BLOCKS: BlockType[] = [
  { id: 1, name: 'Grass', color: '#4ade80', emoji: '🟩', hardness: 1 },
  { id: 2, name: 'Dirt', color: '#92400e', emoji: '🟫', hardness: 1 },
  { id: 3, name: 'Stone', color: '#6b7280', emoji: '⬜', hardness: 2 },
  { id: 4, name: 'Wood', color: '#a16207', emoji: '🟤', hardness: 1.5 },
  { id: 5, name: 'Sand', color: '#fbbf24', emoji: '🟡', hardness: 0.5 },
  { id: 6, name: 'Water', color: '#3b82f6', emoji: '🔵', hardness: 0 },
  { id: 7, name: 'Lava', color: '#ef4444', emoji: '🔴', hardness: 0 },
  { id: 8, name: 'Obsidian', color: '#1e1b4b', emoji: '🟣', hardness: 5 },
  { id: 9, name: 'Glass', color: '#e0f2fe', emoji: '🔲', hardness: 0.3 },
];

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'ProBuilder99', skin: 'steve', kills: 234, deaths: 45, level: 42, coins: 8500, online: true, ping: 23 },
  { id: '2', name: 'VoxelKing', skin: 'alex', kills: 567, deaths: 89, level: 78, coins: 23000, online: true, ping: 45 },
  { id: '3', name: 'CreeperSlayer', skin: 'creeper', kills: 123, deaths: 234, level: 15, coins: 1200, online: true, ping: 67 },
  { id: '4', name: 'BlockMaster', skin: 'steve', kills: 890, deaths: 120, level: 95, coins: 45600, online: false, ping: 0 },
  { id: '5', name: 'NightHunter', skin: 'alex', kills: 345, deaths: 78, level: 55, coins: 12300, online: true, ping: 89 },
  { id: '6', name: 'SkyWalker42', skin: 'steve', kills: 678, deaths: 345, level: 67, coins: 19800, online: true, ping: 34 },
  { id: '7', name: 'DiamondMiner', skin: 'alex', kills: 45, deaths: 23, level: 8, coins: 450, online: true, ping: 112 },
  { id: '8', name: 'RedstoneGenius', skin: 'creeper', kills: 999, deaths: 100, level: 100, coins: 99999, online: true, ping: 12 },
];

const MOCK_SERVERS: GameServer[] = [
  { id: 's1', mode: 'doodlecube', players: 23, maxPlayers: 30, map: 'Pixel Island', ping: 23, region: 'US-East' },
  { id: 's2', mode: 'bedwars', players: 16, maxPlayers: 16, map: 'Dragon Arena', ping: 45, region: 'EU-West' },
  { id: 's3', mode: 'bloxdhop', players: 8, maxPlayers: 20, map: 'Sky Towers', ping: 67, region: 'US-West' },
  { id: 's4', mode: 'survival', players: 45, maxPlayers: 50, map: 'Wild Forest', ping: 34, region: 'Asia' },
  { id: 's5', mode: 'pvp', players: 12, maxPlayers: 20, map: 'Death Valley', ping: 89, region: 'US-East' },
  { id: 's6', mode: 'creative', players: 7, maxPlayers: 30, map: 'Build World', ping: 23, region: 'EU-West' },
  { id: 's7', mode: 'deathrun', players: 10, maxPlayers: 15, map: 'Lava Run', ping: 55, region: 'US-East' },
];

export const useGameStore = create<GameState>((set, get) => ({
  currentPage: 'home',
  activeGameMode: null,
  localPlayer: {
    id: 'local',
    name: 'Player' + Math.floor(Math.random() * 9999),
    skin: 'steve',
    kills: 0,
    deaths: 0,
    level: 1,
    coins: 250,
    online: true,
    ping: 30,
  },
  players: MOCK_PLAYERS,
  gameStarted: false,
  gameMode: null,
  score: 0,
  health: 20,
  maxHealth: 20,
  hunger: 20,
  selectedSlot: 0,
  inventory: [BLOCKS[0], BLOCKS[1], BLOCKS[2], BLOCKS[3], BLOCKS[4], BLOCKS[5], BLOCKS[6], BLOCKS[7], BLOCKS[8]],
  chatMessages: [
    { id: '1', player: 'System', message: 'Welcome to Bloxd.io! Have fun!', color: '#22c55e', timestamp: Date.now() - 30000, type: 'system' },
    { id: '2', player: 'ProBuilder99', message: 'gg wp everyone!', color: '#3b82f6', timestamp: Date.now() - 20000, type: 'chat' },
    { id: '3', player: 'VoxelKing', message: 'anyone want to team up?', color: '#a855f7', timestamp: Date.now() - 10000, type: 'chat' },
  ],
  chatOpen: false,
  servers: MOCK_SERVERS,
  settings: {
    fov: 90,
    sensitivity: 50,
    renderDistance: 8,
    musicVolume: 50,
    sfxVolume: 80,
    showFPS: true,
    crosshair: 'default',
    skin: 'steve',
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setActiveGameMode: (mode) => set({ activeGameMode: mode }),
  startGame: (mode) => set({ gameStarted: true, gameMode: mode, score: 0, health: 20, hunger: 20 }),
  stopGame: () => set({ gameStarted: false, gameMode: null }),
  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages.slice(-49), { ...msg, id: Date.now().toString(), timestamp: Date.now() }]
  })),
  setChatOpen: (open) => set({ chatOpen: open }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  takeDamage: (amount) => set((state) => ({ health: Math.max(0, state.health - amount) })),
  heal: (amount) => set((state) => ({ health: Math.min(state.maxHealth, state.health + amount) })),
  updateScore: (delta) => set((state) => ({ score: state.score + delta })),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  setLocalPlayerName: (name) => set((state) => ({ localPlayer: { ...state.localPlayer, name } })),
}));
