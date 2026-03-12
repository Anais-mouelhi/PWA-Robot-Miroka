import { useState, useCallback } from 'react';

const KEY = 'miroka-validated';

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}

export function useProgress() {
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

  return { validated, validate, reset };
}
