import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModules } from '../hooks/useModules';
import { DEMO_MODULES } from '../data/demoModules';
import { useProgress } from '../context/ProgressContext';

const TIMER_SECONDS = 30;
const LETTERS = ['A', 'B', 'C', 'D'];

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { modules } = useModules();
  const displayModules = modules.length > 0 ? modules : DEMO_MODULES;
  const mod = displayModules.find((m) => m.id === id);
  const { validated, validate } = useProgress();

  const alreadyValidated = validated.includes(id ?? '');
  const [step, setStep] = useState<'challenge' | 'validated'>(alreadyValidated ? 'validated' : 'challenge');
  const [chosen, setChosen] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [hintVisible, setHintVisible] = useState(false);

  const earnedPoints = validated.length * 100;

  /* Timer */
  useEffect(() => {
    if (step !== 'challenge' || chosen !== null) return;
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, step, chosen]);

  if (!mod) return (
    <div className="flex items-center justify-center h-dvh bg-[#0d0d1e] text-white/40">Module introuvable</div>
  );

  const handleAnswer = (idx: number) => {
    if (!mod.challenge || chosen !== null) return;
    setChosen(idx);
    if (idx === mod.challenge.answer) {
      validate(mod.id);
      setTimeout(() => setStep('validated'), 700);
    } else {
      setWrong(true);
      setTimeout(() => { setChosen(null); setWrong(false); }, 1000);
    }
  };

  /* ── Validé ── */
  if (step === 'validated') {
    return (
      <div className="h-dvh flex flex-col items-center justify-center text-white px-8 text-center gap-6"
        style={{ background: 'linear-gradient(160deg, #0d0d1e 0%, #1a0a2e 100%)' }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{ backgroundColor: `${mod.color}22`, border: `2px solid ${mod.color}`, boxShadow: `0 0 40px ${mod.color}66` }}>
          ✓
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-1">Étape validée !</h2>
          <p className="text-white/40 text-sm">{mod.name}</p>
          <p className="text-yellow-400 font-bold mt-2">+200 pts</p>
        </div>
        <button onClick={() => navigate('/experience')}
          className="w-full max-w-xs py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${mod.color}, #7c3aed)`, boxShadow: `0 0 20px ${mod.color}55` }}>
          Continuer →
        </button>
      </div>
    );
  }

  const challenge = mod.challenge;

  return (
    <div className="h-dvh flex flex-col text-white overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0d1e 0%, #1a0a2e 100%)' }}>

      {/* Header */}
      <header className="shrink-0 px-5 pt-10 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/experience')}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-bold text-base">Quiz</p>
          <p className="text-xs" style={{ color: '#06b6d4' }}>Question 1/{challenge ? 1 : 0}</p>
        </div>
        <div className="w-9" />
      </header>

      {/* Badges pts + timer */}
      <div className="shrink-0 px-5 pb-3 flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-base flex-1 justify-center"
          style={{ background: 'rgba(120,40,20,0.55)', border: '1px solid rgba(255,200,50,0.15)' }}>
          <span>⭐</span>
          <span>{earnedPoints} pts</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-base flex-1 justify-center"
          style={{ background: 'rgba(0,60,80,0.55)', border: '1px solid rgba(0,200,220,0.15)' }}>
          <span>⏱</span>
          <span className={timeLeft <= 10 ? 'text-red-400' : ''}>{timeLeft}s</span>
        </div>
      </div>

      {/* Barre de progression timer */}
      <div className="shrink-0 mx-5 mb-5 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${(timeLeft / TIMER_SECONDS) * 100}%`,
            background: timeLeft > 10 ? '#06b6d4' : '#ef4444',
          }}
        />
      </div>

      {/* Carte question + choix + hint */}
      <div className="flex-1 mx-4 mb-6 rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: 'rgba(30, 24, 60, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>

        {/* Question */}
        <div className="shrink-0 px-6 pt-8 pb-6 text-center">
          <p className="font-bold text-xl leading-snug">
            {challenge?.question ?? 'Question non disponible'}
          </p>
        </div>

        {/* Choix — s'étendent pour remplir l'espace */}
        <div className="flex-1 flex flex-col gap-3 px-5">
          {(challenge?.choices ?? []).map((choice, i) => {
            const isChosen = chosen === i;
            const isCorrect = i === (challenge?.answer ?? -1);
            let bg = 'rgba(255,255,255,0.06)';
            let border = 'rgba(255,255,255,0.1)';
            if (isChosen) {
              bg = isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)';
              border = isCorrect ? '#22c55e' : '#ef4444';
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={chosen !== null}
                className="flex-1 w-full flex items-center gap-3 px-4 rounded-xl text-left transition-all active:scale-98"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
                  {LETTERS[i]}
                </span>
                <span className="text-white text-sm font-medium">{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="shrink-0 px-5 py-5">
          {hintVisible ? (
            <p className="text-center text-white/60 text-sm px-4 py-3 rounded-xl"
              style={{ background: 'rgba(124,77,255,0.15)', border: '1px solid rgba(124,77,255,0.3)' }}>
              💡 Indice : réfléchis à l'origine du robot…
            </p>
          ) : (
            <button onClick={() => setHintVisible(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white/60 text-sm font-medium transition-all hover:text-white active:scale-98"
              style={{ background: 'rgba(124,77,255,0.2)', border: '1px solid rgba(124,77,255,0.25)' }}>
              <span>⊙</span> Besoin d'un indice ?
            </button>
          )}
        </div>

      </div>

      {wrong && (
        <p className="absolute bottom-24 left-0 right-0 text-center text-red-400 text-sm font-semibold">
          ❌ Mauvaise réponse, réessayez !
        </p>
      )}
    </div>
  );
}
