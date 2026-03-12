import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useProfile } from '../context/ProfileContext';

const BADGES = [
  { id: 'explorateur', icon: '🏅', label: 'Explorateur Mirokaï', desc: 'A visité les 11 étapes', color: '#a855f7' },
  { id: 'defieur',     icon: '⚡', label: 'Releveur de Défis',   desc: 'A répondu à tous les QCM', color: '#f59e0b' },
  { id: 'assembleur',  icon: '🔧', label: 'Assembleur de Miroki', desc: 'A reconstitué toutes les pièces', color: '#06b6d4' },
  { id: 'nimira',      icon: '🌌', label: 'Enfant de Nimira',    desc: 'A découvert l\'énergie Mirium', color: '#ec4899' },
];

export function RewardPage() {
  const navigate = useNavigate();
  const { reset } = useProgress();
  const { profile } = useProfile();
  const [revealed, setRevealed] = useState(0);

  /* Révèle les badges un par un */
  useEffect(() => {
    if (revealed < BADGES.length) {
      const t = setTimeout(() => setRevealed((r) => r + 1), 600);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  const name = profile.name || 'Explorateur';
  const isGroup = profile.mode === 'groupe' || profile.mode === 'famille';

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden relative text-white">

      {/* Halos décoratifs */}
      <div className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: '#a855f7', top: '-10%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="absolute w-52 h-52 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#06b6d4', bottom: '5%', left: '0%' }} />
      <div className="absolute w-52 h-52 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#ec4899', bottom: '5%', right: '0%' }} />

      <div className="relative z-10 flex flex-col items-center flex-1 px-6 pt-8 pb-6 gap-5 overflow-hidden">

        {/* Trophée + titre */}
        <div className="text-center shrink-0">
          <div className="text-6xl mb-3" style={{ animation: 'bounce 2s infinite' }}>🏆</div>
          <h1 className="text-2xl font-bold text-white">
            {isGroup ? `Bravo, équipe ${name} !` : `Bravo, ${name} !`}
          </h1>
          <p className="text-sm mt-1"
            style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
            Expérience Mirokaï complétée ✓
          </p>
        </div>

        {/* Message robot — mise en avant */}
        <div className="shrink-0 w-full max-w-xs rounded-2xl border-2 p-4 text-center"
          style={{ borderColor: '#a855f766', background: 'linear-gradient(135deg, #1a0a2e88, #0d0d1a88)', boxShadow: '0 0 30px #a855f733' }}>
          <div className="text-4xl mb-2">🤖</div>
          <p className="text-white font-bold text-sm mb-1">Miroki vous attend !</p>
          <p className="text-white/50 text-xs leading-relaxed">
            Vous avez reconstitué toutes ses pièces.{'\n'}
            Rendez-vous auprès du <span className="text-purple-400 font-semibold">vrai robot Mirokaï</span> pour le rencontrer en personne !
          </p>
        </div>

        {/* Badges gagnés */}
        <div className="w-full max-w-xs shrink-0">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3 text-center">
            🎖️ Badge{BADGES.length > 1 ? 's' : ''} gagné{BADGES.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((badge, i) => {
              const visible = i < revealed;
              return (
                <div key={badge.id}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-500"
                  style={{
                    borderColor: visible ? `${badge.color}55` : 'rgba(255,255,255,0.04)',
                    background: visible ? `${badge.color}15` : 'rgba(255,255,255,0.02)',
                    opacity: visible ? 1 : 0.25,
                    transform: visible ? 'scale(1)' : 'scale(0.9)',
                    boxShadow: visible ? `0 0 14px ${badge.color}33` : 'none',
                  }}>
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-white text-xs font-bold text-center leading-tight">{badge.label}</p>
                  <p className="text-white/30 text-center leading-tight" style={{ fontSize: 9 }}>{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-auto shrink-0">
          <button onClick={() => { reset(); navigate('/'); }}
            className="py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', boxShadow: '0 0 30px #a855f755' }}>
            Recommencer l'expérience
          </button>
          <button onClick={() => navigate('/experience')}
            className="py-3 rounded-2xl text-white/40 text-sm border border-white/10 hover:border-white/20 transition-all">
            Revoir le plan
          </button>
        </div>

      </div>
    </div>
  );
}
