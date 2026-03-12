import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useModules } from '../../hooks/useModules';
import { DEMO_MODULES } from '../../data/demoModules';
import { deleteModule, saveModule } from '../../lib/modules';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const { modules, loading } = useModules();
  const displayModules = modules.length > 0 ? modules : DEMO_MODULES;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    await Promise.all(DEMO_MODULES.map((m) => saveModule(m)));
    setSeeding(false);
    setSeedDone(true);
    setTimeout(() => setSeedDone(false), 3000);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteModule(id);
    setDeletingId(null);
    setConfirmId(null);
  };

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden text-white">

      {/* Header */}
      <header className="shrink-0 px-5 pt-5 pb-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm">
            ⚙️
          </div>
          <div>
            <p className="text-white font-bold text-sm">Espace Admin</p>
            <p className="text-white/30 text-xs">Enchanted Tools</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/floor-plan')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all">
            🗺️ Plan
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="px-3 py-2 rounded-xl text-xs text-white/30 border border-white/10 hover:text-white hover:border-white/20 transition-all">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">

        {/* Stats rapides */}
        <div className="shrink-0 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-center">
            <p className="text-2xl font-bold text-white">{displayModules.length}</p>
            <p className="text-blue-400 text-xs mt-0.5">Modules</p>
          </div>
          <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/10 text-center">
            <p className="text-2xl font-bold text-white">
              {displayModules.filter(m => m.mediaType !== 'none').length}
            </p>
            <p className="text-purple-400 text-xs mt-0.5">Avec média</p>
          </div>
          <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/10 text-center">
            <p className="text-2xl font-bold text-white">
              {displayModules.filter(m => m.challenge).length}
            </p>
            <p className="text-green-400 text-xs mt-0.5">Avec défi</p>
          </div>
        </div>

        {/* Bouton recréer les modules de démo */}
        {displayModules.length === 0 && (
          <div className="shrink-0 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
            <p className="text-yellow-400 text-sm font-semibold mb-1">⚠️ Aucun module trouvé</p>
            <p className="text-white/30 text-xs mb-3">Recréez les 11 modules de base pour commencer.</p>
            <button onClick={handleSeed} disabled={seeding}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 16px #f59e0b33' }}>
              {seeding ? '⏳ Création en cours…' : seedDone ? '✓ Modules créés !' : '🔄 Recréer les 11 modules'}
            </button>
          </div>
        )}

        {displayModules.length > 0 && (
          <button onClick={handleSeed} disabled={seeding}
            className="shrink-0 w-full py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/30 hover:text-white/50 hover:border-white/20 transition-all disabled:opacity-30">
            {seeding ? '⏳ Réinitialisation…' : seedDone ? '✓ Réinitialisé !' : '↺ Réinitialiser avec les données de démo'}
          </button>
        )}

        {/* Bouton nouveau module */}
        <button onClick={() => navigate('/admin/module/new')}
          className="shrink-0 w-full py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 0 20px #3b82f633' }}>
          + Nouveau module
        </button>

        {/* Liste modules */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-2 shrink-0">
            Modules ({displayModules.length})
          </p>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/20 text-sm">Chargement…</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2">
              {displayModules.map((mod) => (
                <div key={mod.id}
                  className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">

                  {/* Ligne principale */}
                  <div className="flex items-center gap-3 px-3 py-3">
                    {/* Numéro coloré */}
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0"
                      style={{ borderColor: mod.color, color: mod.color, backgroundColor: `${mod.color}15` }}>
                      {mod.number}
                    </span>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{mod.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {mod.mediaType !== 'none' && (
                          <span className="text-white/30 text-xs">
                            {mod.mediaType === 'audio' ? '🎵' : '🎬'} {mod.mediaType}
                          </span>
                        )}
                        {mod.images.length > 0 && (
                          <span className="text-white/30 text-xs">🖼️ {mod.images.length}</span>
                        )}
                        {mod.challenge && (
                          <span className="text-green-400/60 text-xs">✓ défi</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => navigate(`/admin/module/${mod.id}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-all">
                        Éditer
                      </button>
                      <button onClick={() => setConfirmId(mod.id)}
                        className="px-2 py-1.5 rounded-lg text-xs border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all">
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Confirmation suppression */}
                  {confirmId === mod.id && (
                    <div className="border-t border-white/5 px-3 py-2.5 flex items-center justify-between bg-red-500/5">
                      <p className="text-red-400 text-xs">Supprimer « {mod.name} » ?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-white/40 border border-white/10">
                          Annuler
                        </button>
                        <button onClick={() => handleDelete(mod.id)}
                          disabled={deletingId === mod.id}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50">
                          {deletingId === mod.id ? '…' : 'Supprimer'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
