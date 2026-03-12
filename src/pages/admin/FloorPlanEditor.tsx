import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModules } from '../../hooks/useModules';
import { DEMO_MODULES } from '../../data/demoModules';
import { updatePosition, saveModule } from '../../lib/modules';
import type { Module } from '../../types';

/* Positions par défaut le long du chemin — identique à ExperiencePage */
const PATH_POSITIONS: [number, number][] = [
  [85, 83], [65, 76], [48, 69], [28, 63], [8, 83],
  [5, 63], [10, 53], [32, 47], [14, 41], [20, 33], [55, 27],
];

function getDefaultPosition(index: number): { x: number; y: number } {
  const [x, y] = PATH_POSITIONS[index] ?? [50, 50];
  return { x, y };
}

const ROBOT_LS_KEY = 'miroki-robot-position';
const ROBOT_DEFAULT = { x: 50, y: 55 };

export function FloorPlanEditor() {
  const navigate = useNavigate();
  const { modules, loading } = useModules();
  const displayModules = (modules.length > 0 ? modules : DEMO_MODULES)
    .slice().sort((a, b) => a.number - b.number);

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const init: Record<string, { x: number; y: number }> = {};
    displayModules.forEach((m, i) => {
      const fallback = getDefaultPosition(i);
      init[m.id] = { x: m.position?.x ?? fallback.x, y: m.position?.y ?? fallback.y };
    });
    return init;
  });

  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(ROBOT_LS_KEY);
      return saved ? JSON.parse(saved) : ROBOT_DEFAULT;
    } catch { return ROBOT_DEFAULT; }
  });
  const [robotSaved, setRobotSaved] = useState(false);

  const [dragging, setDragging] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const squareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dragging) return;
    setPositions((prev) => {
      const next = { ...prev };
      displayModules.forEach((m, i) => {
        const fallback = getDefaultPosition(i);
        next[m.id] = { x: m.position?.x ?? fallback.x, y: m.position?.y ?? fallback.y };
      });
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayModules.map((m) => `${m.id}:${m.position?.x}:${m.position?.y}`).join('|')]);

  const getPercent = useCallback((clientX: number, clientY: number) => {
    const rect = squareRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  /* ──── SOURIS ──── */
  const onMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const pos = getPercent(e.clientX, e.clientY);
    if (!pos) return;
    if (dragging === '__robot__') {
      setRobotPos(pos);
    } else {
      setPositions((p) => ({ ...p, [dragging]: pos }));
    }
  };

  const onMouseUp = async () => {
    if (!dragging) return;
    const id = dragging;
    setDragging(null);

    if (id === '__robot__') {
      localStorage.setItem(ROBOT_LS_KEY, JSON.stringify(robotPos));
      setRobotSaved(true);
      setTimeout(() => setRobotSaved(false), 1500);
      return;
    }

    /* Sécurité : ne jamais écrire tant que Firestore n'a pas chargé */
    if (loading) return;

    const pos = positions[id];
    if (!pos) return;
    setSaving(id);
    try {
      await updatePosition(id, pos.x, pos.y);
    } catch (e) {
      console.error('Erreur updatePosition:', e);
    }
    setSaving(null);
    setSavedIds((s) => [...s, id]);
    setTimeout(() => setSavedIds((s) => s.filter((x) => x !== id)), 1500);
  };

  /* ──── TACTILE ──── */
  const onTouchStart = (id: string, e: React.TouchEvent) => {
    e.preventDefault();
    setDragging(id);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0];
    const pos = getPercent(t.clientX, t.clientY);
    if (!pos) return;
    if (dragging === '__robot__') {
      setRobotPos(pos);
    } else {
      setPositions((p) => ({ ...p, [dragging]: pos }));
    }
  };

  const resetToOrbit = async () => {
    setSaving('all');
    const updates: Record<string, { x: number; y: number }> = {};
    displayModules.forEach((m, i) => {
      const pos = getDefaultPosition(i);
      updates[m.id] = { x: pos.x, y: pos.y };
    });
    setPositions(updates);
    await Promise.all(
      displayModules.map((m) => updatePosition(m.id, updates[m.id].x, updates[m.id].y))
    );
    setSaving(null);
    setSavedIds(displayModules.map((m) => m.id));
    setTimeout(() => setSavedIds([]), 1500);
  };

  const getPos = (mod: Module) => positions[mod.id] ?? { x: 50, y: 50 };

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden text-white">

      {/* Header */}
      <header className="shrink-0 px-5 pt-5 pb-4 flex items-center gap-2 border-b border-white/5">
        <button onClick={() => navigate('/admin')} className="text-white/40 hover:text-white text-sm transition-colors">
          ← Retour
        </button>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Éditeur de plan</p>
          <p className="text-white/30 text-xs">Glissez les modules pour les repositionner</p>
        </div>
        <button onClick={resetToOrbit} disabled={saving === 'all'}
          className="px-3 py-2 rounded-xl text-xs border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-30">
          ↺ Réinitialiser
        </button>
        <button onClick={async () => {
          setSaving('all');
          await Promise.all(displayModules.map((m) => {
            const p = positions[m.id];
            if (!p) return Promise.resolve();
            const existsInFirestore = modules.some((fm) => fm.id === m.id);
            if (!existsInFirestore) {
              return saveModule({ ...m, position: { x: p.x, y: p.y } });
            }
            return updatePosition(m.id, p.x, p.y);
          }));
          setSaving(null);
          setSavedIds(displayModules.map((m) => m.id));
          setTimeout(() => setSavedIds([]), 1500);
        }} disabled={saving === 'all'}
          className="px-3 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 0 14px #3b82f633' }}>
          {saving === 'all' ? '…' : '💾 Sauver'}
        </button>
      </header>

      {/* Info */}
      <div className="shrink-0 px-4 py-2 border-b border-white/5 bg-blue-500/5">
        {loading ? (
          <p className="text-yellow-400/70 text-xs text-center">⏳ Chargement des modules depuis Firestore…</p>
        ) : (
          <p className="text-blue-400/50 text-xs text-center">
            ✋ Maintenez et glissez · Sauvegarde auto au relâché · {modules.length} modules chargés
          </p>
        )}
      </div>

      {/* Zone plan — identique à ExperiencePage */}
      <main
        ref={squareRef}
        className="flex-1 relative overflow-hidden select-none touch-none"
        style={{
          backgroundImage: 'url(/experience-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: '30% center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0A0A14',
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,3,20,0.10)' }} />

          {/* Robot draggable */}
          <div
            className="absolute z-30 flex flex-col items-center gap-1"
            style={{
              left: `${robotPos.x}%`,
              top: `${robotPos.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: dragging === '__robot__' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => { e.preventDefault(); setDragging('__robot__'); }}
            onTouchStart={(e) => { e.preventDefault(); setDragging('__robot__'); }}
          >
            <img
              src="/robot-plan.svg"
              alt="Miroki"
              className="pointer-events-none"
              style={{
                width: 80,
                filter: dragging === '__robot__'
                  ? 'drop-shadow(0 0 24px #a855f7cc)'
                  : 'drop-shadow(0 0 12px #a855f766)',
                transform: dragging === '__robot__' ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s, filter 0.15s',
              }}
            />
            <span
              className="text-white/50 pointer-events-none"
              style={{ fontSize: 8, marginTop: 2 }}>
              {robotSaved ? '✓ Sauvé' : 'Miroki'}
            </span>
          </div>

          {/* Modules draggables */}
          {displayModules.map((mod) => {
            const pos = getPos(mod);
            const isDragging = dragging === mod.id;
            const isSaving = saving === mod.id;
            const isSaved = savedIds.includes(mod.id);

            return (
              <div
                key={mod.id}
                className="absolute z-10 flex flex-col items-center gap-1"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={(e) => onMouseDown(mod.id, e)}
                onTouchStart={(e) => onTouchStart(mod.id, e)}
              >
                {/* Halo de drag */}
                {isDragging && (
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width: 52, height: 52, border: `2px dashed ${mod.color}66`, transform: 'translate(-50%,-50%)', top: '50%', left: '50%' }} />
                )}

                {/* Cercle module */}
                <div className="flex items-center justify-center rounded-full font-bold text-white border-2 transition-all"
                  style={{
                    width: 36, height: 36,
                    backgroundColor: isDragging ? mod.color : `${mod.color}25`,
                    borderColor: mod.color,
                    boxShadow: isDragging
                      ? `0 0 0 4px ${mod.color}33, 0 8px 20px rgba(0,0,0,0.6)`
                      : `0 0 10px ${mod.color}55`,
                    transform: isDragging ? 'scale(1.2)' : 'scale(1)',
                    fontSize: 13,
                  }}>
                  {isSaving ? '…' : isSaved ? '✓' : mod.number}
                </div>

                {/* Label */}
                <span className="whitespace-nowrap text-white/50 leading-tight pointer-events-none"
                  style={{ fontSize: 8, maxWidth: 60, textAlign: 'center' }}>
                  {mod.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            );
          })}

          {/* Coordonnées live pendant le drag */}
          {dragging && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white/40 text-xs px-2 py-1 rounded-lg border border-white/10 pointer-events-none">
              x: {Math.round(positions[dragging]?.x ?? 0)} · y: {Math.round(positions[dragging]?.y ?? 0)}
            </div>
          )}
      </main>
    </div>
  );
}
