import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, User, LogIn } from 'lucide-react';

const Navbar = ({ session }) => {
  const location = useLocation();
  const isAdmin = session?.user?.email === 'cioni85@gmail.com';

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontWeight: 'bold',
    color: '#555',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '10px',
    transition: 'background 0.2s'
  };

  const activeStyle = {
    ...navStyle,
    background: '#E3F2FD',
    color: '#1565C0'
  };

  return (
    <nav style={{ 
      background: '#fff', 
      padding: '10px 20px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* LOGO / HOME */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: '#FFC107', borderRadius: '50%', padding: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🦁</span>
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', display: 'none', sm: 'block' }}>
          Emozioni
        </span>
      </Link>

      {/* MENU CENTRALE */}
      <div style={{ display: 'flex', gap: '5px' }}>
        <Link to="/" style={isActive('/') ? activeStyle : navStyle}>
          <Home size={20} />
        </Link>
        <Link to="/stories" style={isActive('/stories') ? activeStyle : navStyle}>
          <BookOpen size={20} />
        </Link>
        <Link to="/games" style={isActive('/games') ? activeStyle : navStyle}>
          <Gamepad2 size={20} />
        </Link>
      </div>

      {/* AREA UTENTE */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {session ? (
          <Link to="/parents" style={{ textDecoration: 'none' }}>
             <div className="clay-btn" style={{ padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <User size={18} />
                {isAdmin ? 'Admin' : 'Genitori'}
             </div>
          </Link>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <LogIn size={18} /> Accedi
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;