# Contribuer au contenu de Pass'âge

Le contenu de Pass'âge (fiches, modules, mots-clés de recherche) est stocké dans des fichiers YAML simples.
Tu peux les éditer directement sur GitHub.com sans toucher au JavaScript.

---

## Structure des fichiers

```
03-version-pwa/
  content/
    modules/
      majeur.yaml      ← Devenir majeur
      admin.yaml       ← Administratif & juridique
      argent.yaml      ← Argent & aides
      etudes.yaml      ← Études & formations
      travail.yaml     ← Travail
      logement.yaml    ← Logement
      vie.yaml         ← Vie quotidienne
      loisirs.yaml     ← Loisirs
      sante.yaml       ← Santé & bien-être
      urgence.yaml     ← Aide & urgences
    lexique.yaml       ← Mots-clés de recherche (synonymes)
    content.template.js ← Ne pas modifier (squelette JS)
  build.js             ← Script de build (génère content.js à partir des YAML)
```

---

## Modifier une fiche existante

1. Navigue dans `03-version-pwa/content/modules/` sur GitHub.com
2. Ouvre le fichier YAML du module concerné (ex. `logement.yaml`)
3. Trouve la section à modifier (cherche son `id:` ou son `title:`)
4. Modifie les champs voulus :
   - `title` : le titre affiché
   - `summary` : le résumé court (1-2 lignes)
   - `lastChecked` : date de dernière vérification (`JJ/MM/AAAA`)
   - `body` : le contenu HTML complet (voir format ci-dessous)
5. Clique sur **Commit changes** — GitHub Actions rebuildera automatiquement `content.js`

---

## Ajouter une nouvelle fiche

1. Ouvre le fichier YAML du module qui convient
2. Copie-colle un bloc `section` existant (à la fin de la liste `sections:`)
3. Change `id:` (un identifiant unique en minuscules avec tirets, ex. `ma-nouvelle-fiche`)
4. Remplis `title`, `summary`, `lastChecked`, et `body`
5. Commit — la fiche sera accessible à l'URL `#/fiche/{module}/{id}`

Exemple de bloc section complet :

```yaml
  - id: ma-nouvelle-fiche
    title: "Ma nouvelle fiche"
    summary: "Un résumé court et clair."
    lastChecked: "09/06/2026"
    body: |
      <p>Le contenu HTML ici.</p>

      <h2>Une section</h2>
      <p>Un paragraphe avec <strong>du gras</strong> et un <a href="https://exemple.be">lien</a>.</p>
```

Pour une fiche qui redirige vers une autre (alias), utilise `linkTo` à la place de `body` :

```yaml
  - id: mon-alias
    title: "Titre de l'alias"
    summary: "Redirige vers la vraie fiche."
    linkTo: module/id-de-la-fiche-source
```

---

## Ajouter des mots-clés de recherche

Le fichier `content/lexique.yaml` associe des termes saisis par l'utilisateur aux fiches correspondantes.

Exemple :

```yaml
"mon nouveau terme":
  - module/fiche-id-1
  - module/fiche-id-2
```

Règles :
- Les clés sont en minuscules, sans accents, telles qu'un utilisateur pourrait les taper
- Prévois aussi la version avec accents si pertinent (`galere` ET `galère`)
- Les valeurs sont des chemins `module/fiche-id`

---

## Format du `body` HTML

Le champ `body` contient du HTML. Tags supportés :

| Tag | Usage |
|-----|-------|
| `<p>` | Paragraphe |
| `<h2>` | Titre de section |
| `<h3>` | Sous-titre |
| `<ul>` / `<li>` | Liste à puces |
| `<ol class="fiche-ol">` / `<li>` | Liste numérotée |
| `<strong>` | Texte en gras |
| `<a href="...">` | Lien externe ou interne |
| `<pre>` | Code / exemple de texte formaté |

### Liens internes

Pour lier vers une autre fiche :
```html
<a href="#/fiche/module/fiche-id">Texte du lien</a>
```

Pour lier vers un module entier :
```html
<a href="#/module/logement">Voir le module Logement</a>
```

### Callouts (encadrés d'information)

```html
<div class="callout tip"><div><strong>Bon à savoir</strong>Le texte du callout ici.</div></div>
<div class="callout warn"><div><strong>Attention</strong>Un avertissement important.</div></div>
<div class="callout"><div><strong>Info</strong>Une information neutre.</div></div>
```

- `callout tip` : fond vert/teal — conseil ou bonne nouvelle
- `callout warn` : fond orange — avertissement ou point de vigilance
- `callout` (sans modificateur) : fond neutre — information générale

### Important

- Utilise `|` (block scalar YAML) pour le champ `body` : ça préserve les sauts de ligne
- Indente le contenu de 6 espaces sous `body: |`
- N'utilise pas de backtick (`` ` ``) dans le HTML — il est réservé au JS
- Pas besoin d'échapper les apostrophes ou guillemets dans le HTML

---

## Tester tes modifications

1. Pousse tes changements sur la branche `main`
2. GitHub Actions lance automatiquement le build (`node build.js`)
3. Le site est déployé sur GitHub Pages en quelques minutes
4. Vérifie ta fiche sur le site déployé

Pour tester en local :
```bash
cd 03-version-pwa
npm install
node build.js
# Ouvre index.html dans un navigateur (ou utilise un serveur local)
```

---

## Questions ?

En cas de doute sur la syntaxe YAML ou le format HTML, ouvre une **Issue** sur GitHub.
