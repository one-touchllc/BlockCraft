'use client';
import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { useGameStore } from '@/stores/gameStore';
import { ACHIEVEMENTS, GAME_MODES } from '@/lib/gameData';

const TABS = ['Overview', 'Stats', 'Achievements', 'Settings'];

const SKIN_OPTIONS = [
  { id: 'steve', name: 'Steve', emoji: '🧑', color: '#8B6914' },
  { id: 'alex', name: 'Alex', emoji: '👱', color: '#6B9A3E' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', color: '#1e293b' },
  { id: 'robot', name: 'Robot', emoji: '🤖', color: '#3b82f6' },
  { id: 'creeper', name: 'Creeper', emoji: '👾', color: '#22c55e' },
  { id: 'ghost', name: 'Ghost', emoji: '👻', color: '#e2e8f0' },
];

const CROSSHAIRS = [
  { id: 'default', label: 'Default', symbol: '+' },
  { id: 'dot', label: 'Dot', symbol: '·' },
  { id: 'cross', label: 'Cross', symbol: '✕' },
  { id: 'circle', label: 'Circle', symbol: '○' },
];

export default function ProfilePage() {
  const { localPlayer, settings, updateSettings, setLocalPlayerName } = useGameStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(localPlayer.name);

  const xpForLevel = (level: number) => level * 500;
  const currentXp = 340;
  const xpNeeded = xpForLevel(localPlayer.level + 1);
  const xpPercent = Math.min(100, (currentXp / xpNeeded) * 100);

  const statRows = [
    { label: 'Total Kills', value: '0', emoji: '⚔️' },
    { label: 'Total Deaths', value: '0', emoji: '💀' },
    { label: 'K/D Ratio', value: '0.00', emoji: '📊' },
    { label: 'Total Wins', value: '0', emoji: '🏆' },
    { label: 'Total Games', value: '0', emoji: '🎮' },
    { label: 'Win Rate', value: '0%', emoji: '📈' },
    { label: 'Blocks Placed', value: '0', emoji: '🧱' },
    { label: 'Distance Walked', value: '0 km', emoji: '👟' },
    { label: 'Time Played', value: '0h 0m', emoji: '⏱️' },
    { label: 'Coins Earned', value: localPlayer.coins.toString(), emoji: '🪙' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* Profile Header */}
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ background: '#111827', border: '1px solid #1e293b' }}>
          <div className="absolute inset-0 opacity-5"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }} />
          <div className="relative flex items-center gap-6 flex-wrap">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>
              {SKIN_OPTIONS.find(s => s.id === settings.skin)?.emoji ?? '🧑'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                      className="bg-transparent border-b-2 border-blue-400 text-white font-game text-xl outline-none px-1"
                      maxLength={20} autoFocus />
                    <button onClick={() => { setLocalPlayerName(nameInput); setEditingName(false); }}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-white"
                      style={{ background: '#22c55e' }}>Save</button>
                    <button onClick={() => setEditingName(false)}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400"
                      style={{ background: '#1e293b' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <h1 className="font-game text-2xl text-white">{localPlayer.name}</h1>
                    <button onClick={() => setEditingName(true)}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors">✏️ Edit</button>
                  </>
                )}
              </div>

              {/* Level & XP */}
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-sm font-bold text-blue-400"
                  style={{ background: '#1e293b' }}>Level {localPlayer.level}</span>
                <span className="text-sm text-slate-400">{currentXp} / {xpNeeded} XP</span>
              </div>

              <div className="w-full max-w-xs h-2 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                <div className="h-full rounded-full transition-all progress-bar" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>

            {/* Coins */}
            <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
              style={{ background: '#0f172a', border: '1px solid #334155' }}>
              <span className="text-3xl">🪙</span>
              <span className="font-game text-lg text-yellow-400">{localPlayer.coins.toLocaleString()}</span>
              <span className="text-xs text-slate-500">Coins</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab ? 'tab-active' : 'text-slate-400 hover:text-white'
              }`}
              style={activeTab !== tab ? { background: '#111827', border: '1px solid #1e293b' } : {}}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Level', value: localPlayer.level, emoji: '⭐', color: '#eab308' },
                { label: 'Coins', value: localPlayer.coins, emoji: '🪙', color: '#f97316' },
                { label: 'Kills', value: localPlayer.kills, emoji: '⚔️', color: '#ef4444' },
                { label: 'Wins', value: 0, emoji: '🏆', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl text-center"
                  style={{ background: '#111827', border: '1px solid #1e293b' }}>
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="font-game text-xl" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent games */}
            <div className="rounded-2xl p-4" style={{ background: '#111827', border: '1px solid #1e293b' }}>
              <h3 className="font-bold text-white mb-4">🎮 Recent Games</h3>
              {GAME_MODES.slice(0, 4).map((mode, i) => (
                <div key={mode.id} className="flex items-center gap-3 py-3 border-b last:border-b-0"
                  style={{ borderColor: '#1e293b' }}>
                  <span className="text-xl">{mode.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{mode.name}</div>
                    <div className="text-xs text-slate-500">{i % 2 === 0 ? '🏆 Win' : '💀 Loss'} · {5 + i * 3}m ago</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    i % 2 === 0 ? 'text-green-400' : 'text-red-400'
                  }`} style={{ background: i % 2 === 0 ? '#22c55e22' : '#ef444422' }}>
                    {i % 2 === 0 ? '+50 XP' : '+10 XP'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'Stats' && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1e293b' }}>
            {statRows.map((s, i) => (
              <div key={s.label} className="flex items-center justify-between px-5 py-4"
                style={{ background: i % 2 === 0 ? '#111827' : '#0f172a', borderTop: i > 0 ? '1px solid #1e293b' : 'none' }}>
                <div className="flex items-center gap-3">
                  <span>{s.emoji}</span>
                  <span className="text-slate-300 font-semibold text-sm">{s.label}</span>
                </div>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'Achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((ach, i) => {
              const unlocked = i < 2;
              return (
                <div key={ach.id} className="flex items-center gap-4 p-4 rounded-xl transition-all"
                  style={{
                    background: '#111827',
                    border: `1px solid ${unlocked ? '#22c55e44' : '#1e293b'}`,
                    opacity: unlocked ? 1 : 0.5,
                  }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: unlocked ? '#22c55e22' : '#1e293b' }}>
                    {ach.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {ach.name}
                      {unlocked && <span className="text-xs text-green-400">✓ Unlocked</span>}
                    </div>
                    <div className="text-xs text-slate-400">{ach.description}</div>
                  </div>
                  <div className="text-xs font-bold text-blue-400 flex-shrink-0">+{ach.xp} XP</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'Settings' && (
          <div className="space-y-4">
            {/* Skin selector */}
            <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1e293b' }}>
              <h3 className="font-bold text-white mb-4">🎨 Select Skin</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {SKIN_OPTIONS.map(skin => (
                  <button key={skin.id} onClick={() => updateSettings({ skin: skin.id })}
                    className="p-3 rounded-xl flex flex-col items-center gap-1 transition-all hover:scale-105"
                    style={{
                      background: '#0f172a',
                      border: `2px solid ${settings.skin === skin.id ? '#3b82f6' : '#1e293b'}`,
                    }}>
                    <span className="text-2xl">{skin.emoji}</span>
                    <span className="text-xs text-slate-400">{skin.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="p-5 rounded-2xl space-y-5" style={{ background: '#111827', border: '1px solid #1e293b' }}>
              <h3 className="font-bold text-white">⚙️ Game Settings</h3>

              {([
                { key: 'fov', label: 'Field of View', min: 60, max: 120, unit: '°' },
                { key: 'sensitivity', label: 'Mouse Sensitivity', min: 1, max: 100, unit: '%' },
                { key: 'renderDistance', label: 'Render Distance', min: 2, max: 16, unit: ' chunks' },
                { key: 'musicVolume', label: 'Music Volume', min: 0, max: 100, unit: '%' },
                { key: 'sfxVolume', label: 'SFX Volume', min: 0, max: 100, unit: '%' },
              ] as const).map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="font-bold text-blue-400">{settings[s.key]}{s.unit}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} value={settings[s.key]}
                    onChange={e => updateSettings({ [s.key]: Number(e.target.value) })}
                    className="w-full accent-blue-500 cursor-pointer" />
                </div>
              ))}

              {/* Show FPS toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Show FPS Counter</span>
                <button onClick={() => updateSettings({ showFPS: !settings.showFPS })}
                  className="w-12 h-6 rounded-full transition-all relative"
                  style={{ background: settings.showFPS ? '#3b82f6' : '#1e293b' }}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                    style={{ left: settings.showFPS ? '28px' : '4px' }} />
                </button>
              </div>
            </div>

            {/* Crosshair */}
            <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1e293b' }}>
              <h3 className="font-bold text-white mb-4">🎯 Crosshair</h3>
              <div className="flex gap-3">
                {CROSSHAIRS.map(c => (
                  <button key={c.id} onClick={() => updateSettings({ crosshair: c.id })}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                    style={{
                      background: '#0f172a',
                      border: `2px solid ${settings.crosshair === c.id ? '#3b82f6' : '#1e293b'}`,
                    }}>
                    <span className="text-white font-bold text-xl w-8 h-8 flex items-center justify-center">{c.symbol}</span>
                    <span className="text-xs text-slate-400">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
