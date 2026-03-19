/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const closePlayer = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Gamepad2 className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">UNBLOCKED<span className="text-emerald-500">HUB</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">Premium Gaming Experience</p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">REQUEST GAME</button>
          <div className="h-4 w-px bg-white/10" />
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all">
            SIGN IN
          </button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-73px)] overflow-hidden">
        {/* Sidebar / Game List */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-white/5 bg-[#0d0d0d] overflow-y-auto custom-scrollbar"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Library</h2>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                    {filteredGames.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {filteredGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                        selectedGame?.id === game.id 
                          ? 'bg-emerald-500/10 border border-emerald-500/20' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left overflow-hidden">
                        <h3 className={`text-sm font-semibold truncate ${selectedGame?.id === game.id ? 'text-emerald-400' : 'text-zinc-200'}`}>
                          {game.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 truncate">{game.description}</p>
                      </div>
                    </button>
                  ))}
                  {filteredGames.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-zinc-500 text-sm italic">No games found...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <section className="flex-1 relative bg-[#050505] overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-4 top-4 z-30 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg hover:bg-black/80 transition-all"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>

          {selectedGame ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 relative group">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                />
                
                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => window.open(selectedGame.url, '_blank')}
                    className="p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={closePlayer}
                    className="p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg hover:bg-red-500 hover:text-black transition-all"
                    title="Close game"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-[#0d0d0d] border-t border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedGame.title}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{selectedGame.description}</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                    <Maximize2 className="w-4 h-4" />
                    FULLSCREEN
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tighter mb-4 italic">FEATURED GAMES</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gamesData.slice(0, 3).map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ y: -5 }}
                      className="group relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#111] cursor-pointer"
                      onClick={() => handleGameSelect(game)}
                    >
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 block">Trending Now</span>
                            <h3 className="text-xl font-bold text-white">{game.title}</h3>
                          </div>
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            <Gamepad2 className="w-5 h-5 text-emerald-500" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-4">
                  All Games <div className="h-px flex-1 bg-white/5" />
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group cursor-pointer"
                      onClick={() => handleGameSelect(game)}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-[#111] mb-3 relative">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-300 group-hover:text-emerald-400 transition-colors truncate">{game.title}</h3>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">Arcade</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
}
