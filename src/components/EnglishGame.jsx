import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VOCABULARY = [
  { emoji: '🐶', it: 'Cane', en: 'Dog', color: '#FFCDD2' },
  { emoji: '🐱', it: 'Gatto', en: 'Cat', color: '#BBDEFB' },
  { emoji: '🍎', it: 'Mela', en: 'Apple', color: '#FFEB3B' },
  { emoji: '🚗', it: 'Auto', en: 'Car', color: '#E1BEE7' },
  { emoji: '🌞', it: 'Sole', en: 'Sun', color: '#FFF9C4' },
  { emoji: '🌲', it: 'Albero', en: 'Tree', color: '#C8E6C9' },
  { emoji: '🏠', it: 'Casa', en: 'House', color: '#D7CCC8' },
  { emoji: '🦁', it: 'Leone', en: 'Lion', color: '#FFCCBC' },
  { emoji: '🚀', it: 'Razzo', en: 'Rocket', color: '#B39DDB' },
  { emoji: '🎈', it: 'Palloncino', en: 'Balloon', color: '#80DEEA' },
];

const EnglishGame = () => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = VOCABULARY[index];

  const speak = (text, lang) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // 'it-IT' o 'en-US'
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      speak(currentCard.en, 'en-US'); // Parla Inglese
    } else {
      speak(currentCard.en, 'en-US'); // Ripeti Inglese
    }
  };

  const nextCard = (e) => {
    e.stopPropagation(); // Evita di girare la carta
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % VOCABULARY.length);
    }, 200);
  };

  const prevCard = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + VOCABULARY.length) % VOCABULARY.length);
    }, 200);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <Link to="/games">
          <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ArrowLeft size={24}/>
          </button>
        </Link>
        <h1 style={{ marginLeft: '20px', color: '#3F51B5' }}>English Lab 🇬🇧</h1>
      </div>

      {/* CARTA GIREVOLE */}
      <div style={{ perspective: '1000px', width: '300px', height: '400px', cursor: 'pointer' }} onClick={handleCardClick}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d'
          }}
        >
          
          {/* LATO ITALIANO (Fronte) */}
          <div className="clay-card" style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: `4px solid ${currentCard.color}`
          }}>
            <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{currentCard.emoji}</div>
            <h2 style={{ fontSize: '2.5rem', color: '#555', margin: 0 }}>{currentCard.it}</h2>
            <p style={{ color: '#999', marginTop: '10px' }}>Tocca per tradurre</p>
          </div>

          {/* LATO INGLESE (Retro) */}
          <div className="clay-card" style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: currentCard.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transform: 'rotateY(180deg)', color: '#333'
          }}>
            <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{currentCard.emoji}</div>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{currentCard.en}</h2>
            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.3)', padding: '10px', borderRadius: '50%' }}>
              <Volume2 size={32} />
            </div>
          </div>

        </motion.div>
      </div>

      {/* CONTROLLI */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <button className="clay-btn" onClick={prevCard} style={{ padding: '15px 30px' }}>Indietro</button>
        <button className="clay-btn clay-btn-primary" onClick={nextCard} style={{ padding: '15px 30px' }}>Prossima</button>
      </div>

    </div>
  );
};

export default EnglishGame;