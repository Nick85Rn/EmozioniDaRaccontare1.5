import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Sparkles } from 'lucide-react';
import PremiumLock from '../components/PremiumLock'; // <--- Importiamo il lucchetto
import { checkAccess } from '../config/subscription'; // <--- Importiamo le regole

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [profile, setProfile] = useState(null); // Stato per il profilo utente

  useEffect(() => {
    fetchStories();
    fetchUserProfile();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase.from('stories').select('*').order('id');
    if (error) console.error(error);
    else setStories(data);
  };

  const fetchUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* HEADER DI BENVENUTO */}
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <Sparkles color="#FFC107" size={35} />
          Le Tue Storie
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Scegli un'avventura e inizia a sognare!</p>
      </div>

      {/* GRIGLIA STORIE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {stories.map((story) => {
          // CONTROLLO ACCESSO (Marketing Check)
          const isUnlocked = checkAccess(profile, 'story', story.id);

          return (
            <div key={story.id} style={{ position: 'relative' }}> 
              {/* Il Link è attivo solo se sbloccato, altrimenti porta ai genitori */}
              <Link to={isUnlocked ? `/story/${story.id}` : '/parents'} style={{ textDecoration: 'none' }}>
                <div className="clay-card story-card" style={{ 
                  height: '100%', 
                  background: story.cover_color || '#fff',
                  transition: 'transform 0.2s',
                  position: 'relative', // Necessario per il lucchetto
                  overflow: 'hidden'
                }}>
                  
                  {/* LUCCHETTO PREMIUM (Se necessario) */}
                  <PremiumLock isLocked={!isUnlocked} />

                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{story.image || '📖'}</div>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 10px 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {story.title}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.4' }}>
                    {story.description}
                  </p>
                  
                  <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '20px', color: '#fff', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    {isUnlocked ? <><BookOpen size={16} /> LEGGI ORA</> : <><Star size={16} /> SBLOCCA</>}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;