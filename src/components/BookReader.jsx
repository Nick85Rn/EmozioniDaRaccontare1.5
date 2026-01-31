import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { speakText, stopSpeech } from '../utils/speechUtils'; 
import { Play, Pause, X, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

const BookReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // 1. Scarica tutto quello che c'è nella riga del libro
        const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
        
        if (error) throw error;

        console.log("📚 DATI RICEVUTI DAL DB:", data); // Guarda la console (F12) se non funziona!

        // 2. ADATTATORE INTELLIGENTE: Cerca il testo in vari formati
        let cleanContent = [];

        if (data.content && Array.isArray(data.content) && data.content.length > 0) {
          // Caso A: Colonna 'content' (Array di stringhe)
          cleanContent = data.content;
        } 
        else if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
          // Caso B: Colonna 'pages' (come le Storie, Array di oggetti)
          cleanContent = data.pages.map(p => p.text || p); 
        } 
        else if (data.text && typeof data.text === 'string') {
          // Caso C: Colonna 'text' (Unico testo lungo) -> Lo dividiamo in paragrafi
          cleanContent = data.text.split('\n\n').filter(p => p.trim().length > 0);
        }
        else if (data.description) {
           // Caso D: Mal che vada usiamo la descrizione
           cleanContent = [data.description];
        }

        // Salviamo il libro con il contenuto "normalizzato"
        setBook({ ...data, finalContent: cleanContent });

      } catch (err) {
        console.error("Errore recupero libro:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
    
    // Pulizia audio quando esci
    return () => stopSpeech();
  }, [id]);

  const getCurrentText = () => {
    if (!book || !book.finalContent) return "";
    return book.finalContent[pageIndex] || "";
  };

  const handleRead = () => {
    const text = getCurrentText();
    if (!text) return;
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
    if (book && book.finalContent && newIndex >= 0 && newIndex < book.finalContent.length) {
      setPageIndex(newIndex);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Caricamento libro... 📖</div>;

  // Se ancora non troviamo nulla, mostriamo l'errore (ma ora sappiamo che abbiamo cercato ovunque)
  if (!book || !book.finalContent || book.finalContent.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤷‍♂️</div>
        <h3 style={{ color: '#333' }}>Ops! Questo libro sembra vuoto.</h3>
        <p style={{ color: '#666' }}>Non ho trovato testo nelle colonne: <i>content, pages, text</i>.</p>
        <p style={{ fontSize: '0.8rem', color: '#999' }}>Controlla su Supabase che la tabella 'books' abbia dei dati.</p>
        <br/>
        <Link to="/books" className="clay-btn">Torna alla Libreria</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', padding: '20px', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#455A64', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={24} /> {book.title}
        </h2>
        <Link to="/books" onClick={handleStop} style={{ color: '#546E7A' }}><X size={32} /></Link>
      </div>

      {/* PAGINA */}
      <div className="clay-card" style={{ 
        flex: 1, 
        background: '#fff', 
        padding: '30px', 
        borderRadius: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1.5rem', 
        lineHeight: '1.6',
        textAlign: 'center', 
        color: '#37474F',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        overflowY: 'auto'
      }}>
        {getCurrentText()}
      </div>

      {/* CONTROLLI */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 30, alignItems: 'center' }}>
        <button 
          onClick={() => handlePageChange(-1)} 
          disabled={pageIndex === 0}
          className="clay-btn" 
          style={{ width: 50, height: 50, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pageIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowLeft />
        </button>
        
        {!isPlaying ? (
          <button 
            onClick={handleRead} 
            className="clay-btn" 
            style={{ background: '#29B6F6', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px' }}
          >
            <Play style={{marginRight:8}} fill="white"/> LEGGI
          </button>
        ) : (
          <button 
            onClick={handleStop} 
            className="clay-btn" 
            style={{ background: '#EF5350', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px' }}
          >
            <Pause style={{marginRight:8}} fill="white"/> STOP
          </button>
        )}

        <button 
          onClick={() => handlePageChange(1)} 
          disabled={pageIndex === book.finalContent.length - 1}
          className="clay-btn"
          style={{ width: 50, height: 50, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pageIndex === book.finalContent.length - 1 ? 0.5 : 1 }}
        >
          <ArrowRight />
        </button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: 15, color: '#90A4AE', fontSize: '0.9rem' }}>
        Pagina {pageIndex + 1} di {book.finalContent.length}
      </p>
    </div>
  );
};

export default BookReader;