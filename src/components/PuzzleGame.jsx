import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy, Play } from 'lucide-react';
import { speakText } from '../utils/speechUtils'; // 🔊 Integra la voce ElevenLabs

// Immagini di esempio (puoi sostituirle con le tue URL reali se diverse)
const IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=500&q=80', name: 'Leone' },
  { id: 2, src: 'https://images.unsplash.com/photo-1519066629447-267fffa62d4b?auto=format&fit=crop&w=500&q=80', name: 'Ghepardo' },
  { id: 3, src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=500&q=80', name: 'Volpe' },
  { id: 4, src: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=500&q=80', name: 'Pesce Pagliaccio' },
];

const PuzzleGame = () => {
  const [level, setLevel] = useState(2); // 2 = Facile (2x2), 3 = Medio, 4 = Difficile
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);
  const [tiles, setTiles] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [firstTileIndex, setFirstTileIndex] = useState(null); // Per lo swap

  // Inizia una nuova partita
  useEffect(() => {
    startNewGame();
  }, [level, selectedImage]);

  const startNewGame = () => {
    setIsSolved(false);
    setFirstTileIndex(null);
    
    // 1. Crea i pezzi
    const totalTiles = level * level;
    const newTiles = Array.from({ length: totalTiles }, (_, index) => ({
      id: index,
      currentPos: index, // Posizione attuale
      correctPos: index, // Posizione corretta
    }));

    // 2. Mescola (Shuffle)
    const shuffled = [...newTiles].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
  };

  // Gestione Click per scambiare due pezzi
  const handleTileClick = (index) => {
    if (isSolved) return;

    if (firstTileIndex === null) {
      // Primo click
      setFirstTileIndex(index);
    } else {
      // Secondo click: Scambia
      const newTiles = [...tiles];
      const temp = newTiles[firstTileIndex];
      newTiles[firstTileIndex] = newTiles[index];
      newTiles[index] = temp;
      
      setTiles(newTiles);
      setFirstTileIndex(null);
      checkWin(newTiles);
    }
  };

  const checkWin = (currentTiles) => {
    const isWin = currentTiles.every((tile, index) => tile.correctPos === index);
    if (isWin) {
      setIsSolved(true);
      // 🔊 VOCE ELEVENLABS ALLA VITTORIA
      speakText(`Bravissimo! Hai completato il puzzle del ${selectedImage.name}!`);
    }
  };

  // Calcolo per ritagliare l'immagine (background-position)
  const getBackgroundStyle = (correctPos) => {
    const row = Math.floor(correctPos / level);
    const col = correctPos % level;
    const percentage = 100 / (level - 1);
    
    return {
      backgroundImage: `url(${selectedImage.src})`,
      backgroundSize: `${level * 100}%`,
      backgroundPosition: `${col * percentage}% ${row * percentage}%`
    };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#E3F2FD', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/games" style={{ textDecoration: 'none', color: '#1565C0' }}>
          <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft />
          </div>
        </Link>
        <h2 style={{ color: '#1565C0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          Puzzle <span style={{fontSize: '1.5rem'}}>🧩</span>
        </h2>
        <button onClick={startNewGame} className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={20} />
        </button>
      </div>

      {/* LIVELLI */}
      <div className="clay-card" style={{ padding: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', borderRadius: '30px' }}>
        {[2, 3, 4].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: level === lvl ? '#fff' : 'transparent',
              color: level === lvl ? '#1565C0' : '#90CAF9',
              fontWeight: 'bold',
              boxShadow: level === lvl ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {lvl === 2 ? 'Facile' : lvl === 3 ? 'Medio' : 'Difficile'}
          </button>
        ))}
      </div>

      {/* SELETTORE IMMAGINI */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        {IMAGES.map((img) => (
          <img 
            key={img.id}
            src={img.src}
            alt={img.name}
            onClick={() => setSelectedImage(img)}
            style={{
              width: '60px', height: '60px', objectFit: 'cover', borderRadius: '15px',
              border: selectedImage.id === img.id ? '3px solid #1565C0' : '3px solid transparent',
              cursor: 'pointer', transition: '0.3s'
            }}
          />
        ))}
      </div>

      {/* GRIGLIA GIOCO */}
      <div 
        className="clay-card"
        style={{ 
          maxWidth: '400px', 
          margin: '0 auto', 
          aspectRatio: '1/1', 
          padding: '10px',
          display: 'grid',
          gridTemplateColumns: `repeat(${level}, 1fr)`,
          gridTemplateRows: `repeat(${level}, 1fr)`,
          gap: '2px',
          background: '#fff',
          position: 'relative' // Importante per contenere
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            style={{
              ...getBackgroundStyle(tile.correctPos),
              borderRadius: '5px',
              cursor: 'pointer',
              border: firstTileIndex === index ? '3px solid #FFD700' : '1px solid #fff',
              transform: firstTileIndex === index ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.2s',
              opacity: isSolved ? 1 : 0.9,
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
            }}
          />
        ))}
      </div>

      {/* 🛠️ FIX BANNER: ORA È UN OVERLAY FISSO E CENTRATO */}
      {isSolved && (
        <div style={{
          position: 'fixed', // Copre tutto lo schermo
          top: 0, 
          left: 0,
          right: 0, 
          bottom: 0,
          background: 'rgba(0,0,0,0.5)', // Sfondo scuro semi-trasparente
          display: 'flex',
          alignItems: 'center', // Centra verticalmente
          justifyContent: 'center', // Centra orizzontalmente
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="clay-card" style={{ 
            background: '#fff', 
            padding: '30px', 
            borderRadius: '25px', 
            textAlign: 'center',
            width: '80%',
            maxWidth: '300px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <Trophy size={60} color="#FFD700" style={{ marginBottom: '15px' }} />
            <h2 style={{ color: '#2E7D32', margin: '0 0 10px 0' }}>Bravissimo!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Hai completato il puzzle!</p>
            
            <button 
              onClick={startNewGame}
              className="clay-btn clay-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}
            >
              <RefreshCw size={18} style={{ marginRight: 8 }} /> Gioca ancora
            </button>
          </div>
        </div>
      )}

      {/* Stili animazione CSS inline per semplicità */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PuzzleGame;