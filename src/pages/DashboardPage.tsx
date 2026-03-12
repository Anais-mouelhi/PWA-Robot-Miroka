import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useProfile } from '../context/ProfileContext';
import { useModules } from '../hooks/useModules';
import { DEMO_MODULES } from '../data/demoModules';

const ALL_BADGES = [
  { id: 'explorateur', icon: '🏅', label: 'Explorateur Mirokaï',  desc: 'Visiter les 11 étapes',          color: '#a855f7', required: 11 },
  { id: 'defieur',     icon: '⚡', label: 'Releveur de Défis',    desc: 'Répondre à tous les QCM',        color: '#f59e0b', required: 11 },
  { id: 'assembleur',  icon: '🔧', label: 'Assembleur de Miroki', desc: 'Reconstituer toutes les pièces', color: '#06b6d4', required: 11 },
  { id: 'nimira',      icon: '🌌', label: 'Enfant de Nimira',     desc: 'Découvrir l\'énergie Mirium',    color: '#ec4899', required: 11 },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { validated } = useProgress();
  const { profile } = useProfile();
  const { modules } = useModules();
  const displayModules = modules.length > 0 ? modules : DEMO_MODULES;

  const done = validated.length;
  const total = displayModules.length;
  const points = done * 100;
  const remaining = total - done;
  const allDone = done === total;
  const earnedBadges = ALL_BADGES.filter((b) => done >= b.required);

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden text-white">

      {/* Header */}
      <header className="shrink-0 px-5 pt-6 pb-4 flex items-center gap-3 border-b border-white/5">
        <button onClick={() => navigate(-1)}
          className="text-white/40 hover:text-white text-sm transition-colors">
          ← Retour
        </button>
        <div className="flex-1">
          <p className="text-white font-bold">Tableau de bord</p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            {profile.avatar?.startsWith('/avatar')
              ? <img src={profile.avatar} alt="" className="w-4 h-4 object-contain" />
              : profile.avatar
            }
            {profile.name}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">

        {/* Score + progression */}
        <div className="shrink-0 grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 text-center">
            <p className="text-3xl font-bold text-white">{points}</p>
            <p className="text-purple-400 text-xs mt-1">Points</p>
          </div>
          <div className="p-4 rounded-2xl border border-green-500/20 bg-green-500/10 text-center">
            <p className="text-3xl font-bold text-white">{done}</p>
            <p className="text-green-400 text-xs mt-1">Validées</p>
          </div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-center">
            <p className="text-3xl font-bold text-white">{remaining}</p>
            <p className="text-white/40 text-xs mt-1">Restantes</p>
          </div>
        </div>

        {/* Barre progression */}
        <div className="shrink-0 p-4 rounded-2xl border border-white/10 bg-white/3">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Progression</span>
            <span>{Math.round((done / total) * 100)}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-700"
              style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <p className="text-white/20 text-xs mt-2 text-center">
            {done === total ? '🏆 Toutes les étapes validées !' : `Plus que ${remaining} étape${remaining > 1 ? 's' : ''} !`}
          </p>
        </div>

        {/* Badges */}
        <div className="shrink-0 p-4 rounded-2xl border border-white/10 bg-white/3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-xs uppercase tracking-widest">
              🎖️ Badges {earnedBadges.length > 0 ? `(${earnedBadges.length}/${ALL_BADGES.length})` : ''}
            </p>
            {!allDone && (
              <p className="text-white/20 text-xs">
                Complète les {total} étapes pour les débloquer
              </p>
            )}
          </div>

          {done === 0 ? (
            /* Aucune pièce trouvée */
            <div className="flex flex-col items-center gap-2 py-3">
              <span className="text-3xl opacity-20">🔒</span>
              <p className="text-white/20 text-xs text-center">
                Trouve ta première pièce pour commencer à gagner des badges !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {ALL_BADGES.map((badge) => {
                const earned = done >= badge.required;
                return (
                  <div key={badge.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border transition-all"
                    style={{
                      borderColor: earned ? `${badge.color}44` : 'rgba(255,255,255,0.05)',
                      background:  earned ? `${badge.color}12`  : 'rgba(255,255,255,0.02)',
                      opacity: earned ? 1 : 0.35,
                    }}>
                    <span className="text-xl shrink-0" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>
                      {earned ? badge.icon : '🔒'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate leading-tight">
                        {badge.label}
                      </p>
                      <p className="text-white/30 leading-tight truncate" style={{ fontSize: 9 }}>
                        {earned ? badge.desc : `${total - done} étape${total - done > 1 ? 's' : ''} restante${total - done > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Objectifs */}
        <div className="shrink-0 p-4 rounded-2xl border border-white/10 bg-white/3">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Objectifs</p>
          <div className="space-y-2">
            {[
              { label: 'Trouver toutes les pièces de Miroki', target: total, current: done, color: '#a855f7' },
              { label: 'Obtenir 500 points', target: 5, current: Math.min(done, 5), color: '#f59e0b' },
              { label: 'Compléter l\'expérience', target: 1, current: done === total ? 1 : 0, color: '#22c55e' },
            ].map((obj) => (
              <div key={obj.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-white/70 text-xs">{obj.label}</p>
                  <div className="h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${(obj.current / obj.target) * 100}%`, backgroundColor: obj.color }} />
                  </div>
                </div>
                <span className="text-xs shrink-0" style={{ color: obj.color }}>
                  {obj.current}/{obj.target}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Liste étapes */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 shrink-0">Étapes</p>
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {displayModules.map((mod) => {
              const isValidated = validated.includes(mod.id);
              return (
                <button key={mod.id}
                  onClick={() => navigate(`/module/${mod.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left"
                  style={{
                    borderColor: isValidated ? `${mod.color}44` : 'rgba(255,255,255,0.05)',
                    background: isValidated ? `${mod.color}11` : 'rgba(255,255,255,0.02)',
                  }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0"
                    style={{
                      backgroundColor: isValidated ? mod.color : 'transparent',
                      borderColor: isValidated ? mod.color : 'rgba(255,255,255,0.15)',
                      color: isValidated ? 'white' : 'rgba(255,255,255,0.3)',
                    }}>
                    {isValidated ? '✓' : mod.number}
                  </span>
                  <span className={`text-sm flex-1 truncate ${isValidated ? 'text-white' : 'text-white/30'}`}>
                    {mod.name}
                  </span>
                  {isValidated
                    ? <span className="text-yellow-400 text-xs shrink-0">+100 pts</span>
                    : <span className="text-white/20 text-xs shrink-0">→</span>
                  }
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
