import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Module } from '../../types';
import { ModuleMarker } from './ModuleMarker';

interface Props {
  modules: Module[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FloorPlan({ modules, selectedId, onSelect }: Props) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#0a0a14] border border-white/10">
      <TransformWrapper
        initialScale={1}
        minScale={0.6}
        maxScale={4}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Boutons zoom */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
              {[
                { label: '+', action: () => zoomIn() },
                { label: '−', action: () => zoomOut() },
                { label: '⊙', action: () => resetTransform() },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-8 h-8 rounded-lg bg-black/60 border border-white/10
                             text-white/70 hover:text-white hover:bg-black/80
                             flex items-center justify-center text-base transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>

            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full"
            >
              <div className="relative w-full h-full select-none">
                {/* Image du vrai plan */}
                <img
                  src="/floor-plan.png"
                  alt="Plan Mirokaï Experience"
                  className="w-full h-full object-contain"
                  draggable={false}
                />

                {/* Marqueurs des modules */}
                {modules.map((mod) => (
                  <ModuleMarker
                    key={mod.id}
                    module={mod}
                    isSelected={selectedId === mod.id}
                    onClick={() => onSelect(mod.id)}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Légende */}
      <div className="absolute bottom-3 left-3 z-20 text-xs text-white/30">
        Pincez pour zoomer · Appuyez sur un module
      </div>
    </div>
  );
}
