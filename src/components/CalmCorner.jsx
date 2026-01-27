import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, X } from 'lucide-react';

const CalmCorner = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Il Bottone "Salvagente" (Sempre visibile in basso a destra) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#FF6B6B',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <LifeBuoy size={32} />
      </motion.button>

      {/* 2. L'Overlay a tutto schermo (Appare quando clicchi) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(74, 144, 226, 0.95)', // Blu calmante
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {/* Bottone Chiudi */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <X size={40} />
            </button>

            <h2>Fai un bel respiro...</h2>

            {/* 3. L'Animazione del Respiro (Cerchio che si espande/contrae) */}
            <motion.div
              animate={{
                scale: [1, 2, 1], // Normale -> Grande -> Normale
              }}
              transition={{
                duration: 4, // 4 secondi per ciclo
                repeat: Infinity, // Infinito
                ease: "easeInOut"
              }}
              style={{
                width: '100px',
                height: '100px',
                background: 'white',
                borderRadius: '50%',
                marginTop: '40px',
                marginBottom: '40px',
                opacity: 0.8
              }}
            />

            <p style={{ fontSize: '1.2rem' }}>Segui il cerchio...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CalmCorner;