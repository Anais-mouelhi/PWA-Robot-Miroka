import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import type { Mode, AgeRange, ChildProfile } from '../context/ProfileContext';

type Step = 'welcome' | 'profil';

const AVATARS = [
  '/avatar-1.png',
  '/avatar-2.png',
  '/avatar-3.png',
  '/avatar-4.png',
  '/avatar-5.png',
  '/avatar-6.png',
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const [step, setStep] = useState<Step>('welcome');
  const [nameInput, setNameInput] = useState(profile.name);

  /* ── WELCOME ── */
  if (step === 'welcome') return (
    <div className="h-dvh overflow-hidden relative" style={{ background: 'linear-gradient(180deg, #621F4A 0%, #004AAD 100%)' }}>

      {/* ── Personnage en fond plein écran ── */}
      <img
        src="/nimira-character.png"
        alt=""
        className="absolute pointer-events-none"
        style={{
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '55%',
          height: 'auto',
        }}
      />



      {/* ── Contenu superposé ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center px-8">

        {/* Logo haut — padding top 32px (8×4) */}
        <div className="flex flex-col items-center gap-2 pt-8">
          <img src="/miroki-logo.svg" alt="Miroki" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <img src="/enchanted-logo.svg" alt="Enchanted Tools" style={{ width: 160, height: 'auto', objectFit: 'contain' }} />
          <img src="/miroka-text.svg" alt="" style={{ width: 24, height: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Titre + description + boutons — gap 16px (8×2) */}
        <div className="absolute left-8 right-8 text-center flex flex-col gap-4" style={{ top: '32%' }}>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white">Bienvenue !</h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
              Vous allez explorer l'univers Mirokaï à travers 11 étapes immersives, des défis et une récompense finale.
            </p>
          </div>
          {/* gap 8px entre les boutons */}
          <div className="flex flex-col gap-2 items-center">
            {/* Bouton primaire */}
            <button onClick={() => setStep('profil')}
              className="font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                width: 229,
                height: 42,
                borderRadius: 41,
                padding: '12px 75px',
                background: '#7E4F84',
                boxShadow: '0 0 20px #7E4F8455',
                whiteSpace: 'nowrap',
              }}>
              S'inscrire
            </button>
            {/* Bouton secondaire */}
            <button onClick={() => setStep('profil')}
              className="font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                width: 229,
                height: 42,
                borderRadius: 41,
                padding: '12px 75px',
                background: 'transparent',
                border: '1px solid #7E4F84',
                whiteSpace: 'nowrap',
              }}>
              Se connecter
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  /* ── PROFIL (tout en une page) ── */
  const COLORS = ['#3b82f6', '#ec4899', '#a855f7', '#06b6d4', '#f59e0b'];

  // Les avatars sont naturellement teal (~180°). On tourne la teinte vers chaque couleur.
  const COLOR_FILTER: Record<string, string> = {
    '#3b82f6': 'hue-rotate(40deg) saturate(180%)',
    '#ec4899': 'hue-rotate(140deg) saturate(200%)',
    '#a855f7': 'hue-rotate(90deg) saturate(160%)',
    '#06b6d4': 'hue-rotate(0deg) saturate(130%)',
    '#f59e0b': 'hue-rotate(210deg) saturate(220%) brightness(1.1)',
  };
  const avatarFilter = COLOR_FILTER[profile.color] ?? 'hue-rotate(0deg)';
  const isGroup = profile.mode === 'groupe' || profile.mode === 'famille';
  const familleOk = profile.mode !== 'famille' || profile.children.length > 0;
  const groupeOk  = true;
  const ageOk = (profile.mode === 'famille' || profile.mode === 'groupe') || !!profile.age;
  const canSubmit = !!profile.mode && nameInput.trim().length > 0 && ageOk && familleOk && groupeOk;

  return (
    <div className="h-dvh flex flex-col overflow-hidden text-white" style={{ background: 'linear-gradient(180deg, #621F4A 0%, #004AAD 100%)' }} >

      {/* Header */}
      <header className="shrink-0 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-white/5">
        <button onClick={() => setStep('welcome')} className="text-white/40 hover:text-white text-sm transition-colors">←</button>
        <p className="text-white font-bold text-xl">Créez votre profil</p>
      </header>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

        {/* Mode de jeu */}
        <div>
          <p className="text-white text-base font-bold mb-3">Choisissez votre mode de jeu</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'solo'    as Mode, icon: '👤', label: 'Seul' },
              { value: 'groupe'  as Mode, icon: '👥', label: 'Groupe' },
              { value: 'famille' as Mode, icon: '👨‍👩‍👧', label: 'Famille' },
            ]).map(({ value, icon, label }) => {
              const selected = profile.mode === value;
              return (
                <button key={value} onClick={() => setProfile({ mode: value })}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: selected ? '#a855f7' : 'rgba(255,255,255,0.08)',
                    background: selected ? '#a855f722' : 'rgba(255,255,255,0.04)',
                  }}>
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs font-semibold text-white/80">{label}</span>
                </button>
              );
            })}
          </div>
          {/* Composition groupe */}
          {profile.mode === 'groupe' && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/3 p-4 flex flex-col gap-4">

              {/* Adultes */}
              <div>
                <p className="text-white/50 text-xs mb-2">Nombre d'adultes</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const sel = profile.adultsCount === n;
                    return (
                      <button key={n} onClick={() => setProfile({ adultsCount: n })}
                        className="w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all"
                        style={{
                          borderColor: sel ? '#a855f7' : 'rgba(255,255,255,0.1)',
                          background: sel ? '#a855f722' : 'transparent',
                          color: sel ? '#a855f7' : 'rgba(255,255,255,0.4)',
                        }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enfants */}
              <div>
                <p className="text-white/50 text-xs mb-2">Nombre d'enfants</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const sel = profile.children.length === n;
                    return (
                      <button key={n}
                        onClick={() => {
                          const updated: ChildProfile[] = Array.from({ length: n }, (_, i) => ({
                            age: profile.children[i]?.age ?? null,
                          }));
                          setProfile({ children: updated });
                        }}
                        className="w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all"
                        style={{
                          borderColor: sel ? '#a855f7' : 'rgba(255,255,255,0.1)',
                          background: sel ? '#a855f722' : 'transparent',
                          color: sel ? '#a855f7' : 'rgba(255,255,255,0.4)',
                        }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {profile.children.length > 0 && (
                <p className="text-white/40 text-xs italic">
                  👶 Les enfants sont considérés comme ayant 15 ans ou moins.
                </p>
              )}
            </div>
          )}

          {/* Adultes + Enfants (famille) */}
          {profile.mode === 'famille' && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/3 p-4 flex flex-col gap-4">

              {/* Adultes */}
              <div>
                <p className="text-white/50 text-xs mb-2">Nombre d'adultes</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const sel = profile.adultsCount === n;
                    return (
                      <button key={n} onClick={() => setProfile({ adultsCount: n })}
                        className="w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all"
                        style={{
                          borderColor: sel ? '#a855f7' : 'rgba(255,255,255,0.1)',
                          background: sel ? '#a855f722' : 'transparent',
                          color: sel ? '#a855f7' : 'rgba(255,255,255,0.4)',
                        }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enfants */}
              <div>
                <p className="text-white/50 text-xs mb-2">Nombre d'enfants</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const sel = profile.children.length === n;
                    return (
                      <button key={n}
                        onClick={() => {
                          const updated: ChildProfile[] = Array.from({ length: n }, (_, i) => ({
                            age: profile.children[i]?.age ?? null,
                          }));
                          setProfile({ children: updated });
                        }}
                        className="w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all"
                        style={{
                          borderColor: sel ? '#a855f7' : 'rgba(255,255,255,0.1)',
                          background: sel ? '#a855f722' : 'transparent',
                          color: sel ? '#a855f7' : 'rgba(255,255,255,0.4)',
                        }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {profile.children.length > 0 && (
                <p className="text-white/40 text-xs italic">
                  👶 Les enfants sont considérés comme ayant 15 ans ou moins.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div>
          <p className="text-white text-base font-bold mb-3">Créez votre Avatar</p>
          <div className="flex gap-3 overflow-x-auto" style={{ padding: '6px 2px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {AVATARS.map((av) => {
              const selected = profile.avatar === av;
              return (
                <button key={av} onClick={() => setProfile({ avatar: av })}
                  className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all"
                  style={{
                    borderColor: selected ? profile.color : 'rgba(255,255,255,0.08)',
                    background: selected ? `${profile.color}22` : 'rgba(255,255,255,0.04)',
                    transform: selected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selected ? `0 0 14px ${profile.color}88` : 'none',
                  }}>
                  <img src={av} alt="avatar" className="w-full h-full object-contain transition-all duration-300"
                    style={{ padding: '6px', filter: avatarFilter }} />
                </button>
              );
            })}
          </div>
          {/* Couleurs */}
          <div className="flex gap-3 mt-3">
            {COLORS.map((c) => (
              <button key={c} onClick={() => setProfile({ color: c })}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: c,
                  borderColor: profile.color === c ? 'white' : 'transparent',
                  transform: profile.color === c ? 'scale(1.2)' : 'scale(1)',
                }} />
            ))}
          </div>
        </div>

        {/* Nom */}
        <div>
          <p className="text-white text-base font-bold mb-2">
            {isGroup ? 'Votre nom d\'équipe' : 'Votre prénom'}
          </p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setProfile({ name: e.target.value }); }}
            placeholder={isGroup ? 'Entrez votre nom…' : 'Entrez votre prénom…'}
            maxLength={20}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white
                       placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors text-sm"
          />
        </div>

        {/* Tranche d'âge — masquée en mode famille/groupe (collectée par enfant) */}
        {profile.mode !== 'famille' && profile.mode !== 'groupe' && (
          <div>
            <p className="text-white text-base font-bold mb-3">Tranche d'âge</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'enfant'  as AgeRange, label: '3-15 ans' },
                { value: 'adulte'  as AgeRange, label: '16-59 ans' },
                { value: 'senior'  as AgeRange, label: '60 ans +' },
              ]).map(({ value, label }) => {
                const selected = profile.age === value;
                return (
                  <button key={value} onClick={() => setProfile({ age: value })}
                    className="py-3 rounded-2xl border-2 text-center transition-all"
                    style={{
                      borderColor: selected ? '#a855f7' : 'rgba(255,255,255,0.08)',
                      background: selected ? '#a855f722' : 'rgba(255,255,255,0.04)',
                    }}>
                    <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bouton fixe en bas */}
      <div className="shrink-0 px-5 pb-8 pt-3 border-t border-white/5">
        <button
          onClick={() => { setProfile({ name: nameInput }); navigate('/intro'); }}
          disabled={!canSubmit}
          className="w-full py-4 font-bold text-white text-base transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: canSubmit ? '0 0 24px #a855f755' : 'none', borderRadius: 9 }}>
          C'est parti →
        </button>
      </div>
    </div>
  );
}
