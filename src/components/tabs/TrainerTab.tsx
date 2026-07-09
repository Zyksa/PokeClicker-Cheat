import React from 'react';
import type { PokeClickerSave } from '../../utils/saveHelper';

interface TrainerTabProps {
  saveData: PokeClickerSave;
  onChange: (updated: PokeClickerSave) => void;
}

const REGIONS = [
  { id: 0, name: 'Kanto' },
  { id: 1, name: 'Johto' },
  { id: 2, name: 'Hoenn' },
  { id: 3, name: 'Sinnoh' },
  { id: 4, name: 'Unova' },
  { id: 5, name: 'Kalos' },
  { id: 6, name: 'Alola' },
  { id: 7, name: 'Galar' },
  { id: 8, name: 'Hisui' },
  { id: 9, name: 'Paldea' },
];

export const TrainerTab: React.FC<TrainerTabProps> = ({ saveData, onChange }) => {
  const { player, save } = saveData;
  const profile = save.profile;

  const updateProfileField = (field: keyof typeof profile, value: any) => {
    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        profile: {
          ...saveData.save.profile,
          [field]: value
        }
      }
    };
    onChange(updated);
  };

  const updatePlayerField = (field: keyof typeof player, value: any) => {
    const updated = {
      ...saveData,
      player: {
        ...saveData.player,
        [field]: value
      }
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-100">Trainer Profile</h2>
        <p className="text-sm text-slate-400">Modify your player name, trainer sprites, region, and interface customization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: General Profile Card Info */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-400">Card & Profile Details</h3>
          
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Trainer Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfileField('name', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Trainer Sprite ID</label>
              <input
                type="number"
                value={profile.trainer}
                onChange={(e) => updateProfileField('trainer', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Background ID</label>
              <input
                type="number"
                value={profile.background}
                onChange={(e) => updateProfileField('background', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Text Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={profile.textColor}
                  onChange={(e) => updateProfileField('textColor', e.target.value)}
                  className="w-10 h-10 bg-transparent border-0 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={profile.textColor}
                  onChange={(e) => updateProfileField('textColor', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Trainer ID</label>
              <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 font-mono text-sm">
                #{player.trainerId || '682236'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Game Progression */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-emerald-400">Progression & Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Current Region</label>
              <select
                value={player._region}
                onChange={(e) => updatePlayerField('_region', parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Highest Region</label>
              <select
                value={player.highestRegion}
                onChange={(e) => updatePlayerField('highestRegion', parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Current Subregion</label>
              <input
                type="number"
                value={player._subregion}
                onChange={(e) => updatePlayerField('_subregion', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Current Route</label>
              <input
                type="number"
                value={player._route}
                onChange={(e) => updatePlayerField('_route', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Current Town</label>
            <input
              type="text"
              value={player._townName}
              onChange={(e) => updatePlayerField('_townName', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/40">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Time Traveller Check</h4>
              <p className="text-xs text-slate-400">Flagged if date manipulation was detected in-game.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={player._timeTraveller}
                onChange={(e) => updatePlayerField('_timeTraveller', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-slate-100"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Visual Trainer Profile Mockup */}
      <div 
        className="rounded-xl border p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: '#1e293b',
          borderColor: '#475569',
          color: profile.textColor || '#f5f5f5'
        }}
      >
        <div className="absolute right-0 bottom-0 opacity-10 font-bold text-9xl uppercase select-none font-mono tracking-tighter">
          TRAINER
        </div>
        <div className="w-24 h-24 bg-slate-900/80 rounded-full flex items-center justify-center border-4 border-indigo-500/50 overflow-hidden shadow-inner">
          <span className="text-2xl font-bold font-mono text-indigo-400">ID {profile.trainer}</span>
        </div>
        <div className="space-y-2 flex-grow text-center md:text-left z-10">
          <div className="text-3xl font-extrabold tracking-tight">{profile.name}</div>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm opacity-80">
            <span>Trainer ID: <strong className="font-mono">#{player.trainerId || '682236'}</strong></span>
            <span>•</span>
            <span>Current Location: <strong>{player._townName} (Route {player._route})</strong></span>
            <span>•</span>
            <span>Region: <strong>{REGIONS.find(r => r.id === player._region)?.name || 'Kanto'}</strong></span>
          </div>
        </div>
        <div className="px-4 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-300 text-xs font-mono select-none">
          POKECLICKER SAVE V{save.update?.version || '0.10.25'}
        </div>
      </div>
    </div>
  );
};
