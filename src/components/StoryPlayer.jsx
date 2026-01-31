import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; // <--- IMPORTANTE
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
    return () => stopSpeech(); // Pulisce quando esci
  }, [id]);

  const handlePlay = () => {
    if (!story) return;
    const text = story.pages?.[currentPage]?.text || "";
    setIsPlaying(true);
    speakText(text, () => setIsPlaying(false)); // Usa il nuovo motore
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
      <div style={{ padding: '15px', background: '#FFCC80', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/stories" onClick={handleStop}><ArrowLeft color="#5D4037" /></Link>
        <span style={{ color: '#5D4037', fontWeight: 'bold' }}>{story.title}</span>
        <Link to="/" onClick={handleStop}><Home color="#5D4037" /></Link>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {page?.image_url && <img src={page.image_url} alt="scena" style={{ width: '100%', borderRadius: '15px', marginBottom: '20px' }} />}
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', fontSize: '1.2rem', color: '#4E342E' }}>
          {page?.text}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => changePage(-1)} className="clay-btn"><ArrowLeft /></button>
          
          {!isPlaying ? (
            <button onClick={handlePlay} className="clay-btn" style={{ background: '#4CAF50', color: '#fff', width: 60, height: 60, borderRadius: '50%' }}><Play /></button>
          ) : (
            <button onClick={handleStop} className="clay-btn" style={{ background: '#F44336', color: '#fff', width: 60, height: 60, borderRadius: '50%' }}><Pause /></button>
          )}

          <button onClick={() => changePage(1)} className="clay-btn"><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;