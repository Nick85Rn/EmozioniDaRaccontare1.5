// src/utils/speechUtils.js

// 👇 LA TUA VOCE SCELTA (ID che avevi salvato)
const VOICE_ID = "13Cuh3NuYvWOVQtLbRN8"; 
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Cache per non scaricare due volte la stessa frase (RISPARMIA CREDITI!)
const audioCache = {}; 
let currentAudio = null; // Per poter stoppare l'audio in corso

export const speakText = async (text, onEndCallback) => {
  // 1. Ferma audio precedente se c'è
  stopSpeech();

  if (!text) return;
  if (!API_KEY) {
    console.error("Manca la API Key di ElevenLabs nel file .env!");
    alert("Errore configurazione voce.");
    return;
  }

  try {
    let audioUrl;

    // 2. CONTROLLA LA CACHE (Hai già scaricato questa frase?)
    if (audioCache[text]) {
      console.log("♻️ Uso audio dalla cache (Crediti risparmiati!)");
      audioUrl = audioCache[text];
    } else {
      console.log("🌍 Scarico audio da ElevenLabs...");
      
      // 3. CHIAMATA API ELEVENLABS
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2", // Modello migliore per l'Italiano
          voice_settings: {
            stability: 0.5,       // Più basso = più espressivo
            similarity_boost: 0.75 // Più alto = più fedele alla voce originale
          }
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail?.message || "Errore ElevenLabs");
      }

      // 4. Converti il risultato in un URL suonabile
      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      
      // Salva in cache
      audioCache[text] = audioUrl;
    }

    // 5. RIPRODUCI
    currentAudio = new Audio(audioUrl);
    
    // Gestione fine audio
    currentAudio.onended = () => {
      if (onEndCallback) onEndCallback();
    };

    currentAudio.play();

  } catch (error) {
    console.error("Errore Audio:", error);
    alert("Impossibile generare la voce. Controlla la quota ElevenLabs.");
  }
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0; // Riavvolgi
    currentAudio = null;
  }
};