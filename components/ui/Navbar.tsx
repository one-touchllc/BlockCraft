'use client';
import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function Navbar() {
  const { localPlayer, currentPage, setCurrentPage } = useGameStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Play', emoji: '🎮' },
    { id: 'leaderboard', label: 'Leaderboard', emoji: '🏆' },
    { id: 'shop', label: 'Shop', emoji: '🛒' },
    { id: 'profile', label: 'Profile', emoji: '👤' },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3"
      style={{ background: 'rgba(10,14,26,0.95)', borderBottom: '1px solid #1e293b', backdropFilter: 'blur(12px)' }}>
      
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-game text-white text-lg"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7)' }}>
          B
        </div>
        <span className="font-game text-2xl" style={{ 
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)', 
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
        }}>
          Bloxd.io
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              currentPage === item.id 
                ? 'tab-active' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="mr-1">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Coins */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold"
          style={{ background: '#1a2235', border: '1px solid #334155' }}>
          <span>🪙</span>
          <span className="text-yellow-400">{localPlayer.coins.toLocaleString()}</span>
        </div>

        {/* Player */}
        <button 
          onClick={() => setCurrentPage('profile')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
          style={{ border: '1px solid #1e293b' }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            🧑
          </div>
          <span className="hidden md:block text-sm font-bold text-slate-200">{localPlayer.name}</span>
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: '#1e293b' }}>
            <span className="text-blue-400">Lv.{localPlayer.level}</span>
          </div>
        </button>

        {/* Mobile menu */}
        <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: '#1a2235' }}>
          <div className="w-5 h-0.5 bg-white mb-1"></div>
          <div className="w-5 h-0.5 bg-white mb-1"></div>
          <div className="w-5 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden p-4 flex flex-col gap-2 animate-bounce-in"
          style={{ background: 'rgba(10,14,26,0.98)', borderBottom: '1px solid #1e293b' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${
                currentPage === item.id ? 'tab-active' : 'text-slate-300 hover:bg-white/5'
              }`}>
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
