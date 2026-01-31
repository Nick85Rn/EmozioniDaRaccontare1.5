import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Library, ArrowLeft, Star, Book } from 'lucide-react';
import PremiumLock from '../components/PremiumLock';

const EbookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      // Scarica dalla tabella 'books'
      const { data } = await supabase.from('books').select('*');
      setBooks(data || []);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const getCover = (book) => {
    return book.cover_url || book.image_url || book.image || null;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3E5F5', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/">
           <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={24} color="#7B1FA2" />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: '#7B1FA2', display: 'flex', alignItems: 'center', gap: '10px' }}>
          I Miei Racconti <Library size={32} />
        </h1>
      </div>

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {books.map((book) => {
             const imageSrc = getCover(book);
             const bgColor = book.cover_color || '#E1BEE7';

             return (
              <div key={book.id}>
                <Link to={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
                  <div className="clay-card" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '180px', background: bgColor, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {imageSrc ? (
                        <img src={imageSrc} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Library size={60} color="#fff" style={{ opacity: 0.7 }} />
                      )}
                      {book.is_premium && (
                        <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', gap: '5px' }}>
                          <Star size={12} fill="black" /> VIP
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '20px', flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{book.title}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{book.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EbookLibrary;