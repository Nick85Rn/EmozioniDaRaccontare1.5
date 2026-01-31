import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; // Importa il motore audio
import { Play, Pause, ArrowLeft, ArrowRight, Home } from 'lucide-react';

const StoryPlayer = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. Carica la storia
  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) console.error("Errore DB:", error);
      else setStory(data);
      
      setLoading(false);
    };

    fetchStory();

    // Pulizia: Ferma audio se esci dalla pagina
    return () => stopSpeech();
  }, [id]);

  // 2. Gestione Play Audio
  const handlePlay = () => {
    if (!story) return;
    
    // Recupera il testo della pagina corrente
    // Adatta questo campo se nel tuo JSON il testo si chiama diversamente
    const textToRead = story.pages?.[currentPage]?.text || "Nessun testo qui.";

    setIsPlaying(true);

    speakText(textToRead, () => {
      // Callback: Audio finito
      setIsPlaying(false);
    });
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
  };

  const changePage = (direction) => {
    handleStop(); // Ferma audio attuale
    
    let newPage = currentPage + direction;
    if (newPage < 0) newPage = 0;
    if (story.pages && newPage >= story.pages.length) newPage = story.pages.length - 1;
    
    setCurrentPage(newPage);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Caricamento... 📖</div>;
  if (!story) return <div style={{ padding: 40, textAlign: 'center' }}>Storia non trovata 😢</div>;

  const pageContent = story.pages ? story.pages[currentPage] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER NAVIGATION */}
      <div style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFCC80' }}>
        <Link to="/stories" onClick={handleStop} style={{ color: '#5D4037' }}><ArrowLeft size={28} /></Link>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#5D4037' }}>{story.title}</h2>
        <Link to="/" onClick={handleStop} style={{ color: '#5D4037' }}><Home size={28} /></Link>
      </div>

      {/* AREA CONTENUTO */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        {/* Immagine */}
        {pageContent?.image_url && (
          <img 
            src={pageContent.image_url} 
            alt="Scena" 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }} 
          />
        )}

        {/* Box Testo */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', width: '100%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.6', color: '#4E342E', textAlign: 'center' }}>
          {pageContent?.text}
        </div>

        {/* Controlli Player */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px' }}>
          {/* Indietro */}
          <button 
            onClick={() => changePage(-1)} 
            disabled={currentPage === 0}
            className="clay-btn"
            style={{ padding: '15px', borderRadius: '50%', opacity: currentPage === 0 ? 0.5 : 1 }}
          >
            <ArrowLeft />
          </button>

          {/* Tasto Play/Pause Gigante */}
          {!isPlaying ? (
            <button 
              onClick={handlePlay} 
              className="clay-btn"
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(76, 175, 80, 0.4)' }}
            >
              <Play size={40} fill="white" style={{ marginLeft: 5 }} />
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

          {/* Avanti */}
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