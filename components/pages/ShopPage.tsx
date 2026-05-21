'use client';
import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { SHOP_ITEMS } from '@/lib/gameData';
import { useGameStore } from '@/stores/gameStore';

const CATEGORIES = ['All', 'Skins', 'Cosmetics', 'Weapons', 'Trails', 'Emotes', 'Hats'];

const RARITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  common:    { color: '#94a3b8', bg: '#94a3b811', label: 'Common' },
  uncommon:  { color: '#22c55e', bg: '#22c55e11', label: 'Uncommon' },
  rare:      { color: '#3b82f6', bg: '#3b82f611', label: 'Rare' },
  epic:      { color: '#a855f7', bg: '#a855f711', label: 'Epic' },
  legendary: { color: '#f97316', bg: '#f9731611', label: 'Legendary' },
};

const COIN_PACKS = [
  { coins: 500,   price: '$2.99',  bonus: '',       emoji: '🪙', color: '#eab308' },
  { coins: 1200,  price: '$4.99',  bonus: '+200',   emoji: '💰', color: '#f97316' },
  { coins: 3000,  price: '$9.99',  bonus: '+800',   emoji: '💎', color: '#3b82f6' },
  { coins: 8000,  price: '$19.99', bonus: '+3000',  emoji: '👑', color: '#a855f7' },
];

export default function ShopPage() {
  const { localPlayer } = useGameStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [purchased, setPurchased] = useState<number[]>([]);
  const [toast, setToast] = useState('');

  const filtered = SHOP_ITEMS.filter(item => {
    if (activeCategory === 'All') return true;
    const map: Record<string, string[]> = {
      Skins: ['skin'], Cosmetics: ['cosmetic'], Weapons: ['weapon_skin'],
      Trails: ['trail'], Emotes: ['emote'], Hats: ['hat'],
    };
    return map[activeCategory]?.includes(item.type);
  });

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (purchased.includes(item.id)) return;
    if (localPlayer.coins < item.price) {
      setToast('❌ Not enough coins!');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    setPurchased(prev => [...prev, item.id]);
    setToast(`✅ Purchased ${item.name}!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold text-white shadow-lg animate-bounce-in"
          style={{ background: '#1e293b', border: '1px solid #334155' }}>
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-game text-4xl text-white mb-1">🛒 Item Shop</h1>
            <p className="text-slate-400">Customize your character with exclusive cosmetics</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-yellow-400"
            style={{ background: '#111827', border: '1px solid #334155' }}>
            🪙 {localPlayer.coins.toLocaleString()} Coins
          </div>
        </div>

        {/* Coin Packs */}
        <div className="mb-10">
          <h2 className="font-bold text-white mb-4">💳 Get Coins</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COIN_PACKS.map(pack => (
              <div key={pack.coins} className="p-4 rounded-xl text-center cursor-pointer hover:scale-105 transition-transform"
                style={{ background: '#111827', border: `1px solid ${pack.color}44` }}>
                <div className="text-3xl mb-2">{pack.emoji}</div>
                <div className="font-game text-lg" style={{ color: pack.color }}>
                  {pack.coins.toLocaleString()}
                </div>
                {pack.bonus && <div className="text-xs text-green-400 font-bold">+{pack.bonus} BONUS</div>}
                <div className="mt-2 px-3 py-1 rounded-lg font-bold text-sm text-white"
                  style={{ background: `linear-gradient(135deg,${pack.color},${pack.color}99)` }}>
                  {pack.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeCategory === cat ? 'tab-active' : 'text-slate-400 hover:text-white'
              }`}
              style={activeCategory !== cat ? { background: '#111827', border: '1px solid #1e293b' } : {}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(item => {
            const rarity = RARITY_CONFIG[item.rarity];
            const owned = purchased.includes(item.id);
            return (
              <div key={item.id}
                className="rounded-xl overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer"
                style={{ background: '#111827', border: `1px solid ${rarity.color}33` }}
                onClick={() => handleBuy(item)}>

                {/* Item visual */}
                <div className="h-24 flex items-center justify-center text-4xl relative"
                  style={{ background: rarity.bg }}>
                  {item.emoji}
                  {owned && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-green-400 font-bold text-xs">✓ OWNED</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <div className="text-xs font-bold text-white truncate mb-1">{item.name}</div>
                  <div className="text-xs font-bold mb-2" style={{ color: rarity.color }}>
                    {rarity.label}
                  </div>
                  <div className={`w-full py-1 rounded-lg text-xs font-bold text-center transition-all ${
                    owned ? 'cursor-default' : 'hover:opacity-90'
                  }`}
                    style={{
                      background: owned
                        ? '#22c55e33'
                        : 'linear-gradient(135deg,#eab308,#ca8a04)',
                      color: owned ? '#22c55e' : '#000',
                    }}>
                    {owned ? '✓ Owned' : `🪙 ${item.price}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
