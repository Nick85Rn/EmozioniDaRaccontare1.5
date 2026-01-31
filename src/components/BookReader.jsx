import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Volume2, VolumeX, Home } from 'lucide-react';
// 👇 NUOVO IMPORT
import { speakText, stopSpeech } from '../utils/speechUtils';

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Audio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await supabase.from('books').select('*').eq('id', id).single();
      if (data) setBook(data);
      setLoading(false);
    };
    fetchBook();
    return () => stopSpeech();
  }, [id]);

  const handleReadPage = async () => {
    if (!book) return;
    
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsLoadingAudio(true);
    setIsSpeaking(true);

    const currentPage = book.pages[pageIndex];
    
    // Parla con ElevenLabs
    await speakText(currentPage.text, book.language || 'it', () => {
      setIsSpeaking(false);
      setIsLoadingAudio(false);
    });
    
    setIsLoadingAudio(false);
  };

  const nextPage = () => {
    stopSpeech();
    setIsSpeaking(false);
    if (pageIndex < book.pages.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      navigate('/ebooks');
    }
  };

  const prevPage = () => {
    stopSpeech();
    setIsSpeaking(false);
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  if (loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin" size={50} color="#673AB7"/></div>;
  if (!book) return <div>Libro non trovato</div>;

  const currentPage = book.pages[pageIndex];
  const progress = ((pageIndex + 1) / book.pages.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#f3e5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      {/* HEADER */}
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/ebooks" onClick={stopSpeech}>
          <button className="clay-btn" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, justifyContent: 'center' }}><ArrowLeft /></button>
        </Link>
        <div style={{ flex: 1, margin: '0 20px', background: 'rgba(0,0,0,0.1)', height: '10px', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#AB47BC', height: '100%', transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6A1B9A' }}>{pageIndex + 1} / {book.pages.length}</div>
      </div>

      {/* CONTENUTO PAGINA */}
      <div style={{ width: '100%', maxWidth: '800px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="clay-card"
            style={{ 
              width: '100%', minHeight: '400px', background: '#fff', padding: '30px', 
              alignItems: 'center', justifyContent: 'center', textAlign: 'center' 
            }}
          >
            {/* EMOJI GIGANTE (Qui sta la tua "immagine") */}
            <div style={{ fontSize: '10rem', marginBottom: '30px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>
              {currentPage.image}
            </div>

            {/* BOTTONE AUDIO */}
            <button 
              onClick={handleReadPage}
              className="clay-btn"
              style={{
                background: isSpeaking ? '#FFCDD2' : '#E1BEE7', 
                color: isSpeaking ? '#C62828' : '#4A148C',
                padding: '10px 20px', borderRadius: '30px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 'bold'
              }}
            >
              {isLoadingAudio ? <Loader2 className="animate-spin" size={20} /> : (isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />)}
              {isLoadingAudio ? 'Caricamento...' : (isSpeaking ? 'Stop' : (book.language === 'en' ? 'Listen' : 'Ascolta'))}
            </button>

            <p style={{ fontSize: '1.6rem', lineHeight: '1.6', color: '#333', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
              {currentPage.text}
            </p>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* CONTROLLI */}
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingBottom: '20px' }}>
        <button onClick={prevPage} disabled={pageIndex === 0} className="clay-btn" style={{ opacity: pageIndex === 0 ? 0.5 : 1 }}>Indietro</button>
        <button onClick={nextPage} className="clay-btn clay-btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
          {pageIndex === book.pages.length - 1 ? 'Fine 🏁' : 'Avanti ➜'}
        </button>
      </div>
    </div>
  );
};

export default BookReader;