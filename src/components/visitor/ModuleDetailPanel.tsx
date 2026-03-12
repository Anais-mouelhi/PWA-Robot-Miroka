import { useState } from 'react';
import type { Module } from '../../types';
import { AudioPlayer } from './AudioPlayer';

interface Props {
  module: Module | null;
  onClose: () => void;
}

export function ModuleDetailPanel({ module, onClose }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  if (!module) return null;

  const c = module.color;

  return (
    <>
      {/* Overlay sombre derrière le panneau */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm z-50 flex flex-col bg-[#0d0d1a] border-l border-white/10 overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center
                       font-bold text-white text-sm border-2"
            style={{ backgroundColor: `${c}33`, borderColor: c, boxShadow: `0 0 12px ${c}66` }}
          >
            {module.number}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-xs uppercase tracking-widest">Module {module.number}</p>
            <h2 className="text-white font-bold text-lg leading-tight">{module.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center
                       justify-center text-white/50 hover:text-white transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Galerie images */}
          {module.images.length > 0 && (
            <div className="space-y-2">
              <img
                key={imgIdx}
                src={module.images[imgIdx]}
                alt={module.name}
                className="w-full aspect-video object-cover rounded-xl bg-white/5"
              />
              {module.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {module.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ backgroundColor: i === imgIdx ? c : '#ffffff33' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-white/40 text-xs uppercase tracking-widest">Description</p>
            <p className="text-white/80 text-sm leading-relaxed">{module.description}</p>
          </div>

          {/* Audio */}
          {module.mediaType === 'audio' && module.mediaUrl && (
            <div className="space-y-1.5">
              <p className="text-white/40 text-xs uppercase tracking-widest">Audio</p>
              <AudioPlayer src={module.mediaUrl} />
            </div>
          )}

          {/* Vidéo */}
          {module.mediaType === 'video' && module.mediaUrl && (
            <div className="space-y-1.5">
              <p className="text-white/40 text-xs uppercase tracking-widest">Vidéo</p>
              <video
                src={module.mediaUrl}
                controls
                playsInline
                className="w-full aspect-video rounded-xl bg-black"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
