'use client';
import { useGameStore } from '@/stores/gameStore';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/home/HeroSection';
import GameModeCard from '@/components/home/GameModeCard';
import LeaderboardPage from '@/components/pages/LeaderboardPage';
import ShopPage from '@/components/pages/ShopPage';
import ProfilePage from '@/components/pages/ProfilePage';
import GamePage from '@/components/pages/GamePage';
import { GAME_MODES, NEWS_ITEMS } from '@/lib/gameData';
import { useGameStore as useStore } from '@/stores/gameStore';

function HomePage() {
  const { setCurrentPage } = useGameStore();
  const featured = GAME_MODES.filter(m => m.featured);
  const all = GAME_MODES;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <Navbar />
      <HeroSection />

      {/* Featured Game Modes */}
      <section id="game-modes" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-game text-2xl md:text-3xl text-white">⭐ Featured Games</h2>
          <span className="text-sm text-slate-400">{GAME_MODES.length} modes available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(mode => (
            <GameModeCard key={mode.id} mode={mode} />
          ))}
        </div>
      </section>

      {/* All Game Modes */}
      <section className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <h2 className="font-game text-2xl text-white mb-6">🎮 All Game Modes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {all.map(mode => (
            <GameModeCard key={mode.id} mode={mode} />
          ))}
        </div>
      </section>

      {/* News & Updates */}
      <section className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        <h2 className="font-game text-2xl text-white mb-6">📰 News & Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NEWS_ITEMS.map(item => (
            <div key={item.id} className="rounded-2xl overflow-hidden"
              style={{ background: '#111827', border: '1px solid #1e293b' }}>
              <div className="h-24 flex items-center justify-center text-5xl"
                style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}44)` }}>
                {item.emoji}
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500 mb-1">{item.date}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t px-4 md:px-8 py-8 text-center text-slate-500 text-sm"
        style={{ borderColor: '#1e293b' }}>
        <div className="font-game text-lg mb-2" style={{
          background: 'linear-gradient(135deg,#3b82f6,#a855f7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Bloxd.io</div>
        <p>© 2026 Bloxd.io — Free Multiplayer Voxel Games</p>
        <div className="flex gap-4 justify-center mt-3 text-xs">
          {['Privacy Policy','Terms of Service','Support','Discord','Twitter'].map(l => (
            <span key={l} className="hover:text-slate-300 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  const currentPage = useStore(s => s.currentPage);

  if (currentPage === 'game') return <GamePage />;
  if (currentPage === 'leaderboard') return <LeaderboardPage />;
  if (currentPage === 'shop') return <ShopPage />;
  if (currentPage === 'profile') return <ProfilePage />;
  return <HomePage />;
}
