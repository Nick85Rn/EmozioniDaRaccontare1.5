import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; 
import { Play, Pause, X, ArrowLeft, ArrowRight, BookOpen, Home } from 'lucide-react';

const BookReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
        if (error) throw error;

        // Normalizzazione contenuto
        let cleanContent = [];
        if (data.content && Array.isArray(data.content)) cleanContent = data.content;
        else if (data.text) cleanContent = data.text.split('\n\n');
        
        setBook({ ...data, finalContent: cleanContent });
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchBook();
    return () => stopSpeech();
  }, [id]);

  const handleRead = () => {
    if (!book || !book.finalContent[pageIndex]) return;
    setIsPlaying(true);
    speakText(book.finalContent[pageIndex], () => setIsPlaying(false));
  };

  const handleStop = () => { stopSpeech(); setIsPlaying(false); };

  const handlePageChange = (dir) => {
    handleStop();
    const newIdx = pageIndex + dir;
    if (book && book.finalContent && newIdx >= 0 && newIdx < book.finalContent.length) setPageIndex(newIdx);
  };

  if (loading) return <div>Caricamento...</div>;
  if (!book || !book.finalContent || book.finalContent.length === 0) return <div style={{padding:40, textAlign:'center'}}>Nessun contenuto. <Link to="/books">Torna indietro</Link></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', padding: '20px', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Link to="/" onClick={handleStop} style={{ color: '#546E7A' }}><Home size={24} /></Link>
        <h2 style={{ margin: 0, color: '#455A64' }}>{book.title}</h2>
        <Link to="/books" onClick={handleStop} style={{ color: '#546E7A' }}><X size={28} /></Link>
      </div>

      <div className="clay-card" style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', lineHeight: '1.6', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
        {book.finalContent[pageIndex]}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 30, alignItems: 'center' }}>
        <button onClick={() => handlePageChange(-1)} disabled={pageIndex === 0} className="clay-btn"><ArrowLeft /></button>
        {!isPlaying ? (
          <button onClick={handleRead} className="clay-btn" style={{ background: '#29B6F6', color: '#fff', padding: '15px 40px', borderRadius: '30px' }}><Play style={{marginRight:8}} fill="white"/> LEGGI</button>
        ) : (
          <button onClick={handleStop} className="clay-btn" style={{ background: '#EF5350', color: '#fff', padding: '15px 40px', borderRadius: '30px' }}><Pause style={{marginRight:8}} fill="white"/> STOP</button>
        )}
        <button onClick={() => handlePageChange(1)} disabled={pageIndex === book.finalContent.length - 1} className="clay-btn"><ArrowRight /></button>
      </div>
    </div>
  );
};

export default BookReader;