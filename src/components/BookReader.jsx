import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { playMagicVoice } from '../audioService';

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // STATI AUDIO
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false); // Nuovo stato per il caricamento
  
  // RIFERIMENTI (Usiamo useRef per avere accesso immediato senza re-render)
  const audioRef = useRef(null); 
  const cancelledRef = useRef(false); // Serve per bloccare l'audio se l'utente ha cliccato stop mentre caricava

  // 1. Carica il Libro
  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) console.error(error);
      else setBook(data);
      
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  // 2. PULIZIA TOTALE (Kill Switch)
  // Questo useEffect parte quando cambi pagina o chiudi il componente
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Funzione per fermare tutto (Reset)
  const stopAudio = () => {
    cancelledRef.current = true; // Segnala di non far partire nuovi audio
    
    // Ferma MP3 (ElevenLabs)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Riavvolgi
    }
    
    // Ferma TTS (Browser)
    window.speechSynthesis.cancel();
    
    // Aggiorna UI
    setIsSpeaking(false);
    setIsLoadingAudio(false);
  };

  // 3. Funzione LEGGI INTELLIGENTE
  const handleReadPage = async () => {
    if (!book) return;
    
    // SE STA GIÀ PARLANDO O CARICANDO -> STOP
    if (isSpeaking || isLoadingAudio) {
      stopAudio();
      return;
    }

    // AVVIO LETTURA
    stopAudio(); // Reset preventivo
    cancelledRef.current = false; // "Armiamo" il flag
    setIsLoadingAudio(true);
    setIsSpeaking(true); // Mettiamo l'icona "Stop" subito per feedback visivo

    const currentPage = book.pages[pageIndex];
    const textToRead = currentPage.text;
    
    try {
      // Chiamiamo il servizio audio
      const audioObj = await playMagicVoice(textToRead, currentPage.audio_url, book.language);

      // CONTROLLO DI SICUREZZA:
      // Se nel frattempo l'utente ha cliccato "Stop" o cambiato pagina...
      if (cancelledRef.current) {
        if (audioObj && audioObj.pause) audioObj.pause(); // Uccidilo subito
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        return;
      }

      // Se siamo ancora "in onda", salviamo il riferimento e agganciamo l'evento fine
      if (audioObj) {
        audioRef.current = audioObj;
        
        // Quando finisce di parlare
        audioObj.onended = () => {
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          audioRef.current = null;
        };
      }
    } catch (e) {
      console.error("Errore audio", e);
      setIsSpeaking(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Navigazione Pagine (Stop automatico al cambio)
  const nextPage = () => {
    if (pageIndex < book.pages.length - 1) {
      stopAudio(); 
      setPageIndex(pageIndex + 1);
    } else {
      stopAudio();
      navigate('/ebooks');
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      stopAudio();
      setPageIndex(pageIndex - 1);
    }
  };

  if (loading) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <Loader2 className="animate-spin" size={50} color="#673AB7"/>
    </div>
  );

  if (!book) return <div>Libro non trovato</div>;

  const currentPage = book.pages[pageIndex];
  const progress = ((pageIndex + 1) / book.pages.length) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f3e5f5', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' 
    }}>
      
      {/* HEADER NAVIGAZIONE */}
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/ebooks" onClick={stopAudio}> {/* Stop anche se clicca sulla freccia */}
          <button className="clay-btn" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, justifyContent: 'center' }}>
            <ArrowLeft />
          </button>
        </Link>
        
        <div style={{ flex: 1, margin: '0 20px', background: 'rgba(0,0,0,0.1)', height: '10px', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#AB47BC', height: '100%', transition: 'width 0.3s' }} />
        </div>

        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6A1B9A' }}>
          {pageIndex + 1} / {book.pages.length}
        </div>
      </div>

      {/* PAGINA LIBRO */}
      <div style={{ width: '100%', maxWidth: '800px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="clay-card"
            style={{ 
              width: '100%', 
              minHeight: '400px', 
              background: '#fff', 
              padding: '30px', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            
            <div style={{ fontSize: '10rem', marginBottom: '30px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>
              {currentPage.image}
            </div>

            {/* BOTTONE AUDIO */}
            <button 
              onClick={handleReadPage}
              className="clay-btn"
              style={{
                background: (isSpeaking || isLoadingAudio) ? '#FFCDD2' : '#E1BEE7', 
                color: (isSpeaking || isLoadingAudio) ? '#C62828' : '#4A148C',
                padding: '10px 20px',
                borderRadius: '30px',
                marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '1rem', fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isLoadingAudio ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />
              )}
              
              {isLoadingAudio ? 'Caricamento...' : (isSpeaking ? 'Stop' : (book.language === 'en' ? 'Listen' : 'Ascolta'))}
            </button>

            <p style={{ 
              fontSize: '1.6rem', 
              lineHeight: '1.6', 
              color: '#333', 
              maxWidth: '600px',
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
            }}>
              {currentPage.text}
            </p>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* CONTROLLI IN BASSO */}
      <div style={{ 
        width: '100%', maxWidth: '800px', 
        display: 'flex', justifyContent: 'space-between', 
        marginTop: '30px', paddingBottom: '20px' 
      }}>
        
        <button 
          onClick={prevPage} 
          disabled={pageIndex === 0}
          className="clay-btn"
          style={{ opacity: pageIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowLeft /> Indietro
        </button>

        <button 
          onClick={nextPage} 
          className="clay-btn clay-btn-primary"
          style={{ padding: '15px 40px', fontSize: '1.2rem' }}
        >
          {pageIndex === book.pages.length - 1 ? 'Fine 🏁' : 'Avanti ➜'}
        </button>

      </div>
    </div>
  );
};

export default BookReader;