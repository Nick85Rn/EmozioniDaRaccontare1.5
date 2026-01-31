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

        // Logica intelligente per trovare il contenuto (come prima)
        let cleanContent = [];
        if (data.content && Array.isArray(data.content)) cleanContent = data.content;
        else if (data.pages && Array.isArray(data.pages)) cleanContent = data.pages.map(p => p.text || p);
        else if (data.text) cleanContent = data.text.split('\n\n').filter(p => p.trim().length > 0);
        else if (data.description) cleanContent = [data.description];

        setBook({ ...data, finalContent: cleanContent });
      } catch (err) {
        console.error("Errore recupero libro:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
    return () => stopSpeech();
  }, [id]);

  const handleRead = () => {
    if (!book || !book.finalContent || !book.finalContent[pageIndex]) return;
    setIsPlaying(true);
    speakText(book.finalContent[pageIndex], () => setIsPlaying(false));
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
  };

  const handlePageChange = (direction) => {
    handleStop();
    const newIndex = pageIndex + direction;
    if (book && book.finalContent && newIndex >= 0 && newIndex < book.finalContent.length) {
      setPageIndex(newIndex);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Caricamento... 📖</div>;

  // Schermata Errore con tasto Home funzionante
  if (!book || !book.finalContent || book.finalContent.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤷‍♂️</div>
        <h3 style={{ color: '#333' }}>Ops! Questo libro sembra vuoto.</h3>
        <br/>
        {/* FIX: Tasto che riporta alla HOME sicura */}
        <Link to="/" className="clay-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Home size={18}/> Torna alla Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', padding: '20px', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* HEADER DI NAVIGAZIONE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        
        {/* Tasto Home a Sinistra */}
        <Link to="/" onClick={handleStop} style={{ color: '#546E7A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Home size={20} />
          </div>
        </Link>

        <h2 style={{ margin: 0, color: '#455A64', fontSize: '1.2rem', textAlign: 'center' }}>
          {book.title}
        </h2>

        {/* Tasto Chiudi a Destra (Torna alla Home) */}
        <Link to="/" onClick={handleStop} style={{ color: '#546E7A' }}>
          <div className="clay-btn" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={24} />
          </div>
        </Link>
      </div>

      {/* PAGINA */}
      <div className="clay-card" style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', lineHeight: '1.6', textAlign: 'center', color: '#37474F', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
        {book.finalContent[pageIndex]}
      </div>

      {/* CONTROLLI */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 30, alignItems: 'center' }}>
        <button onClick={() => handlePageChange(-1)} disabled={pageIndex === 0} className="clay-btn" style={{ width: 50, height: 50, borderRadius: '50%', opacity: pageIndex === 0 ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ArrowLeft /></button>
        
        {!isPlaying ? (
          <button onClick={handleRead} className="clay-btn" style={{ background: '#29B6F6', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px' }}><Play style={{marginRight:8}} fill="white"/> LEGGI</button>
        ) : (
          <button onClick={handleStop} className="clay-btn" style={{ background: '#EF5350', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px' }}><Pause style={{marginRight:8}} fill="white"/> STOP</button>
        )}

        <button onClick={() => handlePageChange(1)} disabled={pageIndex === book.finalContent.length - 1} className="clay-btn" style={{ width: 50, height: 50, borderRadius: '50%', opacity: pageIndex === book.finalContent.length - 1 ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ArrowRight /></button>
      </div>
    </div>
  );
};

export default BookReader;