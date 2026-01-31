import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, ArrowLeft, Star, Library, ImageOff } from 'lucide-react';
import PremiumLock from '../components/PremiumLock';

const StoriesHub = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Distingue se siamo su /books o /stories
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
      // Scarica tutto (*) per essere sicuri di avere il campo 'pages' o 'content'
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNZIONE CRUCIALE: Recupera l'immagine ovunque essa sia (anche dentro le pagine!)
  const getCoverImage = (item) => {
    // 1. Cerca nella radice (nuovo metodo)
    if (item.image_url) return item.image_url;
    if (item.cover_url) return item.cover_url;
    if (item.image) return item.image;
    
    // 2. Cerca dentro le pagine (VECCHIO METODO - Fondamentale per le tue storie)
    if (item.pages && Array.isArray(item.pages) && item.pages.length > 0) {
      const firstPage = item.pages[0];
      if (firstPage.image_url) return firstPage.image_url;
      if (firstPage.image) return firstPage.image;
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: isBooksSection ? '#F3E5F5' : '#FFF3E0', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
           <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <ArrowLeft size={24} color="#333" />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: isBooksSection ? '#7B1FA2' : '#E65100', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {pageTitle} {isBooksSection ? <Library size={32} /> : <BookOpen size={32} />}
        </h1>
      </div>

      {/* Griglia Solida */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {items.map((item) => {
            const imageSrc = getCoverImage(item);
            const isPremium = item.is_premium || item.premium;

            return (
              <div key={item.id} style={{ height: '100%' }}>
                {isPremium ? (
                  <PremiumLock>
                    <Link to={`${detailRoute}/${item.id}`} style={{ textDecoration: 'none' }}>
                      <HubCard item={item} imageSrc={imageSrc} isBook={isBooksSection} isPremium={true} />
                    </Link>
                  </PremiumLock>
                ) : (
                  <Link to={`${detailRoute}/${item.id}`} style={{ textDecoration: 'none' }}>
                    <HubCard item={item} imageSrc={imageSrc} isBook={isBooksSection} isPremium={false} />
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

// Card Grafica Ripristinata
const HubCard = ({ item, imageSrc, isBook, isPremium }) => (
  <div className="clay-card" style={{ 
    background: '#fff', 
    borderRadius: '20px', 
    overflow: 'hidden', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.02)'
  }}>
    <div style={{ height: '200px', background: isBook ? '#E1BEE7' : '#FFE0B2', position: 'relative' }}>
      {imageSrc ? (
        <img src={imageSrc} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isBook ? <Library size={60} color="#fff" /> : <BookOpen size={60} color="#fff" />}
        </div>
      )}
      {isPremium && (
        <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: '#000' }}>
          <Star size={12} fill="black" /> VIP
        </div>
      )}
    </div>
    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>{item.title}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.5', flex: 1 }}>
        {item.description || "Tocca per leggere..."}
      </p>
    </div>
  </div>
);

export default StoriesHub;