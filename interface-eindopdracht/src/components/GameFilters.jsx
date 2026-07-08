import React from 'react';

const GameFilters = ({ 
  games, 
  searchQuery, 
  setSearchQuery, 
  selectedPlatform, 
  setSelectedPlatform, 
  selectedGenre, 
  setSelectedGenre, 
  selectedStatus, 
  setSelectedStatus, 
  sortBy, 
  setSortBy,
  onOpenAddModal 
}) => {
  // ES6 Set & Map to dynamically extract genres and platforms from current games
  const genres = ['All', ...new Set(games.map(game => game.genre))];
  const platforms = ['All', ...new Set(games.map(game => game.platform))];
  
  return (
    <div className="filters-panel">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Zoek een game..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="filters-controls">
        <select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
          title="Filter op genre"
        >
          {genres.map(genre => (
            <option key={genre} value={genre}>
              {genre === 'All' ? 'Alle Genres' : genre}
            </option>
          ))}
        </select>

        <select 
          value={selectedPlatform} 
          onChange={(e) => setSelectedPlatform(e.target.value)}
          title="Filter op platform"
        >
          {platforms.map(platform => (
            <option key={platform} value={platform}>
              {platform === 'All' ? 'Alle Platforms' : platform}
            </option>
          ))}
        </select>

        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          title="Filter op status"
        >
          <option value="All">Alle Statuses</option>
          <option value="Playing">Playing</option>
          <option value="Completed">Completed</option>
          <option value="Backlog">Backlog</option>
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          title="Sorteer op"
        >
          <option value="titel-asc">Titel (A-Z)</option>
          <option value="titel-desc">Titel (Z-A)</option>
          <option value="speeltijd-desc">Speeltijd (Hoog-Laag)</option>
          <option value="speeltijd-asc">Speeltijd (Laag-Hoog)</option>
        </select>

        <button className="btn-add" onClick={onOpenAddModal}>
          + Game Toevoegen
        </button>
      </div>
    </div>
  );
};

export default GameFilters;
