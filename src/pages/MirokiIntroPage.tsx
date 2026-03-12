import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const MESSAGES = [
  "Bonjour ! Je m'appelle Miroki, je viens de la planète Nimira ✨",
  "Mes 11 pièces essentielles ont été dispersées dans cette salle !",
  "J'ai besoin de TON aide pour les retrouver !",
  "Explore chaque zone, réponds aux défis et reconstitue-moi ! 🔧",
];

function useTypewriter(text: string, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayed;
}

export function MirokiIntroPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);
  const current = MESSAGES[msgIdx];
  const displayed = useTypewriter(current, 40);
  const isTyping = displayed.length < current.length;

  const next = () => {
    if (isTyping) return; // attend la fin de l'animation
    if (msgIdx < MESSAGES.length - 1) {
      setMsgIdx((i) => i + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-between overflow-hidden px-6 py-10 relative"
      onClick={next}
    >
      {/* Image de fond */}
      <img src="/miroki-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      {/* Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5, 3, 20, 0.55)' }} />

      {/* Header */}
      <div className="relative z-10 text-center w-full">
        {profile.name && (
          <div className="flex items-center justify-center gap-2">
            {profile.avatar?.startsWith('/avatar')
              ? <img src={profile.avatar} alt="" className="w-9 h-9 object-contain" />
              : <span className="text-2xl">{profile.avatar}</span>
            }
            <p className="text-white font-semibold text-base">{profile.name}</p>
          </div>
        )}
      </div>

      {/* Robot Miroki */}
      <div className="relative z-10 flex flex-col items-center gap-0 flex-1 justify-center">

        {/* Illustration Miroki */}
        <div className="relative flex items-center justify-center">
          <img
            src="/miroki-intro.png"
            alt="Miroki"
            className="relative z-10"
            style={{ width: 260, height: 260, objectFit: 'contain', filter: 'drop-shadow(0 0 24px #a855f766)' }}
          />
        </div>

        {/* Bulle de dialogue */}
        <div className="relative max-w-xs w-full">
          <div className="bg-[#111128] border border-purple-500/30 rounded-2xl rounded-tl-sm p-4 min-h-16 flex items-center"
            style={{ boxShadow: '0 0 20px #a855f722' }}>
            <p className="text-white text-sm leading-relaxed">
              {displayed}
              {isTyping && <span className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 animate-pulse align-middle" />}
            </p>
          </div>
          {/* Flèche bulle */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-[#111128] border-l border-t border-purple-500/30 rotate-45" />

          {/* Indicateur avancer */}
          {!isTyping && (
            <p className="text-center text-white/70 text-sm mt-3 font-medium animate-pulse">
              {msgIdx < MESSAGES.length - 1 ? 'Appuyez pour continuer…' : ''}
            </p>
          )}
        </div>

        {/* Compteur messages */}
        <div className="flex gap-1.5">
          {MESSAGES.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: i <= msgIdx ? '#a855f7' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>

      {/* Bouton final */}
      {done && (
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/accueil'); }}
          className="relative z-10 w-full max-w-xs py-4 font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 24px #a855f755', borderRadius: 9 }}
        >
          J'aide Miroki ! 🔧
        </button>
      )}
    </div>
  );
}
