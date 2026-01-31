// src/utils/speechUtils.js

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Voci ElevenLabs (Rachel per Italiano, Clyde per Inglese - modificabili)
const VOICES = {
  it: "21m00Tcm4TlvDq8ikWAM", 
  en: "TxGEqnHWrfWFTfGW9XjX" 
};

let currentAudio = null;

export const speakText = async (text, language = 'it', onEndCallback) => {
  // Ferma audio precedente
  stopSpeech();

  if (!text) return;
  if (!API_KEY) {
    console.error("Manca la API Key di ElevenLabs nel file .env");
    return;
  }

  try {
    const voiceId = VOICES[language] || VOICES.it;

    // Chiamata API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2", // Fondamentale per l'accento italiano corretto
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) throw new Error("Errore API ElevenLabs");

    // Riproduzione
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(audioUrl);
    
    currentAudio.onended = () => {
      if (onEndCallback) onEndCallback();
    };

    currentAudio.play();
    return currentAudio;

  } catch (error) {
    console.error("Errore Sintesi:", error);
    if (onEndCallback) onEndCallback(); // Sblocca l'interfaccia anche se fallisce
  }
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};