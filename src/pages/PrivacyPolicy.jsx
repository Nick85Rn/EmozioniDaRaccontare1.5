import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      
      <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '30px', fontWeight: 'bold' }}>
        <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '40px', height: '40px' }}><ArrowLeft size={20}/></button>
        Indietro
      </Link>

      <div className="clay-sheet" style={{ background: 'white' }}>
        <h1 style={{ fontSize: '2rem' }}>Privacy Policy</h1>
        <p style={{ color: '#666' }}>Ultimo aggiornamento: Gennaio 2026</p>

        <h3>1. Chi siamo</h3>
        <p>Questa applicazione ("EmozioniApp") è gestita da N. Pellicioni. L'obiettivo dell'app è fornire strumenti educativi per la gestione delle emozioni dei bambini.</p>

        <h3>2. Quali dati raccogliamo</h3>
        <p>Per fornirti il servizio, raccogliamo i seguenti dati:</p>
        <ul>
          <li><strong>Email:</strong> Necessaria per la creazione dell'account sicuro e il recupero della password.</li>
          <li><strong>Dati di utilizzo:</strong> Registriamo le scelte fatte nelle storie (es. "Emozione selezionata: Rabbia") per mostrarti lo storico nel diario genitori. Questi dati sono privati e visibili solo a te.</li>
        </ul>

        <h3>3. Dove sono salvati i dati</h3>
        <p>Utilizziamo <strong>Supabase</strong>, un fornitore di database sicuro, per archiviare i tuoi dati. I server si trovano in Europa (Francoforte), in conformità con il GDPR.</p>

        <h3>4. Pagamenti</h3>
        <p>I pagamenti sono gestiti esternamente tramite <strong>PayPal</strong>. Noi non veniamo mai a conoscenza dei dati della tua carta di credito.</p>

        <h3>5. I tuoi diritti</h3>
        <p>Hai il diritto di accedere ai tuoi dati o cancellarli completamente in qualsiasi momento. Puoi farlo autonomamente cliccando sul tasto "Reset Cloud" nell'Area Genitori, oppure scrivendoci per la cancellazione dell'account.</p>

        <h3>6. Contatti</h3>
        <p>Per qualsiasi domanda sulla privacy, puoi contattarci alla mail di supporto.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;