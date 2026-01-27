import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      textAlign: 'center', 
      padding: '20px', 
      marginTop: 'auto', 
      width: '100%',
      color: '#B0BEC5', 
      fontSize: '0.85rem',
      fontFamily: 'sans-serif',
      borderTop: '1px solid #f0f0f0',
      background: '#fafafa'
    }}>
      <p style={{ margin: 0 }}>
        Powered by <strong style={{ color: '#78909C' }}>Nicola Pellicioni</strong>
        <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span> 
        <span style={{ background: '#ECEFF1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', color: '#546E7A' }}>v1.5</span>
      </p>
    </footer>
  );
};

export default Footer;