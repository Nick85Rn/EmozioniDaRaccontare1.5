import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Importiamo Supabase
import { checkAccess } from '../config/subscription'; // Importiamo le regole
import PremiumLock from '../components/PremiumLock'; // Importiamo il lucchetto
import { ArrowLeft, Smile, Brain, Wind, Anchor, User, Grid3X3, Languages, Trophy } from 'lucide-react';

const GamesHub = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Carichiamo il profilo per sapere se è PREMIUM
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(data);
      }
    };
    loadProfile();
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '80px' }}>
      
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/"><button className="clay-btn" style={{ padding: '10px', borderRadius: '50%', width: '50px', height: '50px', display:'flex', alignItems:'center', justifyContent:'center' }}><ArrowLeft size={24} /></button></Link>
          <div style={{ marginLeft: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>Sala Giochi 🎮</h1>
            <p style={{ margin: 0, color: '#666' }}>Impara divertendoti</p>
          </div>
        </div>
        
        {/* Badge Status */}
        {profile?.is_premium && (
          <div className="clay-card" style={{ padding: '8px 15px', borderRadius: '30px', background: '#FFF3E0', color: '#EF6C00', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={16} /> VIP CLUB ATTIVO
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px', width: '100%', maxWidth: '1000px' }}>
        
        {/* GRATIS: Puzzle, Memory, Forza 4 */}
        <GameCard to="/puzzle" title="Puzzle" subtitle="Metti in ordine" color="#1565C0" Icon={Grid3X3} profile={profile} />
        <GameCard to="/memory" title="Memory" subtitle="Allena la mente" color="#3F51B5" Icon={Brain} profile={profile} />
        <GameCard to="/connect4" title="Forza 4" subtitle="Sfida un amico" color="#E53935" Icon={User} profile={profile} />
        <GameCard to="/battleship" title="Battaglia" subtitle="Affonda le navi" color="#0288D1" Icon={Anchor} profile={profile} />

        {/* PREMIUM: FaceLab, Respiro, Inglese (Le "Killer Features") */}
        <GameCard to="/facelab" title="FaceLab" subtitle="Facce buffe" color="#FF9800" Icon={Smile} profile={profile} />
        <GameCard to="/breathing" title="Respiro" subtitle="Rilassati ora" color="#009688" Icon={Wind} profile={profile} />
        <GameCard to="/english" title="Inglese" subtitle="Impara parole" color="#8E24AA" Icon={Languages} profile={profile} />
        
      </div>
    </div>
  );
};

const GameCard = ({ to, title, subtitle, color, Icon, profile }) => {
  // Verifichiamo se l'utente può accedere a QUESTO specifico gioco
  const isUnlocked = checkAccess(profile, 'game', to);

  return (
    <div style={{ position: 'relative' }}>
      {/* Se bloccato, il link porta all'Area Genitori per l'acquisto */}
      <Link to={isUnlocked ? to : '/parents'} style={{ textDecoration: 'none' }}>
        <motion.div 
          whileHover={{ scale: 1.05, translateY: -5 }} 
          whileTap={{ scale: 0.95 }} 
          className="clay-card" 
          style={{ 
            background: `${color}15`, 
            height: '200px', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center', 
            padding: '20px', 
            border: `2px solid ${color}30`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* IL LUCCHETTO */}
          <PremiumLock isLocked={!isUnlocked} />

          <div style={{ background: '#fff', padding: '15px', borderRadius: '50%', marginBottom: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Icon size={45} color={color} />
          </div>
          <h3 style={{ margin: 0, color: color, fontSize: '1.2rem' }}>{title}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>{subtitle}</p>
        </motion.div>
      </Link>
    </div>
  );
};

export default GamesHub;