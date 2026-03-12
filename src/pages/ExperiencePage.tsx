import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModules } from '../hooks/useModules';
import { DEMO_MODULES } from '../data/demoModules';
import { useProgress } from '../context/ProgressContext';
import type { Module } from '../types';

/* Positions par défaut le long du chemin (utilisées si aucune position Firestore) */
const PATH_POSITIONS: [number, number][] = [
  [85, 83], [65, 76], [48, 69], [28, 63], [8, 83],
  [5, 63], [10, 53], [32, 47], [14, 41], [20, 33], [55, 27],
];

function ModuleNode({
  mod, isValidated, onClick,
}: { mod: Module; isValidated: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 flex flex-col items-center gap-1"
    >
      {/* Halo pulsant si non validé */}
      {!isValidated && (
        <span
          className="absolute rounded-full animate-ping opacity-20 pointer-events-none"
          style={{ width: 44, height: 44, backgroundColor: mod.color }}
        />
      )}

      {/* Cercle principal */}
      <span
        className="relative flex items-center justify-center rounded-full font-bold text-white
                   transition-all duration-200 group-hover:scale-115 active:scale-95"
        style={{
          width: 40, height: 40,
          backgroundColor: isValidated ? mod.color : `${mod.color}22`,
          border: `2px solid ${mod.color}`,
          boxShadow: isValidated
            ? `0 0 18px ${mod.color}, 0 0 40px ${mod.color}55`
            : `0 0 10px ${mod.color}44`,
          fontSize: 14,
        }}
      >
        {isValidated ? '✓' : mod.number}
      </span>

      {/* Label */}
      <span
        className="text-center leading-tight text-white/60 group-hover:text-white transition-colors"
        style={{ fontSize: 9, maxWidth: 58, lineHeight: '1.2' }}
      >
        {mod.name}
      </span>
    </button>
  );
}

function ModuleModal({ mod, onClose, onPlay, onScan }: {
  mod: Module;
  onClose: () => void;
  onPlay: () => void;
  onScan: () => void;
}) {
  const challengeCount = mod.challenge ? 1 : 0;
  const isScanModule = mod.number === 2;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />

      {/* Carte */}
      <div
        className="fixed z-50 left-4 right-4 bottom-6 rounded-2xl overflow-hidden text-white"
        style={{
          background: 'rgba(30, 24, 50, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-bold text-xl">Souvenir N°{mod.number}</h2>
            <p className="text-white/50 text-sm mt-0.5">{mod.description || 'Texte explicatif'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0 ml-3"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >✕</button>
        </div>

        {/* Étape 1 — Voir la vidéo */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span className="font-semibold text-base">Voir la vidéo</span>
          </div>
          <div
            className="relative rounded-xl overflow-hidden flex items-center justify-center"
            style={{ height: 160, background: '#1a1a22' }}
          >
            {mod.mediaUrl && mod.mediaType === 'video'
              ? <video src={mod.mediaUrl} className="w-full h-full object-cover" />
              : <img src="/module-video-thumb.png" alt="" className="w-full h-full object-cover" />
            }
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl ml-1">▶</span>
              </div>
            </div>
          </div>
        </div>

        {/* Étape 2 — Scanner ou Jouer */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span className="font-semibold text-base">{isScanModule ? 'Scanner' : 'Jouer'}</span>
          </div>

          {isScanModule ? (
            /* Carte scanner */
            <button
              onClick={onScan}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all active:scale-98"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 4px 20px #f9731655' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-2xl">📷</span>
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-base">Scanne la pièce</p>
                <p className="text-white/80 text-sm">Trouve la pièce manquante !</p>
                <div className="flex gap-2 mt-2">
                  {['💡 Indices', '⭐ Points'].map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ) : (
            /* Carte jeu */
            <button
              onClick={onPlay}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all active:scale-98"
              style={{ background: '#7C4DFF', boxShadow: '0 4px 20px #7C4DFF55' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-2xl">🎮</span>
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-base">Jouer au jeu</p>
                <p className="text-white/70 text-sm">{challengeCount} question · {challengeCount * 200} points</p>
                <div className="flex gap-2 mt-2">
                  {['⏱ Timer', '💡 Indices', '⭐ Points'].map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function ExperiencePage() {
  const navigate = useNavigate();
  const { modules } = useModules();
  const displayModules = (modules.length > 0 ? modules : DEMO_MODULES)
    .slice().sort((a, b) => a.number - b.number);
  const { validated } = useProgress();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const done = displayModules.filter((m) => validated.includes(m.id)).length;
  const total = displayModules.length;
  const points = done * 100;

  return (
    <div className="h-dvh text-white flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: 'url(/experience-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: '30% center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0A0A14',
      }}>
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'rgba(5,3,20,0.10)' }} />

      {/* Header flottant par-dessus la carte — ne décale pas les modules */}
      <header className="absolute top-0 left-0 right-0 z-40 flex flex-col items-center pt-12 pb-4 px-5 gap-3 pointer-events-none">
        <h1 className="text-white font-extrabold uppercase tracking-widest"
          style={{ fontSize: 22, letterSpacing: '0.15em', textShadow: '0 2px 16px rgba(0,0,0,1)' }}>
          LES MINIMOYS
        </h1>
        <div className="flex items-start gap-12 pointer-events-auto">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 transition-transform active:scale-95">
            <span className="font-extrabold text-white text-xl px-7 py-2"
              style={{ background: '#F3AD35', boxShadow: '0 4px 16px #F3AD3566', minWidth: 80, textAlign: 'center', borderRadius: 9 }}>
              {done}/{total}
            </span>
            <span className="text-white/80 text-lg font-semibold" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>Souvenirs</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 transition-transform active:scale-95">
            <span className="font-extrabold text-white text-xl px-7 py-2 flex items-center gap-1.5"
              style={{ background: '#F3AD35', boxShadow: '0 4px 16px #F3AD3566', minWidth: 104, justifyContent: 'center', borderRadius: 9 }}>
              <span>⭐</span> {points} pts
            </span>
            <span className="text-white/80 text-lg font-semibold" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>Score</span>
          </button>
        </div>
      </header>

      {/* Carte chemin — plein écran */}
      <main className="absolute inset-0 z-10 overflow-hidden">

        {/* Robot + bulle */}
        {(() => {
          let rx = 50, ry = 55;
          try {
            const saved = localStorage.getItem('miroki-robot-position');
            if (saved) { const p = JSON.parse(saved); rx = p.x; ry = p.y; }
          } catch { /* ignore */ }
          return (
            <>
              {/* Bulle */}
              <div className="absolute z-25 pointer-events-none"
                style={{ left: `${rx}%`, top: `${ry}%`, transform: 'translate(32px, -120%)' }}>
                <div className="text-white font-semibold text-center leading-snug px-4 py-3"
                  style={{ fontSize: 14, border: '1.5px solid rgba(255,255,255,0.6)', background: 'rgba(10,6,30,0.55)', backdropFilter: 'blur(4px)', borderRadius: 4, whiteSpace: 'nowrap' }}>
                  Alors, on arrive ?<br />Je vous attends !!
                </div>
              </div>
              {/* Robot */}
              <img src="/robot-plan.svg" alt="Miroki" className="absolute z-20 pointer-events-none"
                style={{ width: 80, left: `${rx}%`, top: `${ry}%`, transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 0 18px #a855f799)' }} />
            </>
          );
        })()}

        {/* Modules positionnés — position Firestore (admin) en priorité, PATH_POSITIONS en fallback */}
        {displayModules.map((mod, i) => {
          const [fx, fy] = PATH_POSITIONS[i] ?? [50, 50];
          const left = `${mod.position?.x ?? fx}%`;
          const top  = `${mod.position?.y ?? fy}%`;
          const isValidated = validated.includes(mod.id);
          return (
            <div key={mod.id} className="absolute z-10" style={{ left, top }}>
              <ModuleNode
                mod={mod}
                isValidated={isValidated}
                onClick={() => setSelectedModule(mod)}
              />
            </div>
          );
        })}

        {/* Légende */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/60 z-20 pointer-events-none"
          style={{ fontSize: 10 }}>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border border-white/60 inline-block" />
            À explorer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            Validé
          </span>
        </div>

        {/* Bouton récompense (si tout validé) */}
        {done === total && (
          <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto">
            <button onClick={() => navigate('/reward')}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', boxShadow: '0 0 30px #a855f766' }}>
              🏆 Récupérer ma récompense
            </button>
          </div>
        )}

      </main>

      {/* Modal module */}
      {selectedModule && (
        <ModuleModal
          mod={selectedModule}
          onClose={() => setSelectedModule(null)}
          onPlay={() => { setSelectedModule(null); navigate(`/module/${selectedModule.id}`); }}
          onScan={() => { setSelectedModule(null); navigate('/scan'); }}
        />
      )}

    </div>
  );
}
