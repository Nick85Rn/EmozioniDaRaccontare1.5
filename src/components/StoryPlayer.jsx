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

  const handleStop = () => stopSpeech();

  const changePage = (dir) => {
    stopSpeech();
    let newPage = currentPage + dir;
    if (story && story.pages) {
      if (newPage < 0) newPage = 0;
      if (newPage >= story.pages.length) newPage = story.pages.length - 1;
      setCurrentPage(newPage);
    }
  };

  if (!story) return <div style={{padding:50, textAlign:'center'}}>Caricamento...</div>;

  const page = story.pages ? story.pages[currentPage] : null;
  // Cerca l'immagine nella pagina corrente
  const pageImage = page?.image_url || page?.image;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px 20px', background: '#FFCC80', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" onClick={handleStop}><Home color="#5D4037" /></Link>
        <span style={{ color: '#5D4037', fontWeight: 'bold' }}>{story.title}</span>
        <Link to="/stories" onClick={handleStop}><ArrowLeft color="#5D4037" /></Link>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        
        {/* ECCO IL BLOCCO IMMAGINE RIPRISTINATO */}
        {pageImage && (
          <div className="clay-card" style={{ padding: 10, background: '#fff', borderRadius: 20, marginBottom: 20 }}>
            <img 
              src={pageImage} 
              alt="Scena" 
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 15 }} 
            />
          </div>
        )}

        <div className="clay-card" style={{ background: '#fff', padding: '20px', borderRadius: '20px', marginBottom: 20, fontSize: '1.2rem', color: '#4E342E' }}>
          {page?.text}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
          <button onClick={() => changePage(-1)} disabled={currentPage===0} className="clay-btn"><ArrowLeft /></button>
          {!isPlaying ? (
            <button onClick={handlePlay} className="clay-btn" style={{ background: '#4CAF50', color: '#fff', borderRadius: '50%', width: 60, height: 60 }}><Play fill="white" /></button>
          ) : (
            <button onClick={handleStop} className="clay-btn" style={{ background: '#F44336', color: '#fff', borderRadius: '50%', width: 60, height: 60 }}><Pause fill="white" /></button>
          )}
          <button onClick={() => changePage(1)} disabled={currentPage===story.pages.length-1} className="clay-btn"><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;