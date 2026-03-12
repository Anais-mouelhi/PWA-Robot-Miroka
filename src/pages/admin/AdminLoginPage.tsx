import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const ok = login(password);
      if (ok) {
        navigate('/admin', { replace: true });
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col items-center justify-center px-6 overflow-hidden relative">

      <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#3b82f6', top: '0%', left: '50%', transform: 'translateX(-50%)' }} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">

        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl border border-blue-500/40 flex items-center justify-center text-2xl mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1a2e)', boxShadow: '0 0 30px #3b82f622' }}>
            ⚙️
          </div>
          <h1 className="text-white font-bold text-xl">Espace Admin</h1>
          <p className="text-white/30 text-sm mt-1">Enchanted Tools — Configuration</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••••"
              autoFocus
              className="w-full bg-white/5 border rounded-xl px-4 py-3 text-white
                         placeholder-white/20 focus:outline-none transition-colors text-sm"
              style={{ borderColor: error ? '#ef444488' : 'rgba(255,255,255,0.1)' }}
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">Mot de passe incorrect.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: password ? '0 0 20px #3b82f644' : 'none' }}>
            {loading ? 'Connexion…' : 'Accéder →'}
          </button>
        </form>

        <p className="text-white/15 text-xs text-center">
          Accès réservé à l'équipe Enchanted Tools
        </p>
      </div>
    </div>
  );
}
