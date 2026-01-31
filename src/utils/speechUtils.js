// src/utils/speechUtils.js

// 👇 NUOVO ID VOCE INSERITO
const VOICE_ID = "w3aQQZqtgGo2o2fsmvQ2"; 
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Cache per risparmiare crediti (se riascolti la stessa frase, non paga due volte)
const audioCache = {}; 
let currentAudio = null;

export const speakText = async (text, onEndCallback) => {
  // 1. Ferma sempre l'audio precedente prima di iniziare
  stopSpeech();

  // Controllo rapido configurazione
  if (!API_KEY) {
    console.error("❌ ERRORE: Manca la API Key nel file .env");
    alert("Errore Configurazione: Manca la chiave di ElevenLabs.");
    return;
  }
  if (!text) return;

  try {
    let audioUrl;

    // 2. CONTROLLA LA CACHE
    if (audioCache[text]) {
      console.log("♻️ Voce recuperata dalla memoria (Crediti risparmiati).");
      audioUrl = audioCache[text];
    } else {
      console.log("🌍 Generazione nuova voce con ElevenLabs...");
      
      // 3. CHIAMATA A ELEVENLABS
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
            stability: 0.5,       // Espressività bilanciata
            similarity_boost: 0.75 // Fedeltà alla voce originale
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🔥 Errore ElevenLabs:", errorData);
        
        if (response.status === 401) throw new Error("API Key non valida.");
        if (response.status === 402) throw new Error("Crediti ElevenLabs esauriti.");
        throw new Error("Errore generazione audio.");
      }

      // 4. Converti risposta in audio
      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      
      // Salva in cache
      audioCache[text] = audioUrl;
    }

    // 5. RIPRODUCI
    currentAudio = new Audio(audioUrl);
    
    // Quando finisce di parlare
    currentAudio.onended = () => {
      if (onEndCallback) onEndCallback();
    };

    // Gestione errori riproduzione browser (es. autoplay bloccato)
    const playPromise = currentAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("🔇 Errore riproduzione browser:", error);
      });
    }

  } catch (error) {
    console.error("❌ ERRORE:", error);
    // Non mostrare alert per ogni piccolo errore, ma loggalo
  }
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};