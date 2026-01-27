import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Lock } from 'lucide-react';

const EbookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('it'); 
  const [isPremiumUser, setIsPremiumUser] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      const { data: booksData } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: true });
      if (booksData) setBooks(booksData);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        if (profile) setIsPremiumUser(profile.is_premium);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter(book => (book.language || 'it') === currentLang);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={50} color="#673AB7" />
    </div>
  );

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER + TOGGLE BANDIERINE */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div style={{ marginLeft: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>Racconti 📖</h1>
            <p style={{ margin: 0, color: '#666' }}>Ebook illustrati</p>
          </div>
        </div>

        <div className="clay-card" style={{ padding: '5px', borderRadius: '50px', flexDirection: 'row', gap: '5px', background: '#eeeeee' }}>
          
          <button 
            onClick={() => setCurrentLang('it')}
            style={{
              background: currentLang === 'it' ? '#fff' : 'transparent',
              padding: '8px 20px', borderRadius: '40px', border: 'none',
              fontWeight: 'bold', color: currentLang === 'it' ? '#333' : '#777',
              boxShadow: currentLang === 'it' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <img src="https://flagcdn.com/w40/it.png" width="20" alt="IT" style={{borderRadius:'4px'}} />
            Italiano
          </button>

          <button 
            onClick={() => setCurrentLang('en')}
            style={{
              background: currentLang === 'en' ? '#fff' : 'transparent',
              padding: '8px 20px', borderRadius: '40px', border: 'none',
              fontWeight: 'bold', color: currentLang === 'en' ? '#333' : '#777',
              boxShadow: currentLang === 'en' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <img src="https://flagcdn.com/w40/gb.png" width="20" alt="EN" style={{borderRadius:'4px'}} />
            English
          </button>
        </div>
      </div>

      {/* GRIGLIA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', width: '100%', maxWidth: '1000px' }}>
        
        {filteredBooks.length === 0 && <div style={{width:'100%', textAlign:'center'}}>Nessun libro.</div>}

        {filteredBooks.map((book) => {
          const isLocked = book.is_premium && !isPremiumUser;

          return (
            <Link to={`/ebook/${book.id}`} key={book.id} style={{ textDecoration: 'none' }}>
              <motion.div 
                whileHover={{ scale: 1.02, translateY: -5 }}
                whileTap={{ scale: 0.98 }}
                className="clay-card"
                style={{ 
                  background: book.cover_color || '#fff', 
                  height: '320px', 
                  display: 'flex', flexDirection: 'column', 
                  alignItems: 'center', textAlign: 'center', 
                  padding: '20px',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05), 10px 10px 20px rgba(166, 171, 189, 0.5)'
                }}
              >
                
                {/* 1. ETÀ */}
                <div style={{ 
                  alignSelf: 'flex-end', 
                  background: '#fff', color: '#333', 
                  padding: '6px 12px', borderRadius: '20px', 
                  fontSize: '0.8rem', fontWeight: '800',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                  marginBottom: '10px',
                  zIndex: 10
                }}>
                  {book.age_target || 'Per tutti'}
                </div>

                {/* 2. CONTENUTO CENTRALE */}
                <div style={{ 
                  flexGrow: 1, 
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  width: '100%', zIndex: 1
                }}>
                  {/* Immagine */}
                  <div style={{ 
                    fontSize: '5rem', 
                    marginBottom: '10px', 
                    filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))',
                    transition: 'transform 0.3s' 
                  }}>
                    {book.pages?.[0]?.image || '📚'}
                  </div>
                  
                  {/* Titolo */}
                  <h3 style={{ 
                    margin: '0', 
                    color: '#fff', 
                    fontSize: '1.4rem', 
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)', 
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    maxWidth: '100%'
                  }}>
                    {book.language === 'en' && (
                       <img src="https://flagcdn.com/w40/gb.png" width="20" alt="EN" style={{marginRight:'5px', verticalAlign:'middle', borderRadius:'3px'}} />
                    )}
                    {book.title}
                  </h3>
                </div>
                
                {/* 3. BOTTONE UNICO */}
                <div style={{ marginTop: 'auto', width: '100%', paddingTop: '15px', zIndex: 2 }}>
                  <button className="clay-btn" style={{ 
                    fontSize: '1rem', padding: '12px 15px', 
                    background: '#ffffff', 
                    color: isLocked ? '#E53935' : '#333',
                    width: '100%', justifyContent: 'center', fontWeight: 'bold',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {isLocked ? (
                      <>🔒 Sblocca</>
                    ) : (
                      <>📖 Leggi <span style={{opacity:0.4, margin:'0 8px'}}>•</span> <span style={{color: '#555'}}>{book.emotion}</span></>
                    )}
                  </button>
                </div>

              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EbookLibrary;