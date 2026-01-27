import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Pagine Principali
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';       
import EbookLibrary from './pages/EbookLibrary'; 
import GamesHub from './pages/GamesHub';         
import ParentsArea from './pages/ParentsArea';   
import StickerAlbum from './pages/StickerAlbum'; 

// Auth & Legal
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin (Pagina Segreta & Strumenti)
import AdminPanel from './pages/AdminPanel';
import AudioGenerator from './pages/AudioGenerator';

// Components
import StoryPlayer from './components/StoryPlayer';
import BookReader from './components/BookReader';
import CalmCorner from './components/CalmCorner';
import Footer from './components/Footer';

// Giochi
import FaceLab from './components/FaceLab';
import MemoryGame from './components/MemoryGame';
import BreathingGame from './components/BreathingGame';
import BattleshipGame from './components/BattleshipGame';
import Connect4Game from './components/Connect4Game';
import EnglishGame from './components/EnglishGame';
import PuzzleGame from './components/PuzzleGame'; 

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- GESTIONE SESSIONE E SICUREZZA ---
  useEffect(() => {
    // 1. Controlla sessione all'avvio
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("Sessione non valida, logout forzato.");
        supabase.auth.signOut();
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    // 2. Ascolta i cambiamenti (login, logout, token scaduto)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        // Pulisce cache locale per evitare loop di redirect
        localStorage.removeItem('sb-emozionidaraccontare-auth-token'); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 👮‍♂️ IL GUARDIANO: CONTROLLO ADMIN ---
  // Verifica se l'utente corrente è ESATTAMENTE tu
  const isAdmin = session?.user?.email === 'cioni85@gmail.com';

  if (loading) return null; // Evita sfarfallii mentre controlla l'utente

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Angolo della Calma (Sempre visibile per i bimbi) */}
        <CalmCorner />
        
        <div style={{ flex: 1 }}>
          <Routes>
            {/* --- PAGINE PUBBLICHE --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* --- PAGINE UTENTE --- */}
            <Route path="/stories" element={<Dashboard />} />
            <Route path="/story/:id" element={<StoryPlayer />} />
            <Route path="/ebooks" element={<EbookLibrary />} />
            <Route path="/ebook/:id" element={<BookReader />} />
            <Route path="/album" element={<StickerAlbum />} />
            
            {/* Area Genitori (Ha il suo Parental Gate interno) */}
            <Route path="/parents" element={<ParentsArea />} />

            {/* --- GIOCHI --- */}
            <Route path="/games" element={<GamesHub />} />
            <Route path="/facelab" element={<FaceLab />} />
            <Route path="/memory" element={<MemoryGame />} />
            <Route path="/breathing" element={<BreathingGame />} />
            <Route path="/battleship" element={<BattleshipGame />} />
            <Route path="/connect4" element={<Connect4Game />} />
            <Route path="/english" element={<EnglishGame />} />
            <Route path="/puzzle" element={<PuzzleGame />} />

            {/* --- AREA AMMINISTRATORE (SUPER PROTETTA) --- */}
            {/* Se è Admin -> Mostra il pannello. Se no -> Calcia alla Home */}
            <Route 
              path="/nicola-admin-secret" 
              element={
                isAdmin ? <AdminPanel /> : <Navigate to="/" replace />
              } 
            />
            
            <Route 
              path="/audio-studio" 
              element={
                isAdmin ? <AudioGenerator /> : <Navigate to="/" replace />
              } 
            />

          </Routes>
        </div>

        {/* Footer in basso */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;