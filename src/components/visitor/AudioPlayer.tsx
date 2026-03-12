import { useRef, useState } from 'react';

export function AudioPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    playing ? ref.current.pause() : ref.current.play();
    setPlaying(!playing);
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
      <audio
        ref={ref}
        src={src}
        onTimeUpdate={() => {
          if (ref.current)
            setProgress((ref.current.currentTime / ref.current.duration) * 100);
        }}
        onLoadedMetadata={() => ref.current && setDuration(ref.current.duration)}
        onEnded={() => setPlaying(false)}
      />

      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500
                   flex items-center justify-center shrink-0 transition-colors"
      >
        {playing ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      <div className="flex-1">
        <div
          className="h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
          onClick={(e) => {
            if (!ref.current) return;
            const r = e.currentTarget.getBoundingClientRect();
            ref.current.currentTime =
              ((e.clientX - r.left) / r.width) * ref.current.duration;
          }}
        >
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>{fmt((progress / 100) * duration)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
