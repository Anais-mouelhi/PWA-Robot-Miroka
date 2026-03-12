import type { Module } from '../../types';

interface Props {
  modules: Module[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SPACES = [
  { id: 'miroka-exp', label: 'Mirokaï Experience', style: { top: '5%',  left: '2%',  width: '38%', height: '60%' }, color: '#a855f7' },
  { id: 'regie',      label: 'Régie',              style: { top: '68%', left: '2%',  width: '8%',  height: '24%' }, color: '#3b82f6' },
  { id: 'cyclage',    label: 'Salle de Cyclage',   style: { top: '68%', left: '11%', width: '29%', height: '24%' }, color: '#ec4899' },
  { id: 'spoon',      label: 'Zone Partenaire Spoon', style: { top: '28%', left: '42%', width: '28%', height: '44%' }, color: '#06b6d4' },
  { id: null, label: 'Vestiaire',  style: { top: '5%',  left: '42%', width: '14%', height: '20%' }, color: '#374151' },
  { id: null, label: 'Lobby',      style: { top: '74%', left: '42%', width: '18%', height: '18%' }, color: '#374151' },
  { id: null, label: 'Sanitaires', style: { top: '5%',  left: '58%', width: '12%', height: '20%' }, color: '#374151' },
  { id: null, label: 'Local CTA',  style: { top: '28%', left: '72%', width: '26%', height: '36%' }, color: '#374151' },
  { id: null, label: '',           style: { top: '5%',  left: '72%', width: '26%', height: '20%' }, color: '#374151' },
  { id: null, label: '',           style: { top: '68%', left: '72%', width: '26%', height: '24%' }, color: '#374151' },
];

export function FloorPlanCards({ modules, selectedId, onSelect }: Props) {
  const getModule = (id: string | null) => id ? modules.find((m) => m.id === id) : undefined;

  return (
    <div className="relative w-full" style={{ paddingBottom: '55%' }}>
      <div className="absolute inset-0">

        {/* Fond grille */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: '#0a0a14',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        {SPACES.map((space) => {
          const mod = getModule(space.id);
          const c = mod?.color ?? space.color;
          const isClickable = !!space.id;
          const isSelected = selectedId === space.id;
          const isGray = !space.id;

          return (
            <div
              key={`${space.label}-${space.style.top}`}
              className="absolute rounded-xl border transition-all duration-200"
              style={{
                ...space.style,
                borderColor: isGray ? 'rgba(255,255,255,0.04)' : `${c}55`,
                background: isGray ? 'rgba(255,255,255,0.015)' : isSelected ? `${c}22` : `${c}0d`,
                boxShadow: isSelected ? `0 0 20px ${c}44, inset 0 0 20px ${c}11` : 'none',
                cursor: isClickable ? 'pointer' : 'default',
              }}
              onClick={() => isClickable && space.id && onSelect(space.id)}
            >
              {isClickable && isSelected && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: c }} />
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                {isClickable ? (
                  <>
                    <span className="font-bold mb-1" style={{ color: c, fontSize: 'clamp(10px, 1.5vw, 15px)' }}>
                      {mod?.number ?? ''}
                    </span>
                    <span className="font-semibold text-white leading-tight" style={{ fontSize: 'clamp(8px, 1.3vw, 13px)' }}>
                      {mod?.name ?? space.label}
                    </span>
                  </>
                ) : space.label ? (
                  <span className="text-white/10 leading-tight" style={{ fontSize: 'clamp(6px, 1vw, 9px)' }}>
                    {space.label}
                  </span>
                ) : null}
              </div>

              {isClickable && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)`, opacity: isSelected ? 1 : 0.4 }} />
              )}
            </div>
          );
        })}

        <div className="absolute bottom-1 right-2 text-white/20 text-xs">PLAN −1</div>
      </div>
    </div>
  );
}
