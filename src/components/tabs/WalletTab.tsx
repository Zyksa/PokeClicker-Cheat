import React from 'react';
import type { PokeClickerSave } from '../../utils/saveHelper';

interface WalletTabProps {
  saveData: PokeClickerSave;
  onChange: (updated: PokeClickerSave) => void;
}

interface CurrencyConfig {
  index: number;
  name: string;
  color: string; // Tailwind border/text/focus colors
  bgColor: string; // Tailwind background
  icon: string; // Emoji representing currency
  description: string;
}

const CURRENCIES: CurrencyConfig[] = [
  {
    index: 0,
    name: 'Money (Pokédollars)',
    color: 'border-yellow-600/50 text-yellow-400 focus:ring-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: '🪙',
    description: 'Bought items in Pokémarts, items from Shops, and upgrades.',
  },
  {
    index: 1,
    name: 'Quest Points',
    color: 'border-cyan-600/50 text-cyan-400 focus:ring-cyan-500',
    bgColor: 'bg-cyan-500/10',
    icon: '📜',
    description: 'Earned by completing Quests. Used for unique items and eggs.',
  },
  {
    index: 2,
    name: 'Dungeon Tokens',
    color: 'border-orange-600/50 text-orange-400 focus:ring-orange-500',
    bgColor: 'bg-orange-500/10',
    icon: '🔑',
    description: 'Earned by catching Pokémon. Used to enter Dungeons.',
  },
  {
    index: 3,
    name: 'Diamonds',
    color: 'border-purple-600/50 text-purple-400 focus:ring-purple-500',
    bgColor: 'bg-purple-500/10',
    icon: '💎',
    description: 'Earned in the Underground. Used for mega stones and fossils.',
  },
  {
    index: 4,
    name: 'Battle Points (BP)',
    color: 'border-blue-600/50 text-blue-400 focus:ring-blue-500',
    bgColor: 'bg-blue-500/10',
    icon: '⚔️',
    description: 'Earned in the Battle Frontier. Used for rare items and shop purchases.',
  },
  {
    index: 5,
    name: 'Farm Points',
    color: 'border-emerald-600/50 text-emerald-400 focus:ring-emerald-500',
    bgColor: 'bg-emerald-500/10',
    icon: '🌱',
    description: 'Earned by harvesting berries. Used to buy seeds and farm tools.',
  },
  {
    index: 6,
    name: 'Contest Tokens',
    color: 'border-rose-600/50 text-rose-400 focus:ring-rose-500',
    bgColor: 'bg-rose-500/10',
    icon: '🎗️',
    description: 'Used in Contest Halls and specialized purchases in Alola/later regions.',
  },
];

export const WalletTab: React.FC<WalletTabProps> = ({ saveData, onChange }) => {
  const currencies = saveData.save.wallet.currencies || [];

  const updateCurrency = (index: number, valStr: string) => {
    let val = parseFloat(valStr);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;

    const newCurrencies = [...currencies];
    // Extend array if save didn't have all slots
    while (newCurrencies.length <= index) {
      newCurrencies.push(0);
    }
    newCurrencies[index] = val;

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        wallet: {
          ...saveData.save.wallet,
          currencies: newCurrencies
        }
      }
    };
    onChange(updated);
  };

  const setMaxAmount = (index: number) => {
    updateCurrency(index, '999999999');
  };

  const setZeroAmount = (index: number) => {
    updateCurrency(index, '0');
  };

  const setAllMax = () => {
    const newCurrencies = [...currencies];
    for (let i = 0; i < 7; i++) {
      while (newCurrencies.length <= i) {
        newCurrencies.push(0);
      }
      newCurrencies[i] = 999999999;
    }
    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        wallet: {
          ...saveData.save.wallet,
          currencies: newCurrencies
        }
      }
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Wallet & Currencies</h2>
          <p className="text-sm text-slate-400">Modify the amount of currencies currently held in your save file.</p>
        </div>
        <button
          onClick={setAllMax}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg transition-all transform active:scale-95 shadow-md shadow-amber-500/10 flex items-center gap-2 self-start sm:self-center"
        >
          🪙 Maximize All Currencies
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRENCIES.map((c) => {
          const amount = currencies[c.index] ?? 0;
          
          return (
            <div 
              key={c.index}
              className={`border rounded-xl p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-md bg-slate-800/40 hover:bg-slate-800/60 ${c.color.split(' ')[0]}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span> {c.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Index #{c.index}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">{c.description}</p>
              </div>

              <div className="mt-4 flex gap-2 items-center">
                <div className="relative flex-grow">
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => updateCurrency(c.index, e.target.value)}
                    className={`w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-slate-200 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:border-transparent transition-all ${c.color.split(' ').find(w => w.startsWith('focus:ring-'))}`}
                  />
                  <div className="absolute right-3 top-2.5 text-slate-500 text-sm select-none">
                    {c.icon}
                  </div>
                </div>

                <button
                  onClick={() => setMaxAmount(c.index)}
                  className="px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-all active:scale-95 border border-slate-600/50"
                  title="Set to 999,999,999"
                >
                  MAX
                </button>
                <button
                  onClick={() => setZeroAmount(c.index)}
                  className="px-3 py-2 bg-slate-900/60 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-lg transition-all active:scale-95 border border-slate-800 hover:border-slate-700"
                  title="Set to 0"
                >
                  RESET
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
