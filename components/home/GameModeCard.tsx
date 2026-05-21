'use client';
import { GameModeInfo } from '@/lib/gameData';
import { useGameStore } from '@/stores/gameStore';

interface Props {
  mode: GameModeInfo;
  compact?: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  featured: '#eab308',
  new: '#22c55e',
  hot: '#ef4444',
};

export default function GameModeCard({ mode, compact = false }: Props) {
  const { setCurrentPage, startGame, setActiveGameMode } = useGameStore();

  const handlePlay = () => {
    setActiveGameMode(mode.id as any);
    setCurrentPage('game');
  };

  if (compact) {
    return (
      <button
        onClick={handlePlay}
        className="game-card flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all hover:bg-white/5"
        style={{ background: '#111827', border: '1px solid #1e293b' }}
      >
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${mode.color}33, ${mode.color}66)` }}>
          {mode.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-white truncate">{mode.name}</div>
          <div className="text-xs text-slate-400 truncate">{mode.players} players</div>
        </div>
        <div className="text-slate-500 text-xs">▶</div>
      </button>
    );
  }

  return (
    <button
      onClick={handlePlay}
      className="game-card relative overflow-hidden rounded-2xl text-left group"
      style={{ background: '#111827', border: '1px solid #1e293b' }}
    >
      {/* Header gradient */}
      <div className={`relative h-36 bg-gradient-to-br ${mode.gradient} flex items-center justify-center overflow-hidden`}>
        {/* Decorative blocks */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-8 h-8 rounded-sm"
              style={{
                background: 'rgba(255,255,255,0.3)',
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                transform: `rotate(${i * 15}deg)`,
                opacity: 0.3 + (i % 3) * 0.2,
              }} />
          ))}
        </div>
        <div className="relative text-6xl transform group-hover:scale-110 transition-transform duration-200">
          {mode.emoji}
        </div>
        {mode.featured && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: '#eab308', color: '#000' }}>
            ⭐ FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-game text-lg text-white">{mode.name}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>👥</span>
            <span>{mode.players}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{mode.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {mode.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: `${mode.color}22`, color: mode.color, border: `1px solid ${mode.color}44` }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Play button */}
        <div className="w-full py-2.5 rounded-xl font-bold text-sm text-center text-white transition-all group-hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${mode.color}, ${mode.color}cc)` }}>
          ▶ Play Now
        </div>
      </div>
    </button>
  );
}
