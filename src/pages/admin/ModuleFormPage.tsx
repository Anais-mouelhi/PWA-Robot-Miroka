import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModules } from '../../hooks/useModules';
import { DEMO_MODULES } from '../../data/demoModules';
import { saveModule } from '../../lib/modules';
import type { Module, MediaType } from '../../types';

const COLORS = ['#a855f7', '#7c3aed', '#8b5cf6', '#06b6d4', '#3b82f6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#f97316', '#10b981'];

function newId() {
  return `etape-${Date.now()}`;
}

export function ModuleFormPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { modules } = useModules();
  const allModules = modules.length > 0 ? modules : DEMO_MODULES;

  const existing = isNew ? null : allModules.find((m) => m.id === id) ?? null;

  const [form, setForm] = useState<Module>(existing ?? {
    id: newId(),
    number: allModules.length + 1,
    name: '',
    description: '',
    color: '#a855f7',
    mediaType: 'none',
    mediaUrl: '',
    images: [],
    position: { x: 50, y: 50 },
    challenge: { question: '', choices: ['', '', '', ''], answer: 0 },
  });

  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'info' | 'media' | 'challenge'>('info');

  useEffect(() => {
    if (!isNew && existing) setForm(existing);
  }, [existing]);

  const set = (patch: Partial<Module>) => setForm((f) => ({ ...f, ...patch }));

  const addImage = () => {
    const url = imageInput.trim();
    if (url && !form.images.includes(url)) {
      set({ images: [...form.images, url] });
      setImageInput('');
    }
  };

  const removeImage = (url: string) => set({ images: form.images.filter((i) => i !== url) });

  const setChoice = (idx: number, val: string) => {
    const choices = [...(form.challenge?.choices ?? ['', '', '', ''])];
    choices[idx] = val;
    set({ challenge: { ...(form.challenge ?? { question: '', choices, answer: 0 }), choices } });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await saveModule(form);
    setSaving(false);
    navigate('/admin');
  };

  const isValid = form.name.trim().length > 0 && form.number > 0;

  const TAB_STYLES = (active: boolean) => ({
    background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
    borderColor: active ? '#3b82f6' : 'rgba(255,255,255,0.08)',
    color: active ? '#60a5fa' : 'rgba(255,255,255,0.4)',
  });

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden text-white">

      {/* Header */}
      <header className="shrink-0 px-5 pt-5 pb-4 flex items-center gap-3 border-b border-white/5">
        <button onClick={() => navigate('/admin')} className="text-white/40 hover:text-white text-sm transition-colors">
          ← Retour
        </button>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{isNew ? 'Nouveau module' : `Éditer : ${form.name}`}</p>
          <p className="text-white/30 text-xs">Espace Admin</p>
        </div>
        <button onClick={handleSave} disabled={!isValid || saving}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: isValid ? '0 0 14px #3b82f644' : 'none' }}>
          {saving ? '…' : 'Enregistrer'}
        </button>
      </header>

      {/* Onglets */}
      <div className="shrink-0 flex gap-2 px-4 pt-3">
        {(['info', 'media', 'challenge'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize"
            style={TAB_STYLES(tab === t)}>
            {t === 'info' ? '📋 Infos' : t === 'media' ? '🎵 Média' : '🎯 Défi'}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── ONGLET INFOS ── */}
        {tab === 'info' && (
          <>
            {/* Numéro + couleur */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Numéro</label>
                <input type="number" min={1} max={99} value={form.number}
                  onChange={(e) => set({ number: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white
                             focus:outline-none focus:border-blue-500 transition-colors text-sm" />
              </div>
              <div className="flex-1">
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Couleur</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => set({ color: c })}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent', transform: form.color === c ? 'scale(1.2)' : 'scale(1)' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Nom du module *</label>
              <input type="text" value={form.name} maxLength={60}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Ex: Naissance de Mirokaï"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                           placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
            </div>

            {/* Description */}
            <div>
              <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
                Cartel / Description
              </label>
              <textarea value={form.description} rows={4} maxLength={500}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Description affichée aux visiteurs…"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                           placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none" />
              <p className="text-white/20 text-xs text-right mt-1">{form.description.length}/500</p>
            </div>

            {/* Aperçu */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/3">
              <p className="text-white/30 text-xs mb-3">Aperçu</p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2"
                  style={{ borderColor: form.color, color: form.color, backgroundColor: `${form.color}15` }}>
                  {form.number}
                </span>
                <div>
                  <p className="text-white text-sm font-semibold">{form.name || 'Nom du module'}</p>
                  <p className="text-white/40 text-xs truncate max-w-xs">{form.description || 'Description…'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── ONGLET MEDIA ── */}
        {tab === 'media' && (
          <>
            {/* Type de média */}
            <div>
              <label className="text-white/40 text-xs uppercase tracking-widest block mb-3">Type de média</label>
              <div className="flex gap-2">
                {(['none', 'audio', 'video'] as MediaType[]).map((t) => (
                  <button key={t} onClick={() => set({ mediaType: t })}
                    className="flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={{
                      borderColor: form.mediaType === t ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                      background: form.mediaType === t ? '#3b82f622' : 'rgba(255,255,255,0.03)',
                      color: form.mediaType === t ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                    }}>
                    {t === 'none' ? 'Aucun' : t === 'audio' ? '🎵 Audio' : '🎬 Vidéo'}
                  </button>
                ))}
              </div>
            </div>

            {/* URL média */}
            {form.mediaType !== 'none' && (
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
                  URL {form.mediaType === 'audio' ? 'audio (.mp3, .ogg…)' : 'vidéo (.mp4 ou YouTube)'}
                </label>
                <input type="url" value={form.mediaUrl ?? ''}
                  onChange={(e) => set({ mediaUrl: e.target.value })}
                  placeholder={form.mediaType === 'audio' ? 'https://…/audio.mp3' : 'https://…/video.mp4'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                             placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
              </div>
            )}

            {/* Images */}
            <div>
              <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
                Images ({form.images.length})
              </label>
              <div className="flex gap-2">
                <input type="url" value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  placeholder="https://… URL d'une image"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                             placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
                <button onClick={addImage} disabled={!imageInput.trim()}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all disabled:opacity-30">
                  +
                </button>
              </div>

              {form.images.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/8">
                      <img src={url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-white/10"
                        onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                      <span className="flex-1 text-white/50 text-xs truncate">{url}</span>
                      <button onClick={() => removeImage(url)}
                        className="text-red-400/60 hover:text-red-400 text-sm transition-colors shrink-0">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ONGLET DÉFI ── */}
        {tab === 'challenge' && (
          <>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Question</label>
              <input type="text" value={form.challenge?.question ?? ''}
                onChange={(e) => set({ challenge: { ...(form.challenge ?? { choices: ['', '', '', ''], answer: 0 }), question: e.target.value } })}
                placeholder="Ex: Où est basée Enchanted Tools ?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                           placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
                Réponses (sélectionnez la bonne)
              </label>
              <div className="flex flex-col gap-2">
                {(form.challenge?.choices ?? ['', '', '', '']).map((choice, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button onClick={() => set({ challenge: { ...(form.challenge ?? { question: '', choices: ['','','',''] }), answer: i } })}
                      className="w-7 h-7 rounded-full border-2 text-xs font-bold shrink-0 transition-all"
                      style={{
                        borderColor: form.challenge?.answer === i ? '#22c55e' : 'rgba(255,255,255,0.15)',
                        background: form.challenge?.answer === i ? '#22c55e22' : 'transparent',
                        color: form.challenge?.answer === i ? '#22c55e' : 'rgba(255,255,255,0.3)',
                      }}>
                      {form.challenge?.answer === i ? '✓' : i + 1}
                    </button>
                    <input type="text" value={choice}
                      onChange={(e) => setChoice(i, e.target.value)}
                      placeholder={`Réponse ${i + 1}…`}
                      className="flex-1 bg-white/5 border rounded-xl px-3 py-2.5 text-white
                                 placeholder-white/20 focus:outline-none transition-colors text-sm"
                      style={{ borderColor: form.challenge?.answer === i ? '#22c55e55' : 'rgba(255,255,255,0.08)' }} />
                  </div>
                ))}
              </div>
              <p className="text-white/20 text-xs mt-2">Cliquez sur le numéro pour marquer la bonne réponse</p>
            </div>
          </>
        )}
      </div>

      {/* Bouton enregistrer en bas */}
      <div className="shrink-0 p-4 border-t border-white/5">
        <button onClick={handleSave} disabled={!isValid || saving}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-30 hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: isValid ? '0 0 20px #3b82f644' : 'none' }}>
          {saving ? 'Enregistrement…' : isNew ? '✓ Créer le module' : '✓ Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
