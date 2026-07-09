import React from 'react';
import type { PokeClickerSave } from '../../utils/saveHelper';

interface UndergroundTabProps {
  saveData: PokeClickerSave;
  onChange: (updated: PokeClickerSave) => void;
}

const ITEMS_LIST = [
  { key: 'Fire_stone', name: 'Fire Stone', type: 'Stone' },
  { key: 'Water_stone', name: 'Water Stone', type: 'Stone' },
  { key: 'Thunder_stone', name: 'Thunder Stone', type: 'Stone' },
  { key: 'Leaf_stone', name: 'Leaf Stone', type: 'Stone' },
  { key: 'Moon_stone', name: 'Moon Stone', type: 'Stone' },
  { key: 'Sun_stone', name: 'Sun Stone', type: 'Stone' },
  { key: 'Shiny_stone', name: 'Shiny Stone', type: 'Stone' },
  { key: 'Dusk_stone', name: 'Dusk Stone', type: 'Stone' },
  { key: 'Dawn_stone', name: 'Dawn Stone', type: 'Stone' },
  { key: 'Ice_stone', name: 'Ice Stone', type: 'Stone' },
  { key: 'Chipped_Pot', name: 'Chipped Pot', type: 'Evolution' },
  { key: 'Cracked_Pot', name: 'Cracked Pot', type: 'Evolution' },
  { key: 'Sachet', name: 'Sachet', type: 'Evolution' },
  { key: 'Whipped_Dream', name: 'Whipped Dream', type: 'Evolution' },
  { key: 'Dragon_scale', name: 'Dragon Scale', type: 'Evolution' },
  { key: 'Metal_coat', name: 'Metal Coat', type: 'Evolution' },
  { key: 'Upgrade', name: 'Upgrade', type: 'Evolution' },
  { key: 'Dubious_disc', name: 'Dubious Disc', type: 'Evolution' },
  { key: 'Protector', name: 'Protector', type: 'Evolution' },
  { key: 'Electirizer', name: 'Electirizer', type: 'Evolution' },
  { key: 'Magmarizer', name: 'Magmarizer', type: 'Evolution' },
  { key: 'Reaper_cloth', name: 'Reaper Cloth', type: 'Evolution' },
  { key: 'Prism_scale', name: 'Prism Scale', type: 'Evolution' },
  { key: 'Oval_stone', name: 'Oval Stone', type: 'Evolution' },
];

export const UndergroundTab: React.FC<UndergroundTabProps> = ({ saveData, onChange }) => {
  const itemList = saveData.player._itemList || {};
  const underground = saveData.save.underground || { undergroundExp: 0 };
  const farming = saveData.save.farming || { unlockedBerries: [], berryList: [] };

  // Set quantity of a general inventory item (Evolutionary stones, items)
  const setItemQuantity = (key: string, qtyStr: string) => {
    let qty = parseInt(qtyStr);
    if (isNaN(qty) || qty < 0) qty = 0;

    const updated = {
      ...saveData,
      player: {
        ...saveData.player,
        _itemList: {
          ...itemList,
          [key]: qty
        }
      }
    };
    onChange(updated);
  };

  // Modify Underground experience
  const updateUndergroundExp = (expStr: string) => {
    let exp = parseInt(expStr);
    if (isNaN(exp) || exp < 0) exp = 0;

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        underground: {
          ...underground,
          undergroundExp: exp
        }
      }
    };
    onChange(updated);
  };

  // Bulk set evolutionary stones to 99
  const handleMaxStones = () => {
    const newItemList = { ...itemList };
    ITEMS_LIST.forEach((item) => {
      newItemList[item.key] = 99;
    });

    const updated = {
      ...saveData,
      player: {
        ...saveData.player,
        _itemList: newItemList
      }
    };
    onChange(updated);
  };

  // Maximize tools durability in underground
  const handleMaxTools = () => {
    const tools = underground.tools || {};
    const newTools = { ...tools };
    
    // Tools indices 0, 1, 2, 3 represent Chisel, Hammer, etc.
    for (let i = 0; i < 4; i++) {
      newTools[i] = { durability: 1 }; // 1 represents 100% durability in PokeClicker
    }

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        underground: {
          ...underground,
          tools: newTools
        }
      }
    };
    onChange(updated);
  };

  // Farming: Unlock all berries
  const handleUnlockAllBerries = () => {
    if (confirm("This will unlock all 70+ berries in your save file. Proceed?")) {
      const unlocked = Array(75).fill(true); // standard PokeClicker has up to 74 berries
      const updated = {
        ...saveData,
        save: {
          ...saveData.save,
          farming: {
            ...farming,
            unlockedBerries: unlocked
          }
        }
      };
      onChange(updated);
    }
  };

  // Farming: Modify shovels
  const setFarmingShovels = (shovelType: 'shovelAmt' | 'mulchShovelAmt', qtyStr: string) => {
    let qty = parseInt(qtyStr) || 0;
    if (qty < 0) qty = 0;

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        farming: {
          ...farming,
          [shovelType]: qty
        }
      }
    };
    onChange(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-100">Underground & Farming</h2>
        <p className="text-sm text-slate-400">Manage mining progress, tools durability, evolutionary items, and agricultural settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Underground Mining Settings */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
            ⛏️ Underground Mining
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Underground EXP</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={underground.undergroundExp ?? 0}
                onChange={(e) => updateUndergroundExp(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <button
                onClick={() => updateUndergroundExp('50000')}
                className="px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all"
              >
                Max Level
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Upgrade Mining level to unlock faster restoration speeds and better trades.</p>
          </div>

          <div className="pt-4 border-t border-slate-700/40 flex justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-200 block">Repair Mining Tools</span>
              <p className="text-xs text-slate-500">Restore all chisel and hammer durability back to 100%.</p>
            </div>
            <button
              onClick={handleMaxTools}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all active:scale-95 shadow-md shadow-amber-500/10"
            >
              Restore Tools
            </button>
          </div>
        </div>

        {/* Right Side: Farming & Berries */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            🌱 Farming & Agriculture
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Berry Shovels</label>
              <input
                type="number"
                value={farming.shovelAmt ?? 0}
                onChange={(e) => setFarmingShovels('shovelAmt', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Mulch Shovels</label>
              <input
                type="number"
                value={farming.mulchShovelAmt ?? 0}
                onChange={(e) => setFarmingShovels('mulchShovelAmt', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/40 flex justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-200 block">Unlock All Berries</span>
              <p className="text-xs text-slate-500">Unlocks the entire list of 74 berries in the farm dictionary.</p>
            </div>
            <button
              onClick={handleUnlockAllBerries}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-100 font-bold text-xs rounded-lg transition-all active:scale-95 shadow-md shadow-emerald-500/10"
            >
              Unlock Berries
            </button>
          </div>
        </div>
      </div>

      {/* Evolutionary Stones & Items Registry */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/40 pb-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              💎 Evolutionary Stones & Items
            </h3>
            <p className="text-xs text-slate-400 mt-1">Configure counts for item evolutions (used to evolve Eevee, starters, etc.).</p>
          </div>
          <button
            onClick={handleMaxStones}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-xs rounded-lg transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            Set All to 99
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ITEMS_LIST.map((item) => {
            const currentQty = itemList[item.key] ?? 0;
            return (
              <div
                key={item.key}
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-3 rounded-lg flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">{item.name}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{item.type}</span>
                </div>
                <input
                  type="number"
                  value={currentQty}
                  onChange={(e) => setItemQuantity(item.key, e.target.value)}
                  className="w-16 bg-slate-900 border border-slate-700/80 rounded px-1.5 py-0.5 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
