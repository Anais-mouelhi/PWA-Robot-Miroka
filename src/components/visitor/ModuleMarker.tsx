import type { Module } from '../../types';

interface Props {
  module: Module;
  isSelected: boolean;
  onClick: () => void;
}

export function ModuleMarker({ module, isSelected, onClick }: Props) {
  const c = module.color;

  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
      style={{ left: `${module.position.x}%`, top: `${module.position.y}%` }}
      aria-label={module.name}
    >
      {/* Anneau pulsant */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-40"
        style={{ backgroundColor: c }}
      />

      {/* Marqueur */}
      <span
        className="relative flex items-center justify-center w-9 h-9 rounded-full
                   border-2 text-white font-bold text-sm transition-all duration-200"
        style={{
          backgroundColor: isSelected ? c : `${c}55`,
          borderColor: c,
          boxShadow: isSelected
            ? `0 0 0 4px ${c}44, 0 0 20px ${c}`
            : `0 0 10px ${c}88`,
          transform: isSelected ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {module.number}
      </span>

      {/* Tooltip */}
      <span
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                   whitespace-nowrap bg-black/80 text-white text-xs rounded-lg
                   px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity
                   pointer-events-none border border-white/10"
      >
        {module.name}
      </span>
    </button>
  );
}
