import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

// Helper to convert hex color to RGB for box-shadows
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 240, 255';
};

const GameCard = ({ 
  game, 
  activeGameId, 
  onSelectShowcase, 
  onToggleFavorite, 
  onUpdateStatus, 
  onUpdatePlaytime, 
  onDeleteGame 
}) => {
  const cardRef = useRef(null);
  const isActive = activeGameId === game.id;

  // Hover effect with GSAP
  useEffect(() => {
    const card = cardRef.current;
    
    const onMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        y: -4,
        borderColor: game.color,
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 15px rgba(${hexToRgb(game.color)}, 0.3)`,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      if (!isActive) {
        gsap.to(card, {
          scale: 1,
          y: 0,
          borderColor: 'rgba(46, 46, 74, 0.5)',
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        // Retain the active styling
        gsap.to(card, {
          scale: 1,
          y: -4,
          borderColor: game.color,
          boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 15px rgba(${hexToRgb(game.color)}, 0.4)`,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [game.color, isActive]);

  // Entrance animation for new card
  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: isActive ? -4 : 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
    );
  }, []);

  // Set css variables for themes dynamically
  const cardStyle = {
    '--game-theme-color': game.color,
    '--game-theme-color-rgb': hexToRgb(game.color)
  };

  return (
    <div 
      ref={cardRef} 
      className={`game-card ${isActive ? 'active-card' : ''}`}
      style={cardStyle}
    >
      <div className="card-top">
        <div className="card-title-group">
          <h3 className="card-title" title={game.titel}>{game.titel}</h3>
          <span className="card-genre">{game.genre}</span>
        </div>
        <button 
          className={`btn-fav ${game.favorite ? 'is-favorite' : ''}`}
          onClick={() => onToggleFavorite(game.id)}
          title={game.favorite ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
        >
          {game.favorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="card-body">
        <p className="card-desc">{game.description || 'Geen beschrijving beschikbaar.'}</p>
        <div className="card-meta">
          <span className="meta-platform">{game.platform}</span>
          <span className={`status-badge status-${game.status.toLowerCase()}`}>
            {game.status}
          </span>
        </div>
      </div>

      <div className="card-controls">
        <div className="control-row">
          <label htmlFor={`status-select-${game.id}`}>Status</label>
          <select 
            id={`status-select-${game.id}`}
            className="status-select"
            value={game.status}
            onChange={(e) => onUpdateStatus(game.id, e.target.value)}
          >
            <option value="Playing">Playing</option>
            <option value="Completed">Completed</option>
            <option value="Backlog">Backlog</option>
          </select>
        </div>

        <div className="playtime-editor">
          <label>Speeltijd</label>
          <div className="playtime-adjust">
            <button onClick={() => onUpdatePlaytime(game.id, -1)} title="Verminder met 1 uur">-</button>
            <span className="playtime-display">{game.speeltijd} u</span>
            <button onClick={() => onUpdatePlaytime(game.id, 1)} title="Vermeerder met 1 uur">+</button>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button 
          className="btn-select-showcase"
          onClick={() => onSelectShowcase(game.id)}
        >
          <span>👁️ Showcase 3D</span>
        </button>
        
        <button 
          className="btn-delete"
          onClick={() => onDeleteGame(game.id)}
          title="Verwijder game"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default GameCard;
