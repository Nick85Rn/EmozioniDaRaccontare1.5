import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Ship, Puzzle, Crosshair, BrainCircuit, ArrowLeft } from 'lucide-react';
import PremiumLock from '../components/PremiumLock'; // Assicurati che il percorso sia giusto

const GamesHub = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#E0F7FA', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#006064' }}>
          <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={24} />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: '#006064', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Sala Giochi <Gamepad2 size={32} />
        </h1>
      </div>

      {/* GRIGLIA GIOCHI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* GIOCO 1: BATTAGLIA NAVALE (Premium) */}
        {/* SOLUZIONE ERRORE: Il Link è DENTRO PremiumLock se bloccato, o qui fuori se sbloccato */}
        <PremiumLock>
          <Link to="/battleship" style={{ textDecoration: 'none' }}>
            <GameCard 
              title="Battaglia Navale" 
              subtitle="Affonda le navi nemiche!"
              icon={<Ship size={40} />}
              color="#0288D1"
            />
          </Link>
        </PremiumLock>

        {/* GIOCO 2: PUZZLE (Premium) */}
        <PremiumLock>
           <Link to="/puzzle" style={{ textDecoration: 'none' }}>
            <GameCard 
              title="Puzzle Animali" 
              subtitle="Ricomponi le foto"
              icon={<Puzzle size={40} />}
              color="#FFA000"
            />
          </Link>
        </PremiumLock>

        {/* GIOCO 3: TIRO AL BERSAGLIO (Gratis - Esempio) */}
        {/* Se vuoi renderlo gratis, togli PremiumLock */}
        <PremiumLock> 
          <Link to="/target" style={{ textDecoration: 'none' }}>
            <GameCard 
              title="Tiro al Bersaglio" 
              subtitle="Colpisci i palloncini"
              icon={<Crosshair size={40} />}
              color="#D32F2F"
            />
          </Link>
        </PremiumLock>

        {/* GIOCO 4: MEMORY (Premium) */}
        <PremiumLock>
          <Link to="/memory" style={{ textDecoration: 'none' }}>
            <GameCard 
              title="Memory Card" 
              subtitle="Allena la tua memoria"
              icon={<BrainCircuit size={40} />}
              color="#7B1FA2"
            />
          </Link>
        </PremiumLock>

      </div>
    </div>
  );
};

// Componente Grafico della Card
const GameCard = ({ title, subtitle, icon, color }) => (
  <div className="clay-card" style={{ 
    background: '#fff', 
    padding: '20px', 
    borderRadius: '20px', 
    textAlign: 'center', 
    cursor: 'pointer',
    transition: 'transform 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  }}>
    <div style={{ 
      background: `${color}20`, 
      color: color, 
      padding: '15px', 
      borderRadius: '50%',
      marginBottom: '5px'
    }}>
      {icon}
    </div>
    <h3 style={{ margin: 0, color: '#333' }}>{title}</h3>
    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{subtitle}</p>
  </div>
);

export default GamesHub;