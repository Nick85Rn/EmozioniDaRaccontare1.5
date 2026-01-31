// src/components/VoiceSelector.jsx
import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

const VoiceSelector = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Controllo supporto browser
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      let allVoices = window.speechSynthesis.getVoices();
      
      // Filtriamo solo le voci che hanno "it" o "IT" nel nome o nella lingua
      // Se vuoi vedere TUTTE le voci, rimuovi il .filter(...)
      const italianVoices = allVoices.filter(v => v.lang.includes('it') || v.lang.includes('IT'));
      
      // Se non trova voci italiane, mostra tutto (meglio di niente)
      setVoices(italianVoices.length > 0 ? italianVoices : allVoices);

      // Imposta la selezione corrente
      const saved = localStorage.getItem('preferred_voice_name');
      if (saved) setSelectedVoice(saved);
    };

    loadVoices();
    
    // Chrome a volte carica le voci in ritardo, questo evento ascolta quando sono pronte
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleChange = (e) => {
    const voiceName = e.target.value;
    setSelectedVoice(voiceName);
    localStorage.setItem('preferred_voice_name', voiceName);

    // Test immediato: Parla con la nuova voce
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Ciao, questa è la voce che hai scelto.");
    const v = window.speechSynthesis.getVoices().find(voice => voice.name === voiceName);
    if (v) utterance.voice = v;
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null; // Nascondi se il browser è vecchio

  return (
    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#555', fontWeight: 'bold' }}>
        <Mic size={20} /> Voce Narrante
      </div>
      
      <select 
        value={selectedVoice} 
        onChange={handleChange}
        style={{ 
          width: '100%', 
          padding: '10px', 
          borderRadius: '10px', 
          border: '1px solid #ccc',
          background: '#f9f9f9',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}
      >
        <option value="">-- Seleziona Voce --</option>
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name.replace('Google', '').replace('Microsoft', '')} {/* Pulisce un po' il nome */}
          </option>
        ))}
      </select>
      <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>
        Seleziona la voce che preferisci per le storie.
      </p>
    </div>
  );
};

export default VoiceSelector;