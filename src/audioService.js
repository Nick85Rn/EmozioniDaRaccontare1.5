// Recuperiamo la chiave dall'ambiente (Netlify / .env)
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Voce di Default (Italiano - Quella scelta da te)
const DEFAULT_VOICE_ID = "13Cuh3NuYvWOVQtLbRN8"; 

export const playMagicVoice = async (text, existingAudioUrl = null, language = 'it', voiceId = DEFAULT_VOICE_ID) => {
  return new Promise(async (resolve) => {
    
    // 1. PRIORITÀ ASSOLUTA: AUDIO SALVATO (MP3 da Supabase)
    if (existingAudioUrl) {
      console.log("🔊 Riproduzione da file salvato");
      const audio = new Audio(existingAudioUrl);
      audio.onerror = () => console.warn("File audio non trovato, passo al fallback...");
      try {
        await audio.play();
        resolve(audio);
        return; 
      } catch (e) {
        console.error("Errore riproduzione file:", e);
      }
    }

    // 2. STREAMING ELEVENLABS (Generazione al volo)
    if (API_KEY) {
      // Se il libro ha una voce specifica nel DB (es. Inglese), usa quella (voiceId).
      // Altrimenti usa la default (DEFAULT_VOICE_ID).
      const targetVoice = voiceId || DEFAULT_VOICE_ID;
      
      console.log(`✨ Generazione ElevenLabs... Voce: ${targetVoice}`);

      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}/stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': API_KEY,
            },
            body: JSON.stringify({
              text: text,
              model_id: "eleven_multilingual_v2", 
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            }),
          }
        );

        if (!response.ok) throw new Error("Errore API ElevenLabs");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        await audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
        
        resolve(audio);
        return; 

      } catch (err) {
        console.warn("⚠️ ElevenLabs fallito, passo al fallback:", err);
      }
    }

    // 3. FALLBACK BROWSER (Gratis, voce robotica)
    console.log("🤖 Uso voce browser");
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'it-IT';
      utterance.rate = 0.9; 
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.includes(language === 'en' ? 'en' : 'it') && 
        !v.name.toLowerCase().includes('android')
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
      resolve({
        pause: () => window.speechSynthesis.cancel(),
        onended: null 
      });
    } else {
      resolve(null);
    }
  });
};