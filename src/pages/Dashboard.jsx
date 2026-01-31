import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, ArrowLeft, Star, PlayCircle } from 'lucide-react';
import PremiumLock from '../components/PremiumLock'; // Assicurati di avere questo componente

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // Scarica tutto (*) così prendiamo anche il campo 'pages' nascosto
      const { data, error } = await supabase.from('stories').select('*');
      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Errore storie:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione "Detective" per trovare l'immagine ovunque sia
  const getCover = (story) => {
    // 1. Cerca nella colonna principale
    if (story.image_url) return story.image_url;
    // 2. Cerca dentro la prima pagina (JSON) - FIX per le tue storie vecchie!
    if (story.pages && Array.isArray(story.pages) && story.pages.length > 0) {
      return story.pages[0].image_url || story.pages[0].image;
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF3E0', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/">
           <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <ArrowLeft size={24} color="#E65100" />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: '#E65100', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Le Mie Storie <BookOpen size={32} />
        </h1>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: '#888'}}>Caricamento libreria...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {stories.map((story) => {
            const imageSrc = getCover(story);
            const isPremium = story.is_premium;

            return (
              <div key={story.id} style={{ height: '100%' }}>
                {isPremium ? (
                  <PremiumLock>
                    <Link to={`/story/${story.id}`} style={{ textDecoration: 'none' }}>
                      <StoryCard story={story} image={imageSrc} />
                    </Link>
                  </PremiumLock>
                ) : (
                  <Link to={`/story/${story.id}`} style={{ textDecoration: 'none' }}>
                     <StoryCard story={story} image={imageSrc} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Componente Grafico Card
const StoryCard = ({ story, image }) => (
  <div className="clay-card" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ height: '180px', background: '#ffe0b2', position: 'relative' }}>
      {image ? (
        <img src={image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={50} color="#fff" />
        </div>
      )}
      {story.is_premium && (
        <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <Star size={12} fill="black" /> VIP
        </div>
      )}
    </div>
    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{story.title}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', flex: 1 }}>{story.description}</p>
      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E65100', fontWeight: 'bold' }}>
        <PlayCircle size={20} /> Leggi Ora
      </div>
    </div>
  </div>
);

export default Dashboard;