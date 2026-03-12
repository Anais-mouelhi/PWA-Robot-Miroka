import { useEffect, useState } from 'react';
import { subscribeModules } from '../lib/modules';
import type { Module } from '../types';

export function useModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeModules((data) => {
      setModules(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { modules, loading };
}
