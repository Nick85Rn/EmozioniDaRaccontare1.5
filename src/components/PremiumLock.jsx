import React from 'react';
import { Lock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumLock = ({ isLocked }) => {
  if (!isLocked) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255, 255, 255, 0.6)', // Effetto vetro
      backdropFilter: 'blur(4px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '20px',
      zIndex: 10
    }}>
      <div style={{
        background: '#fff',
        padding: '15px',
        borderRadius: '50%',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        marginBottom: '10px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <Lock size={24} color="#FFC107" />
      </div>
      
      <div style={{
        background: '#333',
        color: '#fff',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <Star size={12} fill="#FFC107" color="#FFC107" /> PREMIUM
      </div>
      
      {/* Cliccando va all'area genitori per l'upgrade */}
      <Link to="/parents" style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%' }} />
    </div>
  );
};

export default PremiumLock;