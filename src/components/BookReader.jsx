import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; // <--- IMPORTANTE
import { Play, Pause, X, ArrowLeft, ArrowRight } from 'lucide-react';

const BookReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await supabase.from('books').select('*').eq('id', id).single();
      setBook(data);
    };
    fetchBook();
    return () => stopSpeech();
  }, [id]);

  const handleRead = () => {
    if (!book) return;
    const text = book.content?.[pageIndex] || ""; // Adatta se la struttura è diversa
    setIsPlaying(true);
    speakText(text, () => setIsPlaying(false));
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
  };

  const handlePageChange = (direction) => {
    handleStop();
    const newIndex = pageIndex + direction;
    if (book && book.content && newIndex >= 0 && newIndex < book.content.length) {
      setPageIndex(newIndex);
    }
  };

  if (!book) return <div>Caricamento...</div>;

  return (
    <div style={{ height: '100vh', background: '#F5F5F5', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>{book.title}</h2>
        <Link to="/books" onClick={handleStop}><X size={28} /></Link>
      </div>

      <div style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', textAlign: 'center' }}>
        {book.content[pageIndex]}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: 20 }}>
        <button onClick={() => handlePageChange(-1)} className="clay-btn"><ArrowLeft /></button>
        
        {!isPlaying ? (
          <button onClick={handleRead} className="clay-btn" style={{ background: '#2196F3', color: '#fff' }}><Play /> LEGGI</button>
        ) : (
          <button onClick={handleStop} className="clay-btn" style={{ background: '#F44336', color: '#fff' }}><Pause /> STOP</button>
        )}

        <button onClick={() => handlePageChange(1)} className="clay-btn"><ArrowRight /></button>
      </div>
    </div>
  );
};

export default BookReader;