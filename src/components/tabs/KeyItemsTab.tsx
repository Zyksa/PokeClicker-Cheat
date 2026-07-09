import React from 'react';
import type { PokeClickerSave } from '../../utils/saveHelper';

interface KeyItemsTabProps {
  saveData: PokeClickerSave;
  onChange: (updated: PokeClickerSave) => void;
}

interface KeyItemConfig {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: 'Progression' | 'Tools' | 'Special';
}

const KEY_ITEMS: KeyItemConfig[] = [
  // Progression
  {
    key: 'Town_map',
    name: 'Town Map',
    description: 'Allows travel between routes and towns.',
    icon: '🗺️',
    category: 'Progression',
  },
  {
    key: 'Dungeon_ticket',
    name: 'Dungeon Ticket',
    description: 'Enables entering dungeons using Dungeon Tokens.',
    icon: '🎟️',
    category: 'Progression',
  },
  {
    key: 'Safari_ticket',
    name: 'Safari Ticket',
    description: 'Allows access to the Safari Zone.',
    icon: '🎫',
    category: 'Progression',
  },
  {
    key: 'Explorer_kit',
    name: 'Explorer Kit',
    description: 'Unlocks the Underground Mining feature.',
    icon: '⛏️',
    category: 'Progression',
  },
  // Tools
  {
    key: 'Teachy_tv',
    name: 'Teachy TV',
    description: 'Displays helpful tutorials about game mechanics.',
    icon: '📺',
    category: 'Tools',
  },
  {
    key: 'Coin_case',
    name: 'Coin Case',
    description: 'Allows storing coins and points.',
    icon: '💼',
    category: 'Tools',
  },
  {
    key: 'Pokeball_bag',
    name: 'Poké Ball Bag',
    description: 'Permits carrying and organizing Poké Balls.',
    icon: '🎒',
    category: 'Tools',
  },
  {
    key: 'Super_rod',
    name: 'Super Rod',
    description: 'Enables encounters with wild water Pokémon.',
    icon: '🎣',
    category: 'Tools',
  },
  {
    key: 'Wailmer_pail',
    name: 'Wailmer Pail',
    description: 'Speeds up the growth of berries on the farm.',
    icon: '🪣',
    category: 'Tools',
  },
  {
    key: 'Gem_case',
    name: 'Gem Case',
    description: 'Allows collecting and storing elemental gems.',
    icon: '💎',
    category: 'Tools',
  },
  // Special
  {
    key: 'Holo_caster',
    name: 'Holo Caster',
    description: 'Enables receiving holographic broadcasts.',
    icon: '📟',
    category: 'Special',
  },
  {
    key: 'Mystery_egg',
    name: 'Mystery Egg',
    description: 'A strange egg that hatches into a random Pokémon.',
    icon: '🥚',
    category: 'Special',
  },
  {
    key: 'Eon_ticket',
    name: 'Eon Ticket',
    description: 'Allows travel to Southern Island.',
    icon: '✈️',
    category: 'Special',
  },
  {
    key: 'Event_calendar',
    name: 'Event Calendar',
    description: 'Shows active and upcoming seasonal in-game events.',
    icon: '📅',
    category: 'Special',
  },
  {
    key: 'DNA_splicers',
    name: 'DNA Splicers',
    description: 'Permits fusing Kyurem with Reshiram or Zekrom.',
    icon: '🧬',
    category: 'Special',
  },
  {
    key: 'Reins_of_unity',
    name: 'Reins of Unity',
    description: 'Permits fusing Calyrex with Glastrier or Spectrier.',
    icon: '🏇',
    category: 'Special',
  },
  {
    key: 'Pokerus_virus',
    name: 'Pokérus Virus',
    description: 'Unlocks breeding helpers and Pokerus status for Pokémon.',
    icon: '🦠',
    category: 'Special',
  },
];

export const KeyItemsTab: React.FC<KeyItemsTabProps> = ({ saveData, onChange }) => {
  const keyItems = saveData.save.keyItems || {};

  const toggleKeyItem = (key: string) => {
    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        keyItems: {
          ...keyItems,
          [key]: !keyItems[key]
        }
      }
    };
    onChange(updated);
  };

  const setAllState = (state: boolean) => {
    const newKeyItems = { ...keyItems };
    KEY_ITEMS.forEach((item) => {
      newKeyItems[item.key] = state;
    });

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        keyItems: newKeyItems
      }
    };
    onChange(updated);
  };

  const renderCategory = (category: KeyItemConfig['category']) => {
    const items = KEY_ITEMS.filter((item) => item.category === category);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold border-b border-slate-700 pb-2 text-slate-300 tracking-wide">
          {category}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => {
            const owned = !!keyItems[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleKeyItem(item.key)}
                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer select-none transition-all duration-300 backdrop-blur-md ${
                  owned
                    ? 'bg-indigo-500/10 border-indigo-500/50 hover:bg-indigo-500/20 shadow-md shadow-indigo-500/5'
                    : 'bg-slate-800/30 border-slate-700/60 hover:bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-colors duration-300 ${
                  owned ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-500'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm truncate ${owned ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {item.name}
                    </span>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                      owned ? 'bg-indigo-500 text-slate-950 font-bold' : 'bg-slate-700 text-transparent'
                    }`}>
                      {owned ? '✓' : ''}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Key Items Inventory</h2>
          <p className="text-sm text-slate-400">Toggle progression keys, tools, and special items in your inventory.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAllState(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-sm rounded-lg transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            Unlock All Key Items
          </button>
          <button
            onClick={() => setAllState(false)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-sm rounded-lg transition-all active:scale-95"
          >
            Lock All
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {renderCategory('Progression')}
        {renderCategory('Tools')}
        {renderCategory('Special')}
      </div>
    </div>
  );
};
