// src/utils/speechUtils.js

// 👇 ID DELLA VOCE NUOVA (ElevenLabs)
const VOICE_ID = "w3aQQZqtgGo2o2fsmvQ2"; 
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

const audioCache = {}; 
let currentAudio = null;

export const speakText = async (text, onEndCallback) => {
  stopSpeech(); // Ferma sempre prima di iniziare

  if (!API_KEY) {
    console.error("❌ ERRORE: Manca la API Key nel file .env");
    return;
  }
  if (!text) return;

  try {
    let audioUrl;

    // CONTROLLA CACHE (Risparmia soldi/crediti)
    if (audioCache[text]) {
      audioUrl = audioCache[text];
    } else {
      // CHIAMATA API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });

      if (!response.ok) throw new Error("Errore ElevenLabs");

      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache[text] = audioUrl;
    }

    // RIPRODUCI
    currentAudio = new Audio(audioUrl);
    currentAudio.onended = () => { if (onEndCallback) onEndCallback(); };
    currentAudio.play().catch(e => console.error("Errore play:", e));

  } catch (error) {
    console.error("❌ Errore Audio:", error);
  }
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};