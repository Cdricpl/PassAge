# Captures d'écran pour le Play Store

Tu dois fournir **minimum 2, idéalement 5–8 captures** au format téléphone. Voici la procédure.

---

## Spécifications Google

| Critère | Exigence |
|---|---|
| Format | PNG ou JPEG, 24-bit, sans transparence |
| Ratio | 16:9 ou 9:16 |
| Côté minimum | 320 px |
| Côté maximum | 3840 px |
| Téléphone : recommandé | **1080 × 1920** ou **1440 × 2560** (portrait) |
| Nombre | 2 minimum, 8 maximum |
| Poids | < 8 MB par image |

---

## Comment les prendre depuis ton téléphone

### Android (n'importe quel modèle)

1. Connecte ton téléphone au même Wi-Fi que ton PC
2. Sur ton GSM, ouvre Chrome et va sur `http://192.168.0.130:8000` (ton IP locale)
   - Ou utilise l'URL en ligne quand tu auras déployé sur Netlify
3. **Désactive la barre Chrome** : ajoute l'app à l'écran d'accueil (menu ⋮ → "Installer l'application")
4. Ouvre MonAvenir depuis l'icône → tu es en plein écran
5. Pour chaque écran à capturer :
   - Va sur l'écran
   - Capture : **bouton volume bas + bouton power** simultanément (sur la plupart des Android)
6. Les captures se trouvent dans **Galerie → Captures d'écran**
7. Transfère-les sur ton PC (USB, Drive, e-mail à toi-même)

### iPhone (Safari)

1. Ouvre Safari → l'URL → bouton partage ↑ → "Sur l'écran d'accueil"
2. Lance l'app depuis l'icône
3. Pour capturer : **bouton volume haut + bouton power** simultanément
4. Récupère via AirDrop / e-mail

---

## Les 6 écrans à capturer (dans cet ordre)

### 1. Home — la "couverture" de l'app ⭐
**C'est l'image la plus importante.** Elle apparaît dans la liste de recherche Play.

À montrer :
- Le hero "Salut" + 3 chips (Gratuit · Sans compte · Sans jugement)
- Les 6 tuiles situations colorées
- Le **bouton rouge "Ça ne va pas ?"**

🎯 Conseil : laisse l'app démarrer "neuve" (pas de prénom enregistré) pour que ce soit générique. Ou mets un prénom court visible comme "Léo".

### 2. Parcours guidé "Je cherche un logement"
À montrer :
- Le titre du parcours
- La barre de progression (coche 1 ou 2 étapes pour montrer la progression)
- Les 4 étapes avec checkboxes
- Le résultat attendu en bas

### 3. Page Aide / Urgence
À montrer :
- Les gros boutons d'appel rouges
- 112, 1733, 070 245 245, 103, 107…
- Le sous-titre rassurant en haut

### 4. Une fiche complète — "Voir un psy à 11 €" ou "Mon médecin traitant"
À montrer :
- Le contenu rédactionnel de qualité
- Les sous-titres clairs
- Un callout "tip" ou "warn" (encadré coloré)
- Le bouton cœur en haut pour les favoris

### 5. Mon espace
À montrer :
- "Mes parcours en cours" (si tu as commencé un parcours, ça apparaît)
- Les 6 outils : Documents, Contacts, Rappels, Notes, Favoris, Aide

### 6. Page "À propos" (optionnelle mais conseillée pour la légitimité)
À montrer :
- Le titre "MonAvenir, c'est quoi ?"
- La carte "Une initiative du Service Familles d'Accueil de Verviers"
- Le logo SFA visible

---

## Comment améliorer chaque capture (avant upload)

### Outil simple : Photopea (gratuit, en ligne, no install)

[photopea.com](https://www.photopea.com) — clone de Photoshop dans le navigateur.

**Recadrage** :
1. Ouvre la capture dans Photopea
2. Image → Taille du canevas → 1080 × 1920 (ou ton ratio préféré)
3. Si la barre du téléphone (heure, batterie) gêne, masque-la avec un rectangle de la couleur du fond `#FAFAF8`

**Ajout d'un cadre simulant un GSM** (joli mais pas obligatoire) :
- Cherche "iphone mockup PSD free" ou "android mockup PSD free"
- Ouvre le mockup dans Photopea
- Glisse-dépose ta capture dans la zone d'écran

---

## Image vedette (Feature Graphic) — 1024 × 500 px

C'est la grande bannière qui apparaît en haut de la fiche Play. À créer dans Photopea/Canva.

### Composition suggérée (très simple, ~10 min)

**Canva** est le plus simple :
1. [canva.com/create/feature-graphics](https://www.canva.com) — modèle "Feature graphic"
2. Choisis un fond uni (couleur primaire `#4F7CAC`) ou un dégradé doux
3. Ajoute :
   - **À gauche** : logo MonAvenir (ou logo SFA) + texte "MonAvenir" en gros
   - **Au centre/droite** : un slogan : *"Comprendre. Agir. Avancer."*
   - **En bas** : 3 mini-mentions : *"Gratuit · Sans compte · Sans jugement"*
4. Export → JPG ou PNG, 1024 × 500 exact

### Ce que Google n'aime pas
- ❌ Captures d'écran simulées dans la bannière
- ❌ Texte qui ressemble à un bouton ("Téléchargez maintenant")
- ❌ Logos de partenaires (Apple, etc.)
- ❌ Images génériques de stock

### Ce qu'il faut viser
- ✅ Sobre, pas chargé
- ✅ Lisible même en petit (~80 px de haut sur certains écrans)
- ✅ Cohérent avec l'identité visuelle de l'app

---

## Optionnel — captures pour tablette

Pas obligatoire en V1, mais Google adore. Refaire les mêmes 5 écrans à un ratio différent (ex : 1920 × 1200).

→ Skip pour la 1re version.

---

## Checklist avant upload

- [ ] 5 captures téléphone, format portrait, PNG
- [ ] Image vedette 1024 × 500 px, JPG ou PNG
- [ ] Toutes en français (pas de mélange anglais)
- [ ] Le bouton Aide rouge visible sur au moins une capture
- [ ] Aucune info personnelle visible (vrais noms, vrais numéros)
- [ ] Le SFA Verviers visible/mentionné sur une capture (légitimité)
- [ ] Captures cohérentes graphiquement (même luminosité, même fond)
