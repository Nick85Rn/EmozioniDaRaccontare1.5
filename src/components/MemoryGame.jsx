import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const CARDS_DATA = [
  { id: 1, content: '😡', type: 'Rabbia', color: '#FFCDD2' },
  { id: 2, content: '😭', type: 'Tristezza', color: '#BBDEFB' },
  { id: 3, content: '😨', type: 'Paura', color: '#E1BEE7' },
  { id: 4, content: '😄', type: 'Gioia', color: '#FFF9C4' },
  { id: 5, content: '🤢', type: 'Disgusto', color: '#C8E6C9' },
  { id: 6, content: '😴', type: 'Calma', color: '#E0F7FA' },
];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const shuffleCards = () => {
    const shuffled = [...CARDS_DATA, ...CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random() })); 
    setCards(shuffled); setFlipped([]); setSolved([]); setDisabled(false);
  };

  useEffect(() => { shuffleCards(); }, []);

  const handleClick = (id) => {
    if (disabled) return;
    if (flipped.length === 0) { setFlipped([id]); return; }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]); checkMatch(id);
      } else { setDisabled(false); }
    }
  };

  const checkMatch = (secondId) => {
    const first = cards.find((c) => c.uniqueId === flipped[0]);
    const second = cards.find((c) => c.uniqueId === secondId);
    if (first.type === second.type) {
      setSolved([...solved, flipped[0], secondId]); setFlipped([]); setDisabled(false);
    } else {
      setTimeout(() => { setFlipped([]); setDisabled(false); }, 1000);
    }
  };

  const isWon = cards.length > 0 && solved.length === cards.length;

  return (
    <div style={{ 
      padding: '20px', paddingBottom: '80px', minHeight: '100svh', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden' 
    }}>
      
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/games">
          <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', display:'flex', alignItems:'center', justifyContent:'center' }}><ArrowLeft size={20}/></button>
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Memory {isWon ? '🎉' : ''}</h2>
        <button className="clay-btn" onClick={shuffleCards} style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', display:'flex', alignItems:'center', justifyContent:'center' }}><RefreshCw size={20}/></button>
      </div>

      {isWon && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="clay-sheet" 
          style={{ marginBottom: '20px', background: '#FFF9C4', textAlign: 'center', width: '90%', maxWidth: '400px', padding: '20px' }}
        >
          <Trophy size={40} color="#FBC02D" />
          <h3>Hai Vinto!</h3>
          <button className="clay-btn clay-btn-primary" onClick={shuffleCards}>Rigioca</button>
        </motion.div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px', // Gap piccolo per mobile
        width: '100%', 
        maxWidth: '450px', // Non diventa gigante su PC
        aspectRatio: '3/4', // Mantiene la proporzione generale
      }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uniqueId);
          const isSolved = solved.includes(card.uniqueId);
          
          return (
            <div key={card.uniqueId} style={{ aspectRatio: '1/1', perspective: '1000px', zIndex: isFlipped ? 10 : 1 }}>
              <motion.div
                onClick={() => !isFlipped && !isSolved && handleClick(card.uniqueId)}
                animate={{ rotateY: (isFlipped || isSolved) ? 180 : 0, opacity: isSolved ? 0 : 1, scale: isSolved ? 0.8 : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', 
                  cursor: isSolved ? 'default' : 'pointer', pointerEvents: isSolved ? 'none' : 'auto'
                }}
              >
                {/* RETRO */}
                <div className="clay-card" style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  background: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)',
                }}>
                  <span style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.5)' }}>?</span>
                </div>
                {/* FRONTE */}
                <div className="clay-card" style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px', transform: 'rotateY(180deg)', border: '2px solid rgba(255,255,255,0.5)',
                }}>
                  <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{card.content}</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryGame;