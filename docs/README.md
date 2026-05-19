# Pass'âge

> Comprendre. Agir. Avancer.

Application web (PWA) pour les jeunes majeurs (18–25 ans), principalement les jeunes sortant de l'aide à la jeunesse et des familles d'accueil en Belgique francophone.

## En ligne

Version déployée : **https://cdricpl.github.io/Pass-ge/**

Le déploiement est automatique : à chaque push sur `main`, le workflow `.github/workflows/deploy-pages.yml` publie le dossier `03-version-pwa/` à la racine de GitHub Pages.

## Lancer l'app en local

Toute l'app vit dans le dossier `03-version-pwa/`.

### Option 1 — ouverture directe (rapide)

Double-clique sur `03-version-pwa/index.html` — l'app s'ouvre dans ton navigateur.

> Note : en `file://`, le service worker (mode hors-ligne) ne fonctionne pas. Pour tester le mode hors-ligne, utilise l'option 2.

### Option 2 — serveur local (recommandé)

Depuis le dossier `03-version-pwa/`, lance un mini-serveur :

```bash
cd 03-version-pwa

# Avec Python (souvent déjà installé)
python -m http.server 8000

# Ou avec Node.js
npx serve .
```

Puis ouvre [http://localhost:8000](http://localhost:8000).

### Tester sur ton téléphone

1. Lance le serveur sur ton ordinateur (`python -m http.server 8000`).
2. Connecte ton téléphone au même Wi-Fi.
3. Trouve l'IP locale de ton ordi (`ipconfig` sous Windows, `ifconfig` sous macOS/Linux).
4. Ouvre `http://<ton-ip>:8000` dans le navigateur du téléphone.
5. Sur Android (Chrome) → menu → "Installer l'application". Sur iOS (Safari) → partager → "Sur l'écran d'accueil". Tu as une vraie app installée.

## Structure du dépôt

```
.
├── 03-version-pwa/               L'app déployée (la seule version maintenue)
│   ├── index.html                Shell de l'app (header, main, bottom nav)
│   ├── manifest.webmanifest      Manifeste PWA (installable sur téléphone)
│   ├── service-worker.js         Cache pour fonctionnement hors-ligne
│   └── assets/
│       ├── css/
│       │   └── styles.css        Design system complet
│       ├── js/
│       │   ├── content.js        TOUS les contenus (modules, parcours, fiches)
│       │   └── app.js            Routing + interactions
│       ├── icons/
│       │   ├── icon-192.svg
│       │   └── icon-512.svg
│       └── policy.html           Politique de confidentialité
├── docs/                         Documentation, fiche source, listing store
├── archive/                      Anciens prototypes conservés (non déployés)
│   ├── 01-prototype-simple/      1er prototype mono-fichier
│   ├── 02-version-separee/       Version intermédiaire
│   ├── admin/                    Ancien outil d'édition local
│   └── open_chrome_no_cache.bat
└── .github/workflows/
    └── deploy-pages.yml          Déploiement automatique GitHub Pages
```

> Le dossier `archive/` n'est jamais publié : le workflow ne déploie que `03-version-pwa/`. Il est conservé pour référence et l'historique git reste intact.

## Modifier les contenus

Tout est dans **`03-version-pwa/assets/js/content.js`**. Pas de base de données, pas de CMS pour l'instant — c'est un fichier JavaScript que tu peux ouvrir dans n'importe quel éditeur.

- **Ajouter une fiche dans un module** : trouve le module concerné, ajoute un objet dans `sections`.
- **Ajouter un parcours** (situation de vie) : ajoute un objet dans `SITUATIONS`.
- **Modifier une fiche** : la propriété `body` accepte du HTML (titres `<h2>`, paragraphes, listes `<ul>`, callouts `<div class="callout tip">`, etc.).
- **Mettre à jour un numéro d'urgence** : c'est dans la fonction `renderUrgence()` de `app.js`.

## Fonctionnalités du MVP

- 8 modules thématiques (Devenir majeur, Administratif, Argent, Études, Travail, Logement, Vie quotidienne, Aide & urgences).
- 5 parcours guidés par situation de vie.
- Recherche tolérante aux accents.
- Favoris (sauvegardés localement, sans compte).
- Bouton Aide / Urgence permanent avec numéros gratuits.
- Mode hors-ligne (les fiches consultées restent accessibles sans réseau).
- Mobile-first, accessible, langage simple.

## Pas inclus dans le MVP

À prévoir en V2/V3 (cf. document d'architecture) :

- Backend / API.
- Compte utilisateur synchronisé.
- CMS pour les non-développeurs (Strapi, Directus).
- Simulateurs (RIS, garantie locative, budget).
- Géolocalisation des services.
- Notifications.
- Multi-langues.
- Lecture audio des fiches.

## Avant de mettre en ligne

⚠️ Le contenu actuel est un point de départ basé sur la Fiche Majorité. **Avant toute publication réelle**, il faut :

1. **Faire relire chaque fiche par un·e juriste / travailleur·euse social·e** (Droit des Jeunes, Inforjeunes). L'info erronée fait perdre des droits.
2. **Tester avec 5–10 jeunes du public cible** (sortants AAJ/FA), pas avec des étudiants.
3. **Vérifier les montants, seuils et procédures** — ils changent en Belgique.
4. **Mettre en place un plan de mise à jour annuel**.

## Stack technique

- HTML/CSS/JavaScript pur (zéro dépendance, zéro build).
- PWA installable (manifest + service worker).
- Stockage local (favoris) via `localStorage`.

Pas de framework, pas de bundler. Tout est éditable à la main.

## Licence

À définir par le porteur du projet (suggestion : licence libre type MIT ou CC BY-NC-SA pour un projet à impact social).

---

Sources principales : Fiche Majorité (Service Familles d'Accueil), Inforjeunes, Droit des Jeunes.
