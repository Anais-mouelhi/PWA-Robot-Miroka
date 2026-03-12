import type { Module } from '../../types';

interface Props {
  module: Module;
  onClick: () => void;
}

const ICONS: Record<string, string> = {
  audio: '🎵',
  video: '🎬',
  none: '✦',
};

export function ModuleCard({ module, onClick }: Props) {
  const c = module.color;

  return (
    <button
      onClick={onClick}
      className="relative w-full text-left rounded-2xl overflow-hidden border transition-all duration-300
                 hover:scale-[1.02] active:scale-[0.98] group"
      style={{
        borderColor: `${c}44`,
        background: `linear-gradient(135deg, ${c}18 0%, #0d0d1a 60%)`,
        boxShadow: `0 0 0 1px ${c}22`,
      }}
    >
      {/* Glow top-left */}
      <div
        className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20 blur-2xl
                   group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: c }}
      />

      <div className="relative p-5">
        {/* Numéro + icône média */}
        <div className="flex items-start justify-between mb-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center
                       font-bold text-sm border-2"
            style={{
              backgroundColor: `${c}22`,
              borderColor: c,
              color: c,
              boxShadow: `0 0 12px ${c}55`,
            }}
          >
            {module.number}
          </span>
          <span className="text-lg opacity-60">
            {ICONS[module.mediaType]}
          </span>
        </div>

        {/* Nom */}
        <h3 className="text-white font-bold text-base leading-tight mb-1">
          {module.name}
        </h3>

        {/* Description tronquée */}
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
          {module.description}
        </p>

        {/* Barre de couleur en bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50
                     group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }}
        />
      </div>
    </button>
  );
}
