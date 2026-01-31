import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, ArrowLeft, Star, Lock } from 'lucide-react';
import PremiumLock from '../components/PremiumLock'; // Assicurati di avere questo componente, altrimenti rimuovilo

const StoriesHub = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // Scarica ID, Titolo, Descrizione e Immagine dalla tabella 'stories'
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, description, image_url, is_premium'); // Assicurati che le colonne esistano

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Errore caricamento storie:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#E65100' }}>
          <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <ArrowLeft size={24} />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: '#E65100', display: 'flex', alignItems: 'center', gap: '10px' }}>
          La Libreria Magica <BookOpen size={32} />
        </h1>
      </div>

      {/* CARICAMENTO */}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Caricamento storie... ✨</div>}

      {/* GRIGLIA STORIE */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {stories.map((story) => (
            // Se la storia è premium, usa PremiumLock, altrimenti Link diretto
            <div key={story.id} style={{ position: 'relative' }}>
              
              {/* Logica Premium: Se è premium, avvolgi nel lucchetto. Se no, link libero */}
              {story.is_premium ? (
                <PremiumLock>
                  <Link to={`/story/${story.id}`} style={{ textDecoration: 'none' }}>
                    <StoryCard story={story} />
                  </Link>
                </PremiumLock>
              ) : (
                <Link to={`/story/${story.id}`} style={{ textDecoration: 'none' }}>
                  <StoryCard story={story} />
                </Link>
              )}

            </div>
          ))}

          {/* MESSAGGIO SE VUOTO */}
          {stories.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', marginTop: 20 }}>
              Non ci sono ancora storie. Aggiungile su Supabase! 📝
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Sottocomponente per la Card Grafica
const StoryCard = ({ story }) => (
  <div className="clay-card" style={{ 
    background: '#fff', 
    borderRadius: '20px', 
    overflow: 'hidden', 
    height: '100%',
    display: 'flex', 
    flexDirection: 'column',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    border: '1px solid rgba(0,0,0,0.05)'
  }}>
    {/* Immagine Copertina */}
    <div style={{ height: '180px', background: '#eee', overflow: 'hidden', position: 'relative' }}>
      {story.image_url ? (
        <img src={story.image_url} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
          <BookOpen size={50} />
        </div>
      )}
      {/* Badge Premium */}
      {story.is_premium && (
        <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <Star size={12} fill="black" /> VIP
        </div>
      )}
    </div>

    {/* Testo */}
    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>{story.title}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.4', flex: 1 }}>
        {story.description || "Una fantastica avventura ti aspetta..."}
      </p>
      <div style={{ marginTop: '15px', color: '#E65100', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
        Leggi ora <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
      </div>
    </div>
  </div>
);

export default StoriesHub;