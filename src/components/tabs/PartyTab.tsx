import React, { useState, useMemo } from 'react';
import type { PokeClickerSave } from '../../utils/saveHelper';
import { pokemonList, getPokemonName } from '../../data/pokemonList';

interface PartyTabProps {
  saveData: PokeClickerSave;
  onChange: (updated: PokeClickerSave) => void;
}

export const PartyTab: React.FC<PartyTabProps> = ({ saveData, onChange }) => {
  const caughtPokemon = saveData.save.party?.caughtPokemon || [];
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'shiny' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // State for "Add Pokemon" search
  const [addSearchTerm, setAddSearchTerm] = useState('');
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Set of caught IDs for quick lookup
  const caughtIdsSet = useMemo(() => new Set(caughtPokemon.map(p => p.id)), [caughtPokemon]);

  // Filter caught Pokemon based on user query and toggle filters
  const filteredCaught = useMemo(() => {
    return caughtPokemon
      .map(p => ({
        ...p,
        name: getPokemonName(p.id)
      }))
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm;
        const isShiny = !!p[5];
        
        if (filterType === 'shiny') return matchesSearch && isShiny;
        if (filterType === 'normal') return matchesSearch && !isShiny;
        return matchesSearch;
      })
      .sort((a, b) => a.id - b.id);
  }, [caughtPokemon, searchTerm, filterType]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCaught.length / itemsPerPage) || 1;
  const paginatedCaught = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCaught.slice(start, start + itemsPerPage);
  }, [filteredCaught, currentPage]);

  // Adjust page number if it goes out of bounds when filters change
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Search results for adding a new Pokemon
  const addSearchResults = useMemo(() => {
    if (!addSearchTerm.trim()) return [];
    return pokemonList
      .filter(p => !caughtIdsSet.has(p.id)) // Only show uncaught ones
      .filter(p => p.name.toLowerCase().includes(addSearchTerm.toLowerCase()) || p.id.toString() === addSearchTerm)
      .slice(0, 8); // Limit to top 8 results
  }, [addSearchTerm, caughtIdsSet]);

  // Edit individual Pokemon
  const updatePokemon = (id: number, key: number, value: any) => {
    const updatedParty = caughtPokemon.map(p => {
      if (p.id === id) {
        return {
          ...p,
          [key]: value
        };
      }
      return p;
    });

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        party: {
          ...saveData.save.party,
          caughtPokemon: updatedParty
        }
      }
    };
    onChange(updated);
  };

  // Edit individual Pokemon Vitamins (key 2)
  const updateVitamins = (id: number, vitaminIndex: number, amount: number) => {
    const updatedParty = caughtPokemon.map(p => {
      if (p.id === id) {
        const currentVitamins = p[2] || { "0": 0, "1": 0, "2": 0 };
        return {
          ...p,
          2: {
            ...currentVitamins,
            [vitaminIndex]: amount
          }
        };
      }
      return p;
    });

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        party: {
          ...saveData.save.party,
          caughtPokemon: updatedParty
        }
      }
    };
    onChange(updated);
  };

  // Remove Pokemon from party
  const removePokemon = (id: number) => {
    if (confirm(`Are you sure you want to remove ${getPokemonName(id)} from your caught list?`)) {
      const updatedParty = caughtPokemon.filter(p => p.id !== id);
      const updated = {
        ...saveData,
        save: {
          ...saveData.save,
          party: {
            ...saveData.save.party,
            caughtPokemon: updatedParty
          }
        }
      };
      onChange(updated);
    }
  };

  // Add a new Pokemon
  const addPokemonToParty = (id: number, makeShiny: boolean = false) => {
    if (caughtIdsSet.has(id)) return;

    const newPokemonEntry = {
      id,
      "2": { "0": 0, "1": 0, "2": 0 },
      "3": 100, // starting exp
      "5": makeShiny // shiny status
    };

    const updated = {
      ...saveData,
      save: {
        ...saveData.save,
        party: {
          ...saveData.save.party,
          caughtPokemon: [...caughtPokemon, newPokemonEntry]
        }
      }
    };
    
    // Increment total count in statistics
    if (updated.save.statistics) {
      const currentCount = updated.save.statistics.totalPokemonCaptured || caughtPokemon.length;
      updated.save.statistics.totalPokemonCaptured = currentCount + 1;
      
      if (makeShiny) {
        const currentShinyCount = updated.save.statistics.totalShinyPokemonCaptured || 0;
        updated.save.statistics.totalShinyPokemonCaptured = currentShinyCount + 1;
      }
    }

    onChange(updated);
    setAddSearchTerm('');
    setShowAddDropdown(false);
  };

  // Bulk: Catch All Pokemon
  const handleCatchAll = (makeShiny: boolean = false) => {
    const confirmMsg = makeShiny 
      ? "Catching all 1025 Pokemon as Shiny will heavily modify your save. Do you want to proceed?" 
      : "Catch all 1025 standard Pokemon? Proceed?";
    
    if (confirm(confirmMsg)) {
      const updatedParty = [...caughtPokemon];
      
      pokemonList.forEach(p => {
        // If not already caught, append new entry
        const existingIdx = updatedParty.findIndex(entry => entry.id === p.id);
        if (existingIdx === -1) {
          updatedParty.push({
            id: p.id,
            "2": { "0": 0, "1": 0, "2": 0 },
            "3": 500, // starter exp
            "5": makeShiny
          });
        } else if (makeShiny) {
          // If already caught, enforce shiny if option selected
          updatedParty[existingIdx] = {
            ...updatedParty[existingIdx],
            "5": true
          };
        }
      });

      const updated = {
        ...saveData,
        save: {
          ...saveData.save,
          party: {
            ...saveData.save.party,
            caughtPokemon: updatedParty
          }
        }
      };
      
      // Update statistics
      if (updated.save.statistics) {
        updated.save.statistics.totalPokemonCaptured = 1025;
        if (makeShiny) {
          updated.save.statistics.totalShinyPokemonCaptured = 1025;
        }
      }
      
      onChange(updated);
    }
  };

  // Bulk: Toggle All Caught to Shiny
  const handleMakeAllShiny = () => {
    if (confirm("Make all currently caught Pokémon shiny?")) {
      const updatedParty = caughtPokemon.map(p => ({
        ...p,
        "5": true // Key 5 represents shiny status
      }));

      const updated = {
        ...saveData,
        save: {
          ...saveData.save,
          party: {
            ...saveData.save.party,
            caughtPokemon: updatedParty
          }
        }
      };
      onChange(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Bulk Controls */}
      <div className="border-b border-slate-700 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            👾 Party Pokémon
            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono text-xs rounded border border-slate-700">
              {caughtPokemon.length} Caught
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Unlock missing Pokémon, make them shiny, and edit their specific levels or vitamins.</p>
        </div>
        
        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCatchAll(false)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-100 font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/10 active:scale-95"
          >
            🔓 Unlock Entire Pokédex
          </button>
          <button
            onClick={() => handleCatchAll(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-extrabold text-xs rounded-lg transition-all shadow-md shadow-yellow-500/10 active:scale-95"
          >
            ✨ Unlock All Shiny
          </button>
          <button
            onClick={handleMakeAllShiny}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-xs rounded-lg transition-all shadow-md shadow-indigo-600/10 active:scale-95"
          >
            🔮 Make Caught Shiny
          </button>
        </div>
      </div>

      {/* Adding & Filtering Toolbar */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between z-25 relative">
        
        {/* Search caught list */}
        <div className="w-full md:w-80 space-y-1">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Search Caught List</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by name or Pokedex ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col w-full md:w-auto space-y-1">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Shininess Filter</label>
          <div className="bg-slate-900 border border-slate-700 p-0.5 rounded-lg flex">
            <button
              onClick={() => { setFilterType('all'); setCurrentPage(1); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'all' ? 'bg-indigo-500 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setFilterType('shiny'); setCurrentPage(1); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'shiny' ? 'bg-indigo-500 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shiny ✨
            </button>
            <button
              onClick={() => { setFilterType('normal'); setCurrentPage(1); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'normal' ? 'bg-indigo-500 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal
            </button>
          </div>
        </div>

        {/* Add Pokémon Search Bar */}
        <div className="w-full md:w-80 space-y-1 relative">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block text-emerald-400">➕ Add New Pokémon</label>
          <input
            type="text"
            placeholder="Type name to capture..."
            value={addSearchTerm}
            onChange={(e) => {
              setAddSearchTerm(e.target.value);
              setShowAddDropdown(true);
            }}
            onFocus={() => setShowAddDropdown(true)}
            className="w-full bg-slate-900 border border-emerald-950/60 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {showAddDropdown && addSearchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
              {addSearchResults.map((p) => (
                <div 
                  key={p.id}
                  className="px-4 py-2 hover:bg-slate-800 flex items-center justify-between gap-4 text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                      alt={p.name}
                      className="w-8 h-8 object-contain bg-slate-950/40 rounded"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-semibold text-slate-300">{p.name} <span className="text-slate-500 font-mono text-xs">#{p.id}</span></span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => addPokemonToParty(p.id, false)}
                      className="px-2 py-1 bg-emerald-700/60 hover:bg-emerald-600 text-slate-100 font-semibold text-xs rounded border border-emerald-600/40"
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => addPokemonToParty(p.id, true)}
                      className="px-2 py-1 bg-amber-600/60 hover:bg-amber-500 text-slate-100 font-semibold text-xs rounded border border-amber-500/40"
                    >
                      Shiny ✨
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showAddDropdown && addSearchTerm && addSearchResults.length === 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl z-30 text-center text-xs text-slate-500">
              No matching uncaught Pokémon found.
            </div>
          )}
          {showAddDropdown && addSearchTerm && (
            <button
              onClick={() => { setAddSearchTerm(''); setShowAddDropdown(false); }}
              className="absolute right-3.5 top-7 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Pokemon Cards */}
      {filteredCaught.length === 0 ? (
        <div className="bg-slate-800/20 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <span className="text-3xl block mb-2">🔍</span> No Pokémon match your active filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {paginatedCaught.map((p) => {
              const isShiny = !!p[5];
              const exp = p[3] ?? 0;
              const attackBonusPct = p[0] ?? 0;
              const proteins = p[2] || { "0": 0, "1": 0, "2": 0 };

              // Determine display level estimation from exp: level = floor(cbrt(exp)) on PokeClicker standard
              const level = Math.floor(Math.cbrt(exp)) || 1;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between backdrop-blur-md transition-all duration-300 ${
                    isShiny
                      ? 'bg-gradient-to-b from-yellow-500/5 to-slate-800/40 border-yellow-500/40 hover:border-yellow-400 shadow-md shadow-yellow-500/5'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div>
                    {/* Sprite & Identity */}
                    <div className="flex items-center gap-3">
                      <div className="relative bg-slate-900/60 rounded-lg p-1 border border-slate-700/40 flex items-center justify-center w-14 h-14 select-none">
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${p.id}.png`}
                          alt={p.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            // Fallback if network fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-bold text-sm text-slate-200 truncate flex items-center gap-1.5">
                          {p.name}
                          {isShiny && <span className="text-yellow-400 text-xs" title="Shiny">✨</span>}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-0.5">
                          <span>ID #{p.id}</span>
                          <span>Est. Lvl {level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Fields */}
                    <div className="space-y-3 mt-4">
                      {/* Exp Slider/Input */}
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Exp</label>
                        <input
                          type="number"
                          value={exp}
                          onChange={(e) => updatePokemon(p.id, 3, parseInt(e.target.value) || 0)}
                          className="bg-slate-900 border border-slate-700/60 rounded-md px-1.5 py-0.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
                        />
                      </div>

                      {/* Attack Bonus Pct (Key 0) */}
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Attack Bonus %</label>
                        <input
                          type="number"
                          value={attackBonusPct}
                          onChange={(e) => updatePokemon(p.id, 0, parseInt(e.target.value) || 0)}
                          className="bg-slate-900 border border-slate-700/60 rounded-md px-1.5 py-0.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
                        />
                      </div>

                      {/* Vitamins / Proteins Object (Key 2) */}
                      <div className="space-y-1.5 border-t border-slate-700/40 pt-2.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Vitamins (Protein / Calcium / Carbos)</span>
                        <div className="grid grid-cols-3 gap-1">
                          <input
                            type="number"
                            value={proteins["0"] ?? 0}
                            title="Protein"
                            onChange={(e) => updateVitamins(p.id, 0, parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-700/60 rounded-md px-1 py-0.5 text-center text-xs font-mono text-yellow-400/90 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                          />
                          <input
                            type="number"
                            value={proteins["1"] ?? 0}
                            title="Calcium"
                            onChange={(e) => updateVitamins(p.id, 1, parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-700/60 rounded-md px-1 py-0.5 text-center text-xs font-mono text-cyan-400/90 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <input
                            type="number"
                            value={proteins["2"] ?? 0}
                            title="Carbos"
                            onChange={(e) => updateVitamins(p.id, 2, parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-700/60 rounded-md px-1 py-0.5 text-center text-xs font-mono text-emerald-400/90 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between gap-2">
                    <button
                      onClick={() => updatePokemon(p.id, 5, !isShiny)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all active:scale-95 ${
                        isShiny
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {isShiny ? '★ Shiny' : '☆ Make Shiny'}
                    </button>

                    <button
                      onClick={() => removePokemon(p.id)}
                      className="px-2 py-1 text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Release Pokémon"
                    >
                      Release
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3 mt-4 text-sm text-slate-400 select-none">
            <span>
              Showing <strong className="text-slate-200">{((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCaught.length)}</strong> of <strong className="text-slate-200">{filteredCaught.length}</strong> matches
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:hover:bg-slate-900"
              >
                Previous
              </button>
              <div className="px-3 py-1.5 text-xs font-bold font-mono bg-slate-900 border border-slate-800 rounded-lg select-all">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:hover:bg-slate-900"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
