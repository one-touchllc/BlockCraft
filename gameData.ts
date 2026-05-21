export interface GameModeInfo {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  emoji: string;
  color: string;
  gradient: string;
  players: string;
  featured: boolean;
  tags: string[];
  maxPlayers: number;
  features: string[];
}

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'doodlecube',
    name: 'DoodleCube',
    description: 'Draw and guess voxel art with friends!',
    longDescription: 'One player builds a word in voxels while others race to guess it. The faster you guess, the more points you earn!',
    emoji: '🎨',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    players: '2-8',
    featured: true,
    tags: ['Creative', 'Party', 'Fun'],
    maxPlayers: 8,
    features: ['Voxel Drawing', 'Word Guessing', 'Point System', 'Custom Words'],
  },
  {
    id: 'bedwars',
    name: 'BedWars',
    description: 'Protect your bed, destroy others!',
    longDescription: 'Collect resources, upgrade your gear, and destroy enemy beds before they destroy yours. Last team standing wins!',
    emoji: '🛏️',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-600',
    players: '4-16',
    featured: true,
    tags: ['PvP', 'Strategy', 'Teams'],
    maxPlayers: 16,
    features: ['Team Play', 'Resource Collecting', 'Shop System', 'Map Destruction'],
  },
  {
    id: 'bloxdhop',
    name: 'BloxdHop',
    description: 'Parkour through challenging maps!',
    longDescription: 'Jump, sprint, and fly through increasingly difficult parkour courses. Set record times and compete globally!',
    emoji: '🏃',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-600',
    players: '1-20',
    featured: true,
    tags: ['Parkour', 'Speed', 'Skills'],
    maxPlayers: 20,
    features: ['Parkour Maps', 'Timer System', 'Checkpoints', 'Global Leaderboard'],
  },
  {
    id: 'survival',
    name: 'Survival',
    description: 'Mine, craft, and survive together!',
    longDescription: 'Classic survival experience with mining, crafting, building, and fighting monsters. Multiplayer with up to 50 players!',
    emoji: '⛏️',
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-600',
    players: '1-50',
    featured: true,
    tags: ['Survival', 'Crafting', 'Open World'],
    maxPlayers: 50,
    features: ['Mining', 'Crafting', 'Mobs', 'Day/Night Cycle'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Build anything your imagination desires!',
    longDescription: 'Unlimited blocks, fly mode, and a huge canvas. Build solo or collaborate with friends on massive structures!',
    emoji: '🏗️',
    color: '#a855f7',
    gradient: 'from-purple-500 to-violet-600',
    players: '1-30',
    featured: false,
    tags: ['Building', 'Creative', 'Sandbox'],
    maxPlayers: 30,
    features: ['Unlimited Blocks', 'Fly Mode', 'World Edit', 'Blueprint Save'],
  },
  {
    id: 'pvp',
    name: 'PvP Arena',
    description: 'Fight for glory in intense PvP battles!',
    longDescription: 'Gear up and fight in fast-paced PvP arenas. Multiple weapons, power-ups, and dynamic maps!',
    emoji: '⚔️',
    color: '#f97316',
    gradient: 'from-orange-500 to-amber-600',
    players: '2-20',
    featured: false,
    tags: ['PvP', 'Combat', 'Competitive'],
    maxPlayers: 20,
    features: ['Multiple Weapons', 'Power-ups', 'Kill Streaks', 'Ranked Mode'],
  },
  {
    id: 'towerdefense',
    name: 'Tower Defense',
    description: 'Build towers, defeat the waves!',
    longDescription: 'Place strategic towers to defeat waves of enemies. Upgrade your defenses and survive as long as possible!',
    emoji: '🗼',
    color: '#eab308',
    gradient: 'from-yellow-500 to-amber-500',
    players: '1-4',
    featured: false,
    tags: ['Strategy', 'Tower Defense', 'Co-op'],
    maxPlayers: 4,
    features: ['Tower Building', 'Enemy Waves', 'Upgrades', 'Co-op Mode'],
  },
  {
    id: 'deathrun',
    name: 'Death Run',
    description: 'Survive deadly traps to reach the end!',
    longDescription: 'One player sets deadly traps while others try to reach the finish line. Reflexes and timing are everything!',
    emoji: '💀',
    color: '#64748b',
    gradient: 'from-slate-500 to-gray-600',
    players: '2-15',
    featured: false,
    tags: ['Traps', 'Parkour', 'Party'],
    maxPlayers: 15,
    features: ['Trap System', 'Multiple Maps', 'Role System', 'Speed Boost'],
  },
];

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'RedstoneGenius', level: 100, kills: 9999, wins: 1247, coins: 99999, badge: '👑' },
  { rank: 2, name: 'BlockMaster', level: 95, kills: 8901, wins: 987, coins: 45600, badge: '🥈' },
  { rank: 3, name: 'VoxelKing', level: 78, kills: 5678, wins: 756, coins: 23000, badge: '🥉' },
  { rank: 4, name: 'SkyWalker42', level: 67, kills: 6789, wins: 543, coins: 19800, badge: '' },
  { rank: 5, name: 'NightHunter', level: 55, kills: 3456, wins: 432, coins: 12300, badge: '' },
  { rank: 6, name: 'ProBuilder99', level: 42, kills: 2345, wins: 321, coins: 8500, badge: '' },
  { rank: 7, name: 'CreeperSlayer', level: 15, kills: 1234, wins: 123, coins: 1200, badge: '' },
  { rank: 8, name: 'DiamondMiner', level: 8, kills: 456, wins: 45, coins: 450, badge: '' },
];

export const SHOP_ITEMS = [
  { id: 1, name: 'Rainbow Skin', price: 500, emoji: '🌈', type: 'skin', rarity: 'rare' },
  { id: 2, name: 'Dragon Wings', price: 1000, emoji: '🐉', type: 'cosmetic', rarity: 'epic' },
  { id: 3, name: 'Laser Sword', price: 750, emoji: '⚡', type: 'weapon_skin', rarity: 'rare' },
  { id: 4, name: 'Golden Pickaxe', price: 300, emoji: '⛏️', type: 'tool_skin', rarity: 'uncommon' },
  { id: 5, name: 'Flame Trail', price: 800, emoji: '🔥', type: 'trail', rarity: 'epic' },
  { id: 6, name: 'Crown Hat', price: 200, emoji: '👑', type: 'hat', rarity: 'uncommon' },
  { id: 7, name: 'Ninja Skin', price: 600, emoji: '🥷', type: 'skin', rarity: 'rare' },
  { id: 8, name: 'Robot Skin', price: 1500, emoji: '🤖', type: 'skin', rarity: 'legendary' },
  { id: 9, name: 'Party Popper', price: 150, emoji: '🎉', type: 'emote', rarity: 'common' },
  { id: 10, name: 'Death Scythe', price: 2000, emoji: '💀', type: 'weapon_skin', rarity: 'legendary' },
  { id: 11, name: 'Angel Wings', price: 1200, emoji: '😇', type: 'cosmetic', rarity: 'epic' },
  { id: 12, name: 'Star Trail', price: 600, emoji: '⭐', type: 'trail', rarity: 'rare' },
];

export const NEWS_ITEMS = [
  {
    id: 1,
    title: 'New Season: Neon Nights!',
    date: 'May 18, 2026',
    description: 'A brand new season with neon-themed cosmetics, new maps, and exclusive rewards!',
    emoji: '🌃',
    color: '#a855f7',
  },
  {
    id: 2,
    title: 'BloxdHop World Cup',
    date: 'May 15, 2026',
    description: 'Compete in the biggest parkour tournament of the year. $5,000 prize pool!',
    emoji: '🏆',
    color: '#eab308',
  },
  {
    id: 3,
    title: 'Tower Defense Update 2.0',
    date: 'May 10, 2026',
    description: 'New towers, enemies, and a co-op campaign mode added to Tower Defense!',
    emoji: '🗼',
    color: '#3b82f6',
  },
];

export const ACHIEVEMENTS = [
  { id: 1, name: 'First Blood', description: 'Get your first kill', emoji: '⚔️', xp: 50 },
  { id: 2, name: 'Master Builder', description: 'Place 1000 blocks', emoji: '🏗️', xp: 100 },
  { id: 3, name: 'Parkour Pro', description: 'Complete 10 parkour maps', emoji: '🏃', xp: 200 },
  { id: 4, name: 'Survivor', description: 'Survive 7 nights in survival mode', emoji: '🌙', xp: 150 },
  { id: 5, name: 'Social Butterfly', description: 'Play with 50 different players', emoji: '🦋', xp: 75 },
  { id: 6, name: 'Sharpshooter', description: 'Get 100 headshots', emoji: '🎯', xp: 250 },
  { id: 7, name: 'Hoarder', description: 'Collect 10000 coins', emoji: '💰', xp: 300 },
  { id: 8, name: 'Legend', description: 'Reach level 100', emoji: '👑', xp: 1000 },
];
