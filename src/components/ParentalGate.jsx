import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

const ParentalGate = ({ onSuccess, onClose }) => {
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Genera un problema matematico semplice (ma non troppo per un bimbo piccolo)
    const n1 = Math.floor(Math.random() * 10) + 10; // Tra 10 e 20
    const n2 = Math.floor(Math.random() * 10) + 2;  // Tra 2 e 11
    setProblem({ q: `${n1} + ${n2}`, a: n1 + n2 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer) === problem.a) {
      onSuccess();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.9)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="clay-card" style={{ width: '300px', textAlign: 'center', background: '#fff' }}>
        <div style={{ marginBottom: '20px' }}>
          <Lock size={50} color="#555" />
        </div>
        
        <h3>Area Genitori</h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Per entrare, dimostra di essere un adulto.
        </p>

        <div style={{ margin: '20px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {problem.q} = ?
        </div>

        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setError(false); }}
            placeholder="Risposta"
            style={{ 
              padding: '10px', fontSize: '1.2rem', width: '80%', 
              textAlign: 'center', borderRadius: '10px', 
              border: error ? '2px solid red' : '1px solid #ccc',
              marginBottom: '20px'
            }}
            autoFocus
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} className="clay-btn" style={{ flex: 1 }}>
              Esci
            </button>
            <button type="submit" className="clay-btn clay-btn-primary" style={{ flex: 1 }}>
              <Unlock size={18} /> Entra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentalGate;