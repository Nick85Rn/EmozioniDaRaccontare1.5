import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, Save } from 'lucide-react';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      alert("Errore: " + error.message);
    } else {
      alert("Password aggiornata con successo!");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="clay-card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        <h2>Nuova Password</h2>
        <p>Scegli una nuova password sicura.</p>
        
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
             <Lock size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: '#999' }} />
            <input 
              type="password" 
              placeholder="Nuova Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '15px', border: 'none', background: '#f0f4f8', boxSizing: 'border-box', fontSize: '1rem', boxShadow: 'inset 3px 3px 6px #bebebe' }}
            />
          </div>
          <button type="submit" disabled={loading} className="clay-btn clay-btn-primary" style={{ justifyContent: 'center' }}>
            Salva Password <Save size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;