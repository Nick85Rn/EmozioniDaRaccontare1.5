import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// --- COMPONENTI ---
import Navbar from './components/Navbar';
// NOTA: Dallo screenshot il Footer è in 'pages', ma se lo hai spostato in 'components' cambia la riga sotto
import Footer from './pages/Footer'; 

// --- PAGINE ---
import Home from './pages/Home';
import Login from './pages/Login';
import ParentsArea from './pages/ParentsArea';
import AdminPanel from './pages/AdminPanel';
import GamesHub from './pages/GamesHub';

// --- STORIE & LIBRI ---
import StoriesHub from './pages/StoriesHub';       // Per le Storie Interattive
import EbookLibrary from './pages/EbookLibrary';   // <--- ECCO IL FILE GIUSTO PER I RACCONTI!

// --- LETTORI ---
import StoryPlayer from './components/StoryPlayer'; // Lettore Storie
import BookReader from './components/BookReader';   // Lettore Libri
import PuzzleGame from './components/PuzzleGame';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{padding:50, textAlign:'center'}}>Caricamento... 🦁</div>;

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar session={session} />
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/parents" element={<ParentsArea />} />
            <Route path="/nicola-admin-secret" element={<AdminPanel />} />

            {/* SEZIONE STORIE */}
            <Route path="/stories" element={<StoriesHub />} />
            <Route path="/story/:id" element={<StoryPlayer />} />

            {/* SEZIONE RACCONTI (Usa EbookLibrary) */}
            <Route path="/books" element={<EbookLibrary />} />
            <Route path="/book/:id" element={<BookReader />} />

            {/* GIOCHI */}
            <Route path="/games" element={<GamesHub />} />
            <Route path="/puzzle" element={<PuzzleGame />} />
            
            {/* Fallback per link vecchi */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;