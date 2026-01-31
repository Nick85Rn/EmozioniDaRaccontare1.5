import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; // <--- USA IL NUOVO MOTORE
import { Play, Pause, ArrowLeft, ArrowRight, Home } from 'lucide-react';

const StoryPlayer = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. Carica la storia dal Database
  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from('stories') // Assumo che la tabella si chiami 'stories'
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) console.error("Errore caricamento:", error);
      else setStory(data);
      
      setLoading(false);
    };

    fetchStory();

    // Pulizia: Zittisci l'audio se l'utente esce dalla pagina
    return () => stopSpeech();
  }, [id]);

  // 2. Funzione per Leggere la pagina corrente
  const handlePlay = () => {
    if (!story) return;

    // Recupera il testo della pagina corrente
    // (Adatto questo pezzo alla struttura del tuo JSON. Se le pagine sono un array 'pages')
    const textToRead = story.pages?.[currentPage]?.text || "Nessun testo in questa pagina.";

    setIsPlaying(true);

    // CHIAMATA A ELEVENLABS (tramite speechUtils)
    speakText(textToRead, () => {
      // Callback: Cosa fare quando l'audio finisce?
      setIsPlaying(false);
      console.log("Audio finito.");
    });
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
  };

  const changePage = (direction) => {
    stopSpeech(); // Ferma l'audio se cambi pagina
    setIsPlaying(false);
    
    let newPage = currentPage + direction;
    // Controlli per non uscire dai limiti
    if (newPage < 0) newPage = 0;
    if (story.pages && newPage >= story.pages.length) newPage = story.pages.length - 1;
    
    setCurrentPage(newPage);
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Caricamento storia... 📖</div>;
  if (!story) return <div style={{ padding: 20, textAlign: 'center' }}>Storia non trovata 😢</div>;

  // Dati della pagina corrente
  const pageContent = story.pages ? story.pages[currentPage] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <div style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFCC80' }}>
        <Link to="/stories" onClick={handleStop} style={{ color: '#5D4037' }}><ArrowLeft size={28} /></Link>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#5D4037' }}>{story.title}</h2>
        <Link to="/" onClick={handleStop} style={{ color: '#5D4037' }}><Home size={28} /></Link>
      </div>

      {/* CONTENUTO STORIA */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        {/* Immagine */}
        {pageContent?.image_url && (
          <img 
            src={pageContent.image_url} 
            alt="Scena della storia" 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }} 
          />
        )}

        {/* Testo */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', width: '100%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.6', color: '#4E342E', textAlign: 'center' }}>
          {pageContent?.text}
        </div>

        {/* CONTROLLI AUDIO */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px' }}>
          {/* Pagina Precedente */}
          <button 
            onClick={() => changePage(-1)} 
            disabled={currentPage === 0}
            className="clay-btn"
            style={{ padding: '15px', borderRadius: '50%', opacity: currentPage === 0 ? 0.5 : 1 }}
          >
            <ArrowLeft />
          </button>

          {/* PLAY / STOP */}
          {!isPlaying ? (
            <button 
              onClick={handlePlay} 
              className="clay-btn"
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(76, 175, 80, 0.4)' }}
            >
              <Play size={40} fill="white" />
            </button>
          ) : (
            <button 
              onClick={handleStop} 
              className="clay-btn"
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#EF5350', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(239, 83, 80, 0.4)' }}
            >
              <Pause size={40} fill="white" />
            </button>
          )}

          {/* Pagina Successiva */}
          <button 
            onClick={() => changePage(1)} 
            disabled={!story.pages || currentPage === story.pages.length - 1}
            className="clay-btn"
            style={{ padding: '15px', borderRadius: '50%', opacity: (!story.pages || currentPage === story.pages.length - 1) ? 0.5 : 1 }}
          >
            <ArrowRight />
          </button>
        </div>

        <p style={{ color: '#8D6E63', fontSize: '0.9rem' }}>
          Pagina {currentPage + 1} di {story.pages?.length || 1}
        </p>

      </div>
    </div>
  );
};

export default StoryPlayer;