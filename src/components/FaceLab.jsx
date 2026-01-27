import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, RefreshCw, ArrowLeft, Lightbulb } from 'lucide-react';
import { playMagicVoice } from '../audioService';

// (I dati EYE_OPTIONS e MOUTH_OPTIONS rimangono uguali, li ometto per brevità ma tu lasciali nel file!)
// ... INCOLLA QUI GLI ARRAY EYE_OPTIONS E MOUTH_OPTIONS DEL CODICE PRECEDENTE ...
const EYE_OPTIONS = [
  { id: 'happy', label: 'Felici', path: <g><path d="M30,45 Q45,35 60,45" stroke="black" strokeWidth="4" fill="none"/><path d="M90,45 Q105,35 120,45" stroke="black" strokeWidth="4" fill="none"/></g> },
  { id: 'sad', label: 'Tristi', path: <g><path d="M30,45 Q45,55 60,45" stroke="black" strokeWidth="4" fill="none"/><path d="M90,45 Q105,55 120,45" stroke="black" strokeWidth="4" fill="none"/></g> },
  { id: 'angry', label: 'Arrabbiati', path: <g><path d="M30,35 L60,50" stroke="black" strokeWidth="4" fill="none"/><path d="M90,50 L120,35" stroke="black" strokeWidth="4" fill="none"/><circle cx="45" cy="55" r="4"/><circle cx="105" cy="55" r="4"/></g> },
  { id: 'surprised', label: 'Sorpresi', path: <g><circle cx="45" cy="45" r="8" fill="black"/><circle cx="105" cy="45" r="8" fill="black"/><path d="M30,30 Q45,20 60,30" stroke="black" strokeWidth="2" fill="none"/><path d="M90,30 Q105,20 120,30" stroke="black" strokeWidth="2" fill="none"/></g> }
];

const MOUTH_OPTIONS = [
  { id: 'happy', label: 'Sorriso', path: <path d="M40,90 Q75,120 110,90" stroke="black" strokeWidth="4" fill="none" /> },
  { id: 'sad', label: 'Giù', path: <path d="M40,110 Q75,80 110,110" stroke="black" strokeWidth="4" fill="none" /> },
  { id: 'angry', label: 'Denti', path: <rect x="45" y="95" width="60" height="20" rx="5" stroke="black" strokeWidth="3" fill="white" /> },
  { id: 'surprised', label: 'Oh!', path: <circle cx="75" cy="105" r="15" stroke="black" strokeWidth="4" fill="none" /> }
];

const LEVELS = [
  { emotion: 'Felicità', targetEyes: 'happy', targetMouth: 'happy', hint: "Quando sei felice, sorridi e gli occhi brillano!" },
  { emotion: 'Rabbia', targetEyes: 'angry', targetMouth: 'angry', hint: "Quando sei arrabbiato, le sopracciglia scendono e mostri i denti!" },
  { emotion: 'Tristezza', targetEyes: 'sad', targetMouth: 'sad', hint: "Quando sei triste, la bocca va in giù." },
  { emotion: 'Sorpresa', targetEyes: 'surprised', targetMouth: 'surprised', hint: "Quando sei sorpreso dici: OOOOH!" }
];

const FaceLab = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedEyes, setSelectedEyes] = useState(null);
  const [selectedMouth, setSelectedMouth] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const currentLevel = LEVELS[levelIndex];

  const checkAnswer = () => {
    if (selectedEyes === currentLevel.targetEyes && selectedMouth === currentLevel.targetMouth) {
      setIsCorrect(true);
      setFeedback('Bravissimo! 🎉');
      playMagicVoice(`Bravo! Questa è proprio la faccia della ${currentLevel.emotion}!`);
    } else {
      setFeedback('Riprova! 💪');
      playMagicVoice(`Mmm, non sembra ${currentLevel.emotion}. Riprova!`);
    }
  };

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(levelIndex + 1);
      resetRound();
    } else {
      setFeedback("Sei un campione! 🏆");
    }
  };

  const resetRound = () => {
    setSelectedEyes(null);
    setSelectedMouth(null);
    setFeedback('');
    setIsCorrect(false);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/">
           <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px' }}><ArrowLeft /></button>
        </Link>
        <h2 style={{ fontSize: '2rem', color: '#6C5CE7' }}>Lab Facce 🎨</h2>
        <div style={{ width: 50 }}></div>
      </div>

      {/* Obiettivo (Nuvoletta) */}
      <div className="clay-sheet" style={{ padding: '20px', marginBottom: '30px', textAlign: 'center', width: '100%', maxWidth: '500px' }}>
        <p style={{ margin: 0, fontSize: '1.4rem' }}>Fai una faccia di: <br/><strong style={{ color: '#6C5CE7', fontSize: '2rem' }}>{currentLevel.emotion}</strong></p>
        <button onClick={() => playMagicVoice(currentLevel.hint)} style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', margin: '10px auto', gap: '5px', color: '#666' }}>
          <Lightbulb size={16} /> Indizio
        </button>
      </div>

      {/* Area di Gioco */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%', maxWidth: '600px' }}>
        
        {/* LA FACCIA */}
        <div style={{ width: '220px', height: '220px', background: '#FFF3E0', borderRadius: '50%', border: '5px solid #FFB74D', position: 'relative', boxShadow: '10px 10px 30px rgba(0,0,0,0.1)' }}>
          <svg viewBox="0 0 150 150" width="100%" height="100%">
            {/* Occhi */}
            {selectedEyes && EYE_OPTIONS.find(e => e.id === selectedEyes).path}
            {/* Bocca */}
            {selectedMouth && MOUTH_OPTIONS.find(m => m.id === selectedMouth).path}
          </svg>
        </div>

        {/* Controlli (Tessere Clay) */}
        <div style={{ width: '100%' }}>
          <p style={{ fontWeight: 'bold', marginLeft: '10px' }}>1. Occhi</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {EYE_OPTIONS.map(eye => (
              <button
                key={eye.id}
                className="clay-btn"
                onClick={() => setSelectedEyes(eye.id)}
                style={{
                  padding: '10px',
                  width: '70px',
                  height: '70px',
                  background: selectedEyes === eye.id ? '#D1C4E9' : 'var(--neutral)', // Diventa viola se selezionato
                  boxShadow: selectedEyes === eye.id ? 'inset 5px 5px 10px #bebebe' : undefined // Si incassa se selezionato
                }}
              >
                <svg width="40" height="25" viewBox="0 0 150 80" style={{ overflow: 'visible' }}>
                  <g transform="scale(0.8) translate(10,0)">{eye.path}</g>
                </svg>
              </button>
            ))}
          </div>

          <p style={{ fontWeight: 'bold', marginLeft: '10px', marginTop: '20px' }}>2. Bocca</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {MOUTH_OPTIONS.map(mouth => (
              <button
                key={mouth.id}
                className="clay-btn"
                onClick={() => setSelectedMouth(mouth.id)}
                style={{
                  padding: '10px',
                  width: '70px',
                  height: '70px',
                  background: selectedMouth === mouth.id ? '#D1C4E9' : 'var(--neutral)',
                  boxShadow: selectedMouth === mouth.id ? 'inset 5px 5px 10px #bebebe' : undefined
                }}
              >
                 <svg width="40" height="25" viewBox="0 0 150 150" style={{ overflow: 'visible' }}>
                  <g transform="scale(0.8) translate(10,-80)">{mouth.path}</g>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback e Bottoni Azione */}
        {feedback && (
          <motion.div 
            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="clay-btn"
            style={{ width: '100%', background: isCorrect ? '#C8E6C9' : '#FFCDD2', cursor: 'default' }}
          >
            {feedback}
          </motion.div>
        )}

        <div style={{ marginTop: '10px' }}>
            {!isCorrect ? (
                <button 
                    onClick={checkAnswer}
                    className="clay-btn clay-btn-primary"
                    disabled={!selectedEyes || !selectedMouth}
                    style={{ opacity: (!selectedEyes || !selectedMouth) ? 0.5 : 1 }}
                >
                    Controlla <Check />
                </button>
            ) : (
                <button 
                    onClick={nextLevel}
                    className="clay-btn"
                    style={{ background: '#2980b9', color: 'white' }}
                >
                    Avanti <RefreshCw />
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default FaceLab;