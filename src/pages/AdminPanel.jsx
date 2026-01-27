import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Send, ArrowLeft } from 'lucide-react';

const AdminPanel = () => {
  const [emailToSearch, setEmailToSearch] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. CERCA L'UTENTE
  const searchUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setFoundUser(null);
    setLoading(true);

    try {
      const cleanEmail = emailToSearch.trim();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (error) throw error;
      setFoundUser(data);
    } catch (err) {
      setMessage('❌ Utente non trovato. Controlla l\'email.');
    } finally {
      setLoading(false);
    }
  };

  // 2. ATTIVA PREMIUM E INVIA MAIL
  const activatePremium = async () => {
    if (!foundUser) return;
    setLoading(true);

    // RECUPERA LE VARIABILI DAL FILE .ENV
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // 🔍 DEBUG: Stampa in console cosa stiamo usando (F12 per vedere)
    console.log("--- DEBUG EMAILJS ---");
    console.log("Service:", serviceID);
    console.log("Template:", templateID);
    console.log("Public Key:", publicKey); // Controlla se qui c'è scritto "undefined"

    if (!publicKey || !serviceID || !templateID) {
      setMessage("⚠️ ERRORE: Le chiavi nel file .env non vengono lette. Riavvia il server.");
      setLoading(false);
      return;
    }

    try {
      // A. Aggiorna Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true, payment_status: 'paid' })
        .eq('id', foundUser.id);

      if (error) throw error;

      // B. Invia Email
      await emailjs.send(
        serviceID,
        templateID,
        {
          to_email: foundUser.email,    
          user_name: "Genitore",       
          user_email: foundUser.email   
        },
        publicKey // Passiamo la chiave letta dal .env
      );

      setMessage(`✅ Successo! ${foundUser.email} è ora PREMIUM e mail inviata.`);
      setFoundUser({ ...foundUser, is_premium: true, payment_status: 'paid' });

    } catch (err) {
      console.error("ERRORE INVIO:", err);
      if (err.text && err.text.includes("Public Key")) {
        setMessage(`⚠️ Errore Chiave Pubblica non valida. Controlla la console (F12).`);
      } else {
        setMessage(`⚠️ Premium attivo, ma errore mail: ${err.text}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
        <Link to="/parents" style={{ textDecoration: 'none', color: '#666', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
          <ArrowLeft size={18} /> Torna all'Area Genitori
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '0 0 10px 0' }}>
          <ShieldCheck color="#d32f2f" size={32} /> Pannello Admin
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Attivazione manuale con chiavi sicure (.env)</p>
      </div>

      <div className="clay-card" style={{ padding: '30px', background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '600px' }}>
        <form onSubmit={searchUser} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="email" 
            placeholder="Email del cliente..." 
            value={emailToSearch}
            onChange={(e) => setEmailToSearch(e.target.value)} 
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '16px' }}
            required
          />
          <button type="submit" disabled={loading} className="clay-btn clay-btn-primary" style={{ padding: '12px 20px', borderRadius: '10px' }}>
            <Search size={20} />
          </button>
        </form>

        {foundUser && (
          <div style={{ background: '#FAFAFA', padding: '20px', borderRadius: '15px', border: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#333' }}>{foundUser.email}</h3>
            <p style={{ margin: '5px 0' }}>Stato: <strong>{foundUser.is_premium ? 'PREMIUM' : 'FREE'}</strong></p>

            {!foundUser.is_premium && (
              <button onClick={activatePremium} disabled={loading} className="clay-btn" style={{ width: '100%', padding: '12px', marginTop: '15px', backgroundColor: '#4CAF50', color: 'white', justifyContent: 'center' }}>
                {loading ? 'Attendo...' : <><Send size={18} style={{marginRight:8}}/> ATTIVA ORA</>}
              </button>
            )}
          </div>
        )}

        {message && (
          <div style={{ marginTop: '20px', padding: '15px', borderRadius: '10px', background: message.includes('Successo') ? '#E8F5E9' : '#FFEBEE', color: message.includes('Successo') ? '#2E7D32' : '#C62828', textAlign: 'center' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;