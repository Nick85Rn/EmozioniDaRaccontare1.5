import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, ArrowLeft, Star, Library, ImageOff } from 'lucide-react';
import PremiumLock from '../components/PremiumLock';

const StoriesHub = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Capisce se siamo nella sezione LIBRI o STORIE
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
      // Scarica TUTTO (*) per non perdere nessuna colonna
      const { data, error } = await supabase
        .from(tableName)
        .select('*'); 

      if (error) throw error;
      console.log(`Dati caricati da ${tableName}:`, data); // Debug in console
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

      {/* CARICAMENTO */}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Caricamento in corso... ✨</div>}

      {/* GRIGLIA ELEMENTI */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ position: 'relative' }}>
              
              {/* Controlla se è Premium (cerca diverse varianti del nome colonna) */}
              {(item.is_premium || item.premium || item.vip) ? (
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
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '20px', color: '#888' }}>
              <h3>Nessun contenuto trovato. 📭</h3>
              <p>Controlla la tabella <strong>{tableName}</strong> su Supabase.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE CARD CON "DETECTIVE IMMAGINI" ---
const Card = ({ item, isBook }) => {
  
  // FUNZIONE DETECTIVE: Cerca l'immagine in qualsiasi colonna possibile
  const getSmartImage = (obj) => {
    if (!obj) return null;
    return obj.image_url ||  // Standard
           obj.cover_url ||  // Comune per i libri
           obj.image ||      // Generico
           obj.img ||        // Abbreviazione
           obj.copertina ||  // Italiano
           obj.cover ||      // Inglese
           obj.src ||        // HTML style
           null;
  };

  const imageSrc = getSmartImage(item);
  const isPremium = item.is_premium || item.premium || item.vip;

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
      {/* Immagine o Icona Fallback */}
      <div style={{ height: '180px', background: isBook ? '#E1BEE7' : '#FFE0B2', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={item.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.style.display = 'none'; }} // Se l'URL è rotto, nascondi l'immagine
          />
        ) : (
          // Fallback se non c'è proprio nessuna immagine
          isBook ? <Library size={60} color="#fff" /> : <BookOpen size={60} color="#fff" />
        )}

        {/* Se l'immagine c'era ma si è rotta (gestito da onError sopra), mostra icona */}
        {!imageSrc && <div style={{position:'absolute', opacity:0.3}}><ImageOff size={40}/></div>}
        
        {/* Badge VIP */}
        {isPremium && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: '#000', zIndex: 2 }}>
            <Star size={12} fill="black" /> VIP
          </div>
        )}
      </div>

      {/* Testo */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>{item.title || "Senza Titolo"}</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.4', flex: 1 }}>
          {item.description || "Tocca per leggere..."}
        </p>
        <div style={{ marginTop: '15px', color: isBook ? '#7B1FA2' : '#E65100', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          Leggi ora <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
        </div>
      </div>
    </div>
  );
};

export default StoriesHub;