import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, User, LogIn, Library } from 'lucide-react';

const Navbar = ({ session }) => {
  const location = useLocation();
  const isAdmin = session?.user?.email === 'cioni85@gmail.com';

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    color: '#555',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '10px',
    transition: 'background 0.2s',
    fontSize: '0.9rem'
  };

  const activeStyle = {
    ...navStyle,
    background: '#E3F2FD',
    color: '#1565C0'
  };

  return (
    <nav style={{ 
      background: '#fff', 
      padding: '10px 15px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      overflowX: 'auto' // Utile su mobile se ci sono tanti tasti
    }}>
      {/* LOGO (Solo desktop per risparmiare spazio su mobile) */}
      <Link to="/" style={{ textDecoration: 'none', display: 'none', sm: 'block', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: '#FFC107', borderRadius: '50%', padding: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🦁</span>
        </div>
      </Link>

      {/* MENU CENTRALE (Ora include i Racconti!) */}
      <div style={{ display: 'flex', gap: '5px', flex: 1, justifyContent: 'center' }}>
        <Link to="/" style={isActive('/') ? activeStyle : navStyle}>
          <Home size={20} /> <span style={{display: 'none', md: 'inline'}}>Home</span>
        </Link>
        
        {/* STORIE (Interattive) */}
        <Link to="/stories" style={isActive('/stories') ? activeStyle : navStyle}>
          <BookOpen size={20} /> <span style={{display: 'none', md: 'inline'}}>Storie</span>
        </Link>

        {/* RACCONTI (Libri) - ERA QUESTO CHE MANCAVA! */}
        <Link to="/books" style={isActive('/books') ? activeStyle : navStyle}>
          <Library size={20} /> <span style={{display: 'none', md: 'inline'}}>Racconti</span>
        </Link>

        {/* GIOCHI */}
        <Link to="/games" style={isActive('/games') ? activeStyle : navStyle}>
          <Gamepad2 size={20} /> <span style={{display: 'none', md: 'inline'}}>Giochi</span>
        </Link>
      </div>

      {/* AREA UTENTE */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {session ? (
          <Link to="/parents" style={{ textDecoration: 'none' }}>
             <div className="clay-btn" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} />
             </div>
          </Link>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>
              <LogIn size={18} />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;