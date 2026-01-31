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
      const { data } = await supabase.from('books').select('*');
      setBooks(data || []);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F3E5F5', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/">
           <div className="clay-btn" style={{ borderRadius: '50%', width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <ArrowLeft size={24} color="#7B1FA2" />
          </div>
        </Link>
        <h1 style={{ margin: 0, color: '#7B1FA2', display: 'flex', alignItems: 'center', gap: '10px' }}>
          I Miei Ebook <Library size={32} />
        </h1>
      </div>

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {books.map((book) => {
             // Cerca immagine copertina
             const imageSrc = book.cover_url || book.image_url || book.image;
             const bgColor = book.cover_color || '#E1BEE7';

             return (
              <div key={book.id}>
                {book.is_premium ? (
                  <PremiumLock>
                    <Link to={`/ebook/${book.id}`} style={{ textDecoration: 'none' }}>
                      <BookCard book={book} image={imageSrc} color={bgColor} />
                    </Link>
                  </PremiumLock>
                ) : (
                  <Link to={`/ebook/${book.id}`} style={{ textDecoration: 'none' }}>
                    <BookCard book={book} image={imageSrc} color={bgColor} />
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

const BookCard = ({ book, image, color }) => (
  <div className="clay-card" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ height: '180px', background: color, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      {image ? (
          <img src={image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
          <Book size={60} color="#fff" style={{ opacity: 0.7 }} />
      )}
      
      {book.is_premium && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#FFD700', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', gap: '5px' }}>
            <Star size={12} fill="black" /> VIP
          </div>
      )}
    </div>
    <div style={{ padding: '20px', flex: 1 }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{book.title}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{book.description || "Un racconto speciale."}</p>
    </div>
  </div>
);

export default EbookLibrary;