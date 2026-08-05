# Publier Pass'âge sur le Google Play Store

Guide pas-à-pas pour publier la PWA Pass'âge sur le Play Store. Compte ~3 à 7 jours du début à la mise en ligne (dont 1 à 3 jours de validation Google).

---

## Vue d'ensemble — comment ça marche ?

Le Play Store n'accepte pas directement une PWA. La technique standard s'appelle **TWA (Trusted Web Activity)** : on emballe ta PWA dans une fine coque Android. L'utilisateur télécharge "Pass'âge" depuis le Play Store, et derrière le rideau c'est ton site web qui tourne en plein écran.

**Avantages** :
- L'app est cherchable sur le Play Store (visibilité)
- Mises à jour de contenu **automatiques** dès que tu mets à jour le site (pas besoin de re-publier)
- Pas de framework natif à maintenir
- Notifications push possibles (V2)

**Limite** : il faut un **domaine HTTPS** (la PWA doit être en ligne).

---

## ✅ Pré-requis (à régler AVANT de toucher au Play Store)

| # | Pré-requis | Coût | Combien de temps |
|---|---|---|---|
| 1 | **Compte Google Play Developer** | 25 USD (~23 €) une seule fois à vie | 1 h (vérification d'identité) |
| 2 | **Nom de domaine** (ex : `ton-domaine.be`, `monavenir-verviers.be`) | ~10–15 €/an | 30 min |
| 3 | **Hébergement HTTPS gratuit** : Netlify, Vercel, Cloudflare Pages, GitHub Pages | 0 € | 30 min |
| 4 | **Icônes PNG** 192×192 et 512×512 (à partir des SVG actuels) | 0 € | 10 min |
| 5 | **Politique de confidentialité** en ligne (obligatoire Play) | 0 € | déjà créée → `assets/policy.html` |
| 6 | **Captures d'écran** depuis ton GSM | 0 € | 30 min |
| 7 | **Logo officiel SFA Verviers** (recommandé) | 0 € | demande au service |

---

## Étape 1 — Acheter le domaine + héberger

### Option A — la plus simple (Netlify, recommandée)

1. Crée un compte gratuit sur [netlify.com](https://www.netlify.com)
2. **Drag & drop** le dossier `Majorité` entier sur la page d'accueil de Netlify (oui, vraiment)
3. Tu récupères une URL du type `https://random-name.netlify.app` — c'est déjà en HTTPS
4. **Lie ton domaine custom** : dans Netlify, "Domain settings" → "Add custom domain" → suis les instructions DNS
5. Achète ton domaine chez un registrar : **OVHcloud** (Belge), **Gandi**, **Namecheap**

### Option B — GitHub Pages (gratuit aussi)

1. Crée un repo GitHub
2. Push ton code dedans
3. Settings → Pages → Deploy from main branch
4. Tu récupères `https://username.github.io/repo` → custom domain idem

### Option C — OVHcloud (hébergement EU à 6€/mois)

Plus contrôle, plus cher. Recommandé pour la prod sérieuse à long terme.

---

## Étape 2 — Les icônes PNG ✅ déjà faites

Le Play Store exige du **PNG** (le SVG est refusé). Les fichiers sont déjà générés et présents dans le projet :

| Fichier | Rôle |
|---|---|
| `assets/icons/icon-512.png` | Icône de la fiche Play Store (obligatoire) |
| `assets/icons/icon-maskable-512.png` | Icône adaptative Android (plein cadre, glyphe en zone sûre) |
| `assets/icons/icon-192.png` | Icône PWA |

Le `manifest.webmanifest` les déclare déjà. **Rien à faire ici.**

L'**image vedette** (1024×500, obligatoire aussi) est fournie : `feature-graphic-1024x500.png`.

---

## Étape 3 — Compte Google Play Developer

1. Va sur [play.google.com/console/signup](https://play.google.com/console/signup)
2. Connecte-toi avec un compte Google (utilise un compte dédié pour le SFA, pas un perso)
3. **Type de compte** : **Organisation** (pour le SFA Verviers, pas perso)
4. Paye les **25 USD** une fois pour la vie
5. **Vérification d'identité** : carte ID, justificatif d'organisation. Compte 1-2 jours de validation Google.

---

## Étape 4 — Construire l'APK/AAB avec PWABuilder

[PWABuilder.com](https://www.pwabuilder.com) est un outil gratuit officiel Microsoft qui génère un AAB Android signé à partir d'une URL.

1. Va sur [pwabuilder.com](https://www.pwabuilder.com)
2. Entre ton URL : `https://ton-domaine.be`
3. PWABuilder analyse — tu dois avoir un score correct (100/100 idéalement)
4. Clic **"Package for stores"** → **Android**
5. Remplis :
   - **Package ID** : `be.famillesdaccueil.passage` (immuable une fois publié, choisis bien)
   - **App name** : `Pass'âge`
   - **Display mode** : `standalone`
   - **Notification permission** : `false` (pas en V1)
   - **Signing key** : choisis "Generate new" la 1re fois → ⚠️ **télécharge le `.keystore` et le mot de passe** et stocke-les **précieusement** (sans, tu ne pourras plus jamais mettre à jour l'app)
6. Télécharge le ZIP qui contient :
   - `app-release-bundle.aab` ← le fichier à uploader sur Play
   - `assetlinks.json` ← à héberger sur ton site
   - `signing-key-info.json` ← le secret précieux à archiver

---

## Étape 5 — Héberger `assetlinks.json` sur ton site

Pour prouver à Google que tu es bien propriétaire du domaine ET de l'app :

1. Place le fichier `assetlinks.json` fourni par PWABuilder dans un dossier `.well-known/` **à la racine du domaine**.
2. Vérifie qu'il répond : `https://ton-domaine.be/.well-known/assetlinks.json` doit retourner du JSON.

> ⚠️ **Le piège de GitHub Pages.** Google lit ce fichier **uniquement à la racine du domaine**, jamais dans un sous-dossier. Si ton app est publiée sur `https://cdricpl.github.io/PassAge/`, l'URL vérifiée sera `https://cdricpl.github.io/.well-known/assetlinks.json` — donc à la **racine du compte**, hors de ce dépôt.
>
> Deux solutions :
> - **Un dépôt `Cdricpl.github.io`** contenant simplement `.well-known/assetlinks.json` (gratuit, 5 minutes). Attention : ce fichier vaudra alors pour *tout* `cdricpl.github.io`.
> - **Un nom de domaine propre** (ex. `passage-app.be`, ~12 €/an) pointé vers GitHub Pages. Plus propre, plus crédible sur le Play Store, et tu maîtrises la racine. **C'est l'option recommandée.**

Un template prêt à compléter est fourni : `.well-known/assetlinks.json` (remplace le `package_name` et l'empreinte SHA-256 par ceux que PWABuilder t'a donnés).

---

## Étape 6 — Créer la fiche Play Console

Dans [play.google.com/console](https://play.google.com/console) :

1. **Create app** → "Pass'âge"
2. Langue par défaut : Français (Belgique)
3. App ou jeu : App
4. Gratuit ou payant : Gratuit
5. Coche les déclarations Google (CGU, programmes export…)

Puis remplis l'arborescence à gauche (Google indique ce qu'il manque). Toutes les infos textuelles sont prêtes dans **`store-listing.md`** dans ce projet.

### Étape 6a — Fiche du Play Store

| Champ | Source |
|---|---|
| Nom de l'app | `store-listing.md` § Nom |
| Description courte (80 car.) | `store-listing.md` § Description courte |
| Description complète (4000 car.) | `store-listing.md` § Description complète |
| Icône d'application | `assets/icons/icon-512.png` (à générer) |
| Image vedette (1024×500) | À créer (cf. `screenshots-checklist.md`) |
| Captures d'écran téléphone | Min 2, max 8. Cf. `screenshots-checklist.md` |
| URL politique de confidentialité | `https://ton-domaine.be/assets/policy.html` |
| Catégorie | **Éducation** ou **Style de vie** |
| Tags | Voir `store-listing.md` |
| Coordonnées | E-mail public obligatoire (le SFA) |

### Étape 6b — Politique du contenu

- **Public cible** : 13–17 + 18+ (l'app cible 18–25 mais peut être lue par jeunes plus jeunes)
- **Annonces** : Non
- **Achats in-app** : Non
- **Sécurité des données** : voir `store-listing.md` § Data Safety — **rien n'est collecté**, c'est un atout fort

### Étape 6c — Classification du contenu (IARC)

Réponds au questionnaire — pour Pass'âge :
- Violence : Non
- Sexualité : Non (mais info santé sexuelle / planning familial → Léger)
- Langage grossier : Non
- Drogues : Référencement de l'aide ↗ pas glamour
- Thèmes sensibles (mal-être, suicide) : OUI — l'app aborde la prévention
- → Probablement classé **PEGI 12** ou **Teen 13+**

---

## Étape 7 — Upload du AAB et soumission

1. Onglet **"Production"** ou **"Tests fermés"** d'abord
2. Crée une release → upload le `.aab` de PWABuilder
3. Notes de version (ce qui est nouveau dans cette version)
4. Sauvegarde
5. **Soumets à examen**

⏳ Validation Google : généralement **1 à 3 jours**, parfois plus pour la 1re soumission.

---

## Étape 8 — Après publication

- L'app est cherchable sur Play Store
- **Mises à jour du contenu** : tu mets à jour ton site (Netlify auto), les utilisateurs récupèrent dès leur prochaine ouverture (le service worker fait son boulot). **Pas besoin de re-publier sur Play.**
- **Mise à jour de l'app native** (Bubblewrap) : seulement si tu veux changer permissions, icônes, package name, target SDK Android. Re-générer un AAB avec PWABuilder, bumper le `versionCode`, re-uploader.

---

## ⚠️ Pièges à éviter

| Piège | Conséquence | Solution |
|---|---|---|
| Perdre le `.keystore` | **Tu ne pourras plus jamais publier de mise à jour**. L'app meurt. | Sauvegarde dans 3 endroits différents (drive privé, USB, e-mail à toi-même) |
| Modifier le `package name` après publication | Crée une 2e app, perd les avis | Choisis bien dès le départ |
| Pas de politique de confidentialité ou inaccessible | Rejet automatique | Vérifie que l'URL répond avant soumission |
| Captures d'écran trop "designed" / fausses | Rejet | Captures réelles, depuis l'app, pas de mockups |
| Cibler 12+ alors que mention de suicide | Suspendu | Classifie correctement (Teen / PEGI 12) |
| `assetlinks.json` mal hébergé | L'app s'ouvre dans Chrome au lieu du mode standalone | Vérifie sur [developers.google.com/digital-asset-links/tools/generator](https://developers.google.com/digital-asset-links/tools/generator) |

---

## Coûts totaux

| Poste | Une fois | Récurrent |
|---|---|---|
| Compte Play Developer | 25 USD (~23 €) | 0 |
| Domaine | 0 | 10–15 €/an |
| Hébergement Netlify/Vercel/Cloudflare | 0 | 0 |
| **Total** | **~23 €** | **~12 €/an** |

---

## Et l'App Store iOS ?

Pas couvert ici, mais possible avec le même principe via [PWABuilder iOS package](https://docs.pwabuilder.com/#/builder/app-store) (encore en early stage Apple). Plus restrictif :
- Compte Apple Developer : **99 USD/an**
- Validation Apple plus stricte
- iOS Safari mode standalone fonctionne déjà depuis le navigateur ("Sur l'écran d'accueil") — tu peux peut-être attendre.

---

## Documents prêts dans ce projet

- ✅ `docs/PUBLICATION.md` — ce guide
- ✅ `docs/store-listing.md` — tous les textes prêts à coller dans Play Console
- ✅ `03-version-pwa/assets/policy.html` — politique de confidentialité publique
- ✅ `03-version-pwa/.well-known/assetlinks.json` — template à compléter
- ✅ `03-version-pwa/assets/icons/icon-512.png` + `icon-maskable-512.png` + `icon-192.png`
- ✅ `feature-graphic-1024x500.png` — image vedette
- ✅ 6 captures d'écran réelles au format 1079×1918

Bonne route. Si tu bloques à une étape, dis-moi laquelle.
