import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import StickerAward from './StickerAward'; 
// 👇 ECCO IL CAMBIO: Usiamo il nuovo utils
import { speakText, stopSpeech } from '../utils/speechUtils';

const StoryPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Audio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Premio
  const [showAward, setShowAward] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false); 

  // Fetch Storia
  useEffect(() => {
    const fetchStory = async () => {
      const { data } = await supabase.from('stories').select('*').eq('id', id).single();
      if (data) {
        setStory(data);
        setCurrentNodeId(data.start_node || 'start');
      }
      setLoading(false);
    };
    fetchStory();
    return () => stopSpeech(); // Pulisce audio quando esci
  }, [id]);

  // Gestione Audio NUOVA
  const handleSpeak = async () => {
    if(!story || !currentNodeId) return;
    const currentNode = story.nodes[currentNodeId];

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    
    setIsLoadingAudio(true);
    
    // Chiama ElevenLabs
    await speakText(currentNode.text, story.language || 'it', () => {
      setIsSpeaking(false);
      setIsLoadingAudio(false);
    });
    
    setIsSpeaking(true);
    setIsLoadingAudio(false);
  };

  // Ferma audio se cambi pagina/nodo
  useEffect(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, [currentNodeId]);

  const handleChoice = (choice) => {
    stopSpeech();
    setIsSpeaking(false);
    setCurrentNodeId(choice.nextId);
  };

  // Controllo Fine Storia e Premio (INVARIATO)
  useEffect(() => {
    if (!story || !currentNodeId) return;
    const currentNode = story.nodes[currentNodeId];
    const isEnding = !currentNode.choices || currentNode.choices.length === 0;

    if (isEnding && !hasAwarded) {
       const unlockSticker = async () => {
         const { data: { session } } = await supabase.auth.getSession();
         if(session) {
            const { error } = await supabase
               .from('user_stickers')
               .insert([{ user_id: session.user.id, sticker_id: 1 }]);
            if (!error) setTimeout(() => setShowAward(true), 1000); 
         }
       };
       unlockSticker();
       setHasAwarded(true);
    }
  }, [currentNodeId, story, hasAwarded]);

  if (loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin" size={50}/></div>;
  if (!story) return <div style={{textAlign:'center', marginTop:'50px'}}>Storia non trovata!</div>;

  const currentNode = story.nodes[currentNodeId];
  const choices = currentNode.choices || [];
  const isEnding = choices.length === 0;

  return (
    <motion.div 
      animate={{ backgroundColor: currentNode.bgColor || '#f0f4f8' }}
      transition={{ duration: 0.8 }}
      style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <Link to="/stories" onClick={stopSpeech} style={{ position: 'absolute', top: 20, left: 20 }}>
        <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px', display:'flex', alignItems:'center', justifyContent:'center' }}><ArrowLeft /></button>
      </Link>

      {showAward && (
         <StickerAward stickerName="Il Lettore Coraggioso" onClose={() => navigate('/album')} />
      )}

      <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center' }}>
        
        {/* EMOJI GIGANTE (Questo è quello che mancava!) */}
        <motion.div 
          key={currentNodeId} 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ fontSize: '100px', marginBottom: '30px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}
        >
          {currentNode.image}
        </motion.div>

        <motion.div
          key={currentNodeId + '-text'}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="clay-sheet"
          style={{ position: 'relative', marginBottom: '40px', padding: '30px' }}
        >
          <button 
            onClick={handleSpeak}
            disabled={isLoadingAudio}
            className="clay-btn"
            style={{
              position: 'absolute', top: '-30px', right: '20px',
              borderRadius: '50%', width: '60px', height: '60px', padding: 0,
              background: isSpeaking ? '#FF7675' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isLoadingAudio ? <Loader2 className="animate-spin" /> : isSpeaking ? <VolumeX /> : <Volume2 />}
          </button>

          <p style={{ fontSize: '1.5rem', lineHeight: '1.6', color: '#2d3436', margin: 0 }}>
            {currentNode.text}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {choices.map((choice, index) => (
            <motion.button
              key={index}
              className="clay-btn"
              onClick={() => handleChoice(choice)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {choice.text}
            </motion.button>
          ))}

          {isEnding && !showAward && (
            <Link to="/stories" style={{ textDecoration: 'none' }}>
              <button className="clay-btn clay-btn-primary" style={{ width: '100%' }}>
                 {story.language === 'en' ? 'Back to Library 🏁' : 'Torna alla Libreria 🏁'}
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StoryPlayer;