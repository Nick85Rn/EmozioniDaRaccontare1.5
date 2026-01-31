import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; 
import { Play, Pause, X, ArrowLeft, ArrowRight } from 'lucide-react';

const BookReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
        if (error) throw error;
        setBook(data);
      } catch (err) {
        console.error("Errore libro:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
    return () => stopSpeech();
  }, [id]);

  const handleRead = () => {
    // Controllo di sicurezza: se book o content non esistono, non fare nulla
    if (!book || !book.content || !book.content[pageIndex]) return;
    
    const text = book.content[pageIndex];
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
    // Controllo di sicurezza sui limiti
    if (book && book.content && newIndex >= 0 && newIndex < book.content.length) {
      setPageIndex(newIndex);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Caricamento libro... 📖</div>;
  
  // FIX CRITICO: Se il libro non esiste o non ha contenuto, mostra errore invece di spaccare tutto
  if (!book || !book.content || book.content.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3>Ops! Questo libro sembra vuoto. 😢</h3>
        <Link to="/books" className="clay-btn">Torna indietro</Link>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: '#F5F5F5', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>{book.title}</h2>
        <Link to="/books" onClick={handleStop} style={{ color: '#333' }}><X size={28} /></Link>
      </div>

      {/* CONTENUTO PAGINA */}
      <div style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        {/* Qui accediamo all'array in sicurezza */}
        {book.content[pageIndex]}
      </div>

      {/* CONTROLLI */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: 20 }}>
        <button 
          onClick={() => handlePageChange(-1)} 
          disabled={pageIndex === 0}
          className="clay-btn" 
          style={{ opacity: pageIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowLeft />
        </button>
        
        {!isPlaying ? (
          <button onClick={handleRead} className="clay-btn" style={{ background: '#2196F3', color: '#fff', padding: '10px 30px' }}><Play style={{marginRight:5}}/> LEGGI</button>
        ) : (
          <button onClick={handleStop} className="clay-btn" style={{ background: '#F44336', color: '#fff', padding: '10px 30px' }}><Pause style={{marginRight:5}}/> STOP</button>
        )}

        <button 
          onClick={() => handlePageChange(1)} 
          disabled={pageIndex === book.content.length - 1}
          className="clay-btn"
          style={{ opacity: pageIndex === book.content.length - 1 ? 0.5 : 1 }}
        >
          <ArrowRight />
        </button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: 10, color: '#999' }}>Pagina {pageIndex + 1} di {book.content.length}</p>
    </div>
  );
};

export default BookReader;