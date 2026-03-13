import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

type ScanStatus = 'scanning' | 'success' | 'error' | 'permission';

export function QRScanPage() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [message, setMessage] = useState('');

  /* Arrête proprement la caméra avant toute navigation */
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && startedRef.current) {
      try {
        await scannerRef.current.stop();
      } catch { /* déjà stoppé */ }
      startedRef.current = false;
    }
  }, []);

  const goBack = useCallback(async () => {
    await stopScanner();
    navigate('/experience');
  }, [stopScanner, navigate]);

  const handleResult = useCallback((text: string) => {
    let moduleId: string | null = null;
    try {
      const url = new URL(text);
      const parts = url.pathname.split('/');
      const idx = parts.indexOf('module');
      if (idx !== -1 && parts[idx + 1]) moduleId = parts[idx + 1];
    } catch {
      const clean = text.trim().toLowerCase();
      if (clean.startsWith('etape-') || clean.startsWith('module-')) {
        moduleId = clean;
      } else if (clean.includes('/')) {
        moduleId = clean.split('/').pop() ?? null;
      }
    }

    if (moduleId) {
      setStatus('success');
      setMessage('Pièce détectée ! Ouverture…');
      const id = moduleId;
      stopScanner().then(() => {
        setTimeout(() => navigate(`/module/${id}`), 600);
      });
    } else {
      setStatus('error');
      setMessage('QR code non reconnu. Réessayez avec un QR Mirokaï.');
      setTimeout(() => setStatus('scanning'), 2000);
    }
  }, [stopScanner, navigate]);

  useEffect(() => {
    /* Petit délai pour s'assurer que le DOM est monté (Android) */
    const timer = setTimeout(() => {
      const scanner = new Html5Qrcode('qr-reader', { verbose: false });
      scannerRef.current = scanner;

      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (startedRef.current) handleResult(decodedText);
        },
        () => { /* frame errors silencieuses */ }
      ).then(() => {
        startedRef.current = true;
      }).catch((err) => {
        const msg = String(err);
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
          setStatus('permission');
        } else {
          setStatus('error');
          setMessage('Impossible d\'accéder à la caméra.');
        }
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [handleResult, stopScanner]);

  return (
    <div className="h-dvh bg-[#0A0A14] flex flex-col overflow-hidden text-white">

      {/* Header */}
      <header className="shrink-0 px-5 pt-6 pb-4 flex items-center gap-3 border-b border-white/5">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          ←
        </button>
        <div>
          <p className="text-white font-bold">Scanner une pièce</p>
          <p className="text-white/30 text-xs">Pointez la caméra sur le QR code</p>
        </div>
      </header>

      {/* Zone scan */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 relative">

        <div className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#a855f7' }} />

        {/* Cadre caméra — toujours dans le DOM pour html5-qrcode */}
        <div className="relative w-full max-w-xs">
          <div id="qr-reader" className="w-full rounded-2xl overflow-hidden bg-black/30" style={{ minHeight: 260 }} />

          {/* Coins décoratifs */}
          {status === 'scanning' && (
            <>
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-purple-400 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-lg pointer-events-none" />
            </>
          )}

          {status === 'success' && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: '#22c55e22', border: '2px solid #22c55e' }}>
              <span className="text-5xl">✓</span>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: '#ef444422', border: '2px solid #ef4444' }}>
              <span className="text-4xl">✕</span>
            </div>
          )}
        </div>

        {/* Message statut */}
        <div className="text-center px-4">
          {status === 'scanning' && (
            <p className="text-white/40 text-sm animate-pulse">🔍 Recherche d'un QR code…</p>
          )}
          {status === 'success' && (
            <p className="text-green-400 text-sm font-semibold">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm">{message}</p>
          )}
          {status === 'permission' && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-yellow-400 text-sm font-semibold">📷 Accès caméra refusé</p>
              <p className="text-white/40 text-xs leading-relaxed text-center">
                Autorisez l'accès à la caméra dans les paramètres de votre navigateur, puis rechargez la page.
              </p>
              <button
                onClick={goBack}
                className="mt-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: '#a855f7' }}
              >
                Retour à la carte
              </button>
            </div>
          )}
        </div>

        {status !== 'permission' && (
          <div className="w-full max-w-xs p-4 rounded-xl border border-white/5 bg-white/3 text-center">
            <p className="text-white/30 text-xs leading-relaxed">
              Les QR codes sont placés sur chaque station de la salle.<br />
              Scannez-les pour accéder directement au module.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
