import { createContext, useContext, useState, useCallback } from 'react';

interface ProgressCtx {
  validated: string[];
  validate: (id: string) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressCtx>({ validated: [], validate: () => {}, reset: () => {} });

const KEY = 'miroka-validated';
const load = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; } };

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [validated, setValidated] = useState<string[]>(load);

  const validate = useCallback((id: string) => {
    setValidated((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setValidated([]);
  }, []);

  return <Ctx.Provider value={{ validated, validate, reset }}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
