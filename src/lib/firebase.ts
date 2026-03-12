import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCmo3SF7X0LNWmhp_YGhXZGNm0o9HJmsvQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'pwa-robot-miroka.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'pwa-robot-miroka',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'pwa-robot-miroka.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '704301310649',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:704301310649:web:7b8260dc0cc8d2a244b168',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
