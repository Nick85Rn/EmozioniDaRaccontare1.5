import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const StickerAward = ({ onClose, stickerName = "Nuova Figurina" }) => {
  
  useEffect(() => {
    // Esplosione di coriandoli!
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FF69B4', '#00BFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FF69B4', '#00BFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="clay-card"
        style={{ width: '90%', maxWidth: '350px', textAlign: 'center', background: '#FFF9C4', padding: '30px' }}
      >
        <div style={{ marginBottom: '20px' }}>
          <Star size={60} color="#FFD700" fill="#FFD700" className="animate-spin" />
        </div>
        
        <h2 style={{ color: '#FBC02D', margin: '10px 0' }}>COMPLIMENTI!</h2>
        <p style={{ color: '#555' }}>Hai sbloccato:</p>
        
        <div className="clay-card" style={{ margin: '20px auto', width: '100px', height: '100px', background: 'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>
          🎁
        </div>
        
        <h3 style={{ marginBottom: '30px' }}>{stickerName}</h3>

        <button className="clay-btn clay-btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Mettila nell'Album! 📒
        </button>
      </motion.div>
    </div>
  );
};

export default StickerAward;