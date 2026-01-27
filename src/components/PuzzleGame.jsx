import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Grid3X3, Grid2X2, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';

const PUZZLE_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80", title: "Leone" },
  { id: 2, src: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=600&q=80", title: "Ghepardo" },
  { id: 3, src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=600&q=80", title: "Volpe" },
  { id: 4, src: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80", title: "Pesce Pagliaccio" }
];

// DIMENSIONE FISSA DEL PUZZLE (Pixel) - Previene errori di calcolo e duplicati
const BOARD_SIZE = 320; 

const PuzzleGame = () => {
  const [level, setLevel] = useState(3);
  const [selectedImage, setSelectedImage] = useState(PUZZLE_IMAGES[0]);
  const [pieces, setPieces] = useState([]);
  const [firstSelected, setFirstSelected] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Chiave per resettare la griglia

  useEffect(() => { startNewGame(); }, [level, selectedImage]);

  // Algoritmo Shuffle Classico (Fisher-Yates)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    return newArray;
  };

  const startNewGame = () => {
    const totalPieces = level * level;
    const initialPieces = Array.from({ length: totalPieces }, (_, i) => i);
    let shuffled = shuffleArray(initialPieces);
    
    // Evitiamo che esca già risolto
    if (shuffled.every((val, index) => val === index)) {
      shuffled = shuffleArray(initialPieces);
    }

    setPieces(shuffled);
    setIsSolved(false);
    setFirstSelected(null);
    setGameKey(prev => prev + 1);
  };

  const handlePieceClick = (index) => {
    if (isSolved) return;
    if (firstSelected === null) {
      setFirstSelected(index);
    } else {
      if (firstSelected === index) { setFirstSelected(null); return; }
      const newPieces = [...pieces];
      const temp = newPieces[firstSelected];
      newPieces[firstSelected] = newPieces[index];
      newPieces[index] = temp;
      setPieces(newPieces);
      setFirstSelected(null);
      checkWin(newPieces);
    }
  };

  const checkWin = (currentPieces) => {
    if (currentPieces.every((p, i) => p === i)) setTimeout(() => setIsSolved(true), 300);
  };

  const pieceSize = BOARD_SIZE / level;

  return (
    <div style={{ minHeight: '100vh', background: '#E3F2FD', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/games"><button className="clay-btn" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, justifyContent: 'center' }}><ArrowLeft /></button></Link>
            <div style={{ marginLeft: '15px' }}><h1 style={{ color: '#1565C0', margin: 0, fontSize: '1.5rem' }}>Puzzle 🧩</h1></div>
        </div>
        <button onClick={startNewGame} className="clay-btn" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, justifyContent: 'center' }}><RefreshCw /></button>
      </div>

      <div className="clay-card" style={{ marginBottom: '20px', flexDirection: 'row', gap: '10px', padding: '10px', borderRadius: '40px', background: '#BBDEFB' }}>
        <button onClick={() => setLevel(2)} style={{ opacity: level === 2 ? 1 : 0.6, background: level === 2 ? '#fff' : 'transparent' }} className="clay-btn"><Grid2X2 size={18}/> Facile</button>
        <button onClick={() => setLevel(3)} style={{ opacity: level === 3 ? 1 : 0.6, background: level === 3 ? '#fff' : 'transparent' }} className="clay-btn"><Grid3X3 size={18}/> Medio</button>
        <button onClick={() => setLevel(4)} style={{ opacity: level === 4 ? 1 : 0.6, background: level === 4 ? '#fff' : 'transparent' }} className="clay-btn"><Grid size={18}/> Difficile</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '10px' }}>
        {PUZZLE_IMAGES.map((img) => (
          <motion.img key={img.id} src={img.src} alt={img.title} onClick={() => setSelectedImage(img)} whileTap={{ scale: 0.9 }}
            style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: selectedImage.id === img.id ? '3px solid #1565C0' : '3px solid white', cursor: 'pointer' }}
          />
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <div key={gameKey} className="clay-card" style={{ width: `${BOARD_SIZE + 20}px`, height: `${BOARD_SIZE + 20}px`, padding: '10px', background: '#fff', display: 'grid', gridTemplateColumns: `repeat(${level}, 1fr)`, gridTemplateRows: `repeat(${level}, 1fr)`, gap: '2px' }}>
          {pieces.map((pieceId, index) => {
            const originalRow = Math.floor(pieceId / level);
            const originalCol = pieceId % level;
            const backgroundX = -(originalCol * pieceSize);
            const backgroundY = -(originalRow * pieceSize);
            const isSelected = firstSelected === index;

            return (
              <motion.div key={pieceId} layout transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={() => handlePieceClick(index)}
                style={{ width: '100%', height: '100%', backgroundImage: `url(${selectedImage.src})`, backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`, backgroundPosition: `${backgroundX}px ${backgroundY}px`, backgroundRepeat: 'no-repeat', borderRadius: '5px', cursor: 'pointer', border: isSelected ? '3px solid #FFEB3B' : '1px solid rgba(0,0,0,0.1)', zIndex: isSelected ? 10 : 1, boxShadow: isSelected ? '0 0 15px #FFEB3B' : 'none', filter: isSolved ? 'brightness(1.1)' : 'none' }}
              />
            );
          })}
        </div>
        <AnimatePresence>
          {isSolved && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="clay-card" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.95)', border: '2px solid #4CAF50', textAlign: 'center', zIndex: 100, width: '280px', padding: '30px' }}>
              <Trophy size={60} color="#FFD700" style={{ marginBottom: '10px' }} />
              <h2 style={{ color: '#2E7D32' }}>Bravissimo!</h2>
              <button onClick={startNewGame} className="clay-btn clay-btn-primary">Gioca ancora</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default PuzzleGame;