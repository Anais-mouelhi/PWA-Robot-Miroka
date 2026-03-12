import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

type ScanStatus = 'scanning' | 'success' | 'error';

export function QRScanPage() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' }, // caméra arrière
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        scanner.stop().catch(() => {});
        handleResult(decodedText);
      },
      () => {} // erreurs silencieuses pendant le scan
    ).catch(() => {
      setStatus('error');
      setMessage('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  const handleResult = (text: string) => {
    // Formats acceptés :
    // 1. URL complète : http://localhost:5173/module/etape-3
    // 2. ID direct : etape-3
    // 3. URL courte : miroka/etape-3
    let moduleId: string | null = null;

    try {
      const url = new URL(text);
      const parts = url.pathname.split('/');
      const idx = parts.indexOf('module');
      if (idx !== -1 && parts[idx + 1]) {
        moduleId = parts[idx + 1];
      }
    } catch {
      // Pas une URL — on essaie l'ID direct
      const clean = text.trim().toLowerCase();
      if (clean.startsWith('etape-') || clean.startsWith('module-')) {
        moduleId = clean;
      } else if (clean.includes('/')) {
        moduleId = clean.split('/').pop() ?? null;
      }
    }

    if (moduleId) {
      setStatus('success');
      setMessage(`Pièce détectée ! Ouverture…`);
      setTimeout(() => navigate(`/module/${moduleId}`), 800);
    } else {
      setStatus('error');
      setMessage('QR code non reconnu. Réessayez avec un QR Mirokaï.');
      setTimeout(() => setStatus('scanning'), 2000);
    }
  };

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden text-white">

      {/* Header */}
      <header className="shrink-0 px-5 pt-6 pb-4 flex items-center gap-3 border-b border-white/5">
        <button onClick={() => navigate('/experience')}
          className="text-white/40 hover:text-white text-sm transition-colors">
          ← Retour
        </button>
        <div>
          <p className="text-white font-bold">Scanner une pièce</p>
          <p className="text-white/30 text-xs">Pointez la caméra sur le QR code</p>
        </div>
      </header>

      {/* Zone scan */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 relative">

        {/* Fond lumineux */}
        <div className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#a855f7' }} />

        {/* Cadre caméra */}
        <div className="relative w-full max-w-xs">
          <div id="qr-reader" className="w-full rounded-2xl overflow-hidden" />

          {/* Coins décoratifs */}
          {status === 'scanning' && (
            <>
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-purple-400 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-lg pointer-events-none" />
            </>
          )}

          {/* Overlay succès */}
          {status === 'success' && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: '#22c55e22', border: '2px solid #22c55e' }}>
              <span className="text-5xl">✓</span>
            </div>
          )}

          {/* Overlay erreur */}
          {status === 'error' && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: '#ef444422', border: '2px solid #ef4444' }}>
              <span className="text-5xl">✕</span>
            </div>
          )}
        </div>

        {/* Message statut */}
        <div className="text-center">
          {status === 'scanning' && (
            <p className="text-white/40 text-sm animate-pulse">
              🔍 Recherche d'un QR code…
            </p>
          )}
          {status === 'success' && (
            <p className="text-green-400 text-sm font-semibold">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm">{message}</p>
          )}
        </div>

        {/* Info format QR */}
        <div className="w-full max-w-xs p-4 rounded-xl border border-white/5 bg-white/3 text-center">
          <p className="text-white/30 text-xs leading-relaxed">
            Les QR codes sont placés sur chaque station de la salle.<br />
            Scannez-les pour accéder directement au module.
          </p>
        </div>
      </div>
    </div>
  );
}
