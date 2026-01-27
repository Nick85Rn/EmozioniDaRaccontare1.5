import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Mail, Lock, UserPlus } from 'lucide-react';

const Login = () => {
  // Stato per alternare tra Login e Registrazione
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // REGISTRAZIONE
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Account creato! Controlla la tua email.");
      } else {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/parents');
      }
    } catch (error) {
      setError(error.message || 'Errore durante l\'accesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '85vh', // Altezza sufficiente per centrare verticalmente
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#F5F7FA',
      padding: '20px'
    }}>
      
      {/* CARD PRINCIPALE */}
      <div className="clay-card" style={{ 
        maxWidth: '380px', 
        width: '100%', 
        padding: '35px', 
        background: '#fff', 
        borderRadius: '24px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
        display: 'flex',          // <--- FLEXBOX
        flexDirection: 'column',  // <--- INCOLONNA TUTTO
        alignItems: 'center'      // <--- CENTRA ORIZZONTALMENTE TUTTO
      }}>
        
        {/* ICONA */}
        <div style={{ 
          background: isSignUp ? '#E8F5E9' : '#FFF9C4', 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '20px',
          boxShadow: isSignUp ? '0 4px 10px rgba(76, 175, 80, 0.2)' : '0 4px 10px rgba(255, 235, 59, 0.3)'
        }}>
          {isSignUp ? <UserPlus size={32} color="#2E7D32" /> : <Sparkles size={32} color="#FBC02D" />}
        </div>

        {/* TESTI HEADER (Centrati esplicitamente) */}
        <h2 style={{ color: '#333', margin: '0 0 8px 0', fontSize: '1.6rem', textAlign: 'center' }}>
          {isSignUp ? 'Nuovo Account' : 'Bentornato! 👋'}
        </h2>
        <p style={{ color: '#666', margin: '0 0 25px 0', fontSize: '0.9rem', textAlign: 'center' }}>
          {isSignUp ? 'Crea un profilo per salvare i progressi.' : 'Accedi per gestire le impostazioni.'}
        </p>

        {/* MESSAGGI FEEDBACK */}
        {error && (
          <div style={{ width: '100%', background: '#FFEBEE', color: '#D32F2F', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ width: '100%', background: '#E8F5E9', color: '#2E7D32', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {/* FORM (Larghezza 100% per allinearsi alla card) */}
        <form onSubmit={handleAuth} style={{ width: '100%' }}>
          
          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <Mail size={18} color="#9E9E9E" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Email Genitore"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 45px', // Padding a sinistra per l'icona
                borderRadius: '12px', 
                border: '1px solid #E0E0E0', 
                outline: 'none', 
                fontSize: '0.95rem',
                background: '#FAFAFA',
                boxSizing: 'border-box' // FONDAMENTALE PER NON SBOREDARE
              }}
            />
          </div>

          <div style={{ marginBottom: '10px', position: 'relative' }}>
            <Lock size={18} color="#9E9E9E" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 45px', 
                borderRadius: '12px', 
                border: '1px solid #E0E0E0', 
                outline: 'none', 
                fontSize: '0.95rem',
                background: '#FAFAFA',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* LINK PASSWORD DIMENTICATA (Allineato a destra) */}
          {!isSignUp && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#1565C0', textDecoration: 'none', fontWeight: '600' }}>
                Password dimenticata?
              </Link>
            </div>
          )}

          {/* BOTTONE AZIONE */}
          <button 
            type="submit" 
            disabled={loading}
            className="clay-btn clay-btn-primary"
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '12px', 
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              marginTop: isSignUp ? '10px' : '0'
            }}
          >
            {loading ? 'Caricamento...' : (isSignUp ? 'Crea Account' : 'Accedi →')}
          </button>
        </form>

        {/* FOOTER SWITCH (Centrato) */}
        <div style={{ marginTop: '25px', width: '100%', textAlign: 'center', borderTop: '1px solid #F0F0F0', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 15px 0' }}>
            {isSignUp ? 'Hai già un account?' : 'Non hai un account?'}
            <br />
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1565C0', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: '0.95rem',
                marginTop: '5px',
                textDecoration: 'underline'
              }}
            >
              {isSignUp ? 'Accedi qui' : 'Registrati ora'}
            </button>
          </p>
          
          <Link to="/" style={{ color: '#9E9E9E', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Torna alla Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;