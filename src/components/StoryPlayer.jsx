import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils';
import { Play, Pause, ArrowLeft, ArrowRight, Home } from 'lucide-react';

const StoryPlayer = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      // Scarichiamo tutto
      const { data } = await supabase.from('stories').select('*').eq('id', id).single();
      setStory(data);
    };
    fetchStory();
    return () => stopSpeech();
  }, [id]);

  const handlePlay = () => {
    if (!story) return;
    const text = story.pages?.[currentPage]?.text || "";
    setIsPlaying(true);
    speakText(text, () => setIsPlaying(false));
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

  if (!story) return <div style={{padding:40, textAlign:'center'}}>Caricamento storia...</div>;

  const page = story.pages ? story.pages[currentPage] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '15px 20px', background: '#FFCC80', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" onClick={handleStop} style={{ color: '#5D4037' }}>
           <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              <Home size={22} />
           </div>
        </Link>
        <span style={{ color: '#5D4037', fontWeight: 'bold', fontSize: '1.1rem' }}>{story.title}</span>
        <Link to="/stories" onClick={handleStop} style={{ color: '#5D4037' }}>
           <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              <ArrowLeft size={24} />
           </div>
        </Link>
      </div>

      {/* Area Contenuto */}
      <div style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* BLOCCO IMMAGINE RIPRISTINATO */}
        {page && (page.image_url || page.image) && (
          <div className="clay-card" style={{ padding: 10, background: '#fff', borderRadius: 20, marginBottom: 20, width: '100%', maxHeight: '400px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <img 
              src={page.image_url || page.image} 
              alt="Scena" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 15 }} 
            />
          </div>
        )}

        {/* Testo */}
        <div className="clay-card" style={{ background: '#fff', padding: '25px', borderRadius: '20px', width: '100%', fontSize: '1.3rem', lineHeight: '1.6', color: '#4E342E', textAlign: 'center', marginBottom: 30 }}>
          {page?.text || "..."}
        </div>

        {/* Controlli */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', paddingBottom: 20 }}>
          <button onClick={() => changePage(-1)} disabled={currentPage === 0} className="clay-btn" style={{opacity: currentPage===0?0.5:1}}><ArrowLeft /></button>
          
          {!isPlaying ? (
            <button onClick={handlePlay} className="clay-btn" style={{ background: '#4CAF50', color: '#fff', width: 70, height: 70, borderRadius: '50%' }}>
              <Play size={32} fill="white" style={{marginLeft:4}}/>
            </button>
          ) : (
            <button onClick={handleStop} className="clay-btn" style={{ background: '#EF5350', color: '#fff', width: 70, height: 70, borderRadius: '50%' }}>
              <Pause size={32} fill="white" />
            </button>
          )}

          <button onClick={() => changePage(1)} disabled={!story.pages || currentPage === story.pages.length - 1} className="clay-btn" style={{opacity: (!story.pages || currentPage===story.pages.length-1)?0.5:1}}><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;