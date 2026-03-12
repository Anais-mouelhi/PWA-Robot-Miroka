import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCmo3SF7X0LNWmhp_YGhXZGNm0o9HJmsvQ',
  authDomain: 'pwa-robot-miroka.firebaseapp.com',
  projectId: 'pwa-robot-miroka',
  storageBucket: 'pwa-robot-miroka.firebasestorage.app',
  messagingSenderId: '704301310649',
  appId: '1:704301310649:web:7b8260dc0cc8d2a244b168',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MODULES = [
  {
    id: 'etape-1', number: 1, color: '#a855f7',
    name: 'Naissance de Mirokaï',
    description: "Découvrez comment est né le projet Mirokaï au sein d'Enchanted Tools. Une vision : créer des robots humanoïdes capables d'émotions et d'interactions naturelles.",
    mediaType: 'none', images: [], position: { x: 50, y: 13 },
    challenge: { question: 'Où est basée Enchanted Tools ?', choices: ['Londres', 'Paris', 'Berlin', 'Tokyo'], answer: 1 },
  },
  {
    id: 'etape-2', number: 2, color: '#8b5cf6',
    name: 'La Planète Nimira',
    description: "Nimira est la planète fictive d'origine des Mirokaï. Un monde imaginaire riche en lore, qui inspire l'esthétique et la philosophie du projet.",
    mediaType: 'none', images: [], position: { x: 71.3, y: 20.9 },
    challenge: { question: "Comment s'appelle la planète d'origine des Mirokaï ?", choices: ['Kepler', 'Nimira', 'Aurora', 'Nexus'], answer: 1 },
  },
  {
    id: 'etape-3', number: 3, color: '#7c3aed',
    name: "L'Énergie Mirium",
    description: "Le Mirium est l'énergie vitale des Mirokaï. Cette force invisible alimente leur intelligence et leurs émotions. Elle symbolise la connexion entre humains et robots.",
    mediaType: 'none', images: [], position: { x: 84.4, y: 36.9 },
    challenge: { question: 'Quel est le rôle du Mirium pour les Mirokaï ?', choices: ['Les refroidir', 'Leur énergie vitale', 'Leur langage', 'Leur mémoire'], answer: 1 },
  },
  {
    id: 'etape-4', number: 4, color: '#6d28d9',
    name: 'Architecture du Robot',
    description: "Explorez la structure interne d'un Mirokaï : capteurs, actionneurs, processeurs. Chaque composant est conçu pour reproduire les mouvements humains avec précision.",
    mediaType: 'none', images: [], position: { x: 84.4, y: 55.9 },
    challenge: { question: "Quel composant détecte l'environnement du Mirokaï ?", choices: ['Actionneur', 'Capteur', 'Batterie', 'Ecran'], answer: 1 },
  },
  {
    id: 'etape-5', number: 5, color: '#ec4899',
    name: 'Les Émotions',
    description: "Les Mirokaï sont conçus pour exprimer des émotions authentiques. Joie, curiosité, surprise — découvrez comment la technologie imite le ressenti humain.",
    mediaType: 'none', images: [], position: { x: 71.3, y: 71.1 },
    challenge: { question: 'Combien d\'émotions de base les Mirokaï peuvent-ils exprimer ?', choices: ['3', '6', '12', '24'], answer: 1 },
  },
  {
    id: 'etape-6', number: 6, color: '#db2777',
    name: 'Interaction Humain-Robot',
    description: "Comment communiquer avec un Mirokaï ? Voix, gestes, regard — les interfaces naturelles permettent une relation intuitive entre l'humain et la machine.",
    mediaType: 'none', images: [], position: { x: 50, y: 79 },
    challenge: { question: 'Quel sens le Mirokaï utilise-t-il en priorité pour interagir ?', choices: ['Le toucher', 'La vue', "L'ouïe", "L'odorat"], answer: 2 },
  },
  {
    id: 'etape-7', number: 7, color: '#be185d',
    name: 'Intelligence Artificielle',
    description: "Le cerveau du Mirokaï repose sur une IA avancée. Apprentissage, adaptation, prise de décision — découvrez les algorithmes qui donnent vie aux robots.",
    mediaType: 'none', images: [], position: { x: 28.7, y: 71.1 },
    challenge: { question: 'Que signifie "apprentissage automatique" pour un robot ?', choices: ['Il mémorise des textes', "Il apprend de l'expérience", 'Il copie un humain', 'Il exécute un script'], answer: 1 },
  },
  {
    id: 'etape-8', number: 8, color: '#3b82f6',
    name: 'Fabrication',
    description: "Des ateliers parisiens aux chaînes d'assemblage — suivez le parcours de fabrication d'un Mirokaï, de la conception 3D au robot final prêt à l'emploi.",
    mediaType: 'none', images: [], position: { x: 15.6, y: 55.9 },
    challenge: { question: 'Où sont fabriqués les Mirokaï ?', choices: ['Tokyo', 'Shanghai', 'Paris', 'Berlin'], answer: 2 },
  },
  {
    id: 'etape-9', number: 9, color: '#2563eb',
    name: 'Usages & Applications',
    description: "Accueil, médiation culturelle, aide aux personnes âgées — les Mirokaï trouvent leur place dans de nombreux secteurs. Explorez leurs champs d'application.",
    mediaType: 'none', images: [], position: { x: 15.6, y: 36.9 },
    challenge: { question: 'Dans quel secteur les Mirokaï sont-ils déployés en premier ?', choices: ['Industrie', 'Accueil & culture', 'Agriculture', 'Transport'], answer: 1 },
  },
  {
    id: 'etape-10', number: 10, color: '#06b6d4',
    name: 'Éthique & Futur',
    description: "Quelles responsabilités accompagnent la création de robots humanoïdes ? Enchanted Tools place l'éthique au cœur de sa démarche pour un futur humain-robot harmonieux.",
    mediaType: 'none', images: [], position: { x: 28.7, y: 20.9 },
    challenge: { question: "Quelle valeur est au cœur de la démarche d'Enchanted Tools ?", choices: ['La vitesse', "L'éthique", 'Le profit', 'La performance'], answer: 1 },
  },
  {
    id: 'etape-11', number: 11, color: '#0891b2',
    name: 'Rencontre avec Mirokaï',
    description: "Le moment est venu — vous êtes face à un vrai Mirokaï. Observez, interagissez, et vivez l'expérience unique d'une rencontre entre humain et robot.",
    mediaType: 'none', images: [], position: { x: 50, y: 21 },
    challenge: { question: 'Après cette expérience, comment décririez-vous un Mirokaï ?', choices: ['Une machine froide', 'Un être vivant et expressif', 'Un jouet', 'Un ordinateur'], answer: 1 },
  },
];

console.log('🚀 Seed Firestore — Mirokaï Experience');
console.log(`📦 ${MODULES.length} modules à créer…\n`);

let ok = 0;
for (const mod of MODULES) {
  try {
    await setDoc(doc(db, 'modules', mod.id), mod);
    console.log(`  ✓ ${mod.number}. ${mod.name}`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${mod.name}:`, e.message);
  }
}

console.log(`\n✅ ${ok}/${MODULES.length} modules créés dans Firestore.`);
process.exit(0);
