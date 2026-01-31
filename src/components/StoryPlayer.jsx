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
    setIsPlaying(true);
    speakText(story.pages?.[currentPage]?.text || "", () => setIsPlaying(false));
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

  if (!story) return <div style={{padding:20}}>Caricamento...</div>;
  const page = story.pages[currentPage];

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER AGGIORNATO */}
      <div style={{ padding: '15px', background: '#FFCC80', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Tasto Home */}
        <Link to="/" onClick={handleStop} style={{ color: '#5D4037' }}>
            <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <Home size={24} />
            </div>
        </Link>
        
        <span style={{ color: '#5D4037', fontWeight: 'bold', fontSize: '1.1rem' }}>{story.title}</span>
        
        {/* Tasto Indietro (Home) */}
        <Link to="/" onClick={handleStop} style={{ color: '#5D4037' }}>
             <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <ArrowLeft size={24} />
            </div>
        </Link>
      </div>

      {/* CONTENUTO */}
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
        {page?.image_url && <img src={page.image_url} alt="scena" style={{ width: '100%', borderRadius: '15px', marginBottom: '20px', maxHeight: '350px', objectFit: 'cover' }} />}
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', fontSize: '1.3rem', color: '#4E342E', lineHeight: '1.5' }}>
          {page?.text}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => changePage(-1)} disabled={currentPage===0} className="clay-btn" style={{opacity: currentPage===0?0.5:1}}><ArrowLeft /></button>
          
          {!isPlaying ? (
            <button onClick={handlePlay} className="clay-btn" style={{ background: '#4CAF50', color: '#fff', width: 70, height: 70, borderRadius: '50%' }}><Play size={32} fill="white" style={{marginLeft:4}}/></button>
          ) : (
            <button onClick={handleStop} className="clay-btn" style={{ background: '#F44336', color: '#fff', width: 70, height: 70, borderRadius: '50%' }}><Pause size={32} fill="white" /></button>
          )}

          <button onClick={() => changePage(1)} disabled={!story.pages || currentPage===story.pages.length-1} className="clay-btn" style={{opacity: (!story.pages || currentPage===story.pages.length-1)?0.5:1}}><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;