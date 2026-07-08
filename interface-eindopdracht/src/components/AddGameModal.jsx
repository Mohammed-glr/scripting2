import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const COLORS = [
  { name: 'Neon Pink', value: '#ff007f' },
  { name: 'Cyber Cyan', value: '#00f0ff' },
  { name: 'Golden Glow', value: '#d4af37' },
  { name: 'Luminous Purple', value: '#9d00ff' },
  { name: 'Acid Green', value: '#39ff14' },
  { name: 'Crimson Red', value: '#e63946' },
  { name: 'Chilly White', value: '#ffffff' }
];

const MODEL_TYPES = [
  { label: 'Sci-Fi Controller', value: 'controller' },
  { label: 'Energy Sword', value: 'sword' },
  { label: 'Portal Ring', value: 'portal' },
  { label: 'Sci-Fi Power Core', value: 'core' },
  { label: 'Hologram Pyramide', value: 'hologram' }
];

const AddGameModal = ({ isOpen, onClose, onAddGame }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  
  const [titel, setTitel] = useState('');
  const [genre, setGenre] = useState('RPG');
  const [platform, setPlatform] = useState('PC');
  const [status, setStatus] = useState('Backlog');
  const [speeltijd, setSpeeltijd] = useState(0);
  const [color, setColor] = useState('#00f0ff');
  const [modelType, setModelType] = useState('controller');
  const [description, setDescription] = useState('');

  // GSAP animation on open/close
  useEffect(() => {
    if (isOpen) {
      // Fade in overlay, zoom/slide in content
      gsap.killTweensOf([overlayRef.current, contentRef.current]);
      
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(contentRef.current,
        { scale: 0.8, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    // Animate out, then call onClose
    gsap.to(contentRef.current, {
      scale: 0.8,
      y: 50,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titel.trim()) return alert('Titel is verplicht');

    onAddGame({
      titel,
      genre,
      platform,
      status,
      speeltijd: Number(speeltijd) || 0,
      color,
      modelType,
      description,
      favorite: false
    });

    // Reset Form
    setTitel('');
    setGenre('RPG');
    setPlatform('PC');
    setStatus('Backlog');
    setSpeeltijd(0);
    setColor('#00f0ff');
    setModelType('controller');
    setDescription('');

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef} 
      className="modal-overlay"
      onClick={handleClose}
    >
      <div 
        ref={contentRef} 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Game Toevoegen</h2>
          <button className="btn-close" onClick={handleClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Titel</label>
            <input 
              type="text" 
              required
              value={titel} 
              onChange={(e) => setTitel(e.target.value)} 
              placeholder="Bijv. Portal 2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genre</label>
              <input 
                type="text" 
                required
                value={genre} 
                onChange={(e) => setGenre(e.target.value)} 
                placeholder="Bijv. RPG, FPS"
              />
            </div>
            <div className="form-group">
              <label>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="PC">PC</option>
                <option value="PS5">PS5</option>
                <option value="Xbox">Xbox</option>
                <option value="Switch">Switch</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Playing">Playing</option>
                <option value="Completed">Completed</option>
                <option value="Backlog">Backlog</option>
              </select>
            </div>
            <div className="form-group">
              <label>Speeltijd (uren)</label>
              <input 
                type="number" 
                min="0"
                value={speeltijd} 
                onChange={(e) => setSpeeltijd(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Thema Kleur</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                {COLORS.map(c => (
                  <option key={c.value} value={c.value}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>3D Showcase Model</label>
              <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
                {MODEL_TYPES.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Beschrijving</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Korte omschrijving..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Annuleer</button>
            <button type="submit" className="btn-submit">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGameModal;
