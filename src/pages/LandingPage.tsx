import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="h-screen bg-[#0A0A14] flex flex-col items-center justify-center overflow-hidden relative">

      <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#a855f7', top: '5%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#06b6d4', bottom: '15%', left: '10%' }} />
      <div className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#ec4899', bottom: '15%', right: '10%' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Avatar + nom */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full border-2 border-purple-500/50 flex items-center justify-center overflow-hidden"
            style={{ boxShadow: '0 0 40px #a855f744' }}>
            {profile.avatar?.startsWith('/avatar')
              ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-contain p-1" />
              : <span className="text-4xl">{profile.avatar || '🤖'}</span>
            }
          </div>
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping pointer-events-none" />
          {profile.name && (
            <p className="text-white/60 text-sm font-medium">
              {profile.mode === 'groupe' || profile.mode === 'famille' ? 'Groupe' : 'Bonjour'}{' '}
              <span className="text-white font-bold">{profile.name}</span> !
            </p>
          )}
        </div>

        <p className="text-purple-400 text-xs uppercase tracking-widest mb-2">Enchanted Tools · Paris</p>
        <h1 className="text-4xl font-bold text-white mb-1">Mirokaï</h1>
        <h2 className="text-4xl font-bold mb-4"
          style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Experience
        </h2>

        <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-10">
          Explorez 11 étapes immersives et découvrez l'univers des robots Mirokaï
        </p>

        <button
          onClick={() => navigate('/experience')}
          className="px-10 py-5 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 30px #a855f766' }}>
          Commencer l'Expérience →
        </button>

        <p className="mt-5 text-white/20 text-xs">11 étapes · Défis · Récompense</p>
      </div>
    </div>
  );
}
