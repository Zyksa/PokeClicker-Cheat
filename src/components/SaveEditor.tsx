import React, { useState } from 'react';
import { decodeSave, encodeSave } from '../utils/saveHelper';
import type { PokeClickerSave } from '../utils/saveHelper';
import { pokemonList } from '../data/pokemonList';

// Import Tabs
import { TrainerTab } from './tabs/TrainerTab';
import { WalletTab } from './tabs/WalletTab';
import { KeyItemsTab } from './tabs/KeyItemsTab';
import { OakItemsTab } from './tabs/OakItemsTab';
import { PartyTab } from './tabs/PartyTab';
import { UndergroundTab } from './tabs/UndergroundTab';

type TabId = 'trainer' | 'wallet' | 'keyitems' | 'oakitems' | 'party' | 'underground';

export const SaveEditor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [saveData, setSaveData] = useState<PokeClickerSave | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('trainer');
  
  // Export states
  const [exportText, setExportText] = useState('');
  const [copied, setCopied] = useState(false);

  // File loading function
  const handleLoadSave = (rawText: string) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      if (!rawText.trim()) {
        throw new Error("Save string is empty.");
      }
      const decoded = decodeSave(rawText);
      setSaveData(decoded);
      setSuccessMsg("Save file loaded successfully! You can now edit it.");
      setInputText('');
      
      // Auto-generate initial export string
      const initialExport = encodeSave(decoded);
      setExportText(initialExport);
    } catch (e: any) {
      setErrorMsg(e.message);
      setSaveData(null);
    }
  };

  // Drag and drop handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleLoadSave(text);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleLoadSave(text);
      };
      reader.readAsText(file);
    }
  };

  // Change handler for subcomponents
  const handleSaveChange = (newSave: PokeClickerSave) => {
    setSaveData(newSave);
    
    // Regenerate export base64
    try {
      const encoded = encodeSave(newSave);
      setExportText(encoded);
      setCopied(false);
    } catch (e: any) {
      setErrorMsg(`Encoding error: ${e.message}`);
    }
  };

  // Copy to Clipboard helper
  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download save file helper
  const handleDownload = () => {
    if (!saveData) return;
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const trainerName = saveData.save.profile?.name || 'Trainer';
    link.href = url;
    link.download = `pokeclicker_cheat_${trainerName.toLowerCase()}_save.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Load sample save helper for test/demo
  const handleLoadSample = async () => {
    try {
      // In development workspace, read exampleb64.txt or simulate
      // We can also embed a tiny mock save in case the file doesn't resolve in browser,
      // but let's try to fetch it or fallback to a standard clean save template.
      const response = await fetch('/exampleb64.txt');
      if (response.ok) {
        const text = await response.text();
        handleLoadSave(text);
      } else {
        // Fallback mockup
        throw new Error("Could not fetch local sample. Please drag-and-drop your save file.");
      }
    } catch (err: any) {
      setErrorMsg(`Could not load example save: ${err.message}`);
    }
  };

  // Sidebar Tabs Config
  const tabs = [
    { id: 'trainer', name: 'Trainer Profile', icon: '👤' },
    { id: 'wallet', name: 'Wallet Currencies', icon: '🪙' },
    { id: 'keyitems', name: 'Key Items Inventory', icon: '🎒' },
    { id: 'oakitems', name: 'Oak Items', icon: '🔮' },
    { id: 'party', name: 'Party Pokémon', icon: '👾' },
    { id: 'underground', name: 'Mining & Farming', icon: '⛏️' },
  ] as const;

  // Unload save
  const handleCloseSave = () => {
    if (confirm("Close active save editor? Any unsaved edits will be lost unless you exported the base64 string.")) {
      setSaveData(null);
      setExportText('');
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  };

  // Quick Action: Max Currencies
  const quickMaxCurrencies = () => {
    if (!saveData) return;
    const newCurrencies = Array(7).fill(999999999);
    handleSaveChange({
      ...saveData,
      save: {
        ...saveData.save,
        wallet: {
          ...saveData.save.wallet,
          currencies: newCurrencies
        }
      }
    });
    setSuccessMsg("Currencies set to maximum (999,999,999)!");
  };

  // Quick Action: Make Party Shiny
  const quickMakeShiny = () => {
    if (!saveData) return;
    const caught = saveData.save.party?.caughtPokemon || [];
    const updatedParty = caught.map(p => ({
      ...p,
      "5": true // shiny flag
    }));
    handleSaveChange({
      ...saveData,
      save: {
        ...saveData.save,
        party: {
          ...saveData.save.party,
          caughtPokemon: updatedParty
        }
      }
    });
    setSuccessMsg(`All ${caught.length} caught Pokémon are now Shiny!`);
  };

  // Quick Action: Unlock All Key Items
  const quickUnlockKeyItems = () => {
    if (!saveData) return;
    const currentKeys = saveData.save.keyItems || {};
    const newKeys = { ...currentKeys };
    const items = [
      'Teachy_tv', 'Coin_case', 'Pokeball_bag', 'Town_map', 'Dungeon_ticket', 
      'Super_rod', 'Holo_caster', 'Mystery_egg', 'Safari_ticket', 'Wailmer_pail', 
      'Explorer_kit', 'Eon_ticket', 'Event_calendar', 'Gem_case', 'DNA_splicers', 
      'Reins_of_unity', 'Pokerus_virus'
    ];
    items.forEach(key => {
      newKeys[key] = true;
    });
    handleSaveChange({
      ...saveData,
      save: {
        ...saveData.save,
        keyItems: newKeys
      }
    });
    setSuccessMsg("All Key Items unlocked!");
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col antialiased bg-slate-950">
      
      {/* Navbar header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-indigo-400 bg-clip-text text-transparent">
                POKECLICKER SAVE EDITOR
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Intuitive Visual Cheat Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!saveData ? (
              <button
                onClick={handleLoadSample}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 font-bold text-xs rounded-lg transition-all border border-slate-700/80"
              >
                📁 Load Example Save
              </button>
            ) : (
              <button
                onClick={handleCloseSave}
                className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/40 hover:border-rose-500/60 text-rose-400 font-bold text-xs rounded-lg transition-all"
              >
                ❌ Close Save
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 flex flex-col justify-center">
        
        {/* Alerts and Banner Banners */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-4 flex items-start gap-3 text-rose-400 text-sm animate-pulse">
            <span className="text-lg">⚠️</span>
            <div>
              <strong className="font-bold">Error:</strong> {errorMsg}
            </div>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4 flex items-start gap-3 text-emerald-400 text-sm">
            <span className="text-lg">✓</span>
            <div>
              <strong className="font-bold">Success:</strong> {successMsg}
            </div>
          </div>
        )}

        {!saveData ? (
          /* Save Loading Screen / Welcome Zone */
          <div className="max-w-2xl w-full mx-auto space-y-8 py-12">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-100">Modify your Save File</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Paste your Base64 save code or drag and drop your exported file below to modify currencies, pokemon, key items, and progression instantly.
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/60 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800/80 group-hover:bg-indigo-500/10 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center text-3xl transition-all shadow-inner">
                📥
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 font-semibold block text-base">Drag & Drop save text file here</span>
                <span className="text-slate-500 text-xs block">Or click the button below to select a file from your system</span>
              </div>
              <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-sm rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/10">
                Choose File
                <input
                  type="file"
                  accept=".txt,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Paste Textbox */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Paste raw save string (Base64)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. eyJwbGF5ZXIiOnsiX3RpbWVUcmF2ZWxsZXIi..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-700 leading-relaxed resize-y"
              />
              <button
                onClick={() => handleLoadSave(inputText)}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-slate-100 font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10"
              >
                ⚡ Decode & Edit Save
              </button>
            </div>
            
            {/* Guide Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 leading-relaxed bg-slate-900/20 border border-slate-900/60 p-5 rounded-2xl">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">How to export save:</h4>
                <p>Open PokéClicker → Settings (top-right cog) → Click <strong>Export Save</strong>. This downloads a text file or copies the base64 code to your clipboard.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">How to import:</h4>
                <p>Modify anything here → Export from the sidebar → Copy or download the new code → In PokéClicker settings click <strong>Import Save</strong>.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Editor Interface when Save is Loaded */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 items-start">
            
            {/* Left Column: Navigation & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card Header */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-xl select-none">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl font-bold font-mono text-indigo-400 border border-indigo-500/30">
                    {saveData.save.profile?.name?.[0] || 'T'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-200">{saveData.save.profile?.name || 'Trainer'}</h3>
                    <p className="text-xs text-slate-500 font-semibold font-mono">ID: #{saveData.player?.trainerId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <div>
                    Region: <strong className="text-slate-200">{pokemonList.length ? (saveData.player?._region === 0 ? 'Kanto' : saveData.player?._region === 1 ? 'Johto' : 'Region #' + saveData.player?._region) : 'N/A'}</strong>
                  </div>
                  <div>
                    Ver: <strong className="text-slate-200">{saveData.save.update?.version || '0.10.x'}</strong>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-2 shadow-xl select-none">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setErrorMsg(null);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                          active
                            ? 'bg-indigo-600 text-slate-100 shadow-md shadow-indigo-600/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="text-base">{tab.icon}</span>
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Cheat Hacks Card */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">🚀 Instant Quick Cheats</h4>
                <div className="space-y-2">
                  <button
                    onClick={quickMaxCurrencies}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs font-bold text-slate-200 hover:text-slate-100 flex items-center justify-between px-3 border border-slate-750 transition-colors"
                  >
                    <span>🪙 Max Out Currencies</span>
                    <span className="text-[10px] text-slate-500 font-mono">999M</span>
                  </button>
                  <button
                    onClick={quickUnlockKeyItems}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs font-bold text-slate-200 hover:text-slate-100 flex items-center justify-between px-3 border border-slate-750 transition-colors"
                  >
                    <span>🎒 Unlock All Key Items</span>
                    <span className="text-[10px] text-slate-500 font-mono">All</span>
                  </button>
                  <button
                    onClick={quickMakeShiny}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs font-bold text-slate-200 hover:text-slate-100 flex items-center justify-between px-3 border border-slate-750 transition-colors"
                  >
                    <span>🔮 Make Caught Pokémon Shiny</span>
                    <span className="text-[10px] text-slate-500 font-mono">Shiny</span>
                  </button>
                </div>
              </div>

              {/* Export Panel Card */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">💾 Export Save File</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your changes are automatically saved in the code below. Copy the code or click the download button to get the text file.
                </p>
                <div className="space-y-3">
                  <textarea
                    readOnly
                    value={exportText}
                    rows={4}
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] text-slate-400 font-mono focus:outline-none cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleCopy}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        copied 
                          ? 'bg-emerald-600 text-slate-100' 
                          : 'bg-indigo-650 hover:bg-indigo-600 text-slate-100'
                      }`}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy Code'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-all border border-slate-750"
                    >
                      💾 Download .txt
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Active Tab Panels */}
            <div className="lg:col-span-8 bg-slate-900/50 border border-slate-850 rounded-3xl p-6 min-h-[500px] shadow-2xl backdrop-blur-xl">
              {activeTab === 'trainer' && (
                <TrainerTab saveData={saveData} onChange={handleSaveChange} />
              )}
              {activeTab === 'wallet' && (
                <WalletTab saveData={saveData} onChange={handleSaveChange} />
              )}
              {activeTab === 'keyitems' && (
                <KeyItemsTab saveData={saveData} onChange={handleSaveChange} />
              )}
              {activeTab === 'oakitems' && (
                <OakItemsTab saveData={saveData} onChange={handleSaveChange} />
              )}
              {activeTab === 'party' && (
                <PartyTab saveData={saveData} onChange={handleSaveChange} />
              )}
              {activeTab === 'underground' && (
                <UndergroundTab saveData={saveData} onChange={handleSaveChange} />
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-600 select-none">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 PokéClicker Save Editor. Made with Astro + React + Tailwind CSS.</p>
          <p className="text-[10px] opacity-60">PokeClicker is a registered trademark of its owners. This site is not affiliated with the official game.</p>
        </div>
      </footer>

    </div>
  );
};
export default SaveEditor;
