import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Module } from '../types';

const COL = 'modules';

export function subscribeModules(cb: (modules: Module[]) => void) {
  const q = query(collection(db, COL), orderBy('number'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Module)));
  });
}

export async function saveModule(module: Module) {
  await setDoc(doc(db, COL, module.id), module, { merge: true });
}

export async function deleteModule(id: string) {
  await deleteDoc(doc(db, COL, id));
}

export async function updatePosition(id: string, x: number, y: number) {
  await setDoc(doc(db, COL, id), { position: { x, y } }, { merge: true });
}

const SETTINGS_COL = 'settings';

export async function saveRobotPosition(x: number, y: number) {
  await setDoc(doc(db, SETTINGS_COL, 'robot'), { x, y });
}

export function subscribeRobotPosition(cb: (pos: { x: number; y: number } | null) => void) {
  return onSnapshot(doc(db, SETTINGS_COL, 'robot'), (snap) => {
    cb(snap.exists() ? (snap.data() as { x: number; y: number }) : null);
  });
}
