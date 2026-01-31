// src/utils/speechUtils.js

const VOICE_ID = "13Cuh3NuYvWOVQtLbRN8"; 
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

const audioCache = {}; 
let currentAudio = null;

export const speakText = async (text, onEndCallback) => {
  stopSpeech();

  // 1. CONTROLLO CHIAVE
  console.log("🔍 DEBUG AUDIO - Controllo Configurazione:");
  console.log("   - Testo da leggere:", text);
  console.log("   - API Key presente?", API_KEY ? "SÌ ✅" : "NO ❌ (Controlla il file .env)");

  if (!text) return;
  if (!API_KEY) {
    alert("⚠️ Manca la API Key! Controlla la console (F12).");
    return;
  }

  try {
    let audioUrl;

    if (audioCache[text]) {
      console.log("♻️ Uso audio dalla cache.");
      audioUrl = audioCache[text];
    } else {
      console.log("🌍 Contatto ElevenLabs...");
      
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

      console.log("📡 Risposta Server:", response.status); // 200 è OK, 401 è Errore Chiave

      if (!response.ok) {
        const err = await response.json();
        console.error("🔥 ERRORE ELEVENLABS:", err);
        throw new Error(err.detail?.message || "Errore sconosciuto");
      }

      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache[text] = audioUrl;
    }

    currentAudio = new Audio(audioUrl);
    currentAudio.onended = () => { if (onEndCallback) onEndCallback(); };
    
    // Tenta di riprodurre e cattura errori del browser
    const playPromise = currentAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("🔇 Il browser ha bloccato l'audio:", error);
      });
    }

  } catch (error) {
    console.error("❌ ERRORE TOTALE:", error);
    alert(`Errore Audio: ${error.message}`);
  }
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};