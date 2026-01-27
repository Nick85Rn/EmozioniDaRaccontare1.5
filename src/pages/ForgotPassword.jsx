import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Indirizza l'utente alla pagina di reset locale dopo il click nella mail
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password', 
    });

    if (error) {
      setMsg("Errore: " + error.message);
    } else {
      setMsg("Controlla la tua email! Ti abbiamo inviato un link magico.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="clay-card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#666', marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Torna al Login
        </Link>
        
        <h2 style={{ marginTop: 0 }}>Recupera Password</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Inserisci la tua email. Ti manderemo un link per reimpostare la password.</p>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: '#999' }} />
            <input 
              type="email" 
              placeholder="La tua email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '15px', border: 'none', background: '#f0f4f8', boxSizing: 'border-box', fontSize: '1rem', boxShadow: 'inset 3px 3px 6px #bebebe' }}
            />
          </div>

          {msg && <p style={{ color: msg.includes('Errore') ? 'red' : 'green', fontSize: '0.9rem' }}>{msg}</p>}

          <button type="submit" disabled={loading} className="clay-btn clay-btn-primary" style={{ justifyContent: 'center' }}>
            {loading ? 'Invio...' : 'Invia Link'} <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;