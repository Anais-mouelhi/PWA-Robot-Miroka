# Mirokaï Experience — PWA

Application web progressive (PWA) pour accompagner les visiteurs dans la **Mirokaï Experience** d'Enchanted Tools Paris — une expérience immersive de découverte des robots humanoïdes Mirokaï au 18 rue de la Fontaine au Roi, Paris 11e.

---

## Sommaire

1. [Architecture](#architecture)
2. [Stack technique](#stack-technique)
3. [Installation locale](#installation-locale)
4. [Variables d'environnement](#variables-denvironnement)
5. [Structure du projet](#structure-du-projet)
6. [Flux visiteur](#flux-visiteur)
7. [Espace admin](#espace-admin)
8. [Exemples de données Firestore](#exemples-de-données-firestore)
9. [Déploiement Vercel](#déploiement-vercel)
10. [Conventions de code](#conventions-de-code)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Navigateur / PWA                    │
│                                                         │
│  ┌──────────────┐   ┌──────────────┐  ┌──────────────┐ │
│  │  App Visiteur│   │  Espace Admin│  │  Service     │ │
│  │  (React SPA) │   │  (React SPA) │  │  Worker (SW) │ │
│  └──────┬───────┘   └──────┬───────┘  └──────────────┘ │
│         │                  │                            │
│  ┌──────▼──────────────────▼──────────────────────────┐ │
│  │              React Router (client-side)             │ │
│  │  /onboarding  /intro  /experience  /module/:id      │ │
│  │  /dashboard   /reward  /scan                        │ │
│  │  /admin/login  /admin  /admin/editor  /admin/module │ │
│  └─────────────────────────┬──────────────────────────┘ │
└────────────────────────────┼────────────────────────────┘
                             │ Firebase SDK
                    ┌────────▼────────┐
                    │  Firebase       │
                    │  Firestore      │
                    │  (collection    │
                    │   "modules")    │
                    └─────────────────┘
```

**Flux de données :**
- Les modules (étapes) sont stockés dans Firestore et lus en temps réel via `onSnapshot`.
- Les données de profil visiteur et la progression sont persistées dans `localStorage`.
- La position du robot sur la carte est sauvegardée dans `localStorage` (clé `miroki-robot-position`).
- L'admin est protégé par un mot de passe côté client (`AdminAuthContext`).

---

## Stack technique

| Technologie | Usage |
|---|---|
| React 19 + Vite 7 | Frontend SPA |
| TypeScript 5 | Typage statique |
| Tailwind CSS 3 | Styles utilitaires |
| React Router DOM 7 | Navigation client-side |
| Firebase Firestore | Base de données temps réel |
| vite-plugin-pwa | Manifest + Service Worker |
| Framer Motion | Animations |
| html5-qrcode | Scanner QR code |
| Vercel | Hébergement |

---

## Installation locale

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Anais-mouelhi/PWA-Robot-Miroka-.git
cd PWA-Robot-Miroka-

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env
# → Remplir les valeurs Firebase (voir section suivante)

# 4. Lancer le serveur de développement
npm run dev
# → http://localhost:5173

# 5. Build de production
npm run build

# 6. Prévisualiser le build
npm run preview
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine (ne pas commiter) :

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=pwa-robot-miroka.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pwa-robot-miroka
VITE_FIREBASE_STORAGE_BUCKET=pwa-robot-miroka.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=704301310649
VITE_FIREBASE_APP_ID=1:704301310649:web:...
```

> Ces valeurs se trouvent dans la console Firebase → Paramètres du projet → Vos applications.

> **Note :** Des valeurs de fallback sont intégrées dans `src/lib/firebase.ts` pour permettre le fonctionnement sans `.env` (utile sur Vercel si les variables ne sont pas configurées).

---

## Structure du projet

```
PWA-Mirokaï/
├── public/                     # Assets statiques servis directement
│   ├── avatar-1.png … avatar-6.png
│   ├── experience-bg.png       # Fond de la carte interactive
│   ├── robot-plan.svg          # Personnage robot sur la carte
│   ├── nimira-character.png    # Personnage page d'accueil
│   ├── miroki-logo.svg
│   ├── enchanted-logo.svg
│   ├── miroka-text.svg
│   ├── miroki-intro.png        # Fond page intro
│   └── module-video-thumb.png  # Miniature vidéo par défaut
│
├── scripts/
│   └── seed.mjs                # Script de re-seed Firestore (Node.js)
│
├── src/
│   ├── main.tsx                # Point d'entrée React
│   ├── App.tsx                 # Routes React Router
│   ├── index.css               # Styles globaux
│   │
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript (Module, Challenge…)
│   │
│   ├── lib/
│   │   ├── firebase.ts         # Initialisation Firebase
│   │   └── modules.ts          # CRUD Firestore (getModules, saveModule, updatePosition…)
│   │
│   ├── data/
│   │   └── demoModules.ts      # 11 modules de démo (fallback hors connexion)
│   │
│   ├── hooks/
│   │   ├── useModules.ts       # Hook temps réel onSnapshot Firestore
│   │   └── useProgress.ts      # Hook progression visiteur
│   │
│   ├── context/
│   │   ├── ProfileContext.tsx  # Profil visiteur (mode, nom, avatar, âge…)
│   │   ├── ProgressContext.tsx # Modules validés + points
│   │   └── AdminAuthContext.tsx# Authentification admin (localStorage)
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── Loader.tsx
│   │       ├── ScoreBadge.tsx
│   │       └── StarField.tsx
│   │
│   └── pages/
│       ├── OnboardingPage.tsx  # Bienvenue + création profil
│       ├── MirokiIntroPage.tsx # Introduction histoire Mirokaï
│       ├── ExperiencePage.tsx  # Carte interactive + modules
│       ├── ModulePage.tsx      # Quiz / challenge par module
│       ├── DashboardPage.tsx   # Tableau de bord visiteur
│       ├── QRScanPage.tsx      # Scanner QR code
│       ├── RewardPage.tsx      # Page récompense finale
│       └── admin/
│           ├── AdminLoginPage.tsx   # Login admin
│           ├── AdminDashboard.tsx   # Dashboard admin
│           ├── ModuleFormPage.tsx   # Créer / modifier un module
│           └── FloorPlanEditor.tsx  # Éditeur drag & drop positions
│
├── vercel.json                 # Réécriture SPA pour Vercel
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Flux visiteur

```
Bienvenue
   │
   ▼
Créer son profil
  ├── Mode : Solo / Groupe / Famille
  ├── Avatar + couleur
  ├── Prénom ou nom d'équipe
  └── Tranche d'âge (solo uniquement)
   │
   ▼
Introduction Mirokaï  (4 étapes animées)
   │
   ▼
Carte interactive  (/experience)
  ├── 11 modules sur le plan
  ├── Robot draggable avec bulle
  └── Clic module → Modal (vidéo + quiz)
         │
         ▼
      Quiz (/module/:id)
        ├── Question à choix multiples
        ├── Timer 30s
        ├── Indice disponible
        └── Validation → +points
   │
   ▼ (11 modules validés)
Scanner QR code  (/scan)
   │
   ▼
Récompense finale  (/reward)
```

---

## Espace admin

### Accès

URL : `/admin/login`
Mot de passe par défaut : **`enchanted2024`**

> Pour changer le mot de passe : modifier la constante `ADMIN_PASSWORD` dans `src/context/AdminAuthContext.tsx`.

### Fonctionnalités

#### 1. Dashboard admin (`/admin`)

Vue d'ensemble des modules avec accès rapide aux actions.

#### 2. Créer / modifier un module (`/admin/module/:id`)

Champs disponibles :

| Champ | Type | Description |
|---|---|---|
| `number` | number | Numéro d'ordre (1–11) |
| `name` | string | Nom affiché sur la carte |
| `description` | string | Texte du cartel |
| `color` | string (hex) | Couleur du marqueur |
| `mediaType` | `'video' \| 'audio' \| 'none'` | Type de média |
| `mediaUrl` | string (URL) | Lien vers la vidéo ou l'audio |
| `challenge.question` | string | Question du quiz |
| `challenge.choices` | string[] (4) | 4 propositions |
| `challenge.answer` | number (0–3) | Index de la bonne réponse |

#### 3. Éditeur de plan (`/admin/editor`)

- Glisser-déposer les modules sur le fond de carte
- Glisser-déposer le robot pour repositionner sa position par défaut
- Cliquer **"💾 Sauver"** pour envoyer toutes les positions vers Firestore
- Les positions sont sauvegardées en `{ x: number, y: number }` (pourcentages 0–100)

> **Important :** Attendre que le chargement Firestore soit terminé (indicateur ⏳) avant de déplacer ou sauvegarder des modules.

---

## Exemples de données Firestore

Collection : **`modules`**

Document exemple (`etape-1`) :

```json
{
  "id": "etape-1",
  "number": 1,
  "name": "Naissance de Mirokaï",
  "description": "Découvrez comment est né le projet Mirokaï au sein d'Enchanted Tools.",
  "color": "#a855f7",
  "mediaType": "none",
  "mediaUrl": "",
  "images": [],
  "position": {
    "x": 82,
    "y": 78
  },
  "challenge": {
    "question": "Où est basée Enchanted Tools ?",
    "choices": ["Londres", "Paris", "Berlin", "Tokyo"],
    "answer": 1
  }
}
```

### Re-seeder la base de données

Si les modules disparaissent de Firestore, re-peupler avec :

```bash
node scripts/seed.mjs
```

> Nécessite que les variables Firebase soient accessibles dans l'environnement Node (ou modifier directement `scripts/seed.mjs` avec les valeurs hardcodées).

---

## Déploiement Vercel

### Première mise en production

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel --prod
```

### Mises à jour

```bash
git add .
git commit -m "feat: ..."
git push origin main
# → Vercel redéploie automatiquement
```

### Configuration requise sur Vercel

1. Dashboard Vercel → Settings → **Environment Variables**
2. Ajouter les 6 variables `VITE_FIREBASE_*` (voir section [Variables d'environnement](#variables-denvironnement))

### Routing SPA

Le fichier `vercel.json` gère la réécriture pour React Router :

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Sans ce fichier, les routes directes (ex. `/admin/login`) renverraient une erreur 404.

---

## Conventions de code

- **Grille 8px** — tous les espacements et tailles respectent des multiples de 8px
- **`h-dvh`** plutôt que `h-screen` — pour le viewport dynamique mobile (iOS Safari)
- **`overflow: clip`** sur `html/body` — bloque le scroll global sans casser les scrolls internes
- **Firestore avec `merge: true`** — `setDoc(..., { merge: true })` pour ne jamais écraser des champs non modifiés
- **Fallback données** — `useModules` retourne `DEMO_MODULES` si Firestore est vide ou hors ligne
- **Positions en pourcentages** — les positions `x`/`y` des modules sont en % (0–100) pour être indépendantes de la résolution d'écran

---

## Licence

Projet privé — Enchanted Tools Paris © 2026. Tous droits réservés.
