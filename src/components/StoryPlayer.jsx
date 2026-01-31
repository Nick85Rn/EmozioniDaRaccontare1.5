import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; // Importa ElevenLabs
import { Play, Pause, ArrowLeft, ArrowRight, Home } from 'lucide-react';

const StoryPlayer = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      const { data } = await supabase.from('stories').select('*').eq('id', id).single();
      setStory(data);
    };
    fetchStory();
    return () => stopSpeech(); // Ferma audio se esci
  }, [id]);

  const handlePlay = () => {
    if (!story) return;
    const text = story.pages?.[currentPage]?.text || "";
    setIsPlaying(true);
    speakText(text, () => setIsPlaying(false)); // PARLA!
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
  };

  const changePage = (dir) => {
    handleStop();
    let newPage = currentPage + dir;
    if (story && story.pages) {
      if (newPage < 0) newPage = 0;
      if (newPage >= story.pages.length) newPage = story.pages.length - 1;
      setCurrentPage(newPage);
    }
  };

  if (!story) return <div style={{padding:50, textAlign:'center'}}>Caricamento...</div>;

  const page = story.pages ? story.pages[currentPage] : null;
  // Recupera l'immagine della pagina
  const pageImage = page?.image_url || page?.image;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* Header Navigazione */}
      <div style={{ padding: '15px', background: '#FFCC80', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" onClick={handleStop} style={{ color: '#5D4037' }}>
           <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={22} />
           </div>
        </Link>
        <span style={{ color: '#5D4037', fontWeight: 'bold' }}>{story.title}</span>
        <Link to="/stories" onClick={handleStop} style={{ color: '#5D4037' }}>
           <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={24} />
           </div>
        </Link>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        
        {/* Immagine Scena */}
        {pageImage && (
          <div className="clay-card" style={{ padding: 10, background: '#fff', borderRadius: 20, marginBottom: 20 }}>
            <img src={pageImage} alt="Scena" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 15 }} />
          </div>
        )}

        {/* Testo */}
        <div className="clay-card" style={{ background: '#fff', padding: '20px', borderRadius: '20px', marginBottom: 20, fontSize: '1.3rem', color: '#4E342E', lineHeight: '1.6' }}>
          {page?.text}
        </div>

        {/* Controlli Audio */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
          <button onClick={() => changePage(-1)} disabled={currentPage===0} className="clay-btn"><ArrowLeft /></button>
          {!isPlaying ? (
            <button onClick={handlePlay} className="clay-btn" style={{ background: '#4CAF50', color: '#fff', borderRadius: '50%', width: 65, height: 65 }}><Play size={30} fill="white" style={{marginLeft:4}}/></button>
          ) : (
            <button onClick={handleStop} className="clay-btn" style={{ background: '#F44336', color: '#fff', borderRadius: '50%', width: 65, height: 65 }}><Pause size={30} fill="white" /></button>
          )}
          <button onClick={() => changePage(1)} disabled={currentPage===story.pages.length-1} className="clay-btn"><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;