import React, { useState } from 'react';
import { ArrowLeft, Download, Play, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AudioGenerator = () => {
  // Stati per i dati inseriti
  const [apiKey, setApiKey] = useState(''); // La incolli al momento, non salvata nel codice!
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM'); // Rachel (Voce Default)
  
  // Stati per il risultato
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) { setError("Inserisci la API Key di ElevenLabs!"); return; }
    if (!text) { setError("Scrivi qualcosa da dire!"); return; }
    
    setLoading(true);
    setError('');
    setAudioUrl(null);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2", // Ottimo per l'Italiano
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail?.message || "Errore ElevenLabs");
      }

      // Trasformiamo la risposta in un file audio ascoltabile
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Link to="/">
          <button className="clay-btn" style={{ marginBottom: '20px' }}><ArrowLeft /> Home</button>
        </Link>

        <div className="clay-card" style={{ background: '#fff', padding: '30px' }}>
          <h2 style={{ marginTop: 0 }}>🎛️ Audio Studio</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Strumento interno per generare voci.</p>

          {/* 1. API KEY */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>ElevenLabs API Key</label>
            <input 
              type="password" 
              placeholder="Incolla qui la tua chiave (sk-...)" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          {/* 2. VOICE ID */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Voice ID</label>
            <input 
              type="text" 
              placeholder="ID Voce (es. 21m00Tcm4TlvDq8ikWAM)" 
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <small style={{ color: '#888' }}>Trova gli ID nella VoiceLab di ElevenLabs.</small>
          </div>

          {/* 3. TESTO */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Testo da leggere</label>
            <textarea 
              rows="4"
              placeholder="C'era una volta..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'sans-serif' }}
            />
          </div>

          {/* BOTTONE GENERA */}
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className="clay-btn clay-btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Play size={18} style={{ marginRight: '8px' }}/> Genera Audio</>}
          </button>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>❌ {error}</p>}

          {/* RISULTATO */}
          {audioUrl && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#E8F5E9', borderRadius: '15px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2E7D32' }}>Audio Pronto! ✅</h3>
              
              <audio controls src={audioUrl} style={{ width: '100%', marginBottom: '15px' }} />
              
              <a href={audioUrl} download={`audio_${Date.now()}.mp3`}>
                <button className="clay-btn" style={{ background: '#fff', color: '#2E7D32', width: '100%', justifyContent: 'center' }}>
                  <Download size={18} style={{ marginRight: '8px' }} /> Scarica MP3
                </button>
              </a>
              
              <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '10px' }}>
                Ora carica questo file su Supabase Storage e copia il link nel database!
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AudioGenerator;