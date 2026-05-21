@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&family=Press+Start+2P&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-dark: #0a0e1a;
  --bg-card: #111827;
  --bg-card2: #1a2235;
  --accent-blue: #3b82f6;
  --accent-green: #22c55e;
  --accent-orange: #f97316;
  --accent-purple: #a855f7;
  --accent-pink: #ec4899;
  --accent-yellow: #eab308;
  --accent-red: #ef4444;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #1e293b;
  --border-bright: #334155;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
  background: var(--bg-dark);
  color: var(--text-primary);
  font-family: 'Nunito', sans-serif;
}

.font-game { font-family: 'Fredoka One', cursive; }
.font-pixel { font-family: 'Press Start 2P', monospace; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-dark); }
::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 3px; }

/* Glow effects */
.glow-blue { box-shadow: 0 0 20px rgba(59,130,246,0.4); }
.glow-green { box-shadow: 0 0 20px rgba(34,197,94,0.4); }
.glow-orange { box-shadow: 0 0 20px rgba(249,115,22,0.4); }
.glow-purple { box-shadow: 0 0 20px rgba(168,85,247,0.4); }

/* Pixel border */
.pixel-border {
  border: 3px solid;
  image-rendering: pixelated;
}

/* Card hover */
.game-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.game-card:hover {
  transform: translateY(-4px) scale(1.02);
}

/* Animated bg */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-float { animation: float 3s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
.animate-slide-in { animation: slide-in-right 0.3s ease-out; }
.animate-bounce-in { animation: bounce-in 0.5s ease-out; }

/* Game UI */
.hotbar-slot {
  width: 52px;
  height: 52px;
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: border-color 0.1s;
}
.hotbar-slot.active {
  border-color: white;
  box-shadow: 0 0 8px rgba(255,255,255,0.6);
}

/* Crosshair */
.crosshair::before, .crosshair::after {
  content: '';
  position: absolute;
  background: rgba(255,255,255,0.8);
}
.crosshair::before { width: 2px; height: 20px; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.crosshair::after { width: 20px; height: 2px; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* Chat */
.chat-message { animation: slide-in-right 0.2s ease-out; }

/* Progress bars */
.progress-bar {
  background: linear-gradient(90deg, var(--accent-green), #16a34a);
  transition: width 0.3s ease;
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 999;
  pointer-events: none;
}

/* Tab active */
.tab-active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

/* Noise texture overlay */
.noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.04;
}

/* Leaderboard */
.rank-1 { color: #fbbf24; }
.rank-2 { color: #94a3b8; }
.rank-3 { color: #b45309; }

/* Player skin colors */
.skin-steve { background: linear-gradient(135deg, #8B6914, #5C4A1E); }
.skin-alex { background: linear-gradient(135deg, #6B9A3E, #3D6B1A); }
.skin-creeper { background: linear-gradient(135deg, #22c55e, #15803d); }

/* Modal backdrop */
.modal-backdrop {
  backdrop-filter: blur(8px);
  background: rgba(0,0,0,0.7);
}
