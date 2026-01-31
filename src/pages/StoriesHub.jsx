import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, ArrowLeft, Star, Library, Image as ImageIcon } from 'lucide-react';
import PremiumLock from '../components/PremiumLock';

const StoriesHub = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Capisce se siamo nella sezione LIBRI (/books) o STORIE (/stories)
  const isBooksSection = location.pathname.includes('books');
  const tableName = isBooksSection ? 'books' : 'stories'; 
  const pageTitle = isBooksSection ? 'I Miei Racconti' : 'Libreria Magica';
  const detailRoute = isBooksSection ? '/book' : '/story';

  useEffect(() => {
    fetchContent();
  }, [location.pathname]); 

  const fetchContent = async () => {
    setLoading(true);
    try {
      // SCARICA TUTTO (*)
      const { data, error } = await supabase
        .from(tableName)
        .select('*'); 

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error(`Errore caricamento ${tableName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: isBooksSection ? '#F3E5F5' : '#FFF3E0', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: isBooksSection ? '#7B1FA2' : '#E65100' }}>
          <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <ArrowLeft size={24} />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: isBooksSection ? '#7B1FA2' : '#E65100', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {pageTitle} {isBooksSection ? <Library size={32} /> : <BookOpen size={32} />}
        </h1>
      </div>

      {/* GRIGLIA */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ position: 'relative' }}>
              {(item.is_premium || item.premium) ? (
                <PremiumLock>
                  <Link to={`${detailRoute}/${item.id}`} style={{ textDecoration: 'none' }}>
                    <Card item={item} isBook={isBooksSection} />
                  </Link>
                </PremiumLock>
              ) : (
                <Link to={`${detailRoute}/${item.id}`} style={{ textDecoration: 'none' }}>
                  <Card item={item} isBook={isBooksSection} />
                </Link>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
              <h3>Nessun contenuto trovato. 📭</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- CARD CON LOGICA IMMAGINI AVANZATA ---
const Card = ({ item, isBook }) => {
  
  // 1. COLORE: Usa quello del DB o un default
  const coverColor = item.cover_color || (isBook ? '#E1BEE7' : '#FFE0B2');

  // 2. RECUPERO IMMAGINE (LOGICA STORICA CORRETTA)
  let imageSrc = null;

  // A. Controlla le colonne dirette
  if (item.image_url) imageSrc = item.image_url;
  else if (item.cover_url) imageSrc = item.cover_url;
  else if (item.image) imageSrc = item.image;

  // B. SE NON TROVATA: Controlla dentro la prima pagina (JSON)
  // Questo è cruciale per le tue Storie create in passato!
  if (!imageSrc && item.pages && Array.isArray(item.pages) && item.pages.length > 0) {
    const firstPage = item.pages[0];
    if (firstPage.image_url) imageSrc = firstPage.image_url;
    else if (firstPage.image) imageSrc = firstPage.image;
  }

  return (
    <div className="clay-card" style={{ 
      background: '#fff', 
      borderRadius: '20px', 
      overflow: 'hidden', 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.05)',
      transition: 'transform 0.2s'
    }}>
      {/* COPERTINA */}
      <div style={{ 
        height: '180px', 
        background: coverColor, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden' 
      }}>
        
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={item.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        ) : (
          // Icona Fallback
          isBook ? <Library size={60} color="#fff" style={{opacity:0.6}} /> : <BookOpen size={60} color="#fff" style={{opacity:0.6}} />
        )}

        {/* Badge VIP */}
        {(item.is_premium || item.premium) && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: '#000', zIndex: 2 }}>
            <Star size={12} fill="black" /> VIP
          </div>
        )}
      </div>

      {/* INFO TESTO */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>{item.title || "Senza Titolo"}</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.4', flex: 1 }}>
          {item.description || "Tocca per iniziare..."}
        </p>
      </div>
    </div>
  );
};

export default StoriesHub;