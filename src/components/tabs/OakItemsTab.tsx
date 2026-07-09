import React from 'react';
import type { PokeClickerSave } from '../../utils/saveHelper';

interface OakItemsTabProps {
  saveData: PokeClickerSave;
  onChange: (updated: PokeClickerSave) => void;
}

interface OakItemConfig {
  key: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  hasPurchasedFlag: boolean;
}

const OAK_ITEMS: OakItemConfig[] = [
  {
    key: 'Magic_Ball',
    name: 'Magic Ball',
    description: 'Increases the catch rate of all wild Pokémon.',
    icon: '🔮',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Amulet_Coin',
    name: 'Amulet Coin',
    description: 'Increases the amount of money gained from defeating Pokémon.',
    icon: '🪙',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Rocky_Helmet',
    name: 'Rocky Helmet',
    description: 'Deals damage to wild Pokémon when they attack you.',
    icon: '🪖',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Exp_Share',
    name: 'Exp Share',
    description: 'Passively increases the experience gained by caught Pokémon.',
    icon: '🎒',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Sprayduck',
    name: 'Sprayduck',
    description: 'Increases the growth rate of berries planted in the Farm.',
    icon: '🦆',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Shiny_Charm',
    name: 'Shiny Charm',
    description: 'Increases the chance of encountering shiny Pokémon.',
    icon: '✨',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Magma_Stone',
    name: 'Magma Stone',
    description: 'Speeds up the hatching process of eggs in the Hatchery.',
    icon: '🌋',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Cell_Battery',
    name: 'Cell Battery',
    description: 'Speeds up energy restoration in the Underground.',
    icon: '🔋',
    maxLevel: 5,
    hasPurchasedFlag: false,
  },
  {
    key: 'Squirtbottle',
    name: 'Squirtbottle',
    description: 'Increases mutation rate of berries in the Farm.',
    icon: '💧',
    maxLevel: 5,
    hasPurchasedFlag: true,
  },
  {
    key: 'Sprinklotad',
    name: 'Sprinklotad',
    description: 'Increases berry harvest yields on the Farm.',
    icon: '🍃',
    maxLevel: 5,
    hasPurchasedFlag: true,
  },
  {
    key: 'Explosive_Charge',
    name: 'Explosive Charge',
    description: 'Allows destroying large blocks in the Underground.',
    icon: '🧨',
    maxLevel: 5,
    hasPurchasedFlag: true,
  },
  {
    key: 'Treasure_Scanner',
    name: 'Treasure Scanner',
    description: 'Increases the item detection rate in the Underground.',
    icon: '🔍',
    maxLevel: 5,
    hasPurchasedFlag: true,
  },
];

export const OakItemsTab: React.FC<OakItemsTabProps> = ({ saveData, onChange }) => {
  const oakItems = saveData.save.oakItems || {};

  const updateOakItem = (key: string, updates: Partial<typeof oakItems[string]>) => {
    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        oakItems: {
          ...oakItems,
          [key]: {
            ...oakItems[key],
            ...updates
          }
        }
      }
    };
    onChange(updated);
  };

  const setMaxItem = (key: string) => {
    const item = oakItems[key] || { level: 0, exp: 0, isActive: false };
    const config = OAK_ITEMS.find((c) => c.key === key);
    
    updateOakItem(key, {
      level: config?.maxLevel || 5,
      exp: 50000, // arbitary high exp to fill bar
      purchased: config?.hasPurchasedFlag ? true : item.purchased,
    });
  };

  const setAllMax = () => {
    const newOakItems = { ...oakItems };
    OAK_ITEMS.forEach((config) => {
      const current = newOakItems[config.key] || { level: 0, exp: 0, isActive: false };
      newOakItems[config.key] = {
        ...current,
        level: config.maxLevel,
        exp: 50000,
        purchased: config.hasPurchasedFlag ? true : current.purchased,
      };
    });

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        oakItems: newOakItems
      }
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Oak Items</h2>
          <p className="text-sm text-slate-400">Configure Oak Items level, active status, and purchase logs.</p>
        </div>
        <button
          onClick={setAllMax}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-slate-100 font-bold rounded-lg transition-all transform active:scale-95 shadow-md shadow-indigo-500/10 flex items-center gap-2 self-start sm:self-center"
        >
          ✨ Maximize All Oak Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {OAK_ITEMS.map((config) => {
          const item = oakItems[config.key] || { level: 0, exp: 0, isActive: false };
          const level = item.level ?? 0;
          const exp = item.exp ?? 0;
          const isActive = !!item.isActive;
          const purchased = item.purchased ?? !config.hasPurchasedFlag;

          return (
            <div
              key={config.key}
              className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-500/5 border-indigo-500/50 hover:bg-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-xl">
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                        {config.name}
                        {isActive && (
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold rounded border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{config.key}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Level (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max={config.maxLevel}
                      value={level}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val > config.maxLevel) val = config.maxLevel;
                        if (val < 0) val = 0;
                        updateOakItem(config.key, { level: val });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Exp</label>
                    <input
                      type="number"
                      min="0"
                      value={exp}
                      onChange={(e) => updateOakItem(config.key, { exp: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between gap-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => updateOakItem(config.key, { isActive: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/20 focus:ring-offset-0 focus:ring-2 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-slate-300">Equipped</span>
                  </label>

                  {config.hasPurchasedFlag && (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={purchased}
                        onChange={(e) => updateOakItem(config.key, { purchased: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/20 focus:ring-offset-0 focus:ring-2 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-slate-300">Unlocked</span>
                    </label>
                  )}
                </div>

                <button
                  onClick={() => setMaxItem(config.key)}
                  className="px-2.5 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600/50 transition-all active:scale-95"
                >
                  Max Stats
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
