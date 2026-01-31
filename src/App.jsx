import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// --- COMPONENTI STRUTTURALI ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- PAGINE PRINCIPALI ---
import Home from './pages/Home';
import Login from './pages/Login';
import ParentsArea from './pages/ParentsArea';
import AdminPanel from './pages/AdminPanel'; // La pagina segreta

// --- STORI E LIBRI ---
import StoriesHub from './pages/StoriesHub'; // La libreria delle storie
import StoryPlayer from './components/StoryPlayer'; // Il lettore con ElevenLabs
import BookReader from './components/BookReader'; // Il lettore di libri semplici

// --- GIOCHI ---
import GamesHub from './pages/GamesHub'; // La sala giochi
import PuzzleGame from './components/PuzzleGame'; // Il gioco del puzzle

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Controlla la sessione attuale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Ascolta i cambiamenti (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Caricamento Emozioni... 🚀</div>;
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* BARRA DI NAVIGAZIONE (Sempre visibile) */}
        <Navbar session={session} />

        {/* CONTENUTO CHE CAMBIA */}
        <div style={{ flex: 1 }}>
          <Routes>
            {/* 🏠 HOME & AUTH */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* 👨‍👩‍👧‍👦 AREA GENITORI & ADMIN */}
            <Route path="/parents" element={<ParentsArea />} />
            <Route path="/nicola-admin-secret" element={<AdminPanel />} />

            {/* 📚 STORIE INTERATTIVE */}
            <Route path="/stories" element={<StoriesHub />} />
            <Route path="/story/:id" element={<StoryPlayer />} />

            {/* 📖 LIBRI E RACCONTI */}
            {/* Nota: Se non hai una pagina 'BooksHub', usiamo StoriesHub o Home come ripiego */}
            <Route path="/books" element={<StoriesHub />} /> 
            <Route path="/book/:id" element={<BookReader />} />

            {/* 🎮 GIOCHI */}
            <Route path="/games" element={<GamesHub />} />
            <Route path="/puzzle" element={<PuzzleGame />} />
            
            {/* Placeholder per giochi futuri (per evitare crash se clicchi i link in GamesHub) */}
            <Route path="/battleship" element={<GamesHub />} />
            <Route path="/memory" element={<GamesHub />} />
            <Route path="/target" element={<GamesHub />} />

            {/* ⚠️ CATCH-ALL (Se la pagina non esiste, torna alla Home) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* PIÈ DI PAGINA (Sempre visibile) */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;