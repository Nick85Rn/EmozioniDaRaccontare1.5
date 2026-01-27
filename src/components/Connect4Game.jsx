import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

// Configurazioni Gioco
const ROWS = 6;
const COLS = 7;
const P1 = 1; // Rosso
const P2 = 2; // Giallo

const Connect4Game = () => {
  // Griglia 6x7 inizializzata a null
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(P1);
  const [winner, setWinner] = useState(null); // null, P1, P2, o 'draw'
  const [winningCells, setWinningCells] = useState([]); // Per evidenziare la linea vincente

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer(P1);
    setWinner(null);
    setWinningCells([]);
  };

  // Logica click colonna
  const handleColumnClick = (colIndex) => {
    if (winner) return;

    // Trova la prima riga libera dal basso
    let rowIndex = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][colIndex]) {
        rowIndex = r;
        break;
      }
    }

    // Se la colonna è piena, ignora
    if (rowIndex === -1) return;

    // Aggiorna board
    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    // Controlla vittoria
    const winData = checkWin(newBoard, rowIndex, colIndex, currentPlayer);
    if (winData) {
      setWinner(currentPlayer);
      setWinningCells(winData);
    } else if (checkDraw(newBoard)) {
      setWinner('draw');
    } else {
      // Cambio turno
      setCurrentPlayer(currentPlayer === P1 ? P2 : P1);
    }
  };

  const checkDraw = (boardState) => {
    return boardState.every(row => row.every(cell => cell !== null));
  };

  // Algoritmo controllo vittoria (Orizzontale, Verticale, Diagonali)
  const checkWin = (boardState, r, c, player) => {
    // Direzioni: [deltaRow, deltaCol]
    const directions = [
      [0, 1],  // Orizzontale
      [1, 0],  // Verticale
      [1, 1],  // Diagonale Giù-Destra
      [1, -1]  // Diagonale Giù-Sinistra
    ];

    for (let [dr, dc] of directions) {
      let count = 1;
      let cells = [[r, c]];

      // Controlla avanti
      for (let i = 1; i < 4; i++) {
        const nr = r + dr * i;
        const nc = c + dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && boardState[nr][nc] === player) {
          count++;
          cells.push([nr, nc]);
        } else break;
      }

      // Controlla indietro
      for (let i = 1; i < 4; i++) {
        const nr = r - dr * i;
        const nc = c - dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && boardState[nr][nc] === player) {
          count++;
          cells.push([nr, nc]);
        } else break;
      }

      if (count >= 4) return cells;
    }
    return null;
  };

  // Colori
  const playerColor = (p) => p === P1 ? '#F44336' : '#FFEB3B'; // Rosso / Giallo
  const playerShadow = (p) => p === P1 ? '#D32F2F' : '#FBC02D';
  const bgTurnColor = currentPlayer === P1 ? '#FFEBEE' : '#FFFDE7';

  return (
    <motion.div 
      animate={{ backgroundColor: bgTurnColor }}
      transition={{ duration: 0.5 }}
      style={{ 
        padding: '20px', 
        minHeight: '100svh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        overflowX: 'hidden'
      }}
    >
      
      {/* HEADER */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/games">
          <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ArrowLeft size={20}/>
          </button>
        </Link>
        
        <div className="clay-card" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <span style={{ fontSize: '0.9rem', color: '#555' }}>Turno:</span>
           <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: playerColor(currentPlayer), boxShadow: `inset -2px -2px 5px rgba(0,0,0,0.2)` }}></div>
        </div>

        <button className="clay-btn" onClick={resetGame} style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <RefreshCw size={20}/>
        </button>
      </div>

      <h2 style={{ margin: '0 0 20px 0', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#1565C0' }}>Forza 4</h2>

      {/* SCHERMATA VITTORIA */}
      {winner && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="clay-sheet" 
          style={{ 
            position: 'absolute', top: '30%', zIndex: 50,
            background: '#fff', textAlign: 'center', width: '90%', maxWidth: '350px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}
        >
          {winner === 'draw' ? (
            <h3>Pareggio! 🤝</h3>
          ) : (
            <>
              <Trophy size={60} color="#FFD700" style={{margin: '0 auto'}}/>
              <h3 style={{fontSize: '1.8rem', margin: '10px 0'}}>Vince {winner === P1 ? 'Rosso' : 'Giallo'}!</h3>
            </>
          )}
          <button className="clay-btn clay-btn-primary" onClick={resetGame} style={{ marginTop: '20px', width: '100%' }}>Rigioca</button>
        </motion.div>
      )}

      {/* GRIGLIA DI GIOCO (La Tavola Blu) */}
      <div 
        className="clay-card"
        style={{ 
          background: '#1976D2', // Blu classico
          padding: '15px',
          borderRadius: '20px',
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: '8px',
          width: '100%',
          maxWidth: '500px',
          aspectRatio: `${COLS}/${ROWS}`, // Mantiene le proporzioni corrette
          boxShadow: 'inset 5px 5px 15px rgba(255,255,255,0.2), 10px 10px 20px rgba(0,0,0,0.3)'
        }}
      >
        {/* Generiamo le celle. Iteriamo per righe e colonne */}
        {board.map((row, r) => (
          row.map((cellValue, c) => {
            const isWinningCell = winningCells.some(([wr, wc]) => wr === r && wc === c);
            
            return (
              <div 
                key={`${r}-${c}`}
                onClick={() => handleColumnClick(c)} // Cliccare su qualsiasi cella della colonna attiva la colonna
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#1565C0', // Blu scuro per il buco vuoto
                  borderRadius: '50%',
                  position: 'relative',
                  cursor: winner ? 'default' : 'pointer',
                  boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.4)', // Effetto buco
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* PEDINA */}
                {cellValue && (
                  <motion.div
                    initial={{ y: -300, opacity: 0 }} // Effetto caduta
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{
                      width: '85%',
                      height: '85%',
                      borderRadius: '50%',
                      background: playerColor(cellValue),
                      boxShadow: `inset -3px -3px 5px ${playerShadow(cellValue)}, inset 3px 3px 10px rgba(255,255,255,0.4)`,
                      border: isWinningCell ? '4px solid #fff' : 'none', // Evidenzia vittoria
                    }}
                  />
                )}
              </div>
            );
          })
        ))}
      </div>

      <p style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
        Tocca una colonna per inserire il gettone. <br/>Vince chi ne allinea 4!
      </p>

    </motion.div>
  );
};

export default Connect4Game;