import { createContext, useContext, useState } from 'react';

export type Mode = 'solo' | 'famille' | 'groupe' | null;
export type AgeRange = 'enfant' | 'ado' | 'adulte' | 'senior' | null;

export interface ChildProfile {
  age: AgeRange;
}

export interface Profile {
  mode: Mode;
  groupSize: number;
  adultsCount: number;
  avatar: string;
  color: string;
  name: string;
  age: AgeRange;
  children: ChildProfile[];
}

interface ProfileCtx {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  isComplete: boolean;
}

const DEFAULT: Profile = { mode: null, groupSize: 2, adultsCount: 1, avatar: '🤖', color: '#a855f7', name: '', age: null, children: [] };

const Ctx = createContext<ProfileCtx>({
  profile: DEFAULT,
  setProfile: () => {},
  isComplete: false,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(DEFAULT);

  const setProfile = (p: Partial<Profile>) =>
    setProfileState((prev) => ({ ...prev, ...p }));

  const isComplete = !!profile.mode && !!profile.name.trim() && !!profile.age;

  return (
    <Ctx.Provider value={{ profile, setProfile, isComplete }}>
      {children}
    </Ctx.Provider>
  );
}

export const useProfile = () => useContext(Ctx);
