import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, BookOpen, Shield, Gamepad2, Star } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      gap: '30px'
    }}>
      
      {/* HEADER */}
      <div className="clay-card" style={{ 
        padding: '20px 30px', 
        borderRadius: '50px', 
        marginBottom: '10px',
        background: '#fff',
        transform: 'rotate(-2deg)',
        maxWidth: '90%'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          color: '#333', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '10px',
          textAlign: 'center'
        }}>
          Emozioni da Raccontare <span style={{ fontSize: '1.2em' }}>🎈</span>
        </h1>
      </div>

      {/* MENU PRINCIPALE - GRIGLIA RESPONSIVA */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '800px',
        padding: '0 10px'
      }}>

        {/* 1. STORIE */}
        <Link to="/stories" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ 
            width: '100%',
            aspectRatio: '1/1',
            background: '#FFD54F', 
            color: '#3E2723',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '50%', padding: '15px', marginBottom: '10px' }}>
              <Smile size={32} />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Storie</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Ascolta & Gioca</span>
          </div>
        </Link>

        {/* 2. GIOCHI */}
        <Link to="/games" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ 
            width: '100%', 
            aspectRatio: '1/1',
            background: '#69F0AE', 
            color: '#004D40',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '50%', padding: '15px', marginBottom: '10px' }}>
              <Gamepad2 size={32} />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sala Giochi</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Crea & Impara</span>
          </div>
        </Link>

        {/* 3. RACCONTI */}
        <Link to="/ebooks" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ 
            width: '100%', 
            aspectRatio: '1/1',
            background: '#FFFFFF', 
            color: '#4A148C',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ background: 'rgba(74, 20, 140, 0.1)', borderRadius: '50%', padding: '15px', marginBottom: '10px' }}>
              <BookOpen size={32} />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Racconti</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Ebook Emozioni</span>
          </div>
        </Link>

        {/* 4. ALBUM (NUOVO - Rosa) */}
        <Link to="/album" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ 
            width: '100%', 
            aspectRatio: '1/1',
            background: '#F48FB1', /* Rosa acceso */
            color: '#880E4F',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '15px', marginBottom: '10px' }}>
              <Star size={32} fill="white" color="white" />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Il Mio Album</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>I tuoi Trofei 🏆</span>
          </div>
        </Link>

        {/* 5. GENITORI */}
        <Link to="/parents" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ 
            width: '100%', 
            aspectRatio: '1/1',
            background: '#7C4DFF', 
            color: 'white',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '15px', marginBottom: '10px' }}>
              <Shield size={32} />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Genitori</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Area Protetta</span>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Home;