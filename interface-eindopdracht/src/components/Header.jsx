import React from 'react';

const Header = ({ games }) => {
  const totalGames = games.length;
  const completedGames = games.filter(g => g.status === 'Completed').length;
  const totalPlaytime = games.reduce((sum, g) => sum + (Number(g.speeltijd) || 0), 0);

  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>Game Master Dashboard</h1>
        <p>Beheer je bibliotheek en ontdek 3D showcases</p>
      </div>
      <div className="header-stats">
        <div className="stat-item">
          <div className="stat-val">{totalGames}</div>
          <div className="stat-lbl">Totaal</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{completedGames}</div>
          <div className="stat-lbl">Voltooid</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{totalPlaytime}u</div>
          <div className="stat-lbl">Speeltijd</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
