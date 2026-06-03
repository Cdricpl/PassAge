/* ============================================================
   MonAvenir — Contenus
   Sources : Fiche Majorité (Service Familles d'Accueil)
   Tonalité : tutoiement, langage simple, bienveillant
   ============================================================ */

window.MA_CONTENT = (function () {

  // ----- Pictogrammes (SVG inline) -----
  const ICONS = {
    cake: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 6v3M9 5l3-3 3 3M5 22V12a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10M3 22h18M5 16h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z M14 3v5h5 M9 13h6 M9 17h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    euro: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M18 6a8 8 0 1 0 0 12 M5 10h10 M5 14h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cap: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M2 10l10-5 10 5-10 5-10-5z M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5 M22 10v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 8h18l-1 12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 8z M8 8V6a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    cart: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 3h2l3 14h11l3-9H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="21" r="1.5" fill="currentColor"/><circle cx="18" cy="21" r="1.5" fill="currentColor"/></svg>',
    sos: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6 M12 16.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.2a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1 .35 2.02.59 3.06.72A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M11 20A7 7 0 0 1 4 13c0-7 8-12 16-12-1 8-2 19-9 19zM2 22c1-3 3-6 9-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ============================================================
  // SITUATIONS DE VIE — parcours guidés
  // ============================================================
  const SITUATIONS = [
    {
      id: 'majorite',
      title: "Je viens d'avoir 18 ans",
      subtitle: "Comprendre ce qui change pour toi",
      color: 'majeur',
      icon: ICONS.cake,
      intro: "Avoir 18 ans, c'est un cap. Pas de panique : on va voir ensemble ce que ça change vraiment dans ta vie, et les premières choses à faire.",
      steps: [
        { title: "Ce qui change à 18 ans", desc: "Tes nouveaux droits et tes nouvelles responsabilités", linkType: 'fiche', linkId: 'majeur/changements' },
        { title: "Mes premières démarches", desc: "Mutuelle, banque, assurance : par où commencer", linkType: 'fiche', linkId: 'majeur/demarches' },
        { title: "Garder un accompagnement", desc: "AMO, prolongation SAJ, services à contacter", linkType: 'fiche', linkId: 'majeur/accompagnement' },
        { title: "Vérifier mon compte d'épargne", desc: "Le compte ouvert par l'autorité mandante", linkType: 'fiche', linkId: 'argent/epargne-mandante' }
      ],
      outcome: "Tu sais quoi faire et dans quel ordre. Tu n'es pas seul·e.",
      relatedModules: ['admin', 'argent']
    },
    {
      id: 'logement',
      title: "Je cherche un logement",
      subtitle: "Trouver, comprendre, signer sans pièges",
      color: 'logement',
      icon: ICONS.home,
      intro: "Trouver son premier logement, ça peut faire peur. On va voir ensemble comment chercher, ce qu'il faut vérifier, et quelles aides tu peux demander.",
      steps: [
        { title: "Comprendre mes options", desc: "Privé, AIS, SLSP, CPAS : c'est quoi la différence ?", linkType: 'fiche', linkId: 'logement/options' },
        { title: "Trouver un logement", desc: "Où chercher, quoi demander en visite", linkType: 'fiche', linkId: 'logement/recherche' },
        { title: "Avant de signer le bail", desc: "État des lieux, garantie, durée du bail", linkType: 'fiche', linkId: 'logement/bail' },
        { title: "Les aides au logement", desc: "Garantie via le CPAS, allocations", linkType: 'fiche', linkId: 'logement/aides' }
      ],
      outcome: "Tu sais où chercher, quelles aides demander, et quoi vérifier avant de signer.",
      relatedModules: ['logement', 'argent']
    },
    {
      id: 'argent',
      title: "Je n'ai pas assez d'argent",
      subtitle: "Connaître mes droits et mes aides",
      color: 'argent',
      icon: ICONS.euro,
      intro: "Ne reste pas seul·e avec tes soucis d'argent. Tu as probablement droit à des aides — voyons lesquelles.",
      steps: [
        { title: "Les aides auxquelles j'ai droit", desc: "RIS du CPAS, allocations familiales, bourse", linkType: 'fiche', linkId: 'argent/aides-disponibles' },
        { title: "Le RIS (revenu d'intégration)", desc: "Comment l'obtenir, à quoi t'attendre", linkType: 'fiche', linkId: 'argent/ris-cpas' },
        { title: "Estimer mon budget", desc: "Loyer, courses, énergie : combien pour vivre ?", linkType: 'fiche', linkId: 'argent/budget' },
        { title: "Contacts utiles", desc: "CPAS, Droit des Jeunes, Inforjeunes", linkType: 'fiche', linkId: 'urgence/services-aide' }
      ],
      outcome: "Tu comprends ce que tu peux toucher et qui contacter pour passer à l'action.",
      relatedModules: ['argent', 'urgence']
    },
    {
      id: 'travail',
      title: "Je cherche un travail",
      subtitle: "Du CV au premier contrat",
      color: 'travail',
      icon: ICONS.bag,
      intro: "Décrocher un job, ça commence par quelques étapes claires. On t'accompagne du CV au premier contrat.",
      steps: [
        { title: "Préparer ma recherche", desc: "S'inscrire au Forem, faire son CV", linkType: 'fiche', linkId: 'travail/preparer' },
        { title: "Trouver des offres", desc: "Forem, Indeed, agences d'intérim", linkType: 'fiche', linkId: 'travail/trouver' },
        { title: "Réussir l'entretien", desc: "Ce qu'il faut savoir avant le rendez-vous", linkType: 'fiche', linkId: 'travail/entretien' },
        { title: "Comprendre mon contrat", desc: "CDI, CDD, brut/net, mes droits", linkType: 'fiche', linkId: 'travail/contrat' }
      ],
      outcome: "Tu as un CV, tu es inscrit·e au Forem, tu sais lire un contrat avant de signer.",
      relatedModules: ['travail', 'argent']
    },
    {
      id: 'sante-medecin',
      title: "Je dois voir un médecin",
      subtitle: "Comment trouver, prendre RDV, payer",
      color: 'sante',
      icon: ICONS.heart,
      intro: "On va y aller doucement. Voir un médecin, c'est plus simple que ça en a l'air, et il existe des solutions pour ne pas se ruiner.",
      steps: [
        { title: "Choisir mon médecin", desc: "Médecin traitant, maison médicale : ce qui te convient", linkType: 'fiche', linkId: 'sante/medecin' },
        { title: "La maison médicale", desc: "Soins gratuits si tu t'inscris au forfait", linkType: 'fiche', linkId: 'sante/maison-medicale' },
        { title: "Combien ça va me coûter", desc: "DMG, BIM, génériques : ce qui réduit la facture", linkType: 'fiche', linkId: 'admin/mutuelle' },
        { title: "Prendre soin de moi au quotidien", desc: "Dentiste, gyno, check-ups : la fréquence à connaître", linkType: 'fiche', linkId: 'admin/mutuelle' }
      ],
      outcome: "Tu sais comment voir un médecin et combien ça va te coûter.",
      relatedModules: ['sante', 'admin']
    },
    {
      id: 'sante-mal-etre',
      title: "Ça stresse, ma santé",
      subtitle: "Mal-être, anxiété : par où commencer",
      color: 'sante',
      icon: ICONS.leaf,
      intro: "Pas obligé·e de tout comprendre tout de suite. On voit ensemble par quoi commencer — sans jugement, à ton rythme.",
      steps: [
        { title: "Reconnaître ce qui ne va pas", desc: "Anxiété, fatigue, tristesse : c'est plus courant que tu ne crois", linkType: 'fiche', linkId: 'urgence/mal-etre' },
        { title: "Parler sans appeler", desc: "Chat 103, e-mail Télé-Accueil, planning familial", linkType: 'fiche', linkId: 'sante/parler-sans-appeler' },
        { title: "Voir un psy à 11 €", desc: "La convention psy 1ère ligne, comment commencer", linkType: 'fiche', linkId: 'sante/convention-psy' },
        { title: "Si c'est urgent maintenant", desc: "Numéros gratuits, 24/7, anonymes", linkType: 'page', linkId: 'urgence' }
      ],
      outcome: "Tu connais 2 ou 3 portes d'entrée — et tu choisis celle qui te ressemble.",
      relatedModules: ['sante', 'urgence']
    },
    {
      id: 'aide-rapide',
      title: "J'ai besoin d'aide maintenant",
      subtitle: "Trouver de l'écoute ou un service immédiat",
      color: 'urgence',
      icon: ICONS.sos,
      intro: "Tu n'as pas à porter ça seul·e. Voici des numéros et des services disponibles, gratuits et anonymes.",
      steps: [
        { title: "Choisir ma situation", desc: "Vie en danger, mal-être, violences, addiction…", linkType: 'page', linkId: 'urgence' },
        { title: "Appeler ou chatter", desc: "Numéros d'écoute, lignes gratuites 24/7", linkType: 'fiche', linkId: 'urgence/lignes-ecoute' },
        { title: "Trouver un service près de moi", desc: "AMO, planning familial, maison médicale", linkType: 'fiche', linkId: 'urgence/services-aide' }
      ],
      outcome: "Tu ne restes pas seul·e — tu as parlé à quelqu'un ou tu sais où aller.",
      relatedModules: ['urgence', 'sante']
    }
  ];

  // ============================================================
  // MODULES — contenus thématiques
  // ============================================================
  const MODULES = [
    {
      id: 'majeur',
      title: 'Devenir majeur',
      subtitle: "Ce qui change à 18 ans",
      color: 'majeur',
      icon: ICONS.cake,
      objective: "Comprendre tes nouveaux droits et tes nouvelles responsabilités à 18 ans, et savoir ce qu'il faut faire en premier.",
      source: 'justice.belgium.be · one.be · belgium.be',
      sections: [
        {
          id: 'enfant-en-accueil',
          title: "Si tu es en famille d'accueil",
          summary: "Ce qui change vraiment pour toi (et ce qui ne change pas).",
          body: `
<p>Cette fiche, c'est pour toi si tu as été (ou es encore) suivi·e par le SAJ, le SPJ, ou le tribunal de la jeunesse. Ta situation à 18 ans n'est pas tout à fait comme celle des autres jeunes — voici les points spécifiques.</p>

<h2>Ce qui change vraiment</h2>
<ul>
  <li><strong>L'intervention du SAJ/SPJ s'arrête</strong> à ton 18e anniversaire. Plus de mesure imposée.</li>
  <li>Tes <strong>allocations familiales</strong> (si tu poursuis tes études) te sont versées <strong>directement à toi</strong>, plus à ta famille d'accueil.</li>
  <li>Tu peux <strong>quitter la FA quand tu veux</strong>, mais aussi <strong>y rester</strong> si tout le monde est d'accord.</li>
</ul>

<h2>Ce qui ne change pas</h2>
<ul>
  <li>La <strong>porte du Service Familles d'Accueil te reste ouverte</strong>. Tu peux les contacter pour une question, un doute, une écoute — même des années après.</li>
  <li>Le <strong>lien avec ta famille d'accueil</strong> ne s'efface pas administrativement. C'est ton histoire.</li>
</ul>

<h2>Tu as droit au RIS — directement</h2>
<p>En tant que jeune accueilli·e, tu as <strong>droit au revenu d'intégration sociale (RIS)</strong> dès tes 18 ans, et l'enquête du CPAS sur tes parents est <strong>simplifiée</strong> (ton statut le justifie).</p>
<ul>
  <li>Demande à introduire au CPAS de la commune où tu seras domicilié·e.</li>
  <li>Apporte un document attestant de ton statut (mesure SAJ/SPJ ou jugement).</li>
  <li>Voir <a href="#/fiche/argent/ris-cpas">Le RIS et le CPAS</a> pour les détails.</li>
</ul>

<h2>Le compte d'épargne du mandant (très important)</h2>
<p>Pendant ton placement, l'autorité mandante (SAJ/SPJ) a peut-être ouvert un <strong>compte d'épargne à ton nom</strong>, alimenté par les allocations forfaitaires. Tu vas recevoir, dans les semaines qui suivent ta majorité&nbsp;:</p>
<ul>
  <li>Un <strong>document de la banque</strong> qui te confirme le solde du compte.</li>
  <li>Un <strong>document du mandant</strong> (SAJ/SPJ) qui t'explique ce qu'il y a dessus et comment y accéder.</li>
</ul>
<div class="callout warn"><div><strong>Si tu n'as rien reçu après 2-3 mois</strong>Contacte le SAJ/SPJ ou le Service Familles d'Accueil. Ce compte t'appartient, mais il n'arrive pas toujours automatiquement. Voir aussi <a href="#/fiche/argent/epargne-mandante">Le compte d'épargne mandant</a>.</div></div>

<h2>Tu peux demander la prolongation du suivi</h2>
<p>Si tu as un <strong>projet concret</strong> (mise en ordre administrative, recherche logement, passage à un autre service…), tu peux demander au SAJ de <strong>prolonger ton accompagnement</strong> de <strong>2 fois 6 mois maximum</strong>.</p>
<div class="callout warn"><div><strong>À faire 6 mois avant ta majorité (au minimum)</strong>La demande doit arriver bien avant l'anniversaire — sinon il est trop tard. Parle-s'en à ton délégué·e SAJ dès que possible.</div></div>

<h2>Et si tu as juste besoin de parler ?</h2>
<p>Tu peux contacter une <strong>AMO</strong> (Aide en Milieu Ouvert) près de chez toi : écoute, animations, aide aux démarches. Sans rendez-vous, gratuit, confidentiel. Voir aussi <a href="#/fiche/majeur/accompagnement">Garder un accompagnement</a>.</p>

<h2>En résumé : 3 réflexes</h2>
<ol class="fiche-ol">
  <li>Demande <strong>6 mois avant tes 18 ans</strong> si tu veux prolonger ton suivi.</li>
  <li>Vérifie que tu as bien reçu le <strong>document du compte d'épargne</strong> dans les semaines après.</li>
  <li>Introduis ta demande de <strong>RIS au CPAS</strong> pour ne pas rester sans revenu.</li>
</ol>
`
        },
        {
          id: 'changements',
          title: "Ce qui change à 18 ans",
          summary: "Tes droits, tes responsabilités, ce que tes parents/FA peuvent encore te demander.",
          body: `
<p>À 18 ans, tu deviens <strong>majeur·e</strong>. Tu es libre de tes choix, et tu deviens responsable de tes actes.</p>

<h2>Ce que tu peux faire seul·e</h2>
<ul>
  <li>Décider de ton lieu de vie, de tes études, de tes sorties.</li>
  <li>Quitter le domicile familial si tu le souhaites.</li>
  <li>Signer un contrat (bail, téléphone, assurance, banque…).</li>
  <li>Te marier, ouvrir un compte, vendre ou acheter un bien.</li>
  <li>Passer ton permis de conduire (catégorie B).</li>
  <li>Choisir d'être donneur·euse d'organes (à signaler à la commune).</li>
</ul>

<h2>Tes nouveaux devoirs</h2>
<ul>
  <li><strong>Voter aux élections</strong> — c'est obligatoire en Belgique. Voir <a href="#/fiche/majeur/vote">Le droit de vote</a>.</li>
  <li><strong>Faire ta déclaration d'impôts</strong> chaque année. Voir <a href="#/fiche/majeur/impots">La déclaration d'impôts</a>.</li>
  <li><strong>Avoir une mutuelle</strong> à ton nom si tu n'es plus à charge. Voir <a href="#/fiche/sante/medecin">la santé</a>.</li>
  <li><strong>Une assurance RC familiale</strong> si tu prends ton autonomie.</li>
</ul>

<h2>Et tes parents ou ta famille d'accueil ?</h2>
<p>Légalement, ils ne décident plus pour toi. <strong>En pratique</strong>, si tu vis encore chez eux, ils auront sûrement des attentes. C'est normal — le dialogue reste utile, surtout si tu dépends d'eux financièrement.</p>

<h2>Tes responsabilités</h2>
<ul>
  <li><strong>Civile :</strong> tu dois réparer les dommages que tu causes (d'où l'importance d'une <a href="#/fiche/admin/rc-familiale">assurance RC familiale</a>).</li>
  <li><strong>Pénale :</strong> en cas de délit, tu peux être condamné·e comme tout adulte.</li>
  <li><strong>Scolaire :</strong> à la fin de l'année où tu as 18 ans, l'obligation scolaire prend fin.</li>
</ul>

<div class="callout tip"><div><strong>Bon à savoir</strong>Une formation ou un diplôme reste un atout fort pour trouver un emploi. Pas besoin de tout décider tout de suite.</div></div>
`
        },
        {
          id: 'demarches',
          title: "Mes premières démarches",
          summary: "Mutuelle, banque, assurance, impôts : les choses à régler en priorité.",
          body: `
<p>Voici les démarches à prévoir dans tes premiers mois de majorité. Pas tout en même temps — on y va étape par étape.</p>

<h2>1. La mutuelle (obligatoire)</h2>
<p>Tant que tu es domicilié·e chez ta famille ou famille d'accueil, tu restes sur leur mutuelle. Si tu prends ton autonomie, tu dois t'affilier toi-même à une mutuelle (Chrétienne, Neutre, Socialiste, Libérale, Solidaris…) ou à la <strong>CAAMI</strong> (gratuite, mais moins avantageuse). Voir aussi <a href="#/fiche/sante/maison-medicale">la maison médicale</a>.</p>

<h2>2. Le compte bancaire</h2>
<p>Indispensable pour recevoir un salaire, payer en magasin, recevoir tes aides. Tu peux ouvrir un compte courant dès 18 ans — souvent gratuit pour les jeunes (-25 ans). Pense à activer <strong>itsme</strong> en même temps : tu vas en avoir besoin pour la déclaration d'impôts, Tax-on-Web, le SPF Finances…</p>

<h2>3. L'assurance RC familiale</h2>
<p>Si tu vis encore chez ta famille ou FA, tu es couvert·e par leur assurance. Si tu prends un logement, tu dois en souscrire une — c'est elle qui paye si tu casses quelque chose à quelqu'un.</p>

<h2>4. Le RIS du CPAS (si besoin)</h2>
<p>En tant que <strong>jeune accueilli·e</strong>, tu as droit au revenu d'intégration sociale. Demande à introduire au CPAS de ta commune.</p>

<h2>5. Les allocations familiales</h2>
<p>À 18 ans, elles sont versées <strong>directement sur ton compte</strong> (et non plus à ta famille d'accueil). Si tu poursuis tes études, tu les touches jusqu'à 25 ans max.</p>

<h2>6. Ta déclaration d'impôts (chaque année)</h2>
<p>Dès l'année qui suit tes 18 ans, tu reçois ta déclaration. Voir <a href="#/fiche/majeur/impots">La déclaration d'impôts</a> pour les détails — c'est plus simple que ça en a l'air.</p>

<h2>7. T'inscrire pour voter (automatique)</h2>
<p>Pas de démarche : ta convocation arrive par la poste avant chaque scrutin. Voir <a href="#/fiche/majeur/vote">Le droit de vote</a>.</p>

<div class="callout"><div><strong>Garde-la sous la main</strong>Tu peux sauvegarder cette fiche en favori (icône cœur en haut) pour la retrouver vite quand tu en as besoin.</div></div>
`
        },
        {
          id: 'vote',
          title: "Le droit de vote",
          summary: "Comment ça se passe, et comment choisir.",
          body: `
<p>À 18 ans, tu votes. <strong>En Belgique, le vote est obligatoire</strong> pour les élections fédérales, régionales, communales, provinciales et européennes. Ce n'est pas une corvée — c'est ta voix qui compte autant que celle des autres.</p>

<h2>Quelles élections, quand ?</h2>
<ul>
  <li><strong>Élections fédérales</strong> (Chambre) : tous les 5 ans</li>
  <li><strong>Élections régionales et communautaires</strong> : tous les 5 ans</li>
  <li><strong>Élections européennes</strong> : tous les 5 ans (les 16-17 ans peuvent voter aussi depuis 2024)</li>
  <li><strong>Élections communales et provinciales</strong> : tous les 6 ans</li>
</ul>
<p>En Belgique, les dernières grandes élections ont eu lieu en juin 2024 (fédérales, régionales, européennes) et en octobre 2024 (communales et provinciales). Les prochaines élections fédérales sont prévues en 2029.</p>

<h2>Comment ça se passe le jour J ?</h2>
<ol class="fiche-ol">
  <li>Quelques semaines avant, tu reçois ta <strong>convocation</strong> par la poste (même le Roi en reçoit une).</li>
  <li>Le jour du vote, tu te présentes au bureau indiqué avec <strong>ta carte d'identité + ta convocation</strong>.</li>
  <li>Tu entres dans l'isoloir et tu votes (papier ou écran tactile selon ta commune).</li>
  <li>L'agent tamponne ta convocation : c'est ta preuve d'avoir voté.</li>
</ol>

<h2>Pour qui voter ?</h2>
<p>C'est <strong>ton</strong> choix. Personne ne peut te le dicter — pas tes parents, pas ton patron, pas tes amis. Pour t'aider à décider :</p>
<ul>
  <li><strong>Test Électoral RTBF</strong> : un quiz qui te dit quel parti correspond à tes idées (publié au moment des élections).</li>
  <li><strong>De Stemtest</strong> (côté flamand, traduction possible).</li>
  <li>Lis les <strong>programmes des partis</strong> sur leurs sites.</li>
  <li>Méfie-toi des sites/comptes détenus par un parti — ils peuvent t'orienter.</li>
</ul>

<h2>Comment voter correctement ?</h2>
<ul>
  <li>Tu peux voter pour <strong>une liste entière</strong> (vote en tête de liste).</li>
  <li>Tu peux voter pour <strong>un ou plusieurs candidats d'une même liste</strong>.</li>
  <li>Tu <strong>ne peux pas</strong> voter pour des candidats de listes différentes — ton vote serait nul.</li>
  <li>Tu peux aussi voter <strong>blanc</strong> (rien cocher) si aucun parti ne te convient.</li>
</ul>

<h2>Tu ne peux pas y aller le jour J ?</h2>
<ul>
  <li><strong>Procuration</strong> : tu désignes un proche pour voter à ta place (formulaire à la commune).</li>
  <li><strong>Justification</strong> : maladie, étranger, raisons professionnelles → certificat à fournir.</li>
  <li>Sinon, <strong>tu risques une amende</strong> (peu appliquée mais légale).</li>
</ul>

<div class="callout tip"><div><strong>Pas sûr·e de toi ?</strong>Voter, c'est un droit, pas un examen. Tu n'es pas obligé·e de tout comprendre. Choisis ce qui te parle, et tu apprendras avec le temps.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.elections.fgov.be" target="_blank" rel="noopener">elections.fgov.be</a> — site officiel des élections en Belgique</li>
  <li><a href="https://inforjeunes.be" target="_blank" rel="noopener">inforjeunes.be</a> — brochures et infos pour les jeunes</li>
</ul>
`
        },
        {
          id: 'impots',
          title: "La déclaration d'impôts",
          summary: "Cette fameuse déclaration de contribution annuelle.",
          body: `
<p>Dès tes 18 ans, tu dois faire ta <strong>déclaration à l'impôt des personnes physiques</strong> (IPP) — souvent appelée la <strong>déclaration de contribution</strong>. C'est annuel, c'est obligatoire, et c'est plus simple que ça en a l'air.</p>

<h2>Pourquoi tu dois la faire ?</h2>
<p>L'État doit savoir combien tu as gagné dans l'année pour calculer ton impôt. À ton âge, <strong>tu n'as souvent rien à payer</strong> — voire tu récupères de l'argent (par exemple si tu as un job étudiant et qu'on a retenu trop de précompte professionnel).</p>

<h2>Quand ?</h2>
<p>Chaque année, l'administration t'envoie un courrier ou un e-mail au printemps (vers avril-mai).</p>
<ul>
  <li><strong>En ligne (Tax-on-Web)</strong> : généralement jusqu'à <strong>mi-juillet</strong>.</li>
  <li><strong>Sur papier</strong> : généralement avant <strong>fin juin</strong>.</li>
  <li>Les dates exactes sont publiées chaque année par le SPF Finances.</li>
</ul>

<h2>Comment ?</h2>

<h3>Option 1 — En ligne (le plus simple)</h3>
<ol class="fiche-ol">
  <li>Va sur <a href="https://finances.belgium.be/fr/E-services/tax-on-web" target="_blank" rel="noopener">Tax-on-Web</a>.</li>
  <li>Connecte-toi avec <strong>itsme</strong> (le plus rapide) ou ta <strong>carte d'identité électronique</strong> (eID + lecteur de carte).</li>
  <li>Beaucoup de cases sont <strong>déjà remplies</strong> par l'administration (salaire, allocations…).</li>
  <li>Tu vérifies, complètes ce qui manque, signes électroniquement.</li>
</ol>

<h3>Option 2 — La PDS (Proposition de Déclaration Simplifiée)</h3>
<p>Si ta situation est simple, l'administration t'envoie une <strong>proposition pré-remplie</strong>.</p>
<ul>
  <li>Tu vérifies : si tout est correct, <strong>rien à faire</strong>, c'est validé automatiquement.</li>
  <li>Si tu dois corriger : tu te connectes à Tax-on-Web pour modifier.</li>
</ul>

<h2>Ce qu'il faut déclarer (et ce qui est exonéré)</h2>
<ul>
  <li><strong>Salaire</strong> (job étudiant, intérim, CDD/CDI) : à déclarer, généralement pré-rempli.</li>
  <li><strong>RIS du CPAS</strong> : à déclarer mais <strong>exonéré d'impôt</strong>.</li>
  <li><strong>Allocations de chômage</strong> : à déclarer.</li>
  <li><strong>Allocations familiales</strong> : <strong>non taxables</strong>, rien à déclarer.</li>
  <li><strong>Bourse d'études</strong> : <strong>non taxable</strong> dans la plupart des cas.</li>
  <li><strong>Intérêts de compte d'épargne</strong> : exonérés jusqu'à un plafond fixé chaque année (voir le SPF Finances pour le montant en cours).</li>
</ul>

<h2>Si tu n'y comprends rien</h2>
<p>C'est normal. Beaucoup d'adultes galèrent aussi. Plusieurs personnes peuvent t'aider <strong>gratuitement</strong> :</p>
<ul>
  <li><a href="https://inforjeunes.be" target="_blank" rel="noopener">Inforjeunes</a> — accompagnement gratuit, ils ont l'habitude.</li>
  <li>Ton <strong>AMO</strong> ou ton <strong>service social</strong> (école, fac).</li>
  <li>Le <strong>SPF Finances</strong> propose des permanences (téléphone ou en personne) au printemps.</li>
  <li><a href="https://www.sdj.be" target="_blank" rel="noopener">Service Droit des Jeunes</a> pour les questions juridiques.</li>
</ul>

<div class="callout warn"><div><strong>Ne pas faire ta déclaration = amende</strong>Le fisc connaît tes employeurs et tes revenus. Garde tes <strong>fiches de paie</strong> au moins 7 ans, on peut te les redemander.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://finances.belgium.be" target="_blank" rel="noopener">finances.belgium.be</a> — site du SPF Finances</li>
  <li><a href="https://envoltoit.be" target="_blank" rel="noopener">envoltoit.be</a> — portail autonomie d'Inforjeunes</li>
</ul>
`
        },
        {
          id: 'accompagnement',
          title: "Garder un accompagnement",
          summary: "AMO, prolongation SAJ, maisons de jeunes : tu n'es pas seul·e après 18 ans.",
          body: `
<p>Le jour de tes 18 ans, le SAJ, le SPJ ou le tribunal de la jeunesse cesse son intervention. Mais tu peux <strong>continuer à être accompagné·e</strong> si tu en as besoin.</p>

<h2>Prolonger l'accompagnement du SAJ</h2>
<p>Tu peux demander au SAJ de prolonger l'intervention de ton service, <strong>jusqu'à 2 fois 6 mois maximum</strong>. Cette prolongation est acceptée sur base d'objectifs précis (mise en ordre administrative, passage à d'autres services…).</p>

<h2>Les AMO (Aide en Milieu Ouvert)</h2>
<p>Les AMO accompagnent les jeunes au quotidien : écoute, animations, aide pour démarrer en autonomie. C'est gratuit et confidentiel.</p>
<ul>
  <li>Trouver une AMO près de chez toi : <a href="https://inforjeunes.be/centre/" target="_blank" rel="noopener">inforjeunes.be/centre</a></li>
</ul>

<h2>Les maisons de jeunes</h2>
<p>Lieux où tu peux rencontrer d'autres jeunes, te changer les idées, participer à des ateliers. Une équipe d'éducateurs y est présente pour te conseiller. Les coordonnées sont sur le site de ta commune.</p>

<h2>Le service Familles d'Accueil</h2>
<p>La porte du Service Familles d'Accueil te reste toujours ouverte. N'hésite pas à les contacter en cas de doute, de question ou simplement d'un besoin d'écoute.</p>
`
        }
      ]
    },

    {
      id: 'admin',
      title: 'Administratif & juridique',
      subtitle: "Mes papiers, mes droits",
      color: 'admin',
      icon: ICONS.doc,
      objective: "Gérer tes papiers d'identité, tes assurances, et savoir où aller pour quoi.",
      source: 'ibz.be (Registre national) · inami.fgov.be · belgium.be',
      sections: [
        {
          id: 'mutuelle',
          title: "La mutuelle",
          summary: "Pourquoi c'est obligatoire et comment choisir.",
          body: `
<p>La mutuelle (officiellement : <strong>assurance soins de santé</strong>) te permet d'être remboursé·e quand tu vas chez le médecin, le dentiste, ou à l'hôpital.</p>

<h2>C'est obligatoire</h2>
<p>Tout le monde doit être affilié soit à une mutuelle (cotisation à payer), soit à la <strong>CAAMI</strong> (gratuite, mais propose seulement le strict minimum).</p>

<h2>Les services d'une mutuelle</h2>
<ul>
  <li>Remboursement des soins (médecin, médicaments, hôpital).</li>
  <li>Assurances facultatives (soins dentaires, hospitalisation…).</li>
  <li>Services complémentaires (camps, sport, transport non urgent…).</li>
</ul>

<h2>Comment choisir ?</h2>
<p>Les principales mutuelles : Mutualité Chrétienne, Neutre, Socialiste, Libérale, Solidaris… Compare les services et les cotisations sur leurs sites — selon ta situation, l'une peut être plus avantageuse qu'une autre.</p>

<div class="callout tip"><div><strong>Conseils santé</strong>Dentiste 1×/an minimum (sinon le remboursement diminue), ophtalmo tous les 2 ans si tu portes des lunettes, gynéco 1×/an pour les filles.</div></div>
`
        },
        {
          id: 'rc-familiale',
          title: "L'assurance RC familiale",
          summary: "Ce qu'elle couvre, pourquoi tu en as besoin.",
          body: `
<p>L'assurance <strong>Responsabilité Civile familiale</strong> (RC familiale) te protège financièrement si tu causes un dommage à quelqu'un par accident.</p>

<h2>Quelques exemples</h2>
<ul>
  <li>Ton chien provoque un accident.</li>
  <li>Tu fais une rayure sur la portière d'une voiture en vélo.</li>
  <li>Un pot de fleurs tombe de ton appui de fenêtre.</li>
  <li>Un passant glisse sur le verglas devant chez toi.</li>
</ul>

<p>Sans assurance, c'est <strong>toi</strong> qui dois payer — et ça peut monter très vite.</p>

<h2>Quand en prendre une ?</h2>
<ul>
  <li>Tant que tu vis chez ta famille d'accueil, tu es couvert·e par leur assurance.</li>
  <li>Si tu prends ton autonomie, tu dois en souscrire une à ton nom.</li>
</ul>
`
        },
        {
          id: 'voyager',
          title: "Voyager à l'étranger",
          summary: "Carte ID, passeport, visa, vaccins, CEAM.",
          body: `
<p>Tu pars en voyage&nbsp;? Plus besoin d'autorisation parentale&nbsp;! Mais avant de boucler ton sac, vérifie que tu as bien tout côté papiers.</p>

<h2>Carte d'identité</h2>
<p>Ta <strong>carte ID belge</strong> suffit pour aller dans <strong>tous les pays de l'UE</strong>, ainsi qu'en Suisse, au Royaume-Uni (sous conditions), en Norvège, Islande, Liechtenstein, Andorre, Saint-Marin, Vatican, Monaco. Vérifie sa <strong>date de validité</strong> avant de partir — elle doit souvent être valide encore 3 à 6 mois après ton retour.</p>

<h2>Passeport</h2>
<p>Pour <strong>tout le reste du monde</strong>, il te faut un <strong>passeport</strong>. À demander à ta <strong>commune</strong>.</p>
<ul>
  <li>Validité : <strong>7 ans</strong>.</li>
  <li>Coût : ~75 € (procédure normale, ~10 jours). Procédure d'urgence possible (plus chère).</li>
  <li>Apporte une photo récente conforme aux normes.</li>
</ul>

<h2>Visa</h2>
<p>Le <strong>visa</strong> est une autorisation d'entrée délivrée par le pays de destination. Tu peux l'obtenir&nbsp;:</p>
<ul>
  <li>Auprès de l'<strong>ambassade ou consulat</strong> du pays.</li>
  <li>Souvent <strong>en ligne</strong> (eVisa) pour les pays comme USA (ESTA), Canada (AVE), Australie, Inde, etc.</li>
</ul>
<p>Vérifie sur <a href="https://diplomatie.belgium.be/fr/Services/voyager_a_letranger" target="_blank" rel="noopener">diplomatie.belgium.be</a> si un visa est nécessaire pour ta destination.</p>

<h2>Carnet de vaccination</h2>
<p>Selon la destination, certains vaccins sont <strong>obligatoires</strong> (fièvre jaune en Afrique tropicale par exemple) ou <strong>recommandés</strong> (typhoïde, hépatite A, tétanos…).</p>
<ul>
  <li>Parle-en à <strong>ton médecin traitant</strong> ou à un centre de <strong>médecine du voyage</strong>.</li>
  <li>Demande le <strong>certificat international de vaccination</strong> (carnet jaune).</li>
  <li>Site officiel : <a href="https://www.itg.be" target="_blank" rel="noopener">Institut de Médecine Tropicale</a> (Anvers).</li>
</ul>

<h2>Carte Européenne d'Assurance Maladie (CEAM)</h2>
<p>La <strong>CEAM</strong> te permet d'être soigné·e dans tous les pays de l'UE + Islande, Liechtenstein, Norvège, Suisse, aux mêmes conditions que les habitants du pays.</p>
<ul>
  <li><strong>Gratuite</strong> auprès de ta mutuelle.</li>
  <li>À demander <strong>plusieurs semaines avant</strong> ton départ.</li>
  <li>Validité : 2 ans en général.</li>
</ul>

<h2>Assurance voyage</h2>
<p>La CEAM ne couvre pas tout (rapatriement, soins privés…). Pour un long séjour ou un pays hors UE, prends une <strong>assurance voyage</strong> (souvent quelques €/jour). Ta mutuelle ou ta banque en proposent souvent.</p>

<div class="callout tip"><div><strong>Avant de partir</strong>Inscris-toi sur <a href="https://travellersonline.diplomatie.be" target="_blank" rel="noopener">Travellers Online</a> (gratuit, pour que les Affaires étrangères belges puissent te contacter en cas d'urgence dans le pays).</div></div>
`
        },
        {
          id: 'documents',
          title: "Mes papiers d'identité",
          summary: "Carte ID, passeport, casier : où et comment les obtenir.",
          body: `
<p>La plupart des documents administratifs s'obtiennent à <strong>l'administration communale</strong> de ta commune de domicile (ou de naissance).</p>

<h2>À demander à la commune</h2>
<ul>
  <li>Carte d'identité, passeport.</li>
  <li>Actes d'état civil (naissance, mariage…).</li>
  <li>Extrait de casier judiciaire.</li>
  <li>Permis de conduire.</li>
  <li>Don d'organes.</li>
</ul>

<h2>Pour voyager</h2>
<ul>
  <li><strong>Carte ID</strong> : valable dans les pays de l'UE et quelques pays voisins.</li>
  <li><strong>Passeport</strong> : nécessaire hors UE. Valable 7 ans.</li>
  <li><strong>Visa</strong> : à demander à l'ambassade du pays concerné (souvent en ligne).</li>
  <li><strong>Carnet de vaccination</strong> : selon la destination (parle-en à ton médecin).</li>
  <li><strong>Carte Européenne d'Assurance Maladie (CEAM)</strong> : gratuite, à demander à ta mutuelle, indispensable pour voyager dans l'UE.</li>
</ul>
`
        },
        {
          id: 'aide-juridique',
          title: "Avocat prodéo et aide juridique",
          summary: "Un avocat gratuit ou presque, si tes revenus sont bas — comment ça marche en 2026.",
          source: 'justice.belgium.be · avocats.be · droitsquotidiens.be',
          body: `
<p>Tu as besoin de conseils ou d'un·e avocat·e mais tu n'as pas les moyens&nbsp;? L'État belge prévoit deux dispositifs : l'aide juridique de <strong>1ère ligne</strong> (un premier conseil, gratuit, pour tout le monde) et l'aide juridique de <strong>2ème ligne</strong> — l'ancien <strong>« pro deo »</strong> ou <strong>prodéo</strong> — où un·e avocat·e t'est désigné·e gratuitement ou à coût réduit selon tes revenus.</p>

<h2>1ère ligne : un conseil gratuit, sans condition</h2>
<p>Tu peux aller dans une <strong>Commission d'Aide Juridique (CAJ)</strong> ou une permanence d'avocat·e pour poser une question (loyer, papiers, dettes, séparation, travail…). C'est <strong>gratuit, pour toute personne, sans plafond de revenus</strong>.</p>
<ul>
  <li>Trouve une permanence près de chez toi : <a href="https://avocats.be/fr/aide-juridique" target="_blank" rel="noopener">avocats.be/aide-juridique</a></li>
  <li>Ou via le palais de justice de ton arrondissement.</li>
</ul>

<h2>2ème ligne (« prodéo ») : un·e avocat·e désigné·e</h2>
<p>Si tu dois aller plus loin (procédure, représentation devant un tribunal), tu peux demander qu'un·e avocat·e soit <strong>désigné·e</strong> via le <strong>Bureau d'Aide Juridique (BAJ)</strong> de ton arrondissement. Selon tes revenus, l'aide est <strong>totalement</strong> ou <strong>partiellement gratuite</strong>.</p>

<h2>Plafonds de revenus 2026</h2>
<p>Le BAJ examine le total des revenus mensuels nets de toutes les personnes vivant sous ton toit.</p>
<ul>
  <li><strong>Personne isolée</strong> : revenus &lt; <strong>1 920 €/mois</strong> → gratuit total · entre <strong>1 920 € et 2 226 €</strong> → partiellement gratuit.</li>
  <li><strong>Avec d'autres personnes à charge</strong> : les plafonds augmentent de ~<strong>355 €</strong> par personne supplémentaire (à confirmer auprès du BAJ).</li>
</ul>

<h2>Accès automatique (sans calcul de revenus)</h2>
<p>Tu y as droit d'office (sans démarche de calcul) si tu es dans une de ces situations&nbsp;:</p>
<ul>
  <li>Tu touches le <strong>RIS</strong> du CPAS, ou une aide sociale équivalente.</li>
  <li>Tu touches la <strong>GRAPA</strong> (personne âgée) ou une allocation pour personne handicapée.</li>
  <li>Tu es <strong>mineur·e</strong>.</li>
  <li>Tu es <strong>détenu·e</strong>, demandeur·euse d'asile, ou sans-papiers en procédure.</li>
  <li>Tu es <strong>surendetté·e</strong> (procédure de règlement collectif de dettes).</li>
</ul>

<h2>Comment demander ?</h2>
<ol class="fiche-ol">
  <li>Repère le <strong>BAJ de ton arrondissement</strong> (ex. Verviers, Liège, Bruxelles…) via <a href="https://avocats.be/fr/aide-juridique" target="_blank" rel="noopener">avocats.be</a> ou le tribunal de ta région.</li>
  <li>Apporte&nbsp;: ta <strong>carte d'identité</strong>, ta dernière <strong>composition de ménage</strong>, et tes <strong>justificatifs de revenus</strong> (fiche de paie, attestation RIS, allocation…).</li>
  <li>Le BAJ examine ton dossier, vérifie que ta demande n'est pas manifestement infondée, et te <strong>désigne un·e avocat·e</strong>.</li>
  <li>Tu rencontres ton avocat·e et tu n'avances en principe <strong>rien</strong> — sauf une éventuelle part à payer si tu es dans la tranche partielle.</li>
</ol>

<h2>Pour quelles affaires ?</h2>
<ul>
  <li>Procédures devant le tribunal du travail, de la famille, civil, pénal, jeunesse, étrangers.</li>
  <li>Conflit avec un propriétaire, un employeur, une administration, un CPAS.</li>
  <li>Séparation, divorce, garde, pension alimentaire, dettes.</li>
  <li>Défense pénale si tu es poursuivi·e.</li>
</ul>

<div class="callout tip"><div><strong>N'attends pas</strong>Si tu reçois une convocation, un jugement, ou un courrier d'huissier que tu ne comprends pas — va voir une 1ère ligne <strong>tout de suite</strong>. Les délais juridiques sont courts et beaucoup de droits se perdent en quelques semaines.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://justice.belgium.be/fr/themes_et_dossiers/services_du_spf/access_a_la_justice/aide_juridique" target="_blank" rel="noopener">SPF Justice — aide juridique</a></li>
  <li><a href="https://avocats.be/fr/aide-juridique" target="_blank" rel="noopener">avocats.be — annuaire des BAJ et permanences</a></li>
  <li><a href="https://www.droitsquotidiens.be" target="_blank" rel="noopener">Droits Quotidiens</a> — explications juridiques en langage clair</li>
</ul>
`
        }
      ]
    },

    {
      id: 'argent',
      title: 'Argent & aides',
      subtitle: "Mes revenus, mes aides, mon budget",
      color: 'argent',
      icon: ICONS.euro,
      objective: "Comprendre ce que tu peux toucher, mieux gérer ton argent, savoir où demander de l'aide.",
      source: 'mi-is.be (SPP Intégration sociale) · inforjeunes.be',
      sections: [
        {
          id: 'aides-disponibles',
          title: "Les aides auxquelles j'ai droit",
          summary: "Vue d'ensemble : RIS, allocations, bourses.",
          body: `
<p>En tant que jeune sortant·e de l'aide à la jeunesse ou de famille d'accueil, plusieurs aides peuvent te concerner :</p>

<h2>1. Les allocations familiales</h2>
<p>À 18 ans, elles te sont <strong>versées directement</strong>. Si tu poursuis tes études, tu peux les toucher jusqu'à 25 ans.</p>

<h2>2. Le RIS (revenu d'intégration sociale)</h2>
<p>Tu y as droit grâce à ton <strong>statut d'enfant accueilli</strong>. Demande à introduire au CPAS de ta commune.</p>

<h2>3. La bourse d'études (FWB)</h2>
<p>Si tu étudies dans le supérieur ou le secondaire et que tes ressources sont limitées, tu peux demander une <strong>allocation d'études</strong>. Elle ne se rembourse pas.</p>

<h2>4. Les aides ponctuelles du CPAS</h2>
<p>Le CPAS peut accorder des aides spécifiques (alimentaire, médicale, financière, garantie locative…) selon ta situation.</p>

<h2>5. Le compte d'épargne mandant</h2>
<p>Pendant ta période d'éloignement, un compte a peut-être été ouvert à ton nom par l'autorité mandante. <strong>Vérifie auprès d'eux</strong> — pour certains jeunes, le solde peut être conséquent.</p>
`
        },
        {
          id: 'ris-cpas',
          title: "Le RIS et le CPAS",
          summary: "Comment l'obtenir, conditions, contrat d'intégration.",
          body: `
<p>Le <strong>RIS</strong> (revenu d'intégration sociale) est une aide financière versée par le CPAS de ta commune. En tant que jeune accueilli·e, c'est un droit pour toi.</p>

<h2>Les conditions</h2>
<ul>
  <li>Avoir 18 ans accomplis.</li>
  <li>Ne pas avoir de ressources suffisantes pour vivre.</li>
  <li>Accepter de signer un <strong>contrat d'intégration sociale</strong> avec un·e travailleur·euse social·e du CPAS (objectifs scolarité, emploi…).</li>
</ul>

<h2>Comment ça se passe ?</h2>
<ol class="fiche-ol">
  <li>Tu prends rendez-vous au CPAS de ta commune de domicile.</li>
  <li>Une enquête sociale est faite (sur ta situation, parfois sur tes parents).</li>
  <li>Le montant est fixé en fonction (vis seul·e, en colocation…).</li>
  <li>Tu signes le contrat, et le RIS est versé chaque mois.</li>
</ol>

<div class="callout warn"><div><strong>Attention si tu travailles</strong>Si tu fais un job étudiant ou un job ponctuel, ton RIS peut être <strong>partiellement réduit</strong> ce mois-là. Renseigne-toi à l'avance, une exonération existe.</div></div>

<h2>Aides ponctuelles</h2>
<p>Le CPAS peut aussi t'aider de manière ponctuelle (aide alimentaire, garantie locative, aide médicale urgente). Ces aides sont parfois remboursables.</p>
`
        },
        {
          id: 'allocations-familiales',
          title: "Mes allocations familiales",
          summary: "À 18 ans, elles sont versées directement à toi. Jusqu'à 25 ans si tu études.",
          body: `
<p>En Wallonie, les allocations familiales sont gérées par la <strong>caisse publique FAMIWAL</strong> (ou par une caisse privée si tu en as choisi une avant). À 18 ans, plusieurs choses changent.</p>

<h2>Ce qui change à 18 ans</h2>
<ul>
  <li>Les allocations te sont versées <strong>directement sur ton compte</strong> (et non plus à ta famille d'accueil).</li>
  <li>Tu peux les toucher <strong>jusqu'à 25 ans</strong> si tu poursuis des études (au moins 17 crédits/semestre dans le supérieur, ou enseignement secondaire à temps plein).</li>
  <li>Si tu interromps tes études : tu les gardes pendant <strong>360 jours</strong> de stage d'insertion (voir <a href="#/fiche/travail/chomage">Le chômage après les études</a>).</li>
</ul>

<h2>Démarches à faire</h2>
<ol class="fiche-ol">
  <li>Communique ton <strong>numéro de compte (IBAN)</strong> à FAMIWAL ou à ta caisse via <a href="https://my.famiwal.be" target="_blank" rel="noopener">myFAMIWAL</a> (connexion via itsme).</li>
  <li>Si tu déménages : signale ton <strong>changement d'adresse</strong>.</li>
  <li>Si tu es aux études : tu n'as souvent rien à faire — l'info est transmise par ton école.</li>
</ol>

<h2>Le quota du job étudiant</h2>
<p>Tu peux travailler jusqu'à <strong>650 heures par an</strong> sous contrat étudiant <strong>sans</strong> perdre tes allocations familiales (en Wallonie, jusqu'à 25 ans). Si tu dépasses, ça peut suspendre les allocations le mois concerné. Voir <a href="#/fiche/travail/job-etudiant">Le job étudiant</a>.</p>

<h2>Bon à savoir</h2>
<ul>
  <li>Si tu as un enfant, tu touches aussi <strong>ses</strong> allocations familiales.</li>
  <li>Tu peux <strong>cumuler</strong> tes allocations familiales avec un salaire ou avec le RIS.</li>
  <li>Les allocations familiales <strong>ne sont pas taxables</strong> — pas besoin de les déclarer aux impôts.</li>
</ul>

<div class="callout tip"><div><strong>Ton compte d'épargne mandant</strong>Si tu étais en famille d'accueil, vérifie aussi le compte d'épargne ouvert par l'autorité mandante. Voir <a href="#/fiche/argent/epargne-mandante">Le compte d'épargne mandant</a>.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.famiwal.be" target="_blank" rel="noopener">famiwal.be</a> — caisse publique wallonne</li>
  <li><a href="https://www.aviq.be/familles" target="_blank" rel="noopener">AVIQ Familles</a> — info officielle Wallonie</li>
  <li><a href="https://inforjeunes.be/thematique/allocations-familiales/" target="_blank" rel="noopener">Inforjeunes — FAQ allocations familiales</a></li>
</ul>
`
        },
        {
          id: 'compte-bancaire',
          title: "Le compte bancaire",
          summary: "Ouvrir un compte, ordres permanents, épargne.",
          body: `
<p>À 18 ans, tu peux ouvrir un compte en banque à ton nom. C'est indispensable pour recevoir un salaire, payer en magasin, ou recevoir tes aides.</p>

<h2>Le compte courant</h2>
<p>C'est ton compte de tous les jours. Tu peux y :</p>
<ul>
  <li>Recevoir tes revenus (salaire, allocations, RIS).</li>
  <li>Faire des virements et payer en magasin.</li>
  <li>Mettre en place des <strong>domiciliations</strong> (pour tes factures qui reviennent chaque mois).</li>
  <li>Faire des <strong>ordres permanents</strong> (par exemple : ton loyer payé automatiquement chaque mois).</li>
</ul>

<h2>Le compte épargne</h2>
<p>À associer à ton compte courant pour mettre de côté (un projet, un voyage, un coup dur). Il rapporte un petit intérêt.</p>

<h2>L'application mobile de la banque</h2>
<p>Très pratique : tu vois l'état de tes finances en temps réel, tu fais tes virements en quelques clics. Toutes les banques en proposent une.</p>

<div class="callout tip"><div><strong>Astuce</strong>Beaucoup de banques proposent un compte gratuit pour les jeunes ou les étudiants. Compare avant de choisir.</div></div>
`
        },
        {
          id: 'epargne-mandante',
          title: "Le compte d'épargne mandant",
          summary: "Vérifier si un compte a été ouvert à ton nom pendant la prise en charge.",
          body: `
<p>Pendant la période où tu as été éloigné·e de ton milieu familial (institution ou famille d'accueil), un compte d'épargne a peut-être été ouvert à ton nom par l'autorité mandante.</p>

<h2>Ce qu'il faut vérifier</h2>
<ul>
  <li>Cela <strong>n'est pas automatique</strong> — il faut vérifier auprès de l'autorité mandante qui s'occupait de ta situation.</li>
  <li>Le montant versé dépend du type d'hébergement.</li>
  <li>Pour certains jeunes, le solde peut être conséquent.</li>
</ul>

<div class="callout warn"><div><strong>Attention</strong>L'argent part vite. Avant de tout dépenser, pense à un projet utile : caution de logement, voiture pour le travail, formation…</div></div>
`
        },
        {
          id: 'aides-supp',
          title: "Bons plans : tarif social, seconde main",
          summary: "Tarif social énergie/internet, magasins de seconde main.",
          body: `
<p>Plein d'aides et d'astuces existent en plus du RIS pour te faciliter la vie. Voici les plus utiles.</p>

<h2>Tarif social pour l'énergie et l'eau</h2>
<p>Si tu touches le <strong>RIS du CPAS</strong>, certaines allocations handicap, ou la garantie de revenus aux personnes âgées, tu as droit au <strong>tarif social</strong> pour&nbsp;:</p>
<ul>
  <li><strong>Électricité, gaz naturel, chaleur</strong> : tarif identique partout en Belgique, peu importe ton fournisseur.</li>
  <li><strong>Eau</strong> : tarif réduit auprès de la SWDE.</li>
</ul>
<p>Demande à <strong>ton·ta intervenant·e social·e du CPAS</strong> de faire la démarche pour toi. Souvent, c'est <strong>automatique</strong> dès que tu es au RIS — mais vérifie.</p>

<h2>Offre Internet sociale (19 €/mois)</h2>
<p>Si tu touches le RIS, l'aide sociale du CPAS, ou la GRAPA, tu as droit à une <strong>offre internet sociale</strong> à <strong>19 € par mois maximum</strong>, avec :</p>
<ul>
  <li><strong>30 Mbps</strong> minimum de débit.</li>
  <li><strong>150 Go</strong> de téléchargement inclus.</li>
  <li>Disponible chez <strong>Proximus</strong>, <strong>VOO</strong> (Wallonie), parfois <strong>Orange</strong> selon zones.</li>
</ul>
<p>Demande directement à l'opérateur, ou vérifie ton éligibilité via le <a href="https://economie.fgov.be/fr/themes/line/telecommunications/offre-internet-sociale" target="_blank" rel="noopener">SPF Économie</a>.</p>

<h2>Tarif social téléphonie (mobile + fixe)</h2>
<p>Sous conditions (RIS, BIM, handicap…), tu peux aussi obtenir un tarif social sur ta téléphonie mobile et/ou fixe :</p>
<ul>
  <li>Jusqu'à <strong>40 % de réduction</strong> sur les frais d'installation et l'abonnement.</li>
  <li>Demande à ton opérateur ou via <a href="https://www.ibpt.be/consommateurs/tarif-social" target="_blank" rel="noopener">l'IBPT</a> (régulateur télécom).</li>
</ul>

<h2>Magasins de seconde main</h2>
<p>Pour t'équiper sans te ruiner&nbsp;:</p>
<ul>
  <li>ASBL et <strong>magasins de seconde main</strong> dans chaque ville (vêtements, meubles, électroménager). Demande à ta commune ou ton CPAS pour la liste locale.</li>
  <li><strong>Ressourceries</strong> (style Les Petits Riens, Oxfam, Terre, La Bourse aux Vêtements).</li>
</ul>

<h2>Sites de seconde main</h2>
<ul>
  <li><a href="https://www.2ememain.be" target="_blank" rel="noopener">2ememain.be</a> — meubles, électroménager, divers</li>
  <li><a href="https://www.facebook.com/marketplace" target="_blank" rel="noopener">Facebook Marketplace</a> — local, négociable</li>
  <li><a href="https://www.vinted.be" target="_blank" rel="noopener">Vinted</a> — vêtements</li>
  <li><a href="https://www.toogoodtogo.be" target="_blank" rel="noopener">Too Good To Go</a> — paniers anti-gaspi à prix cassés</li>
</ul>

<h2>Frigos communautaires</h2>
<p>Plusieurs communes wallonnes ont mis en place des <strong>frigos solidaires</strong> où chacun peut déposer ou prendre. Renseigne-toi à ta commune ou ton CPAS pour savoir s'il y en a près de chez toi.</p>

<div class="callout tip"><div><strong>L'aide alimentaire, c'est un droit</strong>Restos du Cœur, Croix-Rouge, épiceries sociales : si tu galères en fin de mois, n'attends pas. Ton CPAS peut t'orienter vers le bon service.</div></div>
`
        },
        {
          id: 'budget',
          title: "Mon budget mensuel",
          summary: "Dépenses obligatoires, priorités, astuces pour ne pas se planter.",
          body: `
<p>Avant de prendre un logement ou un engagement, prends 10 minutes pour faire ton budget mensuel. Tu poses tes <strong>rentrées</strong> (RIS, salaire, allocations…) et tes <strong>dépenses fixes</strong>. Le reste, c'est ce que tu peux dépenser ou épargner.</p>

<h2>Dépenses fixes — par ordre de priorité</h2>
<p>Ne paie <strong>jamais</strong> tes loisirs avant tes dépenses obligatoires. Voici l'ordre :</p>
<ol class="fiche-ol">
  <li><strong>Loyer</strong> — astuce : tu peux demander au CPAS de payer ton loyer directement au propriétaire (il te reverse le solde du RIS). Ça évite les oublis.</li>
  <li><strong>Énergie</strong> (eau, électricité, gaz) — provision mensuelle + décompte annuel.</li>
  <li><strong>Assurance habitation</strong> (souvent obligatoire dans le bail).</li>
  <li><strong>Cotisation mutuelle</strong> — tu peux payer mensuellement ou annuellement.</li>
  <li><strong>Téléphone &amp; internet</strong> — voir aussi <a href="#/fiche/argent/aides-supp">tarif social internet</a>.</li>
  <li><strong>Transport</strong> (TEC, SNCB, carburant, vélo).</li>
  <li><strong>Impôts/taxes</strong> (taxe communale, taxe poubelles…) — souvent annuelles.</li>
</ol>

<h2>Astuces pour ne pas oublier</h2>
<ul>
  <li><strong>Domiciliations bancaires</strong> : ton loyer, ta mutuelle et tes factures partent automatiquement chaque mois. Plus d'oublis.</li>
  <li><strong>Ordres permanents</strong> : pareil, mais pour des montants fixes (ex : virer 30 € sur ton compte épargne chaque mois).</li>
  <li><strong>Une farde papier</strong> ou des dossiers sur ton ordi pour classer tes contrats, factures, fiches de paie. Tu te remercieras dans 3 ans.</li>
</ul>

<h2>Dépenses variables</h2>
<ul>
  <li><strong>Courses</strong> : ~200–300 €/mois pour 1 personne (voir <a href="#/fiche/vie/alimentation">Alimentation</a> pour les bons plans).</li>
  <li>Vêtements, hygiène, loisirs.</li>
  <li>Imprévus (médicaments, dépannages…).</li>
</ul>

<h2>L'idéal — épargner un peu chaque mois</h2>
<p>Même 20 € par mois, c'est 240 € au bout d'un an : de quoi faire face à un coup dur (caution déposée pour un nouveau logement, panne d'électroménager, frais de santé inattendus).</p>

<div class="callout warn"><div><strong>Si tu n'arrives pas à payer tes factures</strong>N'attends pas. Parle-en au CPAS, à ton AMO, ou au <a href="https://www.sdj.be" target="_blank" rel="noopener">Service Droit des Jeunes</a>. Il existe des solutions (plan de paiement, médiation de dettes…). Plus tu attends, plus c'est compliqué.</div></div>

<h2>N'oublie pas en cas de déménagement</h2>
<p>Préviens du changement d'adresse à : ta mutuelle, ta banque, ton opérateur télécom, ton fournisseur d'énergie, FAMIWAL (allocations familiales), ton employeur, le Forem, le CPAS si tu y es suivi·e.</p>

<div class="callout tip"><div><strong>Demande de l'aide</strong>Le CPAS, Inforjeunes ou une AMO peuvent t'aider à faire ton budget <strong>gratuitement et sans jugement</strong>. Tu peux aussi voir <a href="#/fiche/argent/aides-supp">Bons plans : tarif social, seconde main</a>.</div></div>
`
        }
      ]
    },

    {
      id: 'etudes',
      title: 'Études & formations',
      subtitle: "Continuer ou reprendre",
      color: 'etudes',
      icon: ICONS.cap,
      objective: "Trouver une formation qui te correspond et savoir comment la financer.",
      source: 'allocations-etudes.cfwb.be · enseignement.be (Fédération Wallonie-Bruxelles)',
      sections: [
        {
          id: 'bourse',
          title: "L'allocation d'études (bourse)",
          summary: "Une aide financière qui ne se rembourse pas, sous conditions de ressources.",
          body: `
<p>L'<strong>allocation d'études</strong>, aussi appelée <strong>bourse</strong>, est une aide versée par la Fédération Wallonie-Bruxelles aux élèves et étudiants dont les ressources familiales sont limitées.</p>

<h2>Les points-clés</h2>
<ul>
  <li>Elle <strong>ne se rembourse pas</strong> (sauf abandon en cours d'année).</li>
  <li>Elle s'adresse aux études secondaires et supérieures.</li>
  <li>Les conditions de revenus dépendent de ta situation familiale.</li>
</ul>

<h2>Comment faire la demande ?</h2>
<p>Tout se passe sur le site officiel : <a href="https://aides-etudes.cfwb.be" target="_blank" rel="noopener">aides-etudes.cfwb.be</a></p>
<p>Si tu galères avec le dossier, prends rendez-vous dans un centre <strong>Inforjeunes</strong> ou une <strong>AMO</strong> — c'est gratuit, ils ont l'habitude.</p>
`
        },
        {
          id: 'service-social-ecole',
          title: "Le service social de ton école",
          summary: "Une aide au sein même de ton établissement.",
          body: `
<p>Chaque école secondaire, haute école et université a un <strong>service social</strong> qui peut t'aider.</p>

<h2>Pour qui ?</h2>
<p>Principalement pour les étudiants qui touchent une bourse, mais pas uniquement. N'hésite pas à pousser la porte.</p>

<h2>Pour quoi ?</h2>
<ul>
  <li>Achat de matériel (livres, ordinateur, blouse…).</li>
  <li>Logement étudiant.</li>
  <li>Transport.</li>
  <li>Difficultés financières ponctuelles.</li>
  <li>Soutien si tu rencontres des difficultés personnelles.</li>
</ul>

<div class="callout tip"><div><strong>Confidentiel</strong>Tout ce que tu y dis reste confidentiel. C'est leur rôle.</div></div>
`
        }
      ]
    },

    {
      id: 'travail',
      title: 'Travail',
      subtitle: "Du CV au premier contrat",
      color: 'travail',
      icon: ICONS.bag,
      objective: "Trouver un emploi, comprendre ton contrat et tes droits.",
      source: 'leforem.be · onem.be · emploi.belgique.be',
      sections: [
        {
          id: 'preparer',
          title: "Préparer ma recherche",
          summary: "Forem, CV, lettre de motivation : par où commencer.",
          body: `
<p>Avant d'envoyer des candidatures, il y a deux choses à faire.</p>

<h2>1. T'inscrire au Forem (obligatoire)</h2>
<p>Le <strong>Forem</strong> est l'organisme public wallon de l'emploi. Tu dois t'y inscrire <strong>en ligne</strong> dès que tu cherches un emploi.</p>
<ul>
  <li>Site : <a href="https://www.leforem.be" target="_blank" rel="noopener">leforem.be</a></li>
  <li>Si tu sors d'études, c'est aussi le point de départ pour ta période de stage d'insertion (avant le chômage).</li>
</ul>

<h2>2. Préparer ton CV et ta lettre de motivation</h2>
<ul>
  <li><strong>Word propose des modèles</strong> de CV gratuits — pas besoin de payer.</li>
  <li>Cherche "modèle CV gratuit" sur Internet, beaucoup d'exemples disponibles.</li>
  <li>Inforjeunes ou ton AMO peuvent t'aider à le rédiger.</li>
</ul>

<div class="callout tip"><div><strong>Astuce</strong>Adapte ton CV à chaque offre — mets en avant les compétences qui correspondent à ce que cherche l'employeur.</div></div>
`
        },
        {
          id: 'trouver',
          title: "Trouver des offres",
          summary: "Forem, Indeed, intérim, candidature spontanée.",
          body: `
<p>Plusieurs canaux à activer en parallèle pour maximiser tes chances.</p>

<h2>Sites d'offres d'emploi</h2>
<ul>
  <li><a href="https://www.leforem.be" target="_blank" rel="noopener">leforem.be</a></li>
  <li><a href="https://www.indeed.be" target="_blank" rel="noopener">indeed.be</a></li>
  <li>StepStone, Jobat, Optioncarrière…</li>
</ul>

<h2>Les agences d'intérim</h2>
<p>Adecco, Tempo Team, Randstad, LEM Interim, Equip Interim… Tu peux t'inscrire en ligne ou directement en agence. C'est souvent un bon point d'entrée pour un premier job.</p>

<h2>La candidature spontanée</h2>
<p>Tu identifies des entreprises qui t'intéressent et tu leur envoies CV + lettre, même sans annonce. C'est un moyen efficace, surtout dans les petites structures.</p>
`
        },
        {
          id: 'entretien',
          title: "Réussir l'entretien d'embauche",
          summary: "Ce à quoi t'attendre, comment te préparer.",
          body: `
<p>Premier entretien ? Pas de panique. Si on t'appelle, c'est que ton profil intéresse déjà.</p>

<h2>Les essentiels</h2>
<ul>
  <li>Sois <strong>présentable</strong> (pas besoin d'un costume — tenue propre et adaptée).</li>
  <li>Arrive <strong>5–10 minutes en avance</strong>.</li>
  <li><strong>Renseigne-toi</strong> avant sur l'entreprise (site web, activité, valeurs).</li>
  <li>Sois <strong>toi-même</strong> — la plupart des employeurs cherchent une personnalité, pas un robot.</li>
</ul>

<h2>Les questions classiques</h2>
<ul>
  <li>« Parlez-moi de vous. »</li>
  <li>« Quelles sont vos qualités et vos défauts ? »</li>
  <li>« Pourquoi voulez-vous travailler chez nous ? »</li>
  <li>Mises en situation, questions sur ton parcours.</li>
</ul>

<div class="callout tip"><div><strong>Astuce</strong>Prépare 2–3 questions à poser à la fin (sur l'équipe, les horaires, les évolutions). Ça montre ton intérêt.</div></div>
`
        },
        {
          id: 'contrat',
          title: "Comprendre mon contrat",
          summary: "CDI, CDD, intérim, brut/net, mes droits.",
          body: `
<p>Tu as décroché un job ? Avant de signer, prends le temps de lire ton contrat. Tu as <strong>le droit de l'emporter</strong> pour le lire chez toi.</p>

<h2>Les types de contrat</h2>
<ul>
  <li><strong>CDI</strong> (durée indéterminée) : pas de fin prévue, sauf rupture par l'employeur ou toi.</li>
  <li><strong>CDD</strong> (durée déterminée) : avec une date de fin précise.</li>
  <li><strong>Contrat de remplacement</strong> : se termine quand la personne remplacée revient.</li>
</ul>

<h2>Brut, net, c'est quoi ?</h2>
<ul>
  <li><strong>Salaire brut</strong> : avant les retenues.</li>
  <li><strong>Cotisations sociales</strong> (~13,07%) : pour la sécurité sociale (chômage, pension, mutuelle).</li>
  <li><strong>Précompte professionnel</strong> : un acompte sur tes impôts.</li>
  <li><strong>Salaire net</strong> : ce qui arrive sur ton compte.</li>
</ul>

<h2>Que vérifier dans ton contrat</h2>
<ul>
  <li>L'horaire et le nombre d'heures.</li>
  <li>Le salaire brut et les éventuels avantages.</li>
  <li>La durée (CDI, CDD…) et la période d'essai.</li>
  <li>Tes droits (congés, jours de maladie…).</li>
</ul>

<div class="callout warn"><div><strong>Avant de signer</strong>Si quelque chose te semble flou, demande à une personne de confiance, à Inforjeunes ou au service Droit des Jeunes de relire avec toi. C'est gratuit.</div></div>
`
        },
        {
          id: 'job-etudiant',
          title: "Le job étudiant",
          summary: "Travailler pendant tes études : règles et quota 650h.",
          body: `
<p>Dès 15 ans (et 2 ans de secondaire) ou 16 ans, tu peux travailler comme <strong>étudiant·e</strong>. C'est une bonne façon d'avoir un revenu d'appoint.</p>

<h2>Les règles à connaître</h2>
<ul>
  <li>Quota de <strong>650 heures par an</strong> à cotisations sociales réduites (depuis le 1er janvier 2025).</li>
  <li>Si tu dépasses, tu cotises au taux normal — ton salaire net baisse fortement.</li>
  <li>Tu peux suivre ton compteur sur <a href="https://www.studentatwork.be" target="_blank" rel="noopener">student@work</a> (compte officiel).</li>
  <li>Tu dois être déclaré·e via une <strong>Dimona étudiant</strong> (ton employeur s'en occupe).</li>
</ul>

<h2>Et tes allocations familiales&nbsp;?</h2>
<ul>
  <li><strong>Avant 18 ans</strong> : aucune incidence sur les allocations familiales.</li>
  <li><strong>De 18 à 25 ans en Wallonie</strong> : tu gardes les allocations si tu restes scolarisé·e et respectes le quota des 650h. La limite des 240h/trimestre n'existe plus en Wallonie pour le contrat étudiant.</li>
</ul>

<h2>Si tu touches le RIS</h2>
<div class="callout warn"><div><strong>Attention</strong>Si tu travailles, ton RIS du CPAS peut être réduit ce mois-là. Une exonération existe (différente si tu es boursier·ère ou non) — demande à ton·ta assistant·e social·e avant de signer.</div></div>

<h2>Côté impôts</h2>
<p>Si tu gagnes plus que la quotité exemptée d'impôt sur l'année, tu devras déclarer tes revenus. Voir <a href="#/fiche/majeur/impots">La déclaration d'impôts</a>. À ton âge, tu n'as souvent rien à payer.</p>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.studentatwork.be" target="_blank" rel="noopener">student@work</a> — suivre ton compteur d'heures</li>
  <li><a href="https://inforjeunes.be/thematique/job-etudiant/" target="_blank" rel="noopener">Inforjeunes — FAQ job étudiant</a></li>
</ul>
`
        },
        {
          id: 'epargne-pension',
          title: "L'épargne-pension",
          summary: "Mettre un peu de côté pour ta pension future, avec un avantage fiscal.",
          body: `
<p>L'<strong>épargne-pension</strong>, c'est une formule d'épargne à long terme qui te permet de constituer une <strong>pension complémentaire</strong> à la pension légale belge. Et sous certaines conditions, tu profites d'un <strong>avantage fiscal</strong> chaque année.</p>

<h2>Pourquoi y penser dès 18 ans ?</h2>
<p>Ça paraît loin, mais plus tu commences tôt, plus l'effet "boule de neige" est fort. Même de petits versements (30–50 € par mois) finissent par représenter une belle somme à 65 ans.</p>

<h2>Comment ça marche ?</h2>
<ul>
  <li>Tu verses un montant (libre, jusqu'à un <strong>plafond annuel fixé par le SPF Finances</strong>).</li>
  <li>Tu récupères <strong>jusqu'à 30 %</strong> de ce versement sous forme de <strong>réduction d'impôt</strong>.</li>
  <li>L'argent reste bloqué jusqu'à 60-65 ans (sauf quelques exceptions).</li>
</ul>

<h2>Où en souscrire ?</h2>
<p>Auprès de la plupart des <strong>banques</strong> et <strong>compagnies d'assurances</strong> belges. Compare avant de signer : les frais de gestion varient.</p>

<h2>Pas obligatoire</h2>
<p>Ce n'est <strong>pas obligatoire</strong>. Si tu n'as pas les moyens, ne te mets pas la pression — la pension légale existe. Ça peut attendre que tu aies un revenu stable.</p>

<div class="callout tip"><div><strong>À retenir</strong>Si tu commences à 25 ans plutôt qu'à 45, tu pourrais avoir <strong>2 à 3 fois plus</strong> à la retraite, pour le même effort mensuel. Le temps fait tout le travail.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://finances.belgium.be" target="_blank" rel="noopener">SPF Finances</a> — règles fiscales et plafond annuel</li>
  <li>Compare les offres sur <a href="https://www.guide-epargne.be" target="_blank" rel="noopener">guide-epargne.be</a> (indépendant)</li>
</ul>
`
        },
        {
          id: 'chomage',
          title: "Le chômage après les études",
          summary: "Stage d'insertion, allocations d'insertion, ONEM — règles 2026.",
          body: `
<p>Quand tu sors d'études sans emploi, tu peux avoir droit aux <strong>allocations d'insertion</strong> — mais le système a été <strong>profondément réformé en mars 2026</strong>. Voici les règles actuelles.</p>

<h2>Étape 1 : t'inscrire au Forem</h2>
<p>Dès la fin de tes études, tu dois t'<strong>inscrire comme demandeur·euse d'emploi au Forem</strong>. C'est cette inscription qui démarre le compteur du stage d'insertion. Voir <a href="#/fiche/travail/preparer">Préparer ma recherche</a>.</p>

<h2>Étape 2 : le stage d'insertion (156 jours = 6 mois)</h2>
<p>Avant de pouvoir toucher des allocations, tu dois faire un <strong>stage d'insertion professionnelle de 156 jours</strong> (≈ 6 mois, hors dimanches). Pendant ce temps :</p>
<ul>
  <li>Tu cherches activement un emploi.</li>
  <li>Le Forem suit ta recherche (entretiens d'évaluation).</li>
  <li>Tu peux faire des stages, suivre des formations.</li>
</ul>
<p>Avant la réforme, ce stage durait 310 jours (≈ 1 an). Depuis le <strong>1er mars 2026</strong>, c'est <strong>réduit à 156 jours</strong>.</p>

<h2>Étape 3 : les allocations d'insertion (max 12 mois)</h2>
<p>Si tu n'as toujours pas d'emploi à la fin du stage, tu peux toucher les <strong>allocations d'insertion</strong> de l'ONEM.</p>
<ul>
  <li>Versées <strong>pendant 12 mois maximum</strong> (avant la réforme : 36 mois).</li>
  <li>Tu dois avoir <strong>moins de 25 ans</strong> au moment de la première demande.</li>
  <li>Le montant dépend de ta situation : isolé·e, cohabitant·e, chef de ménage.</li>
</ul>

<h2>Pendant le stage : à savoir</h2>
<ul>
  <li>Tu gardes le droit aux <strong>allocations familiales</strong> (jusqu'à 25 ans).</li>
  <li>Si tu n'as aucun revenu, demande le <strong>RIS au CPAS</strong> — voir <a href="#/fiche/argent/ris-cpas">Le RIS et le CPAS</a>.</li>
  <li>En tant que jeune accueilli·e, ton statut donne droit au RIS sans enquête sur les parents.</li>
</ul>

<div class="callout warn"><div><strong>Attention — réforme récente</strong>Beaucoup d'infos en ligne ne sont pas encore à jour. Si tu lis "312 jours" ou "3 ans d'allocations", c'est l'ancien système. Depuis le 1er mars 2026 : <strong>156 jours de stage, 12 mois d'allocations max</strong>.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.onem.be/page/avez-vous-droit-aux-allocations-apres-des-etudes-allocations-d-insertion-et-pendant-combien-de-temps" target="_blank" rel="noopener">ONEM — allocations d'insertion</a></li>
  <li><a href="https://inforjeunes.be/thematique/allocations-dinsertion-professionnelle/" target="_blank" rel="noopener">Inforjeunes — FAQ allocations d'insertion</a></li>
</ul>
`
        }
      ]
    },

    {
      id: 'logement',
      title: 'Logement',
      subtitle: "Trouver, signer, emménager",
      color: 'logement',
      icon: ICONS.home,
      objective: "Trouver un logement adapté à ta situation et connaître tes droits de locataire.",
      source: 'logement.wallonie.be · slrb.brussels · inforjeunes.be',
      sections: [
        {
          id: 'options',
          title: "Comprendre mes options",
          summary: "Privé, AIS, SLSP, CPAS : c'est quoi la différence ?",
          body: `
<p>En Belgique, plusieurs types de logements existent, à des prix différents. Voici les principaux.</p>

<h2>Le logement privé</h2>
<p>Tu loues à un propriétaire particulier ou via une agence immobilière. C'est le plus courant, mais aussi souvent le plus cher.</p>

<h2>Le logement social (SLSP)</h2>
<p>Géré par les <strong>Sociétés de Logement de Service Public</strong>, à loyer modéré. Liste d'attente souvent longue, mais à inscrire dès que possible si tes revenus sont limités.</p>

<h2>Les AIS (Agences Immobilières Sociales)</h2>
<p>Les AIS louent des logements privés à des conditions sociales. Le loyer est plus accessible et le bail est plus protecteur. Critères de revenus à respecter.</p>

<h2>Le logement via le CPAS</h2>
<p>Certains CPAS ont leurs propres logements ou appartements de transit. À demander au CPAS de ta commune.</p>

<h2>Les APL (Associations de Promotion du Logement)</h2>
<p>Elles aident à trouver un logement adapté et accompagnent les jeunes en transition. À chercher dans ta région.</p>
`
        },
        {
          id: 'recherche',
          title: "Trouver un logement",
          summary: "Où chercher et quoi demander en visite.",
          body: `
<p>Cherche large et compare. Voici comment.</p>

<h2>Où chercher ?</h2>
<ul>
  <li><strong>Sites en ligne</strong> : Immoweb, Logic-Immo, Zimmo.</li>
  <li><strong>Réseaux sociaux</strong> : groupes Facebook locaux, marketplace.</li>
  <li><strong>Affichages dans les quartiers</strong> : certains propriétaires ne passent pas par Internet.</li>
  <li><strong>Bouche à oreille</strong> : famille, amis, AMO.</li>
</ul>

<h2>Questions à poser au propriétaire</h2>
<ul>
  <li>Quel est le montant du <strong>loyer</strong> ?</li>
  <li>Les <strong>charges</strong> sont-elles comprises ? Forfait ou réelles ? Quel montant ?</li>
  <li>Est-il <strong>meublé</strong> ?</li>
  <li>Quand sera-t-il <strong>libre</strong> ?</li>
  <li>Quelle est la <strong>durée du bail</strong> ?</li>
  <li>Y a-t-il une <strong>assurance habitation</strong> sur le bâtiment ?</li>
  <li>Peut-on s'y <strong>domicilier</strong> ?</li>
  <li>Quel est le montant de la <strong>garantie locative</strong> ? Sur compte bloqué ?</li>
</ul>

<div class="callout tip"><div><strong>Avant de visiter</strong>Vérifie ton budget réel : loyer + charges ≤ ~1/3 de tes revenus, c'est une règle de prudence.</div></div>
`
        },
        {
          id: 'bail',
          title: "Le contrat de bail",
          summary: "Ce qu'il doit contenir, comment le vérifier.",
          body: `
<p>Le bail, c'est l'écrit qui te lie au propriétaire. <strong>Toujours signer un bail écrit</strong>, en deux exemplaires (un pour toi).</p>

<h2>Tu as le droit de l'emporter</h2>
<p>Avant de signer, prends ton exemplaire et lis-le tranquillement chez toi. Le service <strong>Droit des Jeunes</strong> peut t'aider à le décrypter — c'est gratuit.</p>

<h2>Ce qu'il doit contenir</h2>
<ul>
  <li>Identité des parties (avec numéro de registre national).</li>
  <li>Date de prise du bail.</li>
  <li>Description du logement.</li>
  <li>Montant du loyer et des charges.</li>
  <li>Durée du bail.</li>
</ul>

<h2>L'enregistrement</h2>
<p>Le bail doit être <strong>enregistré au SPF Finances</strong>. Sans cet enregistrement, certaines clauses ne sont pas valables. Plus d'infos : <a href="https://finances.belgium.be" target="_blank" rel="noopener">finances.belgium.be</a></p>

<h2>Durée du bail</h2>
<ul>
  <li>1 an, 3 ans ou 9 ans : c'est la loi.</li>
  <li>Si tu veux partir, tu dois donner ton <strong>préavis par recommandé</strong>.</li>
  <li>Le délai commence le <strong>1er du mois suivant</strong> l'envoi du recommandé.</li>
</ul>
`
        },
        {
          id: 'etat-des-lieux',
          title: "L'état des lieux",
          summary: "Le document qui te protège quand tu pars.",
          body: `
<p>L'<strong>état des lieux</strong> décrit en détail le logement à ton arrivée. C'est <strong>essentiel</strong> : ce qui n'est pas noté dedans pourra être mis sur ton dos quand tu quitteras les lieux.</p>

<h2>Quand le faire ?</h2>
<p>Avec le propriétaire, idéalement <strong>avant d'entrer</strong> dans le logement, ou dans les <strong>15 premiers jours</strong>.</p>

<h2>À faire</h2>
<ul>
  <li>Sois <strong>très précis·e</strong> : "porte d'entrée usée", "rideau de douche neuf"…</li>
  <li><strong>Prends des photos</strong> et demande qu'elles soient incluses.</li>
  <li>Signe et date le document, le propriétaire aussi.</li>
  <li>Garde un exemplaire chez toi.</li>
</ul>

<div class="callout warn"><div><strong>Pas d'état des lieux ?</strong>Tu es censé·e avoir reçu le bien dans le même état qu'à la sortie. Mais c'est risqué — exige toujours un état des lieux écrit.</div></div>

<p>Pendant ton occupation, le propriétaire <strong>n'a pas le droit d'entrer chez toi</strong> sans rendez-vous.</p>
`
        },
        {
          id: 'garantie',
          title: "La garantie locative",
          summary: "Ce que c'est, et l'aide du CPAS si tu n'as pas l'argent.",
          body: `
<p>La <strong>garantie locative</strong> (ou caution) sert à couvrir tes éventuels manquements (loyer impayé, dégâts…).</p>

<h2>Trois formes possibles (au choix du locataire)</h2>
<ul>
  <li><strong>Compte bloqué</strong> à ton nom : maximum <strong>2 mois</strong> de loyer.</li>
  <li><strong>Garantie bancaire</strong> (constituée progressivement, sur 3 ans max) : maximum <strong>3 mois</strong> de loyer.</li>
  <li><strong>Garantie via le CPAS</strong> (contrat type CPAS-banque) : maximum <strong>3 mois</strong> de loyer.</li>
</ul>

<h2>Pas d'argent pour la caution ?</h2>
<p>Va voir le <strong>CPAS de ta commune</strong>. Il peut se porter garant pour toi via un document remis à ton propriétaire.</p>

<div class="callout warn"><div><strong>À savoir</strong>Cette caution devra être remboursée au CPAS. Elle te sera prélevée du RIS pendant les premiers mois.</div></div>
`
        },
        {
          id: 'assurance-habitation',
          title: "L'assurance habitation",
          summary: "Pourquoi en prendre une, ce qu'elle couvre, comment choisir.",
          body: `
<p>Quand tu es <strong>locataire</strong>, tu dois souscrire une <strong>assurance habitation</strong> (souvent appelée <strong>assurance incendie locataire</strong>). C'est généralement <strong>obligatoire</strong> dans le bail, et c'est ta protection si quelque chose tourne mal.</p>

<h2>Ce qu'elle couvre</h2>
<ul>
  <li><strong>Incendie</strong>, explosion, fumée.</li>
  <li><strong>Dégâts des eaux</strong> (fuite, gel des canalisations).</li>
  <li>Tempêtes, grêle, catastrophes naturelles.</li>
  <li><strong>Ta responsabilité civile locative</strong> : si tu causes un dégât au logement (incendie de cuisine, fuite que tu n'as pas signalée…), c'est ton assurance qui paie le proprio.</li>
  <li>Souvent : <strong>vol</strong> et <strong>contenu</strong> de ton logement (mobilier, électroménager, vêtements).</li>
</ul>

<h2>Pourquoi c'est important</h2>
<p>Sans assurance, si un incendie partiel se déclare chez toi, tu peux te retrouver à devoir <strong>plusieurs dizaines de milliers d'euros</strong> au propriétaire. C'est un risque que tu ne peux pas porter seul·e.</p>

<h2>Combien ça coûte&nbsp;?</h2>
<p>Pour un studio ou un petit appartement, compte généralement entre <strong>10 et 25 € par mois</strong>. Tu peux payer mensuellement ou annuellement (souvent un peu moins cher en annuel).</p>

<h2>Où la souscrire&nbsp;?</h2>
<ul>
  <li>Auprès de ta <strong>banque</strong> (souvent une offre packagée avec le compte).</li>
  <li>Auprès d'une <strong>compagnie d'assurances</strong> directement (AG, AXA, Ethias, P&V, Belfius Insurance…).</li>
  <li>Via un <strong>courtier d'assurance</strong> indépendant (gratuit pour toi, il compare plusieurs assureurs). Cherche sur Google « courtier d'assurance + ta ville ».</li>
</ul>

<h2>À vérifier dans le contrat</h2>
<ul>
  <li>Le <strong>capital assuré</strong> (en cas de dégâts, ça couvre jusqu'à combien ?).</li>
  <li>La <strong>franchise</strong> (ce qui reste à ta charge en cas de sinistre).</li>
  <li>Le <strong>vol</strong> est-il inclus ou en option ?</li>
  <li>Y a-t-il un <strong>abandon de recours</strong> du proprio (= moins de risques pour toi) ?</li>
</ul>

<div class="callout warn"><div><strong>Attention</strong>Le propriétaire a sa propre assurance pour le bâtiment, mais elle ne couvre <strong>pas</strong> tes affaires à toi ni ta responsabilité. Les deux assurances sont indispensables.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.assuralia.be" target="_blank" rel="noopener">Assuralia</a> — fédération des assureurs (infos générales)</li>
</ul>
`
        },
        {
          id: 'aides',
          title: "Les aides au logement",
          summary: "Qui contacter, à quoi tu as droit.",
          body: `
<p>Plusieurs aides existent pour t'aider à payer ton logement. Renseigne-toi avant de signer.</p>

<h2>L'aide du CPAS</h2>
<ul>
  <li><strong>Garantie locative</strong> : le CPAS peut se porter garant.</li>
  <li><strong>Aide à l'installation</strong> : ponctuelle, pour les premiers frais (mobilier, électroménager…).</li>
  <li><strong>Aide au loyer</strong> : possible selon ta situation.</li>
</ul>

<h2>L'allocation déménagement (ADIL)</h2>
<p>Pour les personnes à revenus modestes qui quittent un logement insalubre ou trop petit pour un meilleur. À demander à la Région wallonne.</p>

<h2>L'allocation loyer</h2>
<p>Pour les locataires d'un logement privé inscrits sur la liste d'attente d'un logement social. Conditions strictes.</p>

<h2>Le service Droit des Jeunes</h2>
<p>Gratuit, confidentiel : ils t'aident à comprendre tes droits et à monter ton dossier. À contacter dès le début.</p>
`
        },
        {
          id: 'compteurs',
          title: "L'ouverture des compteurs",
          summary: "Eau, gaz, électricité : premières démarches dans ton logement.",
          body: `
<p>Dès que tu as les clés, tu dois <strong>ouvrir les compteurs à ton nom</strong> (électricité, gaz, eau), <strong>sauf</strong> si les charges sont déjà comprises dans ton loyer.</p>

<h2>Étape 1 : faire le relevé d'entrée</h2>
<p>Avec le <strong>locataire précédent</strong> (ou le propriétaire), note l'<strong>index</strong> des compteurs au moment où tu prends possession. Garde ces chiffres précieusement — ils servent à éviter qu'on te facture la consommation de quelqu'un d'autre.</p>

<h2>Étape 2 : choisir un fournisseur d'énergie</h2>
<p>Plusieurs fournisseurs (Engie, Luminus, Mega, TotalEnergies, Octa+…). Compare les prix avant de signer :</p>
<ul>
  <li><strong>Wallonie</strong> : <a href="https://www.compacwape.be" target="_blank" rel="noopener">comparateur officiel CWaPE</a></li>
  <li><strong>Bruxelles</strong> : <a href="https://brusim.brugel.brussels" target="_blank" rel="noopener">comparateur Brugel</a></li>
</ul>

<h2>Étape 3 : remplir et envoyer les formulaires</h2>
<ul>
  <li><strong>Eau (Wallonie)</strong> : formulaire de déménagement de la <a href="https://www.swde.be" target="_blank" rel="noopener">SWDE</a> à compléter et renvoyer.</li>
  <li><strong>Électricité &amp; gaz</strong> : <strong>document de reprise des énergies</strong> (signé entre toi et le locataire précédent) à renvoyer à ton fournisseur. Disponible sur le site de ton gestionnaire de réseau (RESA, ORES…).</li>
</ul>

<h2>Tu touches le RIS ? Demande le tarif social</h2>
<p>Si tu es au RIS du CPAS, tu as droit au <strong>tarif social pour l'énergie</strong> (électricité, gaz, chaleur). Il est <strong>identique partout en Belgique</strong>, peu importe le fournisseur.</p>
<ul>
  <li>Souvent <strong>automatique</strong> mais pas toujours.</li>
  <li>Demande à ton·ta intervenant·e CPAS de faire la démarche.</li>
  <li>Voir aussi <a href="#/fiche/argent/aides-supp">Bons plans : tarif social, seconde main</a>.</li>
</ul>

<h2>À vérifier avant de signer le bail</h2>
<ul>
  <li><strong>EPB</strong> (performance énergétique) du logement — si c'est mauvais (F ou G), ta facture explosera.</li>
  <li>Type de chauffage (gaz, mazout, électrique, pompe à chaleur).</li>
  <li>Compteur intelligent ou pas (impacte les tarifs heures pleines/creuses).</li>
</ul>
`
        },
        {
          id: 'entretien',
          title: "Entretien du logement",
          summary: "Quelques habitudes simples + produits naturels pour pas cher.",
          body: `
<p>« Un esprit sain dans un corps sain. » Ton logement aussi : si tu t'y sens bien, tu vas bien. Quelques habitudes simples suffisent — pas besoin de produits hors de prix.</p>

<h2>Petites habitudes qui changent tout</h2>
<ul>
  <li><strong>Faire ton lit</strong> tous les jours (5 min, ça change l'ambiance).</li>
  <li>Chaque chose à sa place : <strong>ranger tout de suite</strong> ce que tu utilises.</li>
  <li><strong>Vaisselle</strong> faite chaque jour (sinon ça s'accumule).</li>
  <li><strong>Aérer</strong> 10 min par jour, même en hiver.</li>
  <li>Balai ou aspirateur <strong>1 fois par semaine</strong> minimum.</li>
</ul>

<h2>3 produits naturels qui font tout</h2>
<p>Les produits ménagers de supermarché coûtent cher. Avec ces trois-là, tu fais <strong>90 %</strong> du ménage&nbsp;:</p>
<ul>
  <li><strong>Vinaigre blanc</strong> : détartre, désinfecte, dégraisse. Pas cher, dispo partout.</li>
  <li><strong>Bicarbonate de soude</strong> : récure, désodorise, blanchit.</li>
  <li><strong>Savon noir</strong> ou savon de Marseille : nettoie tout (sols, vêtements, vaisselle).</li>
</ul>

<h2>Quelques recettes</h2>
<ul>
  <li><strong>Anticalcaire WC/évier</strong> : vinaigre blanc pur, laisser agir 1 h, frotter, rincer.</li>
  <li><strong>Désodoriser frigo/poubelle</strong> : 1 cuillère de bicarbonate dans une coupelle, à laisser 24 h.</li>
  <li><strong>Vitres</strong> : eau + vinaigre blanc (50/50), papier journal pour essuyer.</li>
</ul>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.ecoconso.be" target="_blank" rel="noopener">ecoconso.be</a> — fiches pratiques sur les produits naturels d'entretien</li>
</ul>

<div class="callout tip"><div><strong>Si tu galères mentalement</strong>Quand on déprime, l'entretien du logement est souvent ce qui lâche en premier — et ça empire le moral. Si tu vois ce cercle s'installer, c'est <strong>un signal</strong>. Voir <a href="#/fiche/urgence/mal-etre">Quand ça ne va pas</a>.</div></div>
`
        },
        {
          id: 'changement-adresse',
          title: "Changer d'adresse",
          summary: "Domiciliation, démarches en chaîne.",
          body: `
<p>Tu emménages ? Tu dois te <strong>domicilier</strong> à ta nouvelle adresse — c'est obligatoire.</p>

<h2>Comment faire ?</h2>
<ol class="fiche-ol">
  <li>Tu vas à l'administration communale de ta nouvelle commune avec ta carte d'identité.</li>
  <li>Tu déclares ton changement d'adresse.</li>
  <li>Un agent de quartier passe vérifier que tu vis bien à cette adresse.</li>
  <li>Tu vas chercher ta nouvelle carte d'identité (ou la mise à jour) à la commune.</li>
</ol>

<h2>À prévenir aussi</h2>
<ul>
  <li>Ta <strong>mutuelle</strong>.</li>
  <li>Ta <strong>banque</strong>.</li>
  <li>Le <strong>Forem</strong> ou ton employeur.</li>
  <li>Le <strong>CPAS</strong> si tu y es suivi·e.</li>
  <li>Ton <strong>fournisseur d'énergie</strong> et ton opérateur télécom.</li>
</ul>
`
        }
      ]
    },

    {
      id: 'vie',
      title: 'Vie quotidienne',
      subtitle: "Transport, alimentation, débrouille",
      color: 'vie',
      icon: ICONS.cart,
      objective: "Gérer ton quotidien plus facilement : se déplacer, se nourrir, économiser.",
      source: 'infotec.be (TEC) · wallonie.be · ibpt.be',
      sections: [
        {
          id: 'communication',
          title: "GSM, internet, abonnements",
          summary: "Mettre ton GSM à ton nom, choisir un opérateur, tarif social.",
          body: `
<p>Si ton numéro est encore lié au contrat de ta famille (ou famille d'accueil), tu peux le garder — mais le jour où tu prends ton autonomie, il faudra <strong>le mettre à ton nom</strong>. Voici comment t'y retrouver.</p>

<h2>Garder ton numéro, changer le titulaire</h2>
<p>C'est gratuit et ça se fait en quelques étapes. Tu contactes ton opérateur (Proximus, Orange, Telenet/BASE, VOO…), tu demandes un <strong>transfert de titulaire</strong>. La personne actuellement titulaire doit signer pour autoriser, et toi tu fournis ta carte d'identité + un IBAN pour la domiciliation.</p>

<h2>Comparer les opérateurs</h2>
<p>Les offres bougent souvent. Avant de signer, compare sur :</p>
<ul>
  <li><a href="https://www.mesfournisseurs.be/mobile/" target="_blank" rel="noopener">mesfournisseurs.be</a> — comparateur indépendant GSM</li>
  <li><a href="https://www.bestetarif.be" target="_blank" rel="noopener">bestetarif.be</a> — comparateur officiel BIPT (téléphonie + internet)</li>
</ul>

<h2>Le tarif social internet (19 €/mois)</h2>
<p>Si tu touches le RIS, l'aide sociale du CPAS, ou la GRAPA, tu as droit à l'<strong>offre internet sociale</strong> : <strong>19 € par mois maximum</strong>, vitesse minimum 30 Mbps, 150 Go inclus.</p>
<ul>
  <li>Disponible chez Proximus, Orange (sous certaines conditions), VOO (Wallonie).</li>
  <li>Demande à l'opérateur ou via <a href="https://economie.fgov.be/fr/themes/line/telecommunications/offre-internet-sociale" target="_blank" rel="noopener">le SPF Économie</a>.</li>
</ul>

<h2>Astuces pour réduire la facture</h2>
<ul>
  <li><strong>Forfait avec wifi à la maison</strong> : utilise ton wifi pour ne pas exploser les data mobiles.</li>
  <li><strong>Cartes prépayées</strong> : pas de contrat, tu recharges quand tu veux.</li>
  <li><strong>Pas de roaming UE</strong> : depuis 2017, tu utilises ton forfait belge dans toute l'UE sans surcoût.</li>
</ul>

<div class="callout tip"><div><strong>Avant de signer</strong>Vérifie toujours : durée d'engagement (12 ou 24 mois), frais de résiliation anticipée, prix après les 6 premiers mois (souvent en promo, puis ça monte).</div></div>
`
        },
        {
          id: 'permis-conduire',
          title: "Le permis de conduire (B)",
          summary: "Théorique, pratique, filières, coût en Wallonie 2026.",
          body: `
<p>Le permis B (voiture), c'est un parcours en plusieurs étapes. Voici comment ça se passe en Wallonie.</p>

<h2>Étape 1 : l'examen théorique (dès 17 ans)</h2>
<ul>
  <li>50 questions à choix multiples.</li>
  <li><strong>17 € en 2026</strong>.</li>
  <li>Tu peux te préparer avec le livre <strong>Feu Vert</strong>, des sites en ligne ou en auto-école.</li>
  <li>Plus d'infos : <a href="https://www.wallonie.be/fr/demarches/passer-le-permis-de-conduire-theorique-categorie-b" target="_blank" rel="noopener">wallonie.be</a></li>
</ul>

<div class="callout warn"><div><strong>Depuis le 1er janvier 2026</strong>Tu dois passer le théorique <strong>en Wallonie</strong> si tu veux passer le pratique en Wallonie. Plus possible de mixer Bruxelles + Wallonie.</div></div>

<h2>Étape 2 : choisir ta filière pour le pratique</h2>

<h3>Filière libre (M36)</h3>
<ul>
  <li>Tu apprends avec un·e <strong>guide</strong> (parent, ami·e, etc., qui a son permis depuis ≥ 8 ans).</li>
  <li>Obligatoire : <strong>rendez-vous pédagogique de 3 heures</strong> avec ton·ta guide avant de commencer.</li>
  <li>Stage minimum 3 mois avant l'examen pratique.</li>
  <li>Coût total estimé : <strong>150 à 250 €</strong> (examens + RDV pédago).</li>
</ul>

<h3>Auto-école</h3>
<ul>
  <li>Tu prends des cours encadrés.</li>
  <li>Plus cher (souvent <strong>1500 à 2500 €</strong>) mais plus encadré.</li>
  <li>Tu peux faire des forfaits ou des heures à l'unité.</li>
</ul>

<h3>Filière accès direct (auto-école sans guide)</h3>
<p>Une variante d'auto-école avec une période de pratique courte. Renseigne-toi auprès des auto-écoles agréées.</p>

<h2>Tu n'as pas les moyens&nbsp;?</h2>
<p>Le <strong>CPAS</strong> peut prendre en charge tout ou partie du permis si tu démontres que c'est nécessaire pour <strong>trouver un emploi</strong> ou pour ton autonomie. Demande à ton·ta assistant·e social·e.</p>
<p>Certaines régions proposent aussi des <strong>aides spécifiques au permis pour les jeunes</strong> ; renseigne-toi à ta commune.</p>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.wallonie.be/fr/demarches/passer-le-permis-de-conduire-theorique-categorie-b" target="_blank" rel="noopener">Wallonie — permis de conduire</a></li>
  <li><a href="https://www.feuvert.be" target="_blank" rel="noopener">Feu Vert</a> — préparation aux examens</li>
</ul>
`
        },
        {
          id: 'transport',
          title: "Bus, train, vélo",
          summary: "TEC, SNCB, abonnement combiné, vélo en libre-service.",
          body: `
<h2>TEC (Wallonie) — bus, trams</h2>
<ul>
  <li>Tarif réduit pour les <strong>moins de 25 ans</strong>.</li>
  <li>Abonnement annuel TEC <strong>jusqu'à 24 ans : 12 €/an</strong> (oui, douze euros).</li>
  <li>Site et appli : <a href="https://www.letec.be" target="_blank" rel="noopener">letec.be</a></li>
</ul>

<h2>SNCB — trains</h2>
<ul>
  <li><strong>Go Pass</strong> : pour les -26 ans. 10 trajets simples sur la Belgique pour ~60 €.</li>
  <li><strong>Pass étudiant</strong> : abonnement scolaire entre la gare la plus proche de chez toi et celle de ton école/fac.</li>
  <li>Simulateur tarif et achat : <a href="https://www.belgiantrain.be" target="_blank" rel="noopener">belgiantrain.be</a></li>
</ul>

<h2>Combiné SNCB + TEC</h2>
<p>Si tu prends le train ET le bus quotidiennement, demande l'<strong>abonnement combiné</strong>. Plus avantageux que les deux pris séparément.</p>

<h2>Vélo</h2>
<ul>
  <li><strong>Vélos électriques en libre-service</strong> : Liège (Liégeois et environs), Charleroi, Mons (renseigne-toi à ta commune).</li>
  <li><strong>Achat d'un vélo d'occasion</strong> : entre 100 et 300 €. Vérifie freins, chaîne, gonflage avant d'acheter.</li>
</ul>

<h2>Permis de conduire</h2>
<p>Voir la fiche dédiée <a href="#/fiche/vie/permis-conduire">Le permis de conduire (B)</a> pour toutes les étapes (théorique, pratique, filières, coût) et les aides possibles via le CPAS.</p>
`
        },
        {
          id: 'alimentation',
          title: "Alimentation : manger bien sans se ruiner",
          summary: "Pyramide, conservation, anti-gaspi, aide alimentaire.",
          body: `
<p>« Ça y est, je suis libre, ça sera fast-food tous les jours. » Tentant — mais ton corps et ton portefeuille vont le sentir vite. Quelques repères simples suffisent à manger correctement sans se ruiner.</p>

<h2>La base : la pyramide alimentaire</h2>
<p>Pas de régime, juste un équilibre. Sur une semaine, vise&nbsp;:</p>
<ul>
  <li><strong>Beaucoup</strong> : eau, légumes, fruits.</li>
  <li><strong>Régulièrement</strong> : féculents complets (pâtes, riz, pain), légumineuses (lentilles, pois chiches).</li>
  <li><strong>Modérément</strong> : viandes, poissons, œufs, produits laitiers.</li>
  <li><strong>Avec parcimonie</strong> : graisses, sucres, alcool, plats préparés.</li>
</ul>
<p>Plus d'infos sur <a href="https://www.foodinaction.com" target="_blank" rel="noopener">foodinaction.com</a> ou <a href="https://www.mongeneraliste.be" target="_blank" rel="noopener">mongeneraliste.be</a>.</p>

<h2>Faire ses courses sans exploser le budget</h2>
<ol class="fiche-ol">
  <li><strong>Prépare un menu</strong> pour la semaine avant de partir au magasin.</li>
  <li><strong>Fais une liste</strong> et tiens-toi à ta liste.</li>
  <li><strong>Le ventre plein</strong> : on achète moins n'importe quoi quand on n'a pas faim.</li>
  <li><strong>Marché en fin de journée</strong> : légumes parfois 50 % moins cher.</li>
  <li><strong>Marques distributeurs</strong> : souvent identiques aux marques connues, 30–50 % moins cher.</li>
</ol>

<h2>Anti-gaspi et seconde main alimentaire</h2>
<ul>
  <li><a href="https://www.toogoodtogo.be" target="_blank" rel="noopener">Too Good To Go</a>, <a href="https://www.phenix.be" target="_blank" rel="noopener">Phenix</a> : invendus boulangeries, restos, supermarchés à 30–70 % moins cher.</li>
  <li><strong>Frigos communautaires</strong> : présents dans plusieurs communes wallonnes (renseigne-toi à ta commune).</li>
  <li><strong>Boîtes à dons</strong> dans certains quartiers : on prend, on dépose.</li>
</ul>

<h2>Bien conserver ce qu'on achète</h2>
<ul>
  <li><strong>Frigo</strong> : pas trop plein (l'air doit circuler), aliments dans des boîtes hermétiques quand l'emballage est ouvert.</li>
  <li><strong>Zones de température</strong> : viande/poisson dans la zone froide (~4 °C), légumes dans le bac à légumes, restes en haut.</li>
  <li><strong>Nettoyer le frigo</strong> 1 fois par mois (eau + vinaigre blanc).</li>
  <li><strong>Congélateur</strong> : viande/sauces/poisson 3 mois max ; bœuf/volaille/légumes 1 an. <strong>Jamais recongeler</strong> un aliment décongelé.</li>
</ul>

<h2>Recettes simples à connaître</h2>
<p>Avec quelques bases (œufs, pâtes, riz, légumineuses, conserves de légumes), tu te débrouilles. Cherche en ligne&nbsp;:</p>
<ul>
  <li>« recette pâtes œufs lardons »</li>
  <li>« lentilles corail express »</li>
  <li>« omelette pommes de terre »</li>
  <li>« riz cantonnais maison »</li>
</ul>

<h2>L'aide alimentaire — c'est un droit</h2>
<p>Si tu galères, plusieurs services existent <strong>gratuitement</strong>&nbsp;:</p>
<ul>
  <li><a href="https://www.restosducoeur.be" target="_blank" rel="noopener">Restos du Cœur</a></li>
  <li><a href="https://www.croix-rouge.be" target="_blank" rel="noopener">Croix-Rouge</a> — colis et épiceries sociales</li>
  <li>Épiceries sociales locales (à ~10–30 % du prix normal)</li>
  <li>Ton <strong>CPAS</strong> peut t'orienter et accorder une aide ponctuelle.</li>
</ul>

<div class="callout tip"><div><strong>Pas de honte</strong>Demander de l'aide alimentaire, c'est un droit. Beaucoup de jeunes y ont recours à un moment de leur vie. Personne ne te demandera de te justifier.</div></div>
`
        },
        {
          id: 'lessive',
          title: "Faire sa lessive",
          summary: "Trier, doser, programmer, étendre : les bases pour pas tout abîmer.",
          source: 'ecoconso.be · inforjeunes.be',
          body: `
<p>Première lessive sans tes parents ou ta famille d'accueil ? Pas de panique, ce n'est pas sorcier. Quelques règles simples suffisent à ne pas transformer ton t-shirt blanc en t-shirt rose.</p>

<h2>1. Trier ton linge</h2>
<p>C'est l'étape la plus importante. Fais 3-4 piles :</p>
<ul>
  <li><strong>Blanc et clair</strong> (chemises blanches, sous-vêtements clairs).</li>
  <li><strong>Couleurs</strong> (t-shirts colorés, jeans non noirs).</li>
  <li><strong>Foncé / noir</strong> (jeans noirs, hoodies foncés).</li>
  <li><strong>Délicat</strong> (laine, soie, lingerie) — à part, programme spécial.</li>
</ul>
<p>Sépare aussi le linge <strong>très sale</strong> (sport, jardinage) du reste — sinon tu salis le reste.</p>

<div class="callout warn"><div><strong>Étiquette = ta meilleure amie</strong>Regarde toujours l'étiquette à l'intérieur du vêtement. Les symboles indiquent la température max, si tu peux mettre au sèche-linge, si c'est lavable en machine, etc.</div></div>

<h2>2. Préparer les vêtements</h2>
<ul>
  <li><strong>Vide les poches</strong> (mouchoirs, billets, écouteurs, monnaie…).</li>
  <li><strong>Ferme</strong> les fermetures éclair et boutons (sinon ça arrache).</li>
  <li><strong>Retourne</strong> les couleurs et les vêtements imprimés sur l'envers (évite la décoloration).</li>
  <li>Mets les <strong>petites pièces fragiles</strong> (lingerie, chaussettes) dans un filet de lavage si tu en as un.</li>
</ul>

<h2>3. Charger la machine</h2>
<ul>
  <li><strong>Ne surcharge pas</strong> : le linge doit pouvoir tourner librement. Repère : ta main doit passer au-dessus.</li>
  <li>Pour une machine standard de 7 kg, ça fait environ <strong>une grande corbeille</strong>.</li>
</ul>

<h2>4. Doser la lessive</h2>
<p>Trop de lessive ne lave pas mieux — au contraire, ça rince mal et raidit les fibres.</p>
<ul>
  <li>Suis les <strong>indications sur l'emballage</strong> (bouchon doseur).</li>
  <li>Pour une eau peu calcaire (la Belgique varie selon la région), <strong>réduis un peu</strong>.</li>
  <li>Liquide ou poudre, c'est selon ton goût — la poudre est souvent moins chère.</li>
  <li><strong>Adoucissant</strong> : facultatif. Évite-le sur les serviettes (perd l'absorbance) et les vêtements de sport techniques.</li>
</ul>

<h2>5. Choisir le programme</h2>
<ul>
  <li><strong>30 °C</strong> : couleurs, synthétique, vêtements peu sales. Économique en énergie — <strong>ça suffit pour 90 % du linge</strong>.</li>
  <li><strong>40 °C</strong> : coton clair, linge un peu plus sale.</li>
  <li><strong>60 °C</strong> : draps, serviettes, sous-vêtements, taches biologiques (sang, transpiration tenace).</li>
  <li><strong>Délicat / Laine</strong> : programme dédié, eau froide, essorage doux. Indispensable pour la laine (sinon ça rétrécit).</li>
  <li><strong>Essorage</strong> : 1000-1200 tours/min pour le coton standard, 600-800 pour le délicat.</li>
</ul>

<div class="callout tip"><div><strong>Astuce écologique et économique</strong>Lave à 30 °C dès que possible. Tu économises <strong>jusqu'à 60 %</strong> d'électricité par rapport à un 60 °C — la facture annuelle s'en ressent.</div></div>

<h2>6. Étendre et sécher</h2>
<ul>
  <li><strong>Sors la machine vite</strong> après la fin (sinon ça sent le moisi humide).</li>
  <li><strong>Secoue</strong> chaque vêtement avant de l'étendre (moins de plis).</li>
  <li>Étends les couleurs à l'envers <strong>à l'abri du soleil direct</strong> (évite la décoloration).</li>
  <li><strong>Sèche-linge</strong> : économise du temps mais coûte cher en élec — nettoie le filtre à peluches <strong>à chaque cycle</strong>.</li>
  <li><strong>Pas de sèche-linge</strong> pour : laine, soie, élasthanne, vêtements de sport techniques (les fibres se cassent).</li>
</ul>

<h2>7. Détacher les taches courantes</h2>
<ul>
  <li><strong>Tache fraîche = tache facile.</strong> Agis vite.</li>
  <li><strong>Sang</strong> : eau <strong>froide</strong> (l'eau chaude cuit la tache). Frotte avec du savon de Marseille.</li>
  <li><strong>Gras / huile</strong> : saupoudre de talc ou de farine, laisse absorber, puis lave avec liquide vaisselle avant de mettre en machine.</li>
  <li><strong>Vin / café</strong> : eau gazeuse + savon de Marseille.</li>
  <li><strong>Sueur (auréoles)</strong> : vinaigre blanc avant lavage, ou bicarbonate de soude en pâte.</li>
  <li><strong>Encre</strong> : alcool ménager (sur un coton), tamponne doucement.</li>
</ul>

<h2>8. Entretenir ta machine</h2>
<ul>
  <li><strong>1 fois par mois</strong> : programme 90 °C à vide avec <strong>1 verre de vinaigre blanc</strong> dans le tambour → détartre et désinfecte.</li>
  <li><strong>Après chaque lavage</strong> : laisse la <strong>porte entrouverte</strong> (évite l'humidité et les odeurs).</li>
  <li><strong>Tous les 6 mois</strong> : nettoie le filtre de vidange (en bas devant, souvent un petit volet) — sinon ça bouche.</li>
  <li>Essuie le joint en caoutchouc autour de la porte de temps en temps.</li>
</ul>

<h2>Pas de machine chez toi ?</h2>
<p>Direction le lavoir (laverie automatique). Voir la fiche dédiée : <a href="#/fiche/vie/lavoir">Les lavoirs (laveries automatiques)</a>.</p>

<div class="callout tip"><div><strong>Côté budget</strong>Les marques distributeurs (Carrefour, Colruyt, Delhaize 365…) lavent <strong>aussi bien</strong> que les grandes marques pour 30-50 % moins cher. Le savon de Marseille et le vinaigre blanc remplacent la moitié des produits de l'industrie pour quelques euros par mois.</div></div>
`
        },
        {
          id: 'lavoir',
          title: "Les lavoirs (laveries automatiques)",
          summary: "Quand y aller, comment ça marche, combien ça coûte.",
          source: 'inforjeunes.be · wassalon.be',
          body: `
<p>Pas de machine chez toi ? En kot, en colocation sans accès lave-linge, ou ta machine est en panne ? Direction le <strong>lavoir</strong> (aussi appelé laverie automatique ou laundromat). C'est simple, rapide, et ça dépanne bien.</p>

<h2>Quand y aller</h2>
<ul>
  <li>Tu n'as pas de lave-linge chez toi.</li>
  <li>Tu vis en kot ou en logement étudiant sans buanderie.</li>
  <li>Ta machine est en panne (en attendant la réparation).</li>
  <li>Tu dois laver une <strong>grosse pièce</strong> (couette, gros édredon, sac de couchage) qui ne rentre pas dans une machine domestique standard.</li>
</ul>

<h2>Comment ça marche</h2>
<ol class="fiche-ol">
  <li>Apporte ton linge <strong>déjà trié</strong> (voir <a href="#/fiche/vie/lessive">Faire sa lessive</a> pour les bases du tri).</li>
  <li>Choisis une <strong>machine libre</strong> selon la taille (souvent S / M / L / XL).</li>
  <li><strong>Paie</strong> : selon l'endroit, c'est des jetons, de la monnaie, une appli (Wassalon par ex.), ou la carte bancaire.</li>
  <li>Mets ta <strong>lessive</strong> dans le bac (souvent à apporter de chez toi, parfois distribuée sur place pour 1-2 € de plus).</li>
  <li>Choisis le <strong>programme</strong> (30 / 40 / 60 °C) et lance.</li>
  <li>Cycle de lavage : <strong>30 à 50 minutes</strong>. Tu peux rester ou repartir (à tes risques).</li>
  <li>Sortie de machine, direction <strong>sèche-linge</strong> (autre machine, autre paiement, ~5 €).</li>
  <li>Plie et c'est fini.</li>
</ol>

<h2>Combien ça coûte (Belgique 2026)</h2>
<ul>
  <li><strong>Machine standard</strong> (7-8 kg) : <strong>4 à 7 €</strong> selon la taille et l'endroit.</li>
  <li><strong>Grosse machine</strong> (16-18 kg, pour les couettes) : <strong>10 à 14 €</strong>.</li>
  <li><strong>Sèche-linge</strong> : <strong>3 à 6 €</strong> par cycle (~30 min, parfois 2 cycles nécessaires).</li>
  <li><strong>Lessive sur place</strong> (si tu n'en as pas apporté) : <strong>1 à 2 €</strong>.</li>
  <li><strong>Total pour une lessive complète</strong> : compte <strong>8 à 13 €</strong>.</li>
</ul>

<h2>Astuces pour économiser et gagner du temps</h2>
<ul>
  <li><strong>Apporte ta lessive de chez toi</strong> (économie de 2-3 € par fois).</li>
  <li><strong>Remplis bien la machine</strong> : une grande machine 1× par mois revient moins cher que 4 petites.</li>
  <li><strong>Heures creuses</strong> : matin tôt, milieu de semaine — moins d'attente.</li>
  <li>Apporte un <strong>livre, écouteurs ou ton téléphone chargé</strong> : tu as ~45-90 min à occuper.</li>
  <li>Plie <strong>sur place</strong> avant de remettre en sac (moins de plis chez toi).</li>
  <li>Vérifie les <strong>poches</strong> avant de mettre dans la machine (oublier 5 € dans un jean coûte autant qu'une lessive).</li>
</ul>

<h2>Chaînes et lavoirs en Belgique</h2>
<ul>
  <li><strong>Wassalon</strong> — la plus grande chaîne (Wallonie + Bruxelles). Souvent paiement par appli.</li>
  <li><strong>MyWash</strong> — plusieurs villes wallonnes.</li>
  <li><strong>Laveries indépendantes</strong> — il y en a dans presque toutes les villes. Cherche "laverie automatique" + ta ville sur Google Maps.</li>
</ul>

<h2>Bons plans</h2>
<ul>
  <li><strong>CPAS</strong> : si tu galères pour payer ta lessive, ils peuvent accorder une aide ponctuelle (les vêtements propres font partie des besoins de base).</li>
  <li>Certaines <strong>AMO</strong>, maisons de jeunes ou foyers d'accueil ont des machines à laver accessibles à prix symbolique ou gratuites pour leurs membres.</li>
  <li><strong>Université ou haute école</strong> : certains kots étudiants ont une buanderie partagée à prix réduit.</li>
</ul>

<div class="callout tip"><div><strong>Pour les grosses pièces</strong>Couettes, gros édredons, gros sacs de couchage : préfère le lavoir, même si tu as une machine chez toi. Les grosses machines (16+ kg) lavent et essorent correctement ce que ta machine domestique fait mal (et risque de casser).</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li>Voir la fiche <a href="#/fiche/vie/lessive">Faire sa lessive</a> pour les bases (tri, dosage, programmes).</li>
  <li>Voir <a href="#/fiche/argent/aides-supp">Bons plans : tarif social, seconde main</a> pour les aides liées au quotidien.</li>
</ul>
`
        }
      ]
    },

    {
      id: 'loisirs',
      title: 'Loisirs',
      subtitle: "Activités, culture, souffler",
      color: 'majeur',
      icon: ICONS.leaf,
      objective: "Trouver des activités, profiter de la culture et du sport, souffler quand t'en as besoin — souvent gratuitement ou à petit prix.",
      source: 'article27.be · adeps.be · fdmj.org',
      sections: [
        {
          id: 'pass-jeune',
          title: "Pass Jeune et réductions culturelles",
          summary: "Des réductions sur la culture, le sport et les loisirs pour les moins de 26 ans.",
          body: `
<p>En Belgique, plusieurs passes et réductions existent spécialement pour les jeunes. Tu n'as pas toujours besoin d'un revenu élevé pour profiter de la culture et des activités.</p>

<h2>Le Pass Partout (Wallonie)</h2>
<p>Si tu as moins de 26 ans et peu de revenus, tu peux avoir droit au <strong>Pass Partout</strong> : réductions sur les activités sportives, culturelles et de loisirs dans ta commune.</p>
<ul>
  <li>Renseignes-toi auprès de ton CPAS ou de ta commune.</li>
  <li>Certaines communes ont leur propre Pass Jeune — demande à l'accueil communal.</li>
</ul>

<h2>Article 27 — culture à 1,25 €</h2>
<p>L'<strong>Article 27</strong> permet d'accéder à des spectacles, concerts, expos et cinémas pour <strong>1,25 € seulement</strong>. C'est pour les personnes en situation de précarité.</p>
<ul>
  <li>Demande une carte Article 27 via ton CPAS, une AMO, ou Inforjeunes.</li>
  <li>Plus d'infos : <a href="https://www.article27.be" target="_blank" rel="noopener">article27.be</a></li>
</ul>

<h2>Musées gratuits</h2>
<p>Beaucoup de musées sont <strong>gratuits pour les moins de 26 ans</strong>, notamment les musées fédéraux belges (Beaux-Arts, Sciences naturelles, Instruments de musique, Africa Museum…).</p>
<ul>
  <li>Vérifie toujours sur le site du musée avant de te déplacer.</li>
</ul>
`
        },
        {
          id: 'maisons-jeunes',
          title: "Maisons de jeunes et centres culturels",
          summary: "Des lieux pour se retrouver, faire des activités et rencontrer des gens.",
          body: `
<p>Les <strong>maisons de jeunes</strong> et les <strong>centres culturels</strong> sont des endroits ouverts à tous les jeunes, souvent gratuits ou très peu chers.</p>

<h2>Qu'est-ce qu'on y trouve ?</h2>
<ul>
  <li>Activités artistiques (musique, théâtre, danse, arts plastiques…).</li>
  <li>Espaces détente et rencontre.</li>
  <li>Accès internet et informatique.</li>
  <li>Sorties et événements organisés.</li>
  <li>Parfois : aide aux devoirs, soutien, écoute.</li>
</ul>

<h2>Comment en trouver une près de chez toi ?</h2>
<ul>
  <li>Cherche "maison de jeunes" + ton nom de commune sur Google.</li>
  <li>Demande à ton CPAS, à une AMO, ou à Inforjeunes.</li>
  <li>Site de la Fédération des Maisons de Jeunes : <a href="https://www.fdmj.org" target="_blank" rel="noopener">fdmj.org</a></li>
</ul>

<div class="callout tip"><div><strong>Astuce</strong>Beaucoup de maisons de jeunes organisent des sorties (piscine, bowling, concerts) à prix très réduits. N'hésite pas à t'informer directement sur place.</div></div>
`
        },
        {
          id: 'sport',
          title: "Sport — trouver une activité",
          summary: "S'inscrire dans un club, trouver une salle, pratiquer sans se ruiner.",
          body: `
<p>Le sport, c'est bon pour la tête autant que pour le corps. Et ça ne doit pas forcément coûter cher.</p>

<h2>Options gratuites ou peu chères</h2>
<ul>
  <li><strong>Sport en plein air</strong> : running, vélo, foot dans un parc — zéro coût.</li>
  <li><strong>Centre sportif communal</strong> : souvent à tarif réduit pour les habitants de la commune. Renseignes-toi à l'accueil communal.</li>
  <li><strong>Clubs sportifs locaux</strong> : les cotisations annuelles sont souvent accessibles (30–100 € selon le sport). Certains clubs ont des tarifs "sociaux".</li>
</ul>

<h2>Réductions pour les jeunes en difficulté</h2>
<ul>
  <li>Le <strong>Pass Partout</strong> (si disponible dans ta commune) couvre parfois les inscriptions sportives.</li>
  <li>Certains clubs acceptent des paiements en plusieurs fois — demande directement.</li>
  <li>Renseignes-toi auprès du <strong>service jeunesse de ta commune</strong> pour des activités sportives organisées.</li>
</ul>

<div class="callout tip"><div><strong>Bon à savoir</strong>Adeps (en Wallonie) gère des centres de plein air, piscines et infrastructures sportives accessibles à tous. Voir <a href="https://www.adeps.be" target="_blank" rel="noopener">adeps.be</a> pour les tarifs.</div></div>
`
        },
        {
          id: 'benevol',
          title: "Bénévolat et associations",
          summary: "Donner de son temps, rencontrer des gens, acquérir de l'expérience.",
          body: `
<p>Le bénévolat, c'est une bonne façon de sortir de chez soi, de rencontrer des gens, et parfois de découvrir ce qui te passionne. Et en prime, ça peut s'ajouter à un CV.</p>

<h2>Où chercher ?</h2>
<ul>
  <li><a href="https://www.benevol.be" target="_blank" rel="noopener">benevol.be</a> — plateforme nationale belge pour trouver des missions de bénévolat.</li>
  <li><strong>Inforjeunes</strong> : ils ont souvent des listes d'associations locales qui cherchent des bénévoles.</li>
  <li><strong>Croix-Rouge</strong>, <strong>Restos du Cœur</strong>, clubs sportifs, épiceries sociales… — contacte directement.</li>
</ul>

<h2>Ce que le bénévolat peut t'apporter</h2>
<ul>
  <li>Un réseau, des contacts, des expériences concrètes.</li>
  <li>Une ligne supplémentaire sur ton CV.</li>
  <li>Un sentiment d'utilité — ça fait vraiment du bien.</li>
</ul>

<div class="callout tip"><div><strong>À savoir</strong>En Belgique, le bénévolat est encadré par la loi. Tu peux percevoir de petits remboursements de frais sans que ça affecte tes allocations. Renseigne-toi auprès de l'association.</div></div>
`
        }
      ]
    },

    {
      id: 'sante',
      title: 'Santé & bien-être',
      subtitle: "Prendre soin de toi, corps et tête",
      color: 'sante',
      icon: ICONS.heart,
      objective: "Trouver un médecin sans stress, comprendre les remboursements, parler quand ça va pas. À ton rythme.",
      source: 'inami.fgov.be · inforjeunes.be · ssmg.be',
      sections: [
        {
          id: 'mal-etre',
          title: "Quand ça ne va pas",
          summary: "Anxiété, tristesse, idées noires : tu n'es pas seul·e.",
          linkTo: 'urgence/mal-etre'
        },
        {
          id: 'parler-sans-appeler',
          title: "Parler sans appeler",
          summary: "Chat, e-mail, RDV en personne — tu choisis le canal.",
          body: `
<p>Tu as besoin de parler mais l'idée de téléphoner te bloque ? <strong>C'est normal.</strong> Beaucoup de jeunes vivent ça. Voici d'autres façons de demander de l'aide.</p>

<h2>Le chat 103 (moins de 20 ans)</h2>
<p>Le <strong>103</strong> propose un <strong>chat anonyme et gratuit</strong>, dispo plusieurs heures par jour. Tu écris, quelqu'un te répond. Pas de carte d'identité, pas de questions pièges.</p>
<ul>
  <li>Site : <a href="https://www.103ecoute.be" target="_blank" rel="noopener">103ecoute.be</a></li>
</ul>

<h2>L'e-mail Télé-Accueil (107)</h2>
<p>Tu peux aussi <strong>écrire un e-mail</strong> à Télé-Accueil. Tu prends ton temps, tu poses ce que tu veux. La réponse vient dans les jours qui suivent.</p>
<ul>
  <li>Site : <a href="https://www.tele-accueil.be" target="_blank" rel="noopener">tele-accueil.be</a></li>
</ul>

<h2>Pousser la porte d'un service</h2>
<p>Une <strong>AMO</strong> ou un <strong>planning familial</strong>, ça s'ouvre <strong>sans rendez-vous</strong> et sans jugement. Tu rentres, tu dis "j'aimerais juste parler", et c'est OK.</p>

<div class="callout tip"><div><strong>Pas pressé·e ?</strong>Tu n'as pas à expliquer pourquoi tu viens. Tu peux juste t'asseoir et voir si ça vient.</div></div>
`
        },
        {
          id: 'medecin',
          title: "Mon médecin traitant",
          summary: "Pourquoi en avoir un, comment le choisir.",
          body: `
<p>Avoir un <strong>médecin traitant</strong> (ou médecin de famille), c'est utile : il connaît ton dossier, te suit dans la durée, et tu es <strong>mieux remboursé·e</strong>.</p>

<h2>Comment le choisir ?</h2>
<ul>
  <li>Près de chez toi (pour les consultations rapides).</li>
  <li>Tu peux changer si ça ne te convient pas — tu n'es engagé·e à rien.</li>
  <li>Demande autour de toi (famille, amis, AMO).</li>
</ul>

<h2>Le DMG (Dossier Médical Global)</h2>
<p>Au 1er RDV, demande d'ouvrir ton <strong>DMG</strong>. C'est gratuit (remboursé par la mutuelle), et tu paies <strong>moins cher</strong> à chaque consultation ensuite.</p>

<h2>Le 1er rendez-vous</h2>
<ul>
  <li>Apporte ta <strong>carte d'identité</strong>, ta <strong>vignette de mutuelle</strong>, et tes éventuels antécédents.</li>
  <li>Tu peux <strong>écrire tes questions avant</strong> — pas grave si tu hésites.</li>
  <li>Le médecin est tenu au secret professionnel. Tu peux tout dire.</li>
</ul>

<div class="callout tip"><div><strong>Si c'est trop cher</strong>Va voir la fiche <a href="#/fiche/sante/maison-medicale">La maison médicale</a> — soins illimités gratuits si revenus limités.</div></div>
`
        },
        {
          id: 'maison-medicale',
          title: "La maison médicale",
          summary: "Soins illimités gratuits si tu t'inscris au forfait.",
          body: `
<p>La <strong>maison médicale au forfait</strong>, c'est probablement la meilleure nouvelle de cette page. Tu t'y inscris, et tu ne paies <strong>plus rien</strong> à chaque consultation.</p>

<h2>Ce qui est inclus</h2>
<ul>
  <li>Médecin généraliste — autant de fois que nécessaire.</li>
  <li>Souvent : <strong>kiné</strong>, <strong>infirmier·ère</strong>, parfois psy.</li>
  <li>Aucun ticket modérateur, aucun avance de frais à faire.</li>
</ul>

<h2>Comment s'inscrire ?</h2>
<ol class="fiche-ol">
  <li>Trouve une maison médicale près de chez toi : <a href="https://www.maisonmedicale.org" target="_blank" rel="noopener">maisonmedicale.org</a></li>
  <li>Tu prends RDV (téléphone, parfois en ligne).</li>
  <li>Tu apportes ta carte ID + vignette de mutuelle.</li>
  <li>Tu signes le contrat de forfait. C'est tout.</li>
</ol>

<h2>Ce que tu dois savoir</h2>
<ul>
  <li>Tu ne peux plus aller chez un autre médecin "à la carte" (sauf urgence). C'est la maison médicale qui te suit.</li>
  <li>Tu peux te désinscrire si ça ne te convient pas — tu n'es bloqué·e à rien.</li>
  <li>L'inscription est <strong>gratuite</strong>.</li>
</ul>

<div class="callout"><div><strong>Pour qui ?</strong>Pour tout le monde, mais c'est particulièrement utile si tu as peu de revenus, des soucis de santé chroniques, ou si l'idée d'avancer de l'argent t'angoisse.</div></div>
`
        },
        {
          id: 'convention-psy',
          title: "Voir un psy — gratuit avant 24 ans",
          summary: "La convention psy 1ère ligne — accessible et déstigmatisée.",
          body: `
<p>Voir un psy, c'est devenu vraiment accessible : grâce à la <strong>convention psychologique de 1ère ligne</strong> (INAMI), tu peux consulter un psy <strong>conventionné</strong> à des conditions très avantageuses.</p>

<h2>Combien ça coûte&nbsp;?</h2>
<ul>
  <li><strong>Si tu as moins de 24 ans : c'est totalement GRATUIT</strong> (le ticket modérateur a été supprimé pour les jeunes depuis avril 2024).</li>
  <li>Si tu as 24 ans ou plus : <strong>11 € la séance</strong> (4 € si tu es BIM).</li>
  <li><strong>La 1re séance est toujours gratuite</strong>, peu importe ton âge.</li>
  <li>Séance de groupe : 2,5 € pour tout le monde.</li>
</ul>

<h2>Combien de séances&nbsp;?</h2>
<p>En général jusqu'à <strong>8 séances par an</strong> (en individuel). Souvent suffisant pour un coup de pouce, un cap difficile, un mal-être passager. Pour aller plus loin, ton·ta psy peut t'orienter vers un suivi plus long en 2e ligne (toujours conventionné).</p>

<h2>Pour qui&nbsp;?</h2>
<ul>
  <li>Toute personne ayant une mutuelle belge.</li>
  <li>Pour des situations courantes : stress, anxiété, tristesse, sommeil, conflit, deuil, perte de motivation…</li>
  <li><strong>Pas besoin d'avoir un "vrai" problème grave</strong>. C'est fait pour intervenir tôt.</li>
</ul>

<h2>Comment commencer&nbsp;?</h2>
<ol class="fiche-ol">
  <li>Trouve un psy conventionné : <a href="https://www.psyforyou.be" target="_blank" rel="noopener">psyforyou.be</a> (annuaire officiel) ou <a href="https://psychologue-premiere-ligne.be" target="_blank" rel="noopener">psychologue-premiere-ligne.be</a>.</li>
  <li>Tu peux y aller <strong>directement</strong> : <strong>pas besoin de prescription</strong> de ton médecin.</li>
  <li>Apporte simplement ta carte d'identité et ta carte de mutuelle au 1er RDV.</li>
  <li>Le paiement se fait en <strong>tiers payant</strong> : tu n'avances pas l'argent, tu paies juste ta part (ou rien si -24 ans).</li>
</ol>

<div class="callout tip"><div><strong>Voir un psy ≠ être "fou"</strong>Beaucoup de gens y vont à un moment de leur vie. C'est juste prendre un temps pour soi avec quelqu'un de formé. Et avant 24 ans, ça ne te coûte rien — aucune raison de t'en priver.</div></div>

<h2>Pour aller plus loin</h2>
<ul>
  <li><a href="https://www.inami.fgov.be/fr/themes/soins-de-sante-cout-et-remboursement/les-prestations-de-sante-que-vous-rembourse-votre-mutualite/soins-de-sante-mentale/vos-soins-psychologiques-de-1re-ligne-rembourses-via-les-reseaux-de-sante-mentale" target="_blank" rel="noopener">INAMI — Soins psychologiques 1re ligne</a> (info officielle)</li>
</ul>
`
        },
        {
          id: 'urgence-medicale',
          title: "En cas d'urgence médicale",
          summary: "Quand appeler le 112, quand aller aux urgences, quand attendre.",
          body: `
<p>Pas toujours évident de savoir où aller. Voici un petit guide.</p>

<h2>Appeler le 112 si :</h2>
<ul>
  <li>La personne ne respire plus, perd conscience, fait un AVC ou une crise cardiaque.</li>
  <li>Saignement qui ne s'arrête pas.</li>
  <li>Accident grave.</li>
  <li>Doute sérieux sur la vie d'une personne.</li>
</ul>

<h2>Aller aux urgences hospitalières si :</h2>
<ul>
  <li>Blessure qui nécessite des points, plâtre…</li>
  <li>Douleur intense (ventre, poitrine, tête) inhabituelle.</li>
  <li>Fièvre forte qui ne baisse pas.</li>
  <li>Suspicion de fracture.</li>
</ul>

<h2>Médecin de garde / poste médical :</h2>
<ul>
  <li>Soir et week-end pour les soins courants (rhume sévère, douleur sans gravité).</li>
  <li>Numéro unique : <strong>1733</strong> (te redirige vers le bon poste).</li>
</ul>

<h2>Médecin traitant le lendemain :</h2>
<ul>
  <li>Pour tout le reste (suivi, contrôle, prescription).</li>
</ul>

<div class="callout warn"><div><strong>Dans le doute</strong>Appelle le 112 ou le 1733. Personne ne va te juger pour avoir appelé "pour rien".</div></div>
`
        },
        {
          id: 'planning-familial',
          title: "Le planning familial",
          summary: "Contraception, IVG, écoute, conseil — gratuit pour les jeunes.",
          body: `
<p>Les <strong>centres de planning familial</strong> sont des lieux d'accueil, d'écoute et de soins liés à la vie affective et sexuelle. Beaucoup plus que de la contraception.</p>

<h2>Ce qu'on y propose</h2>
<ul>
  <li>Consultations médicales (gynéco, contraception, IST, test de grossesse).</li>
  <li><strong>IVG</strong> (interruption volontaire de grossesse) dans la plupart des centres.</li>
  <li>Accompagnement psychologique.</li>
  <li>Conseils juridiques (violences, droits, divorce).</li>
  <li>Accueil pour les jeunes — souvent sans rendez-vous.</li>
</ul>

<h2>C'est gratuit ou peu cher</h2>
<p>Les tarifs sont adaptés à tes revenus. Pour les jeunes, <strong>c'est souvent gratuit</strong>.</p>

<h2>C'est confidentiel</h2>
<p>Le secret professionnel est total. Personne ne saura que tu y as été — même pas tes parents si tu ne veux pas.</p>

<p>Trouver un centre près de chez toi : <a href="https://www.loveattitude.be" target="_blank" rel="noopener">loveattitude.be</a></p>
`
        },
        {
          id: 'mutuelle',
          title: "Ma mutuelle",
          summary: "Comprendre ses remboursements, BIM, choisir sa mutuelle.",
          linkTo: 'admin/mutuelle'
        },
        {
          id: 'lignes-ecoute',
          title: "Tous les numéros d'écoute",
          summary: "112, 103, 107, prévention suicide, SOS Viol…",
          linkTo: 'urgence/lignes-ecoute'
        }
      ]
    },
    {
      id: 'urgence',
      title: 'Aide & urgences',
      subtitle: "Trouver de l'aide rapidement",
      color: 'urgence',
      icon: ICONS.sos,
      objective: "Obtenir de l'aide rapidement en cas de besoin (mal-être, violence, addiction, urgence).",
      source: '107.be · 0800-32.123 (Violence) · belgium.be',
      sections: [
        {
          id: 'lignes-ecoute',
          title: "Lignes d'écoute et numéros utiles",
          summary: "Numéros gratuits et confidentiels.",
          body: `
<p>Tu as besoin de parler ? Voici des numéros gratuits, anonymes et disponibles à toute heure.</p>

<h2>Urgences vitales</h2>
<ul>
  <li><strong>112</strong> — Numéro européen unique (police, ambulance, pompiers). Gratuit, 24/7.</li>
  <li><strong>101</strong> — Police.</li>
  <li><strong>100</strong> — Ambulance et pompiers.</li>
  <li><strong>070 245 245</strong> — Centre Anti-Poisons. Gratuit, 24/7. À appeler en cas d'intoxication (médicament, produit ménager, plante…).</li>
  <li><strong>1733</strong> — Médecin généraliste de garde (soir, nuit, week-end pour les soins courants non vitaux).</li>
  <li><strong>1722</strong> — Pompiers, intempéries non urgentes (uniquement en cas de code orange/rouge IRM, pour désengorger le 112).</li>
</ul>

<h2>Écoute et soutien moral</h2>
<ul>
  <li><strong>103</strong> — Écoute Enfants Ado (jusqu'à 20 ans). Gratuit, anonyme, 7j/7.</li>
  <li><strong>107</strong> — Télé-Accueil. Pour parler à quelqu'un quand ça ne va pas, 24/7.</li>
  <li><strong>Centre de Prévention du Suicide : 0800 32 123</strong>. Gratuit, 24/7.</li>
</ul>

<h2>Violences</h2>
<ul>
  <li><strong>SOS Viol : 0800 98 100</strong>. Gratuit, anonyme.</li>
  <li><strong>Écoute Violences Conjugales : 0800 30 030</strong>.</li>
  <li><strong>SOS Enfants : numéros locaux</strong> (consulter <a href="https://www.one.be" target="_blank" rel="noopener">one.be</a>).</li>
</ul>

<h2>Addiction</h2>
<ul>
  <li><strong>Infor-Drogues : 02 227 52 52</strong>. Anonyme, gratuit.</li>
  <li><strong>Aide Alcool : 0800 358 88</strong>.</li>
</ul>
`
        },
        {
          id: 'services-aide',
          title: "Les services d'aide près de moi",
          summary: "AMO, planning familial, CPAS, Inforjeunes.",
          body: `
<p>Voici les services qui peuvent t'accompagner dans la durée. Tous sont gratuits et confidentiels.</p>

<h2>Les AMO (Aide en Milieu Ouvert)</h2>
<p>Pour les jeunes : écoute, animations, aide aux démarches. Gratuit, confidentiel, sans rendez-vous obligatoire.</p>
<p>Trouve une AMO : <a href="https://inforjeunes.be/centre/" target="_blank" rel="noopener">inforjeunes.be/centre</a></p>

<h2>Inforjeunes</h2>
<p>Info, conseils, aide aux démarches (logement, études, emploi, santé). Présent dans toute la Wallonie. Site : <a href="https://inforjeunes.be" target="_blank" rel="noopener">inforjeunes.be</a></p>

<h2>Le service Droit des Jeunes</h2>
<p>Pour toute question juridique : bail, contrat, conflit avec un employeur, démêlés administratifs. Gratuit. Site : <a href="https://www.sdj.be" target="_blank" rel="noopener">sdj.be</a></p>

<h2>Envol'toit (Inforjeunes)</h2>
<p>Le portail dédié à l'autonomie des jeunes : logement, budget, démarches. Plein de fiches claires. Site : <a href="https://envoltoit.be" target="_blank" rel="noopener">envoltoit.be</a></p>

<h2>Le CPAS</h2>
<p>Aide sociale et financière de ta commune. RIS, aides ponctuelles, accompagnement.</p>

<h2>Le planning familial</h2>
<p>Santé, sexualité, écoute psychologique, conseil juridique. Tarifs adaptés aux revenus.</p>

<h2>La maison médicale</h2>
<p>Soins gratuits si tu t'inscris au forfait. <a href="https://www.maisonmedicale.org" target="_blank" rel="noopener">maisonmedicale.org</a></p>
`
        },
        {
          id: 'mal-etre',
          title: "Quand ça ne va pas",
          summary: "Anxiété, dépression, idées noires : par où commencer.",
          body: `
<p>Tu te sens mal, anxieux·se, tu n'arrives plus à dormir, tu as des idées noires ? <strong>Tu n'es pas seul·e, et ça se soigne.</strong> Voici des premières pistes.</p>

<h2>Parler à quelqu'un</h2>
<ul>
  <li><strong>107 (Télé-Accueil)</strong> : pour parler à quelqu'un, à toute heure.</li>
  <li><strong>Centre de Prévention du Suicide : 0800 32 123</strong>.</li>
  <li><strong>103</strong> si tu as moins de 20 ans.</li>
  <li>Une AMO ou un planning familial : tu peux y aller librement.</li>
</ul>

<h2>Voir un·e professionnel·le</h2>
<ul>
  <li><strong>Ton médecin traitant</strong> peut t'orienter et prescrire un suivi psy.</li>
  <li><strong>Convention psy de 1ère ligne</strong> : 8 séances chez un·e psychologue conventionné·e à <strong>11 €</strong> la séance (4 € si BIM). Demande à ton médecin.</li>
  <li>Le <strong>service de santé mentale</strong> de ta région.</li>
</ul>

<div class="callout tip"><div><strong>Tu n'es pas faible</strong>Demander de l'aide quand on souffre, c'est courageux. Aucun·e pro ne te jugera.</div></div>
`
        }
      ]
    }
  ];

  // Construit la map fiche → contenu (les sections "linkTo" ne créent pas d'entrée
  // canonique, elles pointent vers la fiche source dans son module d'origine).
  const FICHES_INDEX = {};
  MODULES.forEach(m => {
    m.sections.forEach(s => {
      if (s.linkTo) return;
      FICHES_INDEX[`${m.id}/${s.id}`] = {
        moduleId: m.id,
        moduleTitle: m.title,
        moduleColor: m.color,
        source: s.source || m.source || '',
        lastChecked: s.lastChecked || '',
        disclaimer: s.disclaimer || '',
        status: s.status || '',
        reviewedBy: s.reviewedBy || '',
        internalNotes: s.internalNotes || '',
        ...s
      };
    });
  });

  // Redirections pour conserver les anciens favoris (sections déplacées vers Santé)
  const REDIRECTS = {
    'vie/medecin': 'sante/medecin',
    'vie/planning-familial': 'sante/planning-familial'
  };

  // ============================================================
  // LEXIQUE INVISIBLE — synonymes / termes familiers / fautes courantes
  // Pour que "j'ai pas d'argent" trouve les fiches sur le RIS, etc.
  // Format : "mot ou expression cherchée" → tableau de paths de fiches à proposer
  // ============================================================
  const LEXIQUE = {
    // Argent / précarité
    'pas d argent': ['argent/ris-cpas', 'argent/aides-supp', 'argent/aides-disponibles'],
    'sans argent': ['argent/ris-cpas', 'argent/aides-supp'],
    'galere': ['argent/ris-cpas', 'argent/aides-disponibles', 'urgence/services-aide'],
    'galère': ['argent/ris-cpas', 'argent/aides-disponibles', 'urgence/services-aide'],
    'fin de mois': ['argent/budget', 'vie/alimentation', 'argent/aides-supp'],
    'precaire': ['argent/ris-cpas', 'argent/aides-supp', 'logement/aides'],
    'précaire': ['argent/ris-cpas', 'argent/aides-supp', 'logement/aides'],
    'minimum': ['argent/ris-cpas'],
    'survie': ['argent/ris-cpas', 'urgence/services-aide'],
    'aide sociale': ['argent/ris-cpas', 'argent/aides-disponibles'],
    'aide cpas': ['argent/ris-cpas', 'argent/aides-disponibles'],
    'pauvre': ['argent/ris-cpas', 'argent/aides-supp'],
    'ris': ['argent/ris-cpas'],
    'rsa': ['argent/ris-cpas'], // confusion fréquente avec la France
    'cpas': ['argent/ris-cpas', 'urgence/services-aide'],
    'allocations': ['argent/aides-disponibles'],
    'bourse': ['etudes/bourse'],
    'etudes': ['etudes/bourse', 'etudes/service-social-ecole'],
    'banque': ['argent/compte-bancaire'],
    'compte': ['argent/compte-bancaire', 'argent/epargne-mandante'],
    'budget': ['argent/budget'],
    'epargne': ['argent/compte-bancaire', 'travail/epargne-pension', 'argent/epargne-mandante'],

    // Santé mentale
    'mal etre': ['urgence/mal-etre', 'sante/convention-psy'],
    'mal-être': ['urgence/mal-etre', 'sante/convention-psy'],
    'mal dans ma peau': ['urgence/mal-etre', 'sante/convention-psy'],
    'depression': ['urgence/mal-etre', 'sante/convention-psy'],
    'dépression': ['urgence/mal-etre', 'sante/convention-psy'],
    'deprimer': ['urgence/mal-etre', 'sante/convention-psy'],
    'triste': ['urgence/mal-etre', 'sante/convention-psy'],
    'anxiete': ['urgence/mal-etre', 'sante/convention-psy'],
    'anxiété': ['urgence/mal-etre', 'sante/convention-psy'],
    'angoisse': ['urgence/mal-etre', 'sante/convention-psy'],
    'crise': ['urgence/mal-etre', 'urgence/lignes-ecoute'],
    'panique': ['urgence/mal-etre', 'urgence/lignes-ecoute'],
    'idees noires': ['urgence/mal-etre', 'urgence/lignes-ecoute'],
    'suicide': ['urgence/mal-etre', 'urgence/lignes-ecoute'],
    'envie de mourir': ['urgence/mal-etre', 'urgence/lignes-ecoute'],
    'fatigue': ['urgence/mal-etre', 'sante/medecin'],
    'sommeil': ['urgence/mal-etre', 'sante/medecin'],
    'parler a quelqu un': ['sante/parler-sans-appeler', 'urgence/lignes-ecoute', 'urgence/services-aide'],
    'ecouter': ['sante/parler-sans-appeler', 'urgence/lignes-ecoute'],
    'psy': ['sante/convention-psy'],
    'psychologue': ['sante/convention-psy'],
    'psychiatre': ['sante/convention-psy', 'sante/medecin'],
    'therapeute': ['sante/convention-psy'],

    // Santé physique
    'malade': ['sante/medecin', 'sante/maison-medicale', 'sante/urgence-medicale'],
    'medecin': ['sante/medecin', 'sante/maison-medicale'],
    'docteur': ['sante/medecin', 'sante/maison-medicale'],
    'maladie': ['sante/medecin', 'admin/mutuelle'],
    'mutuelle': ['admin/mutuelle', 'sante/medecin'],
    'assurance maladie': ['admin/mutuelle'],
    'remboursement': ['admin/mutuelle', 'sante/maison-medicale'],
    'pharmacie': ['sante/medecin', 'admin/mutuelle'],
    'medicament': ['sante/medecin'],
    'dentiste': ['sante/medecin', 'admin/mutuelle'],
    'gyneco': ['sante/planning-familial'],
    'gynéco': ['sante/planning-familial'],
    'contraception': ['sante/planning-familial'],
    'pilule': ['sante/planning-familial'],
    'preservatif': ['sante/planning-familial'],
    'ivg': ['sante/planning-familial'],
    'avortement': ['sante/planning-familial'],
    'enceinte': ['sante/planning-familial'],
    'grossesse': ['sante/planning-familial'],
    'sexe': ['sante/planning-familial'],
    'ist': ['sante/planning-familial', 'sante/medecin'],

    // Logement
    'appartement': ['logement/recherche', 'logement/options'],
    'appart': ['logement/recherche', 'logement/options'],
    'studio': ['logement/recherche', 'logement/options'],
    'kot': ['logement/recherche'],
    'colocation': ['logement/recherche', 'logement/options'],
    'coloc': ['logement/recherche', 'logement/options'],
    'sdf': ['logement/aides', 'urgence/services-aide'],
    'sans abri': ['logement/aides', 'urgence/services-aide'],
    'sans logement': ['logement/aides', 'urgence/services-aide'],
    'caution': ['logement/garantie'],
    'garantie': ['logement/garantie'],
    'bail': ['logement/bail'],
    'loyer': ['logement/aides', 'logement/bail'],
    'proprietaire': ['logement/bail', 'logement/etat-des-lieux'],
    'preavis': ['logement/bail'],
    'demenager': ['logement/changement-adresse', 'logement/compteurs'],
    'demenagement': ['logement/changement-adresse', 'logement/compteurs'],
    'electricite': ['logement/compteurs', 'argent/aides-supp'],
    'électricité': ['logement/compteurs', 'argent/aides-supp'],
    'gaz': ['logement/compteurs'],
    'eau': ['logement/compteurs'],
    'energie': ['logement/compteurs', 'argent/aides-supp'],
    'compteur': ['logement/compteurs'],
    'chauffage': ['logement/compteurs'],
    'tarif social': ['argent/aides-supp', 'logement/compteurs'],
    'sls': ['logement/options'],
    'ais': ['logement/options'],
    'social housing': ['logement/options', 'logement/aides'],

    // Travail
    'job': ['travail/preparer', 'travail/trouver'],
    'boulot': ['travail/preparer', 'travail/trouver'],
    'emploi': ['travail/preparer', 'travail/trouver'],
    'travailler': ['travail/preparer', 'travail/job-etudiant'],
    'cv': ['travail/preparer'],
    'lettre de motivation': ['travail/preparer'],
    'entretien': ['travail/entretien'],
    'embauche': ['travail/entretien', 'travail/contrat'],
    'contrat': ['travail/contrat'],
    'cdi': ['travail/contrat'],
    'cdd': ['travail/contrat'],
    'salaire': ['travail/contrat'],
    'paye': ['travail/contrat'],
    'paie': ['travail/contrat'],
    'forem': ['travail/preparer'],
    'interim': ['travail/trouver'],
    'intérim': ['travail/trouver'],
    'chomage': ['travail/chomage'],
    'chômage': ['travail/chomage'],
    'onem': ['travail/chomage'],
    'pension': ['travail/epargne-pension'],
    'retraite': ['travail/epargne-pension'],
    'job etudiant': ['travail/job-etudiant'],
    'job d ete': ['travail/job-etudiant', 'travail/trouver'],

    // Devenir majeur / admin
    '18 ans': ['majeur/changements', 'majeur/demarches', 'majeur/enfant-en-accueil'],
    'majorité': ['majeur/changements', 'majeur/enfant-en-accueil'],
    'majorite': ['majeur/changements', 'majeur/enfant-en-accueil'],
    'famille d accueil': ['majeur/enfant-en-accueil', 'majeur/accompagnement'],
    'fa': ['majeur/enfant-en-accueil'],
    'saj': ['majeur/enfant-en-accueil', 'majeur/accompagnement'],
    'spj': ['majeur/enfant-en-accueil', 'majeur/accompagnement'],
    'mandant': ['majeur/enfant-en-accueil', 'argent/epargne-mandante'],
    'amo': ['majeur/accompagnement', 'urgence/services-aide'],
    'voter': ['majeur/vote'],
    'vote': ['majeur/vote'],
    'election': ['majeur/vote'],
    'élection': ['majeur/vote'],
    'impots': ['majeur/impots'],
    'impôts': ['majeur/impots'],
    'declaration': ['majeur/impots'],
    'déclaration': ['majeur/impots'],
    'tax': ['majeur/impots'],
    'fiscal': ['majeur/impots'],
    'contribution': ['majeur/impots'],
    'carte d identite': ['admin/documents'],
    'carte id': ['admin/documents'],
    'passeport': ['admin/voyager', 'admin/documents'],
    'visa': ['admin/voyager'],
    'voyage': ['admin/voyager'],
    'voyager': ['admin/voyager'],
    'etranger': ['admin/voyager'],
    'étranger': ['admin/voyager'],
    'vacances': ['admin/voyager'],
    'commune': ['admin/documents', 'logement/changement-adresse'],
    'permis': ['vie/transport'],
    'permis de conduire': ['vie/transport'],
    'casier judiciaire': ['admin/documents'],
    'rc familiale': ['admin/rc-familiale'],
    'responsabilite': ['admin/rc-familiale'],

    // Vie quotidienne
    'manger': ['vie/alimentation'],
    'nourriture': ['vie/alimentation'],
    'courses': ['vie/alimentation'],
    'cuisine': ['vie/alimentation'],
    'recette': ['vie/alimentation'],
    'aide alimentaire': ['vie/alimentation', 'argent/aides-supp'],
    'restos du coeur': ['vie/alimentation'],
    'menage': ['logement/entretien'],
    'ménage': ['logement/entretien'],
    'nettoyer': ['logement/entretien'],
    'transport': ['vie/transport'],
    'tec': ['vie/transport'],
    'sncb': ['vie/transport'],
    'train': ['vie/transport'],
    'bus': ['vie/transport'],
    'lessive': ['vie/lessive', 'vie/lavoir'],
    'lessives': ['vie/lessive', 'vie/lavoir'],
    'laver': ['vie/lessive', 'vie/lavoir'],
    'linge': ['vie/lessive', 'vie/lavoir'],
    'machine a laver': ['vie/lessive', 'vie/lavoir'],
    'lave linge': ['vie/lessive', 'vie/lavoir'],
    'lave-linge': ['vie/lessive', 'vie/lavoir'],
    'vetements': ['vie/lessive'],
    'vêtements': ['vie/lessive'],
    'detacher': ['vie/lessive'],
    'détacher': ['vie/lessive'],
    'tache': ['vie/lessive'],
    'tâche': ['vie/lessive'],
    'taches': ['vie/lessive'],
    'sechoir': ['vie/lessive', 'vie/lavoir'],
    'séchoir': ['vie/lessive', 'vie/lavoir'],
    'seche linge': ['vie/lessive', 'vie/lavoir'],
    'sèche-linge': ['vie/lessive', 'vie/lavoir'],
    'lavoir': ['vie/lavoir'],
    'lavoirs': ['vie/lavoir'],
    'laverie': ['vie/lavoir'],
    'laveries': ['vie/lavoir'],
    'laundromat': ['vie/lavoir'],
    'wassalon': ['vie/lavoir'],
    'mywash': ['vie/lavoir'],
    'couette': ['vie/lavoir', 'vie/lessive'],
    'edredon': ['vie/lavoir', 'vie/lessive'],

    // Urgences
    'urgent': ['urgence/lignes-ecoute', 'urgence/services-aide'],
    'urgence': ['urgence/lignes-ecoute', 'urgence/services-aide'],
    'aide': ['urgence/services-aide', 'urgence/lignes-ecoute'],
    'help': ['urgence/lignes-ecoute', 'urgence/services-aide'],
    'violence': ['urgence/lignes-ecoute', 'sante/planning-familial'],
    'violences': ['urgence/lignes-ecoute', 'sante/planning-familial'],
    'viol': ['urgence/lignes-ecoute', 'sante/planning-familial'],
    'agression': ['urgence/lignes-ecoute'],
    'harcelement': ['urgence/lignes-ecoute'],
    'harcèlement': ['urgence/lignes-ecoute'],
    'drogue': ['urgence/lignes-ecoute'],
    'drogues': ['urgence/lignes-ecoute'],
    'alcool': ['urgence/lignes-ecoute'],
    'addiction': ['urgence/lignes-ecoute'],

    // Nouveaux termes (mai 2026)
    'famiwal': ['argent/allocations-familiales'],
    'allocs': ['argent/allocations-familiales'],
    'caf': ['argent/allocations-familiales'], // confusion FR
    'gsm': ['vie/communication'],
    'telephone': ['vie/communication'],
    'téléphone': ['vie/communication'],
    'forfait': ['vie/communication'],
    'wifi': ['vie/communication', 'argent/aides-supp'],
    'internet': ['vie/communication', 'argent/aides-supp'],
    'proximus': ['vie/communication'],
    'orange': ['vie/communication'],
    'voo': ['vie/communication'],
    'permis b': ['vie/permis-conduire'],
    'conduire': ['vie/permis-conduire'],
    'voiture': ['vie/permis-conduire'],
    'auto-ecole': ['vie/permis-conduire'],
    'auto ecole': ['vie/permis-conduire'],
    'examen theorique': ['vie/permis-conduire'],
    'feu vert': ['vie/permis-conduire'],
    'assurance habitation': ['logement/assurance-habitation'],
    'assurance incendie': ['logement/assurance-habitation'],
    'incendie': ['logement/assurance-habitation', 'urgence/lignes-ecoute'],
    'antipoison': ['urgence/lignes-ecoute'],
    'anti-poison': ['urgence/lignes-ecoute'],
    'intoxication': ['urgence/lignes-ecoute'],
    'medecin de garde': ['urgence/lignes-ecoute', 'sante/urgence-medicale'],
    'pharmacie de garde': ['sante/urgence-medicale'],
    'tempete': ['urgence/lignes-ecoute'],
    'inondation': ['urgence/lignes-ecoute'],
    'tec': ['vie/transport'],
    'go pass': ['vie/transport']
  };

  const SITUATIONS_INDEX = {};
  SITUATIONS.forEach(s => { SITUATIONS_INDEX[s.id] = s; });

  const MODULES_INDEX = {};
  MODULES.forEach(m => { MODULES_INDEX[m.id] = m; });

  // ============================================================
  // DOCUMENTS ESSENTIELS — checklist suggérée
  // ============================================================
  const DOCUMENTS_ESSENTIELS = [
    { id: 'carte-id', label: "Carte d'identité (à jour)", category: "Identité" },
    { id: 'passeport', label: "Passeport (si tu voyages hors UE)", category: "Identité" },
    { id: 'permis', label: "Permis de conduire", category: "Identité" },
    { id: 'mutuelle', label: "Carte de mutuelle / vignettes", category: "Santé" },
    { id: 'ceam', label: "Carte Européenne d'Assurance Maladie (CEAM)", category: "Santé" },
    { id: 'dmg', label: "Dossier Médical Global (DMG) ouvert", category: "Santé" },
    { id: 'rib', label: "RIB / IBAN de mon compte bancaire", category: "Argent" },
    { id: 'rc-familiale', label: "Attestation d'assurance RC familiale", category: "Argent" },
    { id: 'attestation-cpas', label: "Attestation du CPAS (si tu touches le RIS)", category: "Argent" },
    { id: 'attestation-allocs', label: "Attestation d'allocations familiales", category: "Argent" },
    { id: 'composition-menage', label: "Composition de ménage (commune)", category: "Administratif" },
    { id: 'casier', label: "Extrait de casier judiciaire", category: "Administratif" },
    { id: 'inscription-forem', label: "Attestation d'inscription au Forem", category: "Travail" },
    { id: 'cv', label: "Mon CV à jour", category: "Travail" },
    { id: 'contrat-travail', label: "Contrat de travail (copie)", category: "Travail" },
    { id: 'fiches-paie', label: "3 dernières fiches de paie", category: "Travail" },
    { id: 'attestation-etudes', label: "Attestation d'inscription aux études", category: "Études" },
    { id: 'releve-notes', label: "Relevé de notes / diplômes", category: "Études" },
    { id: 'bail', label: "Contrat de bail signé", category: "Logement" },
    { id: 'etat-lieux', label: "État des lieux d'entrée", category: "Logement" },
    { id: 'garantie', label: "Preuve de la garantie locative", category: "Logement" },
    { id: 'assurance-habitation', label: "Assurance habitation", category: "Logement" }
  ];

  return {
    ICONS,
    SITUATIONS,
    SITUATIONS_INDEX,
    MODULES,
    MODULES_INDEX,
    FICHES_INDEX,
    REDIRECTS,
    LEXIQUE,
    DOCUMENTS_ESSENTIELS
  };
})();
