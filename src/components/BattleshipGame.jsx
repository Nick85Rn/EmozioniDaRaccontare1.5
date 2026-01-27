import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Anchor, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

// Configurazioni
const GRID_SIZE = 5; 
const SHIP_COUNT = 4;

const BattleshipGame = () => {
  const [phase, setPhase] = useState('setup1');
  const [turn, setTurn] = useState(1); 
  
  const [p1Ships, setP1Ships] = useState([]);
  const [p1ShotsReceived, setP1ShotsReceived] = useState([]);
  const [p2Ships, setP2Ships] = useState([]);
  const [p2ShotsReceived, setP2ShotsReceived] = useState([]);

  // ... LOGICA DI GIOCO (Invariata) ...
  const handleCellClick = (index) => {
    if (phase === 'setup1') {
      if (p1Ships.includes(index)) setP1Ships(p1Ships.filter(i => i !== index));
      else if (p1Ships.length < SHIP_COUNT) setP1Ships([...p1Ships, index]);
    } else if (phase === 'setup2') {
      if (p2Ships.includes(index)) setP2Ships(p2Ships.filter(i => i !== index));
      else if (p2Ships.length < SHIP_COUNT) setP2Ships([...p2Ships, index]);
    } else if (phase === 'playing') {
      if (turn === 1) {
        if (!p2ShotsReceived.includes(index)) {
          const newShots = [...p2ShotsReceived, index];
          setP2ShotsReceived(newShots);
          checkWin(p2Ships, newShots, 1);
          if (!isGameOver(p2Ships, newShots)) setTimeout(() => setPhase('transition'), 1000);
        }
      } else {
        if (!p1ShotsReceived.includes(index)) {
          const newShots = [...p1ShotsReceived, index];
          setP1ShotsReceived(newShots);
          checkWin(p1Ships, newShots, 2);
          if (!isGameOver(p1Ships, newShots)) setTimeout(() => setPhase('transition'), 1000);
        }
      }
    }
  };

  const isGameOver = (ships, shots) => ships.every(shipIndex => shots.includes(shipIndex));
  
  const checkWin = (enemyShips, shots, player) => {
    if (enemyShips.every(ship => shots.includes(ship))) {
      setPhase('gameover');
    }
  };

  const handleNextPhase = () => {
    if (phase === 'setup1' && p1Ships.length === SHIP_COUNT) {
      setTurn(2); setPhase('transition');
    } else if (phase === 'setup2' && p2Ships.length === SHIP_COUNT) {
      setTurn(1); setPhase('transition');
    } else if (phase === 'transition') {
      if (p1Ships.length === SHIP_COUNT && p2Ships.length === SHIP_COUNT) {
        setPhase('playing');
        setTurn(prev => prev === 1 ? 2 : 1); 
      } else {
        setPhase('setup2');
      }
    }
  };

  const bgColor = turn === 1 ? '#E3F2FD' : '#FFEBEE'; 
  const cardColor = turn === 1 ? '#2196F3' : '#F44336';
  const playerTitle = turn === 1 ? 'Capitano Blu 🔵' : 'Capitano Rosso 🔴';

  // --- RENDER GRID ADATTIVA ---
  const renderGrid = () => {
    const isSetup = phase.includes('setup');
    const currentShips = turn === 1 ? p1Ships : p2Ships;
    const enemyShips = turn === 1 ? p2Ships : p1Ships;
    const enemyShots = turn === 1 ? p2ShotsReceived : p1ShotsReceived;

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, 
        gap: '2vw', // Gap proporzionale allo schermo
        width: '100%', 
        maxWidth: '400px', // Limite massimo su PC
        aspectRatio: '1/1', // Mantiene sempre il quadrato
        margin: '0 auto'
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          let content = '';
          let cellStyle = { background: 'white', cursor: 'pointer' };

          if (isSetup && currentShips.includes(index)) {
              content = '⛵'; cellStyle.background = '#FFF59D';
          } else if (!isSetup && enemyShots.includes(index)) {
              if (enemyShips.includes(index)) { content = '💥'; cellStyle.background = '#FFCDD2'; } 
              else { content = '🌊'; cellStyle.background = '#B3E5FC'; }
          }

          return (
            <motion.div
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCellClick(index)}
              className="clay-card"
              style={{
                ...cellStyle,
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.2rem, 4vw, 2rem)', // Testo che scala!
                borderRadius: '15%', // Arrotondamento fluido
                padding: 0,
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              {content}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // --- RESPONSIVE WRAPPERS ---
  if (phase === 'transition') {
    return (
      <div style={{ padding: '20px', height: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#37474F' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 10vw, 5rem)' }}>🙈</h1>
        <h2 style={{ color: 'white', marginBottom: '30px', textAlign: 'center', fontSize: '1.5rem' }}>Passa il dispositivo al<br/>{turn === 1 ? 'Giocatore 2 (ROSSO)' : 'Giocatore 1 (BLU)'}</h2>
        <button className="clay-btn clay-btn-primary" onClick={handleNextPhase} style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Sono pronto!</button>
      </div>
    );
  }

  if (phase === 'gameover') {
    return (
      <div style={{ padding: '20px', height: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFF9C4' }}>
        <Trophy size={80} color="#FFD700" />
        <h1 style={{ color: '#333', fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center' }}>Vittoria!</h1>
        <p style={{ fontSize: '1.2rem' }}>Bravo {playerTitle}!</p>
        <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
             <Link to="/games"><button className="clay-btn">Esci</button></Link>
             <button className="clay-btn clay-btn-primary" onClick={() => window.location.reload()}>Rivincita</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px', minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}
    >
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/games">
          <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', display:'flex', alignItems:'center', justifyContent:'center' }}><ArrowLeft size={20}/></button>
        </Link>
        <div className="clay-card" style={{ padding: '8px 15px', background: cardColor, color: 'white', fontSize:'0.9rem' }}>
          <span style={{ fontWeight: 'bold' }}>{playerTitle}</span>
        </div>
        <div style={{ width: 45 }}></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', maxWidth:'90%' }}>
        {phase.includes('setup') ? (
          <>
            <h2 style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)'}}>Posiziona le Navi ⚓</h2>
            <p style={{fontSize: '0.9rem'}}>Navi: <strong>{(turn === 1 ? p1Ships.length : p2Ships.length)} / {SHIP_COUNT}</strong></p>
          </>
        ) : (
          <>
            <h2 style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)'}}>Attacco! 💣</h2>
            <p style={{fontSize: '0.9rem'}}>Tocca per sparare</p>
          </>
        )}
      </div>

      {renderGrid()}

      {phase.includes('setup') && (
        <div style={{ marginTop: 'auto', paddingBottom: '30px', paddingTop:'20px' }}>
          <button 
            className="clay-btn clay-btn-primary"
            disabled={(turn === 1 ? p1Ships.length : p2Ships.length) < SHIP_COUNT}
            onClick={handleNextPhase}
            style={{ 
                opacity: (turn === 1 ? p1Ships.length : p2Ships.length) < SHIP_COUNT ? 0.5 : 1,
                fontSize: '1.1rem', padding: '15px 30px'
            }}
          >
            Fatto! Nascondi <Anchor size={20} style={{marginLeft:'5px'}}/>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BattleshipGame;