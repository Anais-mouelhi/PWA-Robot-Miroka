import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { useModules } from '../../hooks/useModules';
import { DEMO_MODULES } from '../../data/demoModules';

export function ScoreBadge() {
  const navigate = useNavigate();
  const { validated } = useProgress();
  const { modules } = useModules();
  const displayModules = modules.length > 0 ? modules : DEMO_MODULES;
  const [open, setOpen] = useState(false);

  const total = displayModules.length;
  const done = validated.length;
  const points = done * 100;

  return (
    <>
      {/* Bouton badge */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all"
        style={{
          borderColor: done > 0 ? '#a855f766' : 'rgba(255,255,255,0.1)',
          background: done > 0 ? '#a855f711' : 'rgba(255,255,255,0.03)',
        }}
      >
        <span className="text-base">⭐</span>
        <span className="text-white font-bold text-sm">{points}</span>
        {done > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
            {done}
          </span>
        )}
      </button>

      {/* Popup détail */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed top-16 right-4 z-50 w-64 bg-[#0d0d1a] border border-white/10 rounded-2xl p-4 shadow-2xl">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Mes points</h3>
              <div className="flex gap-2">
                <button onClick={() => { setOpen(false); navigate('/dashboard'); }}
                  className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
                  Tout voir →
                </button>
                <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white text-sm">✕</button>
              </div>
            </div>

            {/* Score total */}
            <div className="text-center py-3 mb-4 rounded-xl border border-purple-500/20 bg-purple-500/10">
              <p className="text-3xl font-bold text-white">{points}</p>
              <p className="text-purple-400 text-xs uppercase tracking-widest mt-1">points</p>
            </div>

            {/* Progression */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{done} étapes validées</span>
                <span>{total - done} restantes</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Liste des étapes */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {displayModules.map((mod) => {
                const isValidated = validated.includes(mod.id);
                return (
                  <div key={mod.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg"
                    style={{ background: isValidated ? `${mod.color}11` : 'transparent' }}>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0"
                      style={{
                        backgroundColor: isValidated ? mod.color : 'transparent',
                        borderColor: isValidated ? mod.color : 'rgba(255,255,255,0.1)',
                        color: isValidated ? 'white' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {isValidated ? '✓' : mod.number}
                    </span>
                    <span className={`text-xs flex-1 truncate ${isValidated ? 'text-white' : 'text-white/30'}`}>
                      {mod.name}
                    </span>
                    {isValidated && <span className="text-yellow-400 text-xs shrink-0">+100</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
