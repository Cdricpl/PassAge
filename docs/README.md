# Pass'âge

> Comprendre. Agir. Avancer.

Application web (PWA) pour les jeunes de 18 à 25 ans en sortie d'aide à la jeunesse ou de famille d'accueil en **Belgique francophone**.

## En ligne

**https://cdricpl.github.io/Pass-ge/**

Déploiement automatique : chaque push sur `main` publie le dossier `03-version-pwa/` via `.github/workflows/deploy-pages.yml`.

---

## Ce que fait l'application

- **9 modules thématiques** — Administration, Argent, Études, Travail, Logement, Vie quotidienne, Loisirs, Santé, Urgences
- **59 fiches pratiques** avec informations vérifiées (montants, procédures, délais, numéros utiles)
- **Lexique** — 294 définitions accessibles au survol dans les fiches
- **Recherche** tolérante aux accents, apostrophes et tirets
- **Favoris** — marquer des fiches sans compte
- **Notes personnelles** par fiche
- **Contacts** personnels enregistrables
- **Rappels** à créer manuellement
- **Onboarding** à la première visite
- **Mode hors-ligne** — les fiches consultées restent accessibles sans réseau
- **Installable** sur Android et iOS (PWA)
- Mobile-first, accessible (ARIA, contraste, skip-link), langage volontairement simple

---

## Structure du dépôt

```
.
├── 03-version-pwa/               L'application déployée
│   ├── index.html                Shell de l'app
│   ├── manifest.webmanifest      Manifeste PWA (installable)
│   ├── service-worker.js         Cache hors-ligne
│   ├── build.js                  Compile les YAML → content.js + valide le contenu
│   ├── package.json
│   ├── content/
│   │   ├── modules/              9 fichiers YAML (un par module)
│   │   │   ├── admin.yaml
│   │   │   ├── argent.yaml
│   │   │   ├── etudes.yaml
│   │   │   ├── travail.yaml
│   │   │   ├── logement.yaml
│   │   │   ├── vie.yaml
│   │   │   ├── loisirs.yaml
│   │   │   ├── sante.yaml
│   │   │   └── urgence.yaml
│   │   └── lexique.yaml          294 définitions du lexique
│   ├── admin/
│   │   └── index.html            Interface d'édition visuelle (GitHub API)
│   └── assets/
│       ├── css/styles.css        Design system complet
│       ├── js/
│       │   ├── app.js            Router + toutes les interactions
│       │   ├── content.js        Contenu compilé — généré par build.js
│       │   └── sw-register.js    Enregistrement du service worker
│       ├── icons/                Icônes PWA + logo SFA
│       └── policy.html           Politique de confidentialité
├── docs/                         Documentation complémentaire
└── .github/workflows/
    └── deploy-pages.yml          Déploiement automatique GitHub Pages
```

---

## Modifier les contenus

### Via l'interface d'administration (recommandé)

Ouvre `03-version-pwa/admin/index.html` dans un navigateur.  
Entre ton Personal Access Token GitHub (permission `contents: write`).  
L'interface permet de modifier les fiches et le lexique avec validation avant envoi.  
Le build et le déploiement sont automatiques après chaque commit.

### Via les fichiers YAML (développeurs)

```bash
cd 03-version-pwa

# 1. Modifier les fichiers dans content/modules/ ou content/lexique.yaml
# 2. Compiler et valider
node build.js

# 3. Commit + push → déploiement automatique
```

> **Important** : ne modifie jamais `assets/js/content.js` directement. Ce fichier est généré par `build.js`.

`build.js` valide le contenu avant de générer (HTML équilibré, liens internes, champs obligatoires, entrées de lexique). Le build échoue si une erreur est détectée.

---

## Lancer l'app en local

```bash
cd 03-version-pwa

# Avec Python
python -m http.server 8000

# Ou avec Node.js
npx serve .
```

Ouvre [http://localhost:8000](http://localhost:8000).

> En `file://`, le service worker ne s'active pas. Pour tester le mode hors-ligne, utilise un serveur local.

### Tester sur téléphone

1. Lance le serveur local sur ton ordinateur.
2. Connecte ton téléphone au même Wi-Fi.
3. Trouve l'IP locale (`ipconfig` Windows / `ifconfig` macOS-Linux).
4. Ouvre `http://<ton-ip>:8000` dans le navigateur du téléphone.
5. Android (Chrome) → menu → "Installer l'application" / iOS (Safari) → partager → "Sur l'écran d'accueil".

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| App (exécution) | HTML / CSS / JavaScript pur — zéro dépendance |
| Build (dev) | Node.js — script `build.js` uniquement |
| Admin (éditeur) | js-yaml 4.1.0 + DOMPurify 3.2.4 (CDN) |
| PWA | Web App Manifest + Service Worker |
| Stockage | `localStorage` (favoris, notes, contacts, rappels) |
| Déploiement | GitHub Pages (auto sur push `main`) |

---

## Licence

À définir par le porteur du projet.

---

*Sources : Inforjeunes, Droit des Jeunes, Service Familles d'Accueil (Fédération Wallonie-Bruxelles).*
