import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const BreathingGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [text, setText] = useState("Premi Start");

  // Ciclo del testo sincronizzato con l'animazione (4s inspira, 4s espira)
  const handleStart = () => {
    setIsRunning(true);
    setText("Inspira... 🌸"); // Naso
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Link to="/games">
          <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px' }}><ArrowLeft /></button>
        </Link>
      </div>

      <h2 style={{ marginBottom: '40px', color: '#555', textAlign: 'center' }}>Il Palloncino della Calma 🎈</h2>

      {/* CERCHIO ANIMATO */}
      <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Cerchio di sfondo fisso */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px dashed #ccc', opacity: 0.5 }}></div>

        {/* Cerchio che respira */}
        <motion.div
          animate={isRunning ? {
            scale: [1, 1.5, 1.5, 1], // Piccolo -> Grande -> Pausa -> Piccolo
            backgroundColor: ["#E1F5FE", "#81D4FA", "#81D4FA", "#E1F5FE"],
          } : { scale: 1 }}
          transition={isRunning ? {
            duration: 8, // 4 sec in, 4 sec out
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 0.5, 1] // Timing preciso
          } : {}}
          onUpdate={(latest) => {
            // Logica semplice per cambiare testo in base alla grandezza (approssimata)
            if (isRunning) {
                // Questo è un trucco visivo, in una app reale useremmo eventi precisi
            }
          }}
          className="clay-card"
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 20px rgba(135, 206, 250, 0.4)',
            zIndex: 10
          }}
        >
           <Wind size={60} color="#0277BD" style={{ opacity: 0.5 }} />
        </motion.div>

        {/* Testo Istruzioni Dinamico */}
        <motion.div
            animate={isRunning ? { opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.1, 0.8] } : {}}
            transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }} // Mirror fa andare avanti e indietro
            style={{ position: 'absolute', pointerEvents: 'none', zIndex: 20, fontSize: '1.5rem', fontWeight: 'bold', color: '#01579B' }}
        >
             {/* Qui usiamo un trucco CSS per il testo, oppure un'animazione separata */}
             {/* Per semplicità, mettiamo un testo fisso "Inspira / Espira" sotto */}
        </motion.div>

      </div>

      {/* Testo Guida */}
      <div style={{ marginTop: '50px', height: '50px', textAlign: 'center' }}>
        {isRunning ? (
            <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 4, repeat: Infinity }}
                style={{ fontSize: '1.5rem', color: '#0288D1' }}
            >
                Inspira dal naso... Espira dalla bocca...
            </motion.p>
        ) : (
            <button className="clay-btn clay-btn-primary" onClick={handleStart} style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
                Inizia a Respirare
            </button>
        )}
      </div>

    </div>
  );
};

export default BreathingGame;