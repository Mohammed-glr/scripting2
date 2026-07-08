import React, { useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { initialGames } from './data/gamesData';

// Component Imports
import Header from './components/Header';
import GameFilters from './components/GameFilters';
import GameCard from './components/GameCard';
import AddGameModal from './components/AddGameModal';
import ThreeShowcase from './components/ThreeShowcase';
import AchievementAlert from './components/AchievementAlert';

function App() {
  // Load initial state from local storage, or fall back to default
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('gm_dashboard_games');
    return saved ? JSON.parse(saved) : initialGames;
  });

  // Active game ID for Three.js Showcase
  const [activeGameId, setActiveGameId] = useState(() => {
    const saved = localStorage.getItem('gm_dashboard_games');
    const list = saved ? JSON.parse(saved) : initialGames;
    return list.length > 0 ? list[0].id : null;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('titel-asc');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Achievement State
  const [achievement, setAchievement] = useState('');

  // Persist games list to localStorage
  useEffect(() => {
    localStorage.setItem('gm_dashboard_games', JSON.stringify(games));
  }, [games]);

  // Entrance GSAP animation on mount
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.app-header', 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo('.filters-panel', 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );
    tl.fromTo('.showcase-panel', 
      { x: 50, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );
  }, []);

  // Compute filtered and sorted list using useMemo (ES6/React efficiency)
  const filteredAndSortedGames = useMemo(() => {
    let list = [...games];

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(game => game.titel.toLowerCase().includes(q));
    }

    // Platform filtering
    if (selectedPlatform !== 'All') {
      list = list.filter(game => game.platform === selectedPlatform);
    }

    // Genre filtering
    if (selectedGenre !== 'All') {
      list = list.filter(game => game.genre === selectedGenre);
    }

    // Status filtering
    if (selectedStatus !== 'All') {
      list = list.filter(game => game.status === selectedStatus);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'titel-asc') {
        return a.titel.localeCompare(b.titel);
      }
      if (sortBy === 'titel-desc') {
        return b.titel.localeCompare(a.titel);
      }
      if (sortBy === 'speeltijd-desc') {
        return b.speeltijd - a.speeltijd;
      }
      if (sortBy === 'speeltijd-asc') {
        return a.speeltijd - b.speeltijd;
      }
      return 0;
    });

    return list;
  }, [games, searchQuery, selectedPlatform, selectedGenre, selectedStatus, sortBy]);

  // Retrieve active game details
  const activeGame = useMemo(() => {
    return games.find(game => game.id === activeGameId) || null;
  }, [games, activeGameId]);

  // If the active game was deleted, reset to the first available game
  useEffect(() => {
    if (games.length > 0 && !games.some(game => game.id === activeGameId)) {
      setActiveGameId(games[0].id);
    } else if (games.length === 0) {
      setActiveGameId(null);
    }
  }, [games, activeGameId]);

  // Handlers
  const handleToggleFavorite = (id) => {
    setGames(prev => prev.map(game => 
      game.id === id ? { ...game, favorite: !game.favorite } : game
    ));
  };

  const handleUpdateStatus = (id, newStatus) => {
    const game = games.find(g => g.id === id);
    if (!game) return;

    // Trigger achievement if status changes to Completed
    if (newStatus === 'Completed' && game.status !== 'Completed') {
      setAchievement(`Je hebt "${game.titel}" voltooid!`);
    }

    setGames(prev => prev.map(g => 
      g.id === id ? { ...g, status: newStatus } : g
    ));
  };

  const handleUpdatePlaytime = (id, change) => {
    setGames(prev => prev.map(game => {
      if (game.id === id) {
        const newPlaytime = Math.max(0, game.speeltijd + change);
        return { ...game, speeltijd: newPlaytime };
      }
      return game;
    }));
  };

  const handleDeleteGame = (id) => {
    if (window.confirm('Weet je zeker dat je deze game wilt verwijderen?')) {
      // Scale down card animation using GSAP can be bypassed by standard react state updates,
      // but cards animate gracefully out before we trigger the state update!
      setGames(prev => prev.filter(game => game.id !== id));
    }
  };

  const handleAddGame = (newGame) => {
    const nextId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
    const gameWithId = { ...newGame, id: nextId };
    
    setGames(prev => [gameWithId, ...prev]);
    setActiveGameId(gameWithId.id); // Focus showcase on the newly added game
  };

  const handleResetLibrary = () => {
    if (window.confirm('Weet je zeker dat je de bibliotheek wilt resetten naar de standaardlijst?')) {
      setGames(initialGames);
      if (initialGames.length > 0) {
        setActiveGameId(initialGames[0].id);
      }
      localStorage.removeItem('gm_dashboard_games');
    }
  };

  return (
    <div className="app-container">
      <Header games={games} />
      
      <GameFilters 
        games={games}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="dashboard-grid">
        <main className="library-section">
          {filteredAndSortedGames.length > 0 ? (
            <div className="library-grid">
              {filteredAndSortedGames.map(game => (
                <GameCard 
                  key={game.id}
                  game={game}
                  activeGameId={activeGameId}
                  onSelectShowcase={setActiveGameId}
                  onToggleFavorite={handleToggleFavorite}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePlaytime={handleUpdatePlaytime}
                  onDeleteGame={handleDeleteGame}
                />
              ))}
            </div>
          ) : (
            <div className="empty-library">
              <h3>Geen games gevonden</h3>
              <p>Probeer een andere filter of zoekterm, of reset de bibliotheek.</p>
              <button className="btn-reset" onClick={handleResetLibrary}>
                Reset Bibliotheek
              </button>
            </div>
          )}

          {games.length > 0 && filteredAndSortedGames.length > 0 && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                className="btn-reset" 
                style={{ background: 'rgba(255, 0, 85, 0.1)', color: '#ff0055', border: '1px solid rgba(255, 0, 85, 0.3)' }}
                onClick={handleResetLibrary}
              >
                Reset Bibliotheek naar Standaard
              </button>
            </div>
          )}
        </main>

        <aside>
          {activeGame ? (
            <ThreeShowcase game={activeGame} />
          ) : (
            <div className="showcase-panel" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <h2>3D Showcase</h2>
              <p style={{ marginTop: '1rem', color: '#8b8baf' }}>Selecteer een game uit de library om de 3D showcase te bekijken.</p>
            </div>
          )}
        </aside>
      </div>

      <AddGameModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <AchievementAlert 
        achievement={achievement}
        onClear={() => setAchievement('')}
      />
    </div>
  );
}

export default App;
