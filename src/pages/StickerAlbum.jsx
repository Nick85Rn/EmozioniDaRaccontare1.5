import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Lock, Star, Loader2 } from 'lucide-react';

const StickerAlbum = () => {
  const [stickers, setStickers] = useState([]);
  const [myStickers, setMyStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Scarica tutte le figurine possibili
      const { data: allStickers } = await supabase.from('stickers').select('*').order('id');
      
      // 2. Scarica quelle dell'utente
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: unlocked } = await supabase
          .from('user_stickers')
          .select('sticker_id')
          .eq('user_id', session.user.id);
        
        // Crea un array semplice di ID posseduti: [1, 3, 5]
        setMyStickers(unlocked ? unlocked.map(u => u.sticker_id) : []);
      }
      
      setStickers(allStickers || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin" size={40}/></div>;

  // Calcolo progresso
  const progress = Math.round((myStickers.length / stickers.length) * 100) || 0;

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/">
          <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ArrowLeft size={24}/>
          </button>
        </Link>
        <div style={{ marginLeft: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Il Mio Album 📒</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Completato: {progress}%</p>
        </div>
      </div>

      {/* Barra Progresso */}
      <div style={{ width: '100%', maxWidth: '800px', height: '10px', background: '#ddd', borderRadius: '5px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#69F0AE', transition: 'width 0.5s' }}></div>
      </div>

      {/* Griglia Figurine */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '800px' 
      }}>
        {stickers.map((sticker) => {
          const isUnlocked = myStickers.includes(sticker.id);
          
          return (
            <div key={sticker.id} className="clay-card" style={{ 
              opacity: isUnlocked ? 1 : 0.5,
              background: isUnlocked ? sticker.bg_color : '#eeeeee',
              filter: isUnlocked ? 'none' : 'grayscale(100%)',
              height: '160px',
              padding: '10px',
              position: 'relative',
              border: isUnlocked ? '2px solid white' : '1px dashed #999'
            }}>
              
              <div style={{ fontSize: '3.5rem', marginBottom: '10px', filter: isUnlocked ? 'drop-shadow(0 5px 5px rgba(0,0,0,0.2))' : 'none' }}>
                {isUnlocked ? sticker.image_emoji : '❓'}
              </div>
              
              <h3 style={{ margin: '0', fontSize: '0.85rem', textAlign: 'center', lineHeight: '1.2' }}>
                {isUnlocked ? sticker.name : '???'}
              </h3>
              
              {!isUnlocked && (
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Lock size={16} color="#666" />
                </div>
              )}
              
              {isUnlocked && sticker.rarity === 'leggendaria' && (
                <div style={{ position: 'absolute', top: -10, right: -10, background: '#FFD700', borderRadius: '50%', padding: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                  <Star size={14} color="white" fill="white" />
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StickerAlbum;