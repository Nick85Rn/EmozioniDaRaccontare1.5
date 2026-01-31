import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { 
  Lock, Unlock, Settings, LogOut, User, ShieldCheck, 
  CreditCard, Moon, Volume2, CheckCircle, Star, 
  ExternalLink, Sun, Clock, Database 
} from 'lucide-react';

// 👇 CONFIGURAZIONE COSTI E LINK
const PREMIUM_COST = "9,90€"; 
const PAYPAL_LINK = "https://paypal.me/NPellicioni/9.90"; 

// 👇 CONFIGURAZIONE EMAILJS (Per notificare TE del pagamento)
const EMAILJS_SERVICE_ID = "service_82046y2"; 
const EMAILJS_TEMPLATE_ID = "template_rrgy54o"; 
const EMAILJS_PUBLIC_KEY = "PuKbUKoAwK7OcpNf_"; 

const ParentsArea = () => {
  // --- STATI SICUREZZA ---
  const [isVerified, setIsVerified] = useState(false);
  const [mathProblem, setMathProblem] = useState({ n1: 0, n2: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  
  // --- STATI UTENTE & DATI ---
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false); 
  const [showConfirmPay, setShowConfirmPay] = useState(false);
  
  const navigate = useNavigate();

  // --- LOGICA TEMI ---
  const isNight = profile?.night_mode === true;
  const theme = {
    bg: isNight ? '#121212' : '#F5F7FA',
    cardBg: isNight ? '#1E1E1E' : '#FFFFFF',
    textMain: isNight ? '#E0E0E0' : '#37474F',
    textSub: isNight ? '#B0BEC5' : '#666666',
    border: isNight ? '1px solid #333' : 'none',
    highlight: isNight ? '#BB86FC' : '#1565C0',
    shadow: isNight ? '0 4px 6px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.05)'
  };

  const isPendingVerification = profile?.payment_status === 'pending';
  // Verifica Admin (Tu)
  const isAdmin = session?.user?.email === 'cioni85@gmail.com';

  useEffect(() => {
    generateMathProblem();
    checkSessionAndProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSessionAndProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) await fetchProfile(session.user.id);
    setLoading(false);
  };

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data);
    } catch (err) { console.error(err); }
  };

  const updatePreference = async (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (session) await supabase.from('profiles').update({ [field]: value }).eq('id', session.user.id);
  };

  const handleStartPayment = () => {
    window.open(PAYPAL_LINK, '_blank');
    setShowConfirmPay(true);
  };

  const handleConfirmPayment = async () => {
    setUpgrading(true);
    try {
      // 1. Aggiorna DB
      const { error } = await supabase
        .from('profiles')
        .update({ payment_status: 'pending', payment_date: new Date().toISOString() })
        .eq('id', session.user.id);

      if (error) throw error;

      // 2. Invia Mail a TE
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: "cioni85@gmail.com", 
          user_email: session.user.email,
          payment_date: new Date().toLocaleString('it-IT'),
          message: "L'utente ha confermato il pagamento. Verifica su PayPal."
        },
        EMAILJS_PUBLIC_KEY
      );

      await fetchProfile(session.user.id); 
      setShowConfirmPay(false);
      alert("✅ Richiesta inviata! Riceverai il Premium entro 4 ore.");
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore di connessione. Riprova tra poco.");
    } finally {
      setUpgrading(false);
    }
  };

  const generateMathProblem = () => {
    setMathProblem({ n1: Math.floor(Math.random() * 8) + 2, n2: Math.floor(Math.random() * 5) + 2 });
    setUserAnswer('');
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer) === mathProblem.n1 * mathProblem.n2) setIsVerified(true);
    else { alert('Sbagliato! Riprova.'); generateMathProblem(); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // --- BLOCCO PARENTAL GATE ---
  if (!isVerified) {
    return (
      <div style={{ minHeight: '100vh', background: '#263238', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="clay-card" style={{ maxWidth: '350px', width: '100%', padding: '30px', background: '#ECEFF1', textAlign: 'center', borderRadius: '20px' }}>
          <div style={{ background: '#CFD8DC', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            <Lock size={30} color="#455A64" />
          </div>
          <h2 style={{ color: '#37474F', margin: '0 0 10px 0' }}>Area Genitori</h2>
          <p style={{ color: '#546E7A', fontSize: '0.9rem', marginBottom: '20px' }}>Risolvi per entrare:</p>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '20px', border: '2px solid #B0BEC5', letterSpacing: '2px' }}>
            {mathProblem.n1} x {mathProblem.n2} = ?
          </div>
          <form onSubmit={checkAnswer}>
            <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Risultato" autoFocus style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #90A4AE', marginBottom: '10px', fontSize: '1.2rem', textAlign: 'center', outline: 'none' }} />
            <button type="submit" className="clay-btn" style={{ width: '100%', justifyContent: 'center', background: '#455A64', color: '#fff', fontSize: '1rem', padding: '12px' }}><Unlock size={18} style={{ marginRight: 8 }} /> Sblocca</button>
          </form>
          <Link to="/" style={{ display: 'block', marginTop: '20px', color: '#78909C', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna indietro</Link>
        </div>
      </div>
    );
  }

  // --- INTERFACCIA DASHBOARD ---
  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '20px', transition: 'background 0.3s ease' }}>
      
      {/* HEADER */}
      <div style={{ maxWidth: '800px', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, color: theme.textMain, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}>
          <ShieldCheck color="#4CAF50" size={32} /> Area Genitori
        </h1>
        <Link to="/"><button className="clay-btn" style={{ padding: '8px 20px', fontSize: '0.9rem', background: theme.cardBg, color: theme.textMain, border: theme.border }}>Esci</button></Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {session ? (
          <>
            {/* CARD UTENTE */}
            <div className="clay-card" style={{ background: theme.cardBg, padding: '25px', marginBottom: '25px', flexDirection: 'row', alignItems: 'center', gap: '20px', flexWrap: 'wrap', border: theme.border, boxShadow: theme.shadow }}>
              <div style={{ background: isNight ? '#333' : '#E3F2FD', padding: '15px', borderRadius: '50%', border: isNight ? 'none' : '2px solid #BBDEFB' }}>
                <User size={35} color={theme.highlight} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: theme.textMain }}>Ciao Genitore! 👋</h3>
                <p style={{ margin: 0, color: theme.textSub, fontSize: '0.95rem', wordBreak: 'break-all' }}>{session.user.email}</p>
                {isPendingVerification && (
                  <span style={{ fontSize: '0.8rem', color: '#F57C00', fontWeight: 'bold', background: '#FFF3E0', padding: '2px 8px', borderRadius: '10px', marginTop: '5px', display: 'inline-block' }}>
                    Verifica Pagamento in Corso ⏳
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="clay-btn" style={{ background: '#FFEBEE', color: '#D32F2F', border: '1px solid #FFCDD2', fontSize: '0.9rem', whiteSpace: 'nowrap' }}><LogOut size={16} style={{ marginRight: 8 }} /> Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* CARD PREFERENZE (Senza Selettore Voce perché ora usi ElevenLabs) */}
              <div className="clay-card" style={{ padding: '25px', background: theme.cardBg, alignItems: 'flex-start', border: theme.border, boxShadow: theme.shadow }}>
                <div style={{ background: isNight ? '#333' : '#ECEFF1', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}><Settings size={24} color="#607D8B" /></div>
                <h3 style={{ margin: '0 0 15px 0', color: theme.textMain }}>Preferenze App</h3>
                
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: `1px solid ${isNight ? '#333' : '#eee'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.textSub }}>{isNight ? <Moon size={20} /> : <Sun size={20} />} Modalità {isNight ? 'Scura' : 'Chiara'}</div>
                  <label className="switch"><input type="checkbox" checked={isNight} onChange={(e) => updatePreference('night_mode', e.target.checked)} /><span className="slider round"></span></label>
                </div>
                
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.textSub }}><Volume2 size={20} /> Effetti Sonori</div>
                  <label className="switch"><input type="checkbox" checked={profile?.sound_enabled !== false} onChange={(e) => updatePreference('sound_enabled', e.target.checked)} /><span className="slider round"></span></label>
                </div>
              </div>

              {/* CARD PIANO PREMIUM */}
              <div className="clay-card" style={{ padding: '25px', background: profile?.is_premium ? (isNight ? '#1B5E20' : '#E8F5E9') : theme.cardBg, alignItems: 'flex-start', border: profile?.is_premium ? '2px solid #4CAF50' : theme.border, boxShadow: theme.shadow }}>
                <div style={{ background: profile?.is_premium ? '#C8E6C9' : (isNight ? '#333' : '#FFF3E0'), padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>
                  {profile?.is_premium ? <Star size={24} color="#2E7D32" fill="#2E7D32" /> : <CreditCard size={24} color="#F57C00" />}
                </div>
                
                <h3 style={{ margin: '0 0 10px 0', color: theme.textMain }}>Il tuo Piano</h3>
                
                {profile?.is_premium ? (
                  <>
                    <div style={{ background: '#2E7D32', color: '#fff', padding: '5px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px' }}>
                      <CheckCircle size={14} /> PREMIUM ATTIVO
                    </div>
                    <p style={{ color: isNight ? '#A5D6A7' : '#2E7D32', fontSize: '0.9rem', lineHeight: '1.4' }}>Hai accesso illimitato a tutte le funzionalità VIP.</p>
                  </>
                ) : (
                  <>
                    <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center', marginBottom:'15px' }}>
                        <div style={{ background: '#9E9E9E', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>GRATUITO</div>
                        <div style={{ color: theme.textMain, fontWeight:'bold', fontSize:'1.1rem' }}>{PREMIUM_COST}</div>
                    </div>

                    {isPendingVerification ? (
                      <div style={{ background: isNight ? '#3E2723' : '#FFF8E1', padding: '15px', borderRadius: '10px', border: '1px solid #FFE0B2', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#F57C00', fontWeight: 'bold' }}>
                          <Clock size={20} /> Verifica in corso
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: isNight ? '#FFCC80' : '#5D4037', lineHeight: '1.4' }}>
                          Abbiamo salvato la richiesta! Stiamo verificando il pagamento. <br/><br/>
                          <strong>Entro 4 ore</strong> l'account sarà sbloccato.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p style={{ color: theme.textSub, fontSize: '0.9rem', marginBottom: '20px' }}>
                          Sblocca tutte le storie e i giochi educativi per sempre. Un solo pagamento.
                        </p>
                        {!showConfirmPay ? (
                          <button onClick={handleStartPayment} className="clay-btn clay-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Acquista Premium <ExternalLink size={16} style={{ marginLeft: 8 }} />
                          </button>
                        ) : (
                          <div style={{ width: '100%', background: isNight ? '#3E2723' : '#FFF3E0', padding: '15px', borderRadius: '10px', border: '1px solid #FFE0B2', textAlign: 'center', boxSizing: 'border-box' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: isNight ? '#FFCC80' : '#E65100', fontWeight: 'bold' }}>
                              Hai completato il pagamento?
                            </p>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button onClick={() => setShowConfirmPay(false)} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: theme.cardBg, color: theme.textSub, cursor: 'pointer', flex: 1 }}>No</button>
                              <button onClick={handleConfirmPayment} disabled={upgrading} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#4CAF50', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flex: 2 }}>
                                {upgrading ? 'Invio...' : 'Sì, Verifica!'}
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* BOTTONE SEGRETO PER NICOLA (Admin) */}
            {isAdmin && (
              <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <Link to="/nicola-admin-secret" style={{ textDecoration: 'none' }}>
                  <div className="clay-card" style={{ 
                    background: '#263238', color: '#fff', padding: '15px', borderRadius: '15px', 
                    textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }}>
                    <Database size={20} color="#FF5722" /> ACCEDI ALLA ADMIN CONSOLE
                  </div>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="clay-card" style={{ background: theme.cardBg, padding: '50px 30px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', border: theme.border }}>
             <h2 style={{ color: theme.textMain }}>Salva i progressi</h2>
             <p style={{ color: theme.textSub, marginBottom: '30px' }}>Accedi per gestire il tuo piano e le impostazioni.</p>
             <Link to="/login"><button className="clay-btn clay-btn-primary">Accedi o Registrati</button></Link>
          </div>
        )}
      </div>
      <style>{`.switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; } .switch input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; } .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); } input:checked + .slider { background-color: #2196F3; } input:checked + .slider:before { transform: translateX(20px); }`}</style>
    </div>
  );
};

export default ParentsArea;