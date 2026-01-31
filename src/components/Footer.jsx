import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: '#fff', 
      borderTop: '1px solid #eee', 
      padding: '20px', 
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#666',
      marginTop: 'auto' // Spinge il footer in fondo
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <div>
          © {currentYear} <strong>Emozioni da Raccontare</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/parents" style={{ color: '#888', textDecoration: 'none' }}>Area Genitori</Link>
          <span>•</span>
          <Link to="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy</Link>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <span>Versione 1.5</span>
          <span>|</span>
          <span>Fatto con <Heart size={10} color="red" fill="red" /> da Nicola</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;