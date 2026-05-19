/* ============================================================
   Pass'âge — Application
   Routing par hash, rendu client, données en localStorage.
   La home est pré-rendue en HTML : on ne la remplace pas au 1er chargement,
   on l'enrichit (resume banner, progression sur les tuiles).
   ============================================================ */

(function () {
  'use strict';

  const { SITUATIONS, SITUATIONS_INDEX, MODULES, MODULES_INDEX, FICHES_INDEX, REDIRECTS, LEXIQUE, DOCUMENTS_ESSENTIELS, ICONS } = window.MA_CONTENT;

  const main = document.getElementById('main');
  const backBtn = document.getElementById('backBtn');
  const favToggleBtn = document.getElementById('favToggleBtn');
  const navItems = document.querySelectorAll('.nav-item');

  // Alias de modules pour les routes du nouveau home
  const MODULE_ALIASES = {
    administratif: 'admin'
  };
  Object.entries(MODULE_ALIASES).forEach(([alias, target]) => {
    if (MODULES_INDEX[target] && !MODULES_INDEX[alias]) {
      MODULES_INDEX[alias] = MODULES_INDEX[target];
    }
  });

  // ============================================================
  // Stockage local
  // ============================================================
  const STORE_PREFIX = 'passage.';
  const LEGACY_STORE_PREFIX = 'monavenir.';

  // Migration unique : reprend les données enregistrées sous l'ancien
  // préfixe interne (favoris, notes, contacts, rappels…) pour ne rien
  // perdre lors du renommage. Idempotente.
  (function migrateLegacyStorage() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(LEGACY_STORE_PREFIX) !== 0) continue;
        const newKey = STORE_PREFIX + k.slice(LEGACY_STORE_PREFIX.length);
        if (localStorage.getItem(newKey) === null) {
          localStorage.setItem(newKey, localStorage.getItem(k));
        }
        localStorage.removeItem(k);
      }
    } catch (e) { /* localStorage indisponible — rien à migrer */ }
  })();

  const Store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(STORE_PREFIX + key);
        if (raw === null) return fallback;
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
      } catch (e) {
        // localStorage indisponible (mode privé strict, désactivé) ou JSON corrompu
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        // QuotaExceededError, mode privé, ou autre — l'app ne doit pas crasher
        if (e && e.name === 'QuotaExceededError') {
          // Tentative douce : prévenir l'utilisateur sans bloquer
          try { console.warn('[Pass\'âge] Stockage local plein — sauvegarde impossible.'); } catch (_) {}
        }
        return false;
      }
    },
    remove(key) {
      try { localStorage.removeItem(STORE_PREFIX + key); } catch (e) { /* ignore */ }
    }
  };

  const Favs = {
    all: () => Store.get('favorites', []),
    has: (id) => Favs.all().includes(id),
    toggle: (id) => {
      const list = Favs.all();
      const i = list.indexOf(id);
      if (i >= 0) list.splice(i, 1); else list.push(id);
      Store.set('favorites', list);
      return list.includes(id);
    }
  };

  const Notes = {
    all: () => Store.get('notes', {}),
    get: (id) => Notes.all()[id] || '',
    set: (id, text) => {
      const all = Notes.all();
      if (text && text.trim()) all[id] = text;
      else delete all[id];
      Store.set('notes', all);
    },
    list: () => Object.entries(Notes.all()).map(([id, text]) => ({ id, text }))
  };

  const Checklists = {
    all: () => Store.get('checklists', {}),
    get: (sid) => Checklists.all()[sid] || {},
    isChecked: (sid, idx) => !!Checklists.get(sid)[idx],
    toggle: (sid, idx) => {
      const all = Checklists.all();
      if (!all[sid]) all[sid] = {};
      if (all[sid][idx]) delete all[sid][idx];
      else all[sid][idx] = true;
      Store.set('checklists', all);
    },
    progress: (sid) => {
      const total = (SITUATIONS_INDEX[sid] || {}).steps?.length || 0;
      if (!total) return { done: 0, total: 0, percent: 0 };
      const done = Object.keys(Checklists.get(sid)).length;
      return { done, total, percent: Math.round((done / total) * 100) };
    }
  };

  const Docs = {
    all: () => Store.get('documents', {}),
    get: (id) => Docs.all()[id] || null,
    set: (id, status) => {
      const all = Docs.all();
      if (status) all[id] = status; else delete all[id];
      Store.set('documents', all);
    },
    custom: () => Store.get('documents.custom', []),
    addCustom: (label) => {
      const list = Docs.custom();
      const id = 'custom-' + Date.now();
      list.push({ id, label, category: "Personnels" });
      Store.set('documents.custom', list);
      return id;
    },
    removeCustom: (id) => {
      Store.set('documents.custom', Docs.custom().filter(d => d.id !== id));
      const all = Docs.all();
      delete all[id];
      Store.set('documents', all);
    }
  };

  const Contacts = {
    all: () => Store.get('contacts', []),
    add: (c) => {
      const list = Contacts.all();
      list.push({ ...c, id: 'c-' + Date.now() });
      Store.set('contacts', list);
    },
    remove: (id) => Store.set('contacts', Contacts.all().filter(c => c.id !== id))
  };

  const Profile = {
    getName: () => Store.get('profile.name', ''),
    setName: (name) => Store.set('profile.name', (name || '').trim().slice(0, 30)),
    clearName: () => Store.remove('profile.name'),
    welcomeDone: () => Store.get('welcome.done', false),
    markWelcomeDone: () => Store.set('welcome.done', true)
  };

  const Rappels = {
    all: () => Store.get('rappels', []).sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    add: (r) => {
      const list = Store.get('rappels', []);
      list.push({ ...r, id: 'r-' + Date.now() });
      Store.set('rappels', list);
    },
    remove: (id) => Store.set('rappels', Store.get('rappels', []).filter(r => r.id !== id))
  };

  // ============================================================
  // Helpers
  // ============================================================
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  const isPast = (iso) => iso && iso < new Date().toISOString().slice(0, 10);
  const isToday = (iso) => iso && iso === new Date().toISOString().slice(0, 10);

  const tile = (href, color, icon, title, sub, extraClass = '') => `
    <a class="tile ${extraClass}" href="${href}" data-color="${color}">
      <span class="tile-icon">${icon}</span>
      <div>
        <div class="tile-title">${escapeHtml(title)}</div>
        ${sub ? `<div class="tile-sub">${escapeHtml(sub)}</div>` : ''}
      </div>
    </a>`;

  const arrow = ICONS.arrow;
  const trash = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ============================================================
  // Pages
  // ============================================================

  // 9 thèmes affichés sur l'accueil avec les libellés et routes actualisées
  function renderThemesPreview() {
    const HOME_THEME_CARDS = [
      { href: '#/module/argent', color: 'argent', icon: ICONS.euro, title: 'Argent & aides', subtitle: 'Mes revenus, mes aides, mon budget' },
      { href: '#/module/logement', color: 'logement', icon: ICONS.home, title: 'Logement', subtitle: 'Trouver, signer, emménager' },
      { href: '#/module/travail', color: 'travail', icon: ICONS.bag, title: 'Travail', subtitle: 'Stage, job, entrée en emploi' },
      { href: '#/module/sante', color: 'sante', icon: ICONS.leaf, title: 'Santé', subtitle: 'Médecin, mutuelle, bien-être' },
      { href: '#/module/administratif', color: 'admin', icon: ICONS.doc, title: 'Administratif', subtitle: 'Papiers, mutuelle, démarches' },
      { href: '#/module/etudes', color: 'etudes', icon: ICONS.cap, title: 'Études & formations', subtitle: 'Bourses, écoles, orientation' },
      { href: '#/module/vie', color: 'vie', icon: ICONS.cart, title: 'Vie quotidienne', subtitle: 'Transports, GSM, alimentation' },
      { href: '#/module/loisirs', color: 'majeur', icon: ICONS.leaf, title: 'Loisirs', subtitle: 'Activités, culture, souffler' },
      { href: '#/urgence', color: 'urgence', icon: ICONS.sos, title: 'Aide & urgence', subtitle: 'Quand ça ne va pas' }
    ];

    return `
      <section class="themes-preview" aria-labelledby="themes-preview-label">
        <header class="themes-preview-head">
          <h2 id="themes-preview-label">
            <span class="themes-preview-spark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" fill="currentColor"/></svg>
            </span>
            Explore par thème
          </h2>
          <span class="themes-preview-count">${HOME_THEME_CARDS.length} thèmes</span>
        </header>
        <p class="themes-preview-lead">Découvre les ${HOME_THEME_CARDS.length} thèmes de l'app et choisis ce qui t'intéresse.</p>
        <div class="themes-preview-grid">
          ${HOME_THEME_CARDS.map(card => `
            <a class="theme-mini" href="${card.href}" data-color="${card.color}">
              <span class="theme-mini-icon">${card.icon}</span>
              <strong>${escapeHtml(card.title)}</strong>
              <span>${escapeHtml(card.subtitle)}</span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  function greetingText() {
    const name = Profile.getName();
    return name ? `Salut ${escapeHtml(name)}.` : 'Salut.';
  }

  function applyGreetingToStaticDOM() {
    document.querySelectorAll('.hero-greeting').forEach(el => {
      const name = Profile.getName();
      el.textContent = name ? `Salut ${name}.` : 'Salut.';
    });
  }

  // Source unique du footer de la home (utilisé par le rendu JS ; le HTML
  // statique d'index.html ne contient plus de copie — cf. enhanceStaticHome).
  function homeFooterHTML() {
    return `
      <footer class="app-footer">
        <p><strong>Tu peux fermer l'app et revenir plus tard.</strong> On garde tes notes et favoris sur ton appareil — rien n'est envoyé sur Internet.</p>
        <a href="https://famillesdaccueil.mypixieset.com/" target="_blank" rel="noopener" class="signature-block">
          <img src="assets/icons/logo-sfa.png" alt="" class="signature-logo" />
          <span class="signature-text">
            <span class="signature-intro">Une initiative du</span>
            <strong>Service Familles d'Accueil</strong>
            <span>de Verviers</span>
          </span>
          <svg viewBox="0 0 24 24" width="14" height="14" class="signature-ext" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <nav class="footer-links" aria-label="Liens utiles">
          <a href="#/a-propos">À propos</a>
          <a href="#/urgence">Aide &amp; urgence</a>
        </nav>
        <p class="updated-date">Contenu mis à jour le 8 mai 2026.</p>
      </footer>
    `;
  }

  // Partie dérivée de la home (grille des thèmes + footer) : SOURCE UNIQUE.
  // Injectée par renderHome() (navigation) et enhanceStaticHome() (1er chargement).
  function homeDynamicHTML() {
    return renderThemesPreview() + homeFooterHTML();
  }

  function renderHome() {
    main.innerHTML = `
      <section class="hero">
        <h1 class="hero-greeting">${greetingText()}</h1>
        <p class="hero-question">Ici, on t'aide à comprendre, à choisir, à avancer. À ton rythme.</p>
        <ul class="trust-chips" aria-label="Nos engagements">
          <li><span class="dot" aria-hidden="true"></span> 100 % gratuit</li>
          <li><span class="dot" aria-hidden="true"></span> Sans compte</li>
          <li><span class="dot" aria-hidden="true"></span> Sans jugement</li>
        </ul>
      </section>

      <form class="search-bar" role="search">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="search" name="q" placeholder="Une question ? Tape un mot…" aria-label="Rechercher dans Pass'âge" />
      </form>
      <div class="search-suggest">
        <span>Essaye :</span>
        <a href="#/recherche?q=CPAS">CPAS</a>
        <a href="#/recherche?q=bail">bail</a>
        <a href="#/recherche?q=mutuelle">mutuelle</a>
        <a href="#/recherche?q=Forem">Forem</a>
      </div>

      <div id="resumeBanner"></div>

      <a class="urgence-cta" href="#/urgence">
        <span class="urgence-cta-icon">${ICONS.sos}</span>
        <span class="urgence-cta-body">
          <strong>Ça ne va pas ?</strong>
          <span>Trouve quelqu'un à qui parler, tout de suite.</span>
        </span>
      </a>

      <div id="homeDynamic">${homeDynamicHTML()}</div>
    `;
    injectResumeBanner();
  }

  // Au 1er chargement, le haut de la home est déjà en HTML statique (paint
  // instantané). On injecte ici la partie dérivée depuis la source JS unique.
  function enhanceStaticHome() {
    const slot = document.getElementById('homeDynamic');
    if (slot) slot.innerHTML = homeDynamicHTML();
    injectResumeBanner();
  }

  function injectResumeBanner() {
    const inProgress = SITUATIONS
      .map(s => ({ s, p: Checklists.progress(s.id) }))
      .filter(({ p }) => p.done > 0 && p.done < p.total);
    if (inProgress.length === 0) return;
    const next = inProgress[0];
    const html = `
      <a href="#/situation/${next.s.id}" class="resume-banner">
        <div>
          <div class="resume-banner-label">Tu as commencé</div>
          <div class="resume-banner-title">${escapeHtml(next.s.title)}</div>
          <div class="progress">
            <div class="progress-bar"><div class="progress-fill" style="width:${next.p.percent}%"></div></div>
            <span class="progress-text">${next.p.done}/${next.p.total}</span>
          </div>
        </div>
        <span class="fiche-link-arrow">${arrow}</span>
      </a>`;
    const target = document.getElementById('resumeBanner');
    if (target) target.innerHTML = html;
  }

  function renderSituation(id) {
    const s = SITUATIONS_INDEX[id];
    if (!s) return render404();
    const p = Checklists.progress(s.id);
    main.innerHTML = `
      <section class="parcours-intro" data-color="${s.color}">
        <h1 class="page-title">${escapeHtml(s.title)}</h1>
        <p>${escapeHtml(s.intro)}</p>
        ${p.total > 0 ? `
          <div class="progress" style="margin-top: var(--sp-4)">
            <div class="progress-bar"><div class="progress-fill" style="width:${p.percent}%"></div></div>
            <span class="progress-text">${p.done}/${p.total} étape${p.total > 1 ? 's' : ''}</span>
          </div>
        ` : ''}
      </section>

      <h2 class="section-label">Les étapes — coche au fur et à mesure</h2>
      <div class="parcours-steps" data-situation="${s.id}">
        ${s.steps.map((step, i) => {
          const checked = Checklists.isChecked(s.id, i);
          const href = step.linkType === 'fiche' ? `#/fiche/${step.linkId}` : `#/${step.linkId}`;
          return `
            <div class="parcours-step ${checked ? 'is-done' : ''}">
              <button class="step-check" data-toggle-step="${i}" aria-pressed="${checked}" aria-label="Marquer comme ${checked ? 'non fait' : 'fait'}">
                ${checked
                  ? '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8 12l3 3 5-6" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                  : '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>'}
              </button>
              <a class="step-body-link" href="${href}">
                <div class="step-title">${escapeHtml(step.title)}</div>
                <div class="step-desc">${escapeHtml(step.desc)}</div>
              </a>
              <a class="fiche-link-arrow" href="${href}" aria-label="Ouvrir">${arrow}</a>
            </div>`;
        }).join('')}
      </div>

      <div class="parcours-outcome">
        <strong>Ce que tu auras à la fin</strong>
        ${escapeHtml(s.outcome)}
      </div>

      ${s.relatedModules && s.relatedModules.length ? `
        <h2 class="section-label">Pour aller plus loin</h2>
        <div class="related-modules">
          ${s.relatedModules.map(mid => {
            const m = MODULES_INDEX[mid];
            if (!m) return '';
            return `
              <a class="related-module" href="#/module/${m.id}" data-color="${m.color}">
                <span class="tile-icon">${m.icon}</span>
                <div>
                  <strong>${escapeHtml(m.title)}</strong>
                  <span>${escapeHtml(m.objective)}</span>
                </div>
                <span class="related-arrow" aria-hidden="true">→</span>
              </a>`;
          }).join('')}
        </div>
      ` : ''}
    `;
  }

  function renderModule(id) {
    const m = MODULES_INDEX[id];
    if (!m) return render404();
    main.innerHTML = `
      <section class="module-header" data-color="${m.color}">
        <h1>${escapeHtml(m.title)}</h1>
        <p>${escapeHtml(m.objective)}</p>
      </section>

      <h2 class="section-label">Les fiches</h2>
      <div class="fiche-list">
        ${m.sections.map(s => {
          const href = s.linkTo ? `#/fiche/${s.linkTo}` : `#/fiche/${m.id}/${s.id}`;
          const linkBadge = s.linkTo ? '<span class="link-badge" title="Vu ailleurs dans l\'app">↗</span>' : '';
          return `
            <a class="fiche-link" href="${href}">
              <div>
                <div class="fiche-link-title">${escapeHtml(s.title)} ${linkBadge}</div>
                <div class="fiche-link-sub">${escapeHtml(s.summary)}</div>
              </div>
              <span class="fiche-link-arrow">${arrow}</span>
            </a>`;
        }).join('')}
      </div>
    `;
  }

  function renderFiche(path) {
    // Compatibilité : favoris d'avant le déplacement vers Santé
    if (REDIRECTS && REDIRECTS[path]) {
      window.location.hash = `#/fiche/${REDIRECTS[path]}`;
      return;
    }
    const f = FICHES_INDEX[path];
    if (!f) return render404();
    const noteValue = Notes.get(path);
    const metaSource = escapeHtml(f.source || `Source à vérifier`);
    const metaDate = escapeHtml(f.lastChecked || `08/05/2026`);
    const metaDisclaimer = f.disclaimer
      ? escapeHtml(f.disclaimer)
      : `Cette fiche est un repère général. Elle ne remplace pas l’avis d’un service compétent.`;
    main.innerHTML = `
      <p style="margin-bottom: var(--sp-3); color: var(--color-text-soft); font-size: var(--fs-sm);">
        <a href="#/module/${f.moduleId}" style="text-decoration: none;">${escapeHtml(f.moduleTitle)}</a>
      </p>
      <article class="fiche">
        <h1>${escapeHtml(f.title)}</h1>
        ${f.body}
      </article>

      <section class="fiche-meta">
        <p><strong>Source :</strong> ${metaSource}</p>
        <p><strong>Dernière vérification :</strong> ${metaDate}</p>
        <p class="fiche-meta-disclaimer">${metaDisclaimer}</p>
      </section>

      <section class="notes-block">
        <label class="notes-label" for="notes-area">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M11 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Mes notes
        </label>
        <textarea id="notes-area" data-note-path="${path}" maxlength="2000" placeholder="Écris ce que tu veux retenir : un RDV pris, un nom, une question à poser…">${escapeHtml(noteValue)}</textarea>
        <div class="notes-meta" id="notes-meta">${noteValue ? 'Gardé sur ton appareil' : 'C\'est juste pour toi, ça reste sur ton téléphone'}</div>
      </section>
    `;
    favToggleBtn.dataset.fiche = path;
    favToggleBtn.hidden = false;
    updateFavBtn();
  }

  function render404() {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <h2>On n'a pas trouvé cette page</h2>
        <p>Le lien est peut-être cassé, ou la page a bougé.</p>
        <p style="margin-top: var(--sp-4)"><a href="#/">Revenir à l'accueil</a></p>
      </div>
    `;
  }

  function renderRecherche(query) {
    const q = (query || '').trim();
    let results = [];
    const seen = new Set();
    const addResult = (r) => { if (!seen.has(r.href)) { seen.add(r.href); results.push(r); } };

    if (q.length >= 2) {
      const nq = norm(q);
      const tokens = nq.split(/\s+/).filter(Boolean);
      const matchesAllTokens = (text) => {
        const normText = norm(text);
        return tokens.every(token => normText.includes(token));
      };

      // 1. Recherche exacte/partielle dans le contenu des fiches
      Object.entries(FICHES_INDEX).forEach(([path, f]) => {
        const text = `${f.title} ${f.summary} ${f.body.replace(/<[^>]+>/g, ' ')}`;
        if (matchesAllTokens(text)) {
          addResult({ href: `#/fiche/${path}`, title: f.title, sub: `${f.moduleTitle} — ${f.summary}` });
        }
      });

      // 2. Recherche dans modules et situations
      MODULES.forEach(m => {
        const text = `${m.title} ${m.subtitle || ''} ${m.objective || ''}`;
        if (matchesAllTokens(text)) {
          addResult({ href: `#/module/${m.id}`, title: m.title, sub: m.subtitle || '' });
        }
      });
      SITUATIONS.forEach(s => {
        const text = `${s.title} ${s.subtitle || ''} ${s.intro || ''}`;
        if (matchesAllTokens(text)) {
          addResult({ href: `#/situation/${s.id}`, title: s.title, sub: 'Parcours guidé' });
        }
      });

      // 3. Lexique invisible : termes familiers, synonymes, fautes courantes
      Object.entries(LEXIQUE).forEach(([term, paths]) => {
        const nt = norm(term);
        if (nt.length >= 3 && (nt.includes(nq) || nq.includes(nt))) {
          paths.forEach(path => {
            const f = FICHES_INDEX[path];
            if (f) addResult({ href: `#/fiche/${path}`, title: f.title, sub: `${f.moduleTitle} — ${f.summary}` });
          });
        }
      });
    }

    main.innerHTML = `
      <h1 class="page-title">Rechercher</h1>
      <form class="search-bar" role="search">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="search" name="q" placeholder="Une question ? Tape un mot…" aria-label="Rechercher dans Pass'âge" autofocus value="${escapeHtml(q)}" />
      </form>
      <div class="search-suggest">
        <span>Idées :</span>
        <a href="#/recherche?q=CPAS">CPAS</a>
        <a href="#/recherche?q=bail">bail</a>
        <a href="#/recherche?q=mutuelle">mutuelle</a>
        <a href="#/recherche?q=Forem">Forem</a>
      </div>

      ${q.length < 2 ? `
        <p style="color: var(--color-text-soft); margin-top: var(--sp-4);">La recherche commence à partir de 2 lettres.</p>
      ` : results.length === 0 ? `
        <div class="empty-state">
          <p>Rien trouvé pour <strong>« ${escapeHtml(q)} »</strong>.</p>
          <p style="margin-top: var(--sp-3)">Essaie un autre mot, ou reviens à <a href="#/">l'accueil</a> pour voir les situations.</p>
        </div>
      ` : `
        <p style="color: var(--color-text-soft); margin: var(--sp-3) 0;">${results.length} résultat${results.length > 1 ? 's' : ''}</p>
        <div class="search-results fiche-list">
          ${results.map(r => `
            <a class="fiche-link" href="${r.href}">
              <div>
                <div class="fiche-link-title">${escapeHtml(r.title)}</div>
                <div class="fiche-link-sub">${escapeHtml(r.sub)}</div>
              </div>
              <span class="fiche-link-arrow">${arrow}</span>
            </a>
          `).join('')}
        </div>
      `}
    `;
  }

  function renderUrgence() {
    const calls = [
      { tel: '112', title: '112 — Urgences vitales', sub: 'Police, ambulance, pompiers · 24/7 · gratuit', primary: true, className: 'urgence-card--112' },
      { tel: '1733', title: '1733 — Médecin de garde', sub: 'Soins courants en soirée et week-end', className: 'urgence-card--medical' },
      { tel: '0702452452', title: '070 245 245 — Centre Anti-Poisons', sub: 'Intoxication, ingestion · 24/7 · gratuit', className: 'urgence-card--poison' },
      { tel: '103', title: '103 — Écoute Enfants Ado', sub: 'Pour les moins de 20 ans · gratuit, anonyme', className: 'urgence-card--youth' },
      { tel: '107', title: '107 — Télé-Accueil', sub: 'Quand ça ne va pas, parle à quelqu\'un · 24/7', className: 'urgence-card--listening' },
      { tel: '080032123', title: '0800 32 123 — Prévention du suicide', sub: 'Gratuit · 24/7 · anonyme', className: 'urgence-card--suicide' },
      { tel: '080098100', title: '0800 98 100 — SOS Viol', sub: 'Gratuit · anonyme', className: 'urgence-card--family' },
      { tel: '080030030', title: '0800 30 030 — Violences conjugales', sub: 'Écoute et orientation', className: 'urgence-card--social' },
      { tel: '022275252', title: '02 227 52 52 — Infor-Drogues', sub: 'Gratuit · anonyme', className: 'urgence-card--medical' }
    ];
    main.innerHTML = `
      <section class="urgence-page">
        <h1 class="page-title">Aide / Urgence</h1>
        <p class="page-lead">Tu n'es pas seul·e. Ces numéros sont gratuits, anonymes, et ouverts à toute heure.</p>

        ${calls.map(c => `
          <a class="urgence-card ${c.primary ? 'primary' : ''} ${c.className || ''}" href="tel:${c.tel}">
            <span class="urgence-card-icon">${ICONS.phone}</span>
            <div>
              <div class="urgence-card-title">${escapeHtml(c.title)}</div>
              <div class="urgence-card-sub">${escapeHtml(c.sub)}</div>
            </div>
          </a>
        `).join('')}

        <h2 class="section-label">En savoir plus</h2>
        <div class="fiche-list">
          <a class="fiche-link" href="#/fiche/urgence/lignes-ecoute">
            <div><div class="fiche-link-title">Toutes les lignes d'écoute</div>
            <div class="fiche-link-sub">Liste complète des numéros utiles</div></div>
            <span class="fiche-link-arrow">${arrow}</span>
          </a>
          <a class="fiche-link" href="#/fiche/urgence/services-aide">
            <div><div class="fiche-link-title">Les services près de moi</div>
            <div class="fiche-link-sub">AMO, planning familial, CPAS, Inforjeunes</div></div>
            <span class="fiche-link-arrow">${arrow}</span>
          </a>
          <a class="fiche-link" href="#/fiche/urgence/mal-etre">
            <div><div class="fiche-link-title">Quand ça ne va pas</div>
            <div class="fiche-link-sub">Anxiété, dépression, idées noires : par où commencer</div></div>
            <span class="fiche-link-arrow">${arrow}</span>
          </a>
        </div>
      </section>
    `;
  }

  function renderFavoris() {
    const favs = Favs.all();
    const items = favs.map(path => FICHES_INDEX[path]).filter(Boolean);
    main.innerHTML = `
      <h1 class="page-title">Mes favoris</h1>
      <p class="page-lead">Les fiches que tu as gardées de côté.</p>
      ${items.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          </div>
          <h2>Pas encore de favoris</h2>
          <p>Sur une fiche, tape sur le cœur en haut pour la garder ici. Pratique pour la retrouver vite.</p>
        </div>
      ` : `
        <div class="fiche-list">
          ${items.map(f => `
            <a class="fiche-link" href="#/fiche/${f.moduleId}/${f.id}">
              <div>
                <div class="fiche-link-title">${escapeHtml(f.title)}</div>
                <div class="fiche-link-sub">${escapeHtml(f.moduleTitle)} — ${escapeHtml(f.summary)}</div>
              </div>
              <span class="fiche-link-arrow">${arrow}</span>
            </a>`).join('')}
        </div>
      `}
    `;
  }

  function renderMonEspace() {
    const counts = {
      favoris: Favs.all().length,
      notes: Notes.list().length,
      docs: Object.values(Docs.all()).filter(s => s === 'oui').length,
      docsTotal: DOCUMENTS_ESSENTIELS.length + Docs.custom().length,
      contacts: Contacts.all().length,
      rappels: Rappels.all().length
    };

    const inProgress = SITUATIONS
      .map(s => ({ s, p: Checklists.progress(s.id) }))
      .filter(({ p }) => p.done > 0);

    main.innerHTML = `
      <h1 class="page-title">Mon espace</h1>
      <p class="page-lead">Tout ce que tu sauvegardes reste sur ton appareil.</p>

      ${inProgress.length > 0 ? `
        <h2 class="section-label">Mes parcours en cours</h2>
        <div class="fiche-list">
          ${inProgress.map(({ s, p }) => `
            <a class="fiche-link" href="#/situation/${s.id}">
              <div style="flex: 1">
                <div class="fiche-link-title">${escapeHtml(s.title)}</div>
                <div class="progress" style="margin-top: 6px">
                  <div class="progress-bar"><div class="progress-fill" style="width:${p.percent}%"></div></div>
                  <span class="progress-text">${p.done}/${p.total}</span>
                </div>
              </div>
              <span class="fiche-link-arrow">${arrow}</span>
            </a>
          `).join('')}
        </div>
      ` : ''}

      <h2 class="section-label">Mon profil</h2>
      <section class="profile-card">
        <div class="profile-info">
          <div class="profile-label">Comment on t'appelle ici</div>
          <div class="profile-value">${Profile.getName() ? escapeHtml(Profile.getName()) : '<em>Pas encore défini</em>'}</div>
        </div>
        <button class="btn-ghost" data-action="edit-name">${Profile.getName() ? 'Modifier' : 'Ajouter un prénom'}</button>
      </section>
      <form class="form-card profile-edit-form" id="profileEditForm" hidden>
        <label>Ton prénom (ou un surnom) <input type="text" name="name" maxlength="30" placeholder="Ex : Léo" value="${escapeHtml(Profile.getName())}" autocomplete="off" /></label>
        <p style="font-size: var(--fs-xs); color: var(--color-text-soft); margin: 0;">Ça reste sur ton téléphone. Personne d'autre ne peut le voir.</p>
        <div class="form-actions">
          <button type="button" class="btn-ghost" data-action="cancel-name">Annuler</button>
          ${Profile.getName() ? '<button type="button" class="btn-ghost danger" data-action="clear-name">Enlever</button>' : ''}
          <button type="submit" class="btn-primary">Sauvegarder</button>
        </div>
      </form>

      <h2 class="section-label">Mes outils</h2>
      <div class="tiles">
        ${tile('#/mes-contacts', 'travail', '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 18c0-2.5 2.2-4 5-4s5 1.5 5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', 'Mes contacts', counts.contacts ? `${counts.contacts} contact${counts.contacts > 1 ? 's' : ''}` : 'Vide')}
        ${tile('#/mes-rappels', 'logement', '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', 'Mes rappels', counts.rappels ? `${counts.rappels} rappel${counts.rappels > 1 ? 's' : ''}` : 'Vide')}
        ${tile('#/mes-notes', 'etudes', '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M11 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', 'Mes notes', counts.notes ? `${counts.notes} note${counts.notes > 1 ? 's' : ''}` : 'Vide')}
      </div>

      <h2 class="section-label">À propos</h2>
      <article class="fiche">
        <p>Pass'âge aide les jeunes à comprendre leurs droits, gérer l'administratif, et trouver de l'aide. <strong>Sans compte. Sans pub. Sans tracking.</strong></p>
        <p>Sources : <em>Fiche Majorité</em> (Service Familles d'Accueil), Inforjeunes, Droit des Jeunes.</p>
      </article>

      <p style="text-align: center; margin: var(--sp-6) 0; font-size: var(--fs-sm);">
        <a href="#" id="resetDataLink" style="color: var(--color-text-muted)">Tout effacer (favoris, notes, rappels…)</a>
      </p>
    `;
  }

  function renderMesDocuments() {
    const all = [...DOCUMENTS_ESSENTIELS, ...Docs.custom()];
    const byCat = {};
    all.forEach(d => {
      const cat = d.category || 'Autres';
      (byCat[cat] = byCat[cat] || []).push(d);
    });
    const oui = all.filter(d => Docs.get(d.id) === 'oui').length;

    main.innerHTML = `
      <h1 class="page-title">Mes documents</h1>
      <p class="page-lead">Coche ce que tu as déjà. Pratique pour ne rien oublier au moment d'un dossier.</p>

      <div class="progress" style="margin-bottom: var(--sp-5)">
        <div class="progress-bar"><div class="progress-fill" style="width:${all.length ? Math.round(oui/all.length*100) : 0}%"></div></div>
        <span class="progress-text">${oui}/${all.length}</span>
      </div>

      ${Object.entries(byCat).map(([cat, docs]) => `
        <h2 class="section-label">${escapeHtml(cat)}</h2>
        <div class="docs-list">
          ${docs.map(d => {
            const status = Docs.get(d.id);
            const isCustom = d.id.startsWith('custom-');
            return `
              <div class="doc-item ${status === 'oui' ? 'is-done' : ''}">
                <div class="doc-label">${escapeHtml(d.label)}</div>
                <div class="doc-actions">
                  <button class="chip ${status === 'oui' ? 'chip-on chip-green' : ''}" data-doc="${d.id}" data-status="oui">J'ai</button>
                  <button class="chip ${status === 'a-faire' ? 'chip-on chip-orange' : ''}" data-doc="${d.id}" data-status="a-faire">À faire</button>
                  ${isCustom ? `<button class="icon-btn" data-doc-remove="${d.id}" aria-label="Supprimer">${trash}</button>` : ''}
                </div>
              </div>`;
          }).join('')}
        </div>
      `).join('')}

      <h2 class="section-label">Ajouter un document</h2>
      <form class="form-row" id="addDocForm">
        <input type="text" name="label" placeholder="Ex : ma facture d'énergie" required maxlength="80" />
        <button type="submit" class="btn-primary">Ajouter</button>
      </form>
    `;
  }

  function renderMesContacts() {
    const list = Contacts.all();
    main.innerHTML = `
      <h1 class="page-title">Mes contacts</h1>
      <p class="page-lead">Garde sous la main les numéros qui te servent : ton AS, ton médecin, l'AMO… Personne d'autre n'y a accès.</p>

      ${list.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 21c0-3.5 3.1-6 7-6s7 2.5 7 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <h2>Pas encore de contacts</h2>
          <p>Ajoute-en un ci-dessous. Ça reste sur ton téléphone.</p>
        </div>
      ` : `
        <div class="contact-list">
          ${list.map(c => `
            <div class="contact-card">
              <div class="contact-head">
                <div>
                  <div class="contact-nom">${escapeHtml(c.nom)}</div>
                  ${c.role ? `<div class="contact-role">${escapeHtml(c.role)}</div>` : ''}
                </div>
                <button class="icon-btn" data-contact-remove="${c.id}" aria-label="Supprimer">${trash}</button>
              </div>
              ${c.telephone ? `<a class="contact-line" href="tel:${escapeHtml(c.telephone.replace(/\s/g, ''))}">${ICONS.phone}<span>${escapeHtml(c.telephone)}</span></a>` : ''}
              ${c.email ? `<a class="contact-line" href="mailto:${escapeHtml(c.email)}"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM2 8l10 6 10-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span>${escapeHtml(c.email)}</span></a>` : ''}
              ${c.notes ? `<div class="contact-notes">${escapeHtml(c.notes)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `}

      <h2 class="section-label">Ajouter un contact</h2>
      <form class="form-card" id="addContactForm">
        <label>Nom <input type="text" name="nom" required maxlength="60" placeholder="Ex : Marie Dupont" /></label>
        <label>Rôle <input type="text" name="role" maxlength="60" placeholder="Ex : Mon assistante sociale" /></label>
        <label>Téléphone <input type="tel" name="telephone" maxlength="30" placeholder="Ex : 0476 12 34 56" /></label>
        <label>E-mail <input type="email" name="email" maxlength="80" placeholder="Ex : marie@cpas.be" /></label>
        <label>Notes <textarea name="notes" maxlength="200" rows="2" placeholder="Horaires, adresse, info utile…"></textarea></label>
        <button type="submit" class="btn-primary">Ajouter le contact</button>
      </form>
    `;
  }

  function renderMesRappels() {
    const list = Rappels.all();
    const today = new Date().toISOString().slice(0, 10);
    main.innerHTML = `
      <h1 class="page-title">Mes rappels</h1>
      <p class="page-lead">Note les dates qui comptent : préavis, RDV, dossier à déposer, paiement…</p>

      ${list.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <h2>Pas encore de rappels</h2>
          <p>Ajoute-en un ci-dessous. Tu n'oublieras plus.</p>
        </div>
      ` : `
        <div class="rappel-list">
          ${list.map(r => {
            const past = isPast(r.date);
            const today_ = isToday(r.date);
            const cls = past ? 'is-past' : today_ ? 'is-today' : '';
            const tag = past ? 'En retard' : today_ ? "Aujourd'hui" : '';
            return `
              <div class="rappel-card ${cls}">
                <div class="rappel-date">
                  ${tag ? `<span class="rappel-tag">${tag}</span>` : ''}
                  ${escapeHtml(formatDate(r.date))}
                </div>
                <div class="rappel-titre">${escapeHtml(r.titre)}</div>
                ${r.notes ? `<div class="rappel-notes">${escapeHtml(r.notes)}</div>` : ''}
                <button class="icon-btn rappel-remove" data-rappel-remove="${r.id}" aria-label="Supprimer">${trash}</button>
              </div>
            `;
          }).join('')}
        </div>
      `}

      <h2 class="section-label">Ajouter un rappel</h2>
      <form class="form-card" id="addRappelForm">
        <label>Quoi ? <input type="text" name="titre" required maxlength="80" placeholder="Ex : Donner mon préavis" /></label>
        <label>Quand ? <input type="date" name="date" required min="${today}" /></label>
        <label>Notes <textarea name="notes" maxlength="200" rows="2" placeholder="Détails utiles…"></textarea></label>
        <button type="submit" class="btn-primary">Ajouter le rappel</button>
      </form>
    `;
  }

  function renderAPropos() {
    main.innerHTML = `
      <p class="page-pretitle">À propos</p>
      <h1 class="page-title">Pass'âge, c'est quoi&nbsp;?</h1>
      <p class="page-lead">Une appli pour aider les jeunes à s'y retrouver après 18 ans. Sans compte, sans pub, sans jugement.</p>

      <section class="apropos-card">
        <h2><span class="apropos-icon" style="background: var(--color-argent-soft); color: var(--color-argent);"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" fill="currentColor"/></svg></span> Notre mission</h2>
        <p>Trop d'infos utiles pour les jeunes majeur·es sont cachées dans du jargon administratif. Pass'âge rassemble l'essentiel : devenir majeur·e, papiers, argent, logement, travail, études, santé, vie quotidienne, urgences. Tu lis, tu prends ce qui t'aide, tu refermes.</p>
      </section>

      <section class="apropos-card">
        <div class="apropos-initiative">
          <img src="assets/icons/logo-sfa.png" alt="" class="apropos-logo" />
          <div>
            <p class="apropos-initiative-label">Une initiative du</p>
            <h2 class="apropos-initiative-title">Service Familles d'Accueil de Verviers</h2>
          </div>
        </div>
        <p>Pass'âge est née au Service Familles d'Accueil de Verviers, qui accompagne depuis des années les jeunes en placement et leurs familles d'accueil. Sa porte te reste ouverte après tes 18 ans : pour une question, un doute, une écoute.</p>
        <p><a href="https://famillesdaccueil.mypixieset.com/" target="_blank" rel="noopener" class="apropos-link">Site du Service Familles d'Accueil <span aria-hidden="true">↗</span></a></p>
      </section>

      <section class="apropos-card">
        <h2><span class="apropos-icon" style="background: var(--color-primary-soft); color: var(--color-primary);"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4z M20 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></span> Nos sources</h2>
        <p>Les contenus s'appuient sur des ressources publiques fiables. En cas de doute juridique, c'est toujours ces services qui font foi : l'app est un repère, pas un avis légal.</p>
        <p><a href="https://inforjeunes.be" target="_blank" rel="noopener" class="apropos-link">Inforjeunes <span aria-hidden="true">↗</span></a> — info gratuite pour les 12–26 ans</p>
        <p><a href="https://www.sdj.be" target="_blank" rel="noopener" class="apropos-link">Service Droit des Jeunes <span aria-hidden="true">↗</span></a> — questions juridiques, gratuit</p>
        <p><a href="https://envoltoit.be" target="_blank" rel="noopener" class="apropos-link">Envol'toit <span aria-hidden="true">↗</span></a> — logement des jeunes (Inforjeunes)</p>
      </section>

      <section class="apropos-card">
        <h2><span class="apropos-icon" style="background: var(--color-sante-soft); color: var(--color-sante);"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Tes données</h2>
        <p>Pas de compte, pas de cookie de tracking, pas de pub. Tes favoris, ton prénom et tes notes sont stockés <strong>uniquement</strong> sur ton téléphone. Rien n'est envoyé sur Internet.</p>
        <p>
          <a href="#/mon-espace" class="apropos-link">Voir mes données →</a>
          &nbsp;·&nbsp;
          <a href="assets/policy.html" target="_blank" rel="noopener" class="apropos-link">Politique complète <span aria-hidden="true">↗</span></a>
        </p>
      </section>

      <section class="apropos-card">
        <h2><span class="apropos-icon" style="background: var(--color-logement-soft); color: #B7691A;"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM2 8l10 6 10-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></span> Contact &amp; retours</h2>
        <p>Tu vois une erreur, une info à mettre à jour, ou tu as une idée pour améliorer l'app&nbsp;? Écris au Service Familles d'Accueil via <a href="https://famillesdaccueil.mypixieset.com/" target="_blank" rel="noopener" class="apropos-link">leur site</a>. Toute correction est la bienvenue.</p>
      </section>

      <p class="apropos-meta">Contenu mis à jour le 8 mai 2026. Vérifié à partir des sites publics belges.</p>
    `;
  }

  function renderMesNotes() {
    const list = Notes.list();
    main.innerHTML = `
      <h1 class="page-title">Mes notes</h1>
      <p class="page-lead">Toutes les notes que tu as écrites sur les fiches.</p>

      ${list.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path d="M11 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h2>Pas encore de notes</h2>
          <p>Sur n'importe quelle fiche, écris ce que tu veux retenir : un RDV, un nom, une question. C'est juste pour toi.</p>
        </div>
      ` : `
        <div class="notes-list">
          ${list.map(({ id, text }) => {
            const f = FICHES_INDEX[id];
            if (!f) return '';
            return `
              <a class="note-card" href="#/fiche/${id}">
                <div class="note-card-source">${escapeHtml(f.moduleTitle)} — ${escapeHtml(f.title)}</div>
                <div class="note-card-text">${escapeHtml(text)}</div>
              </a>
            `;
          }).join('')}
        </div>
      `}
    `;
  }

  // ============================================================
  // Routing
  // ============================================================

  function parseRoute() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const [path, qs] = hash.split('?');
    const segments = path.split('/').filter(Boolean);
    const params = {};
    (qs || '').split('&').forEach(p => {
      const [k, v] = p.split('=');
      if (!k) return;
      try { params[k] = decodeURIComponent(v || ''); }
      catch (_) { params[k] = v || ''; } // lien tronqué/mal collé : on garde la valeur brute plutôt que de crasher
    });
    return { segments, params };
  }

  const ROUTES = {
    '': { render: renderHome, nav: 'home' },
    'situation': { render: (s) => renderSituation(s[1]), nav: 'home' },
    'module': { render: (s) => renderModule(s[1]), nav: 'home' },
    'fiche': { render: (s) => renderFiche(`${s[1]}/${s[2]}`), nav: 'home' },
    'recherche': { render: (s, p) => renderRecherche(p.q), nav: 'recherche' },
    'urgence': { render: renderUrgence, nav: 'urgence' },
    'favoris': { render: renderFavoris, nav: 'favoris' },
    'mon-espace': { render: renderMonEspace, nav: 'mon-espace' },
    'mes-documents': { render: renderMesDocuments, nav: 'mon-espace' },
    'mes-contacts': { render: renderMesContacts, nav: 'mon-espace' },
    'mes-rappels': { render: renderMesRappels, nav: 'mon-espace' },
    'mes-notes': { render: renderMesNotes, nav: 'mon-espace' },
    'a-propos': { render: renderAPropos, nav: 'home' }
  };

  function route() {
    const { segments, params } = parseRoute();
    const top = segments[0] || '';
    favToggleBtn.hidden = true;

    // Cas spécial : 1ère visite sur la home, le HTML statique est déjà rendu.
    if (top === '' && main.dataset.staticHome === 'true') {
      delete main.dataset.staticHome;
      enhanceStaticHome();
      setActiveNav('home');
      backBtn.hidden = true;
      return;
    }

    const r = ROUTES[top];
    if (r) {
      r.render(segments, params);
      setActiveNav(r.nav);
    } else {
      render404();
    }

    backBtn.hidden = (segments.length === 0);
    window.scrollTo(0, 0);
    updatePageMetadata();
  }

  function setActiveNav(routeName) {
    navItems.forEach(item => {
      const isActive = item.dataset.route === routeName;
      item.classList.toggle('is-active', isActive);
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function updateFavBtn() {
    const path = favToggleBtn.dataset.fiche;
    if (!path) return;
    const active = Favs.has(path);
    favToggleBtn.classList.toggle('is-active', active);
    favToggleBtn.setAttribute('aria-label', active ? 'Retirer des favoris' : 'Ajouter aux favoris');
    favToggleBtn.querySelector('path').setAttribute('fill', active ? 'currentColor' : 'none');
  }

  function updatePageMetadata() {
    const titleText = main.querySelector('h1, .page-title')?.textContent?.trim();
    document.title = titleText ? `${titleText} — Pass'âge` : 'Pass\'âge — Tu n\'es pas seul·e';
    // preventScroll : sinon le focus refait défiler <main> dans la vue
    // après le scrollTo(0,0) → décalage visible à chaque changement de page.
    main.focus({ preventScroll: true });
  }

  // ============================================================
  // Délégation d'événements
  // ============================================================

  main.addEventListener('click', (e) => {
    const stepBtn = e.target.closest('[data-toggle-step]');
    if (stepBtn) {
      const container = stepBtn.closest('[data-situation]');
      const idx = parseInt(stepBtn.dataset.toggleStep, 10);
      Checklists.toggle(container.dataset.situation, idx);
      route();
      return;
    }

    const docBtn = e.target.closest('[data-doc]');
    if (docBtn) {
      const id = docBtn.dataset.doc;
      const newStatus = docBtn.dataset.status;
      const current = Docs.get(id);
      Docs.set(id, current === newStatus ? null : newStatus);
      route();
      return;
    }

    const docRem = e.target.closest('[data-doc-remove]');
    if (docRem) { Docs.removeCustom(docRem.dataset.docRemove); route(); return; }

    const cRem = e.target.closest('[data-contact-remove]');
    if (cRem) {
      if (confirm('Supprimer ce contact ?')) { Contacts.remove(cRem.dataset.contactRemove); route(); }
      return;
    }

    const rRem = e.target.closest('[data-rappel-remove]');
    if (rRem) {
      if (confirm('Supprimer ce rappel ?')) { Rappels.remove(rRem.dataset.rappelRemove); route(); }
      return;
    }

    // Édition du prénom
    if (e.target.closest('[data-action="edit-name"]')) {
      const form = document.getElementById('profileEditForm');
      if (form) {
        form.hidden = false;
        const input = form.querySelector('input');
        if (input) { input.focus(); input.select(); }
      }
      return;
    }
    if (e.target.closest('[data-action="cancel-name"]')) {
      const form = document.getElementById('profileEditForm');
      if (form) form.hidden = true;
      return;
    }
    if (e.target.closest('[data-action="clear-name"]')) {
      Profile.clearName();
      route();
      applyGreetingToStaticDOM();
      return;
    }

    if (e.target.id === 'resetDataLink') {
      e.preventDefault();
      if (confirm("Tu effaces tout ? Favoris, notes, rappels et contacts disparaissent. Pas moyen de revenir en arrière.")) {
        ['favorites', 'notes', 'checklists', 'documents', 'documents.custom', 'contacts', 'rappels'].forEach(k => Store.remove(k));
        route();
      }
    }
  });

  let noteTimer = null;
  main.addEventListener('input', (e) => {
    if (e.target.matches('[data-note-path]')) {
      clearTimeout(noteTimer);
      const meta = document.getElementById('notes-meta');
      if (meta) meta.textContent = 'Sauvegarde…';
      noteTimer = setTimeout(() => {
        Notes.set(e.target.dataset.notePath, e.target.value);
        if (meta) meta.textContent = e.target.value.trim() ? 'Gardé sur ton appareil' : 'C\'est juste pour toi, ça reste sur ton téléphone';
      }, 400);
    }
  });

  main.addEventListener('submit', (e) => {
    if (e.target.id === 'addDocForm') {
      e.preventDefault();
      const label = e.target.label.value.trim();
      if (label) {
        const id = Docs.addCustom(label);
        Docs.set(id, 'a-faire');
        route();
      }
    } else if (e.target.id === 'addContactForm') {
      e.preventDefault();
      const f = e.target;
      Contacts.add({
        nom: f.nom.value.trim(),
        role: f.role.value.trim(),
        telephone: f.telephone.value.trim(),
        email: f.email.value.trim(),
        notes: f.notes.value.trim()
      });
      route();
    } else if (e.target.id === 'addRappelForm') {
      e.preventDefault();
      const f = e.target;
      Rappels.add({
        titre: f.titre.value.trim(),
        date: f.date.value,
        notes: f.notes.value.trim()
      });
      route();
    } else if (e.target.id === 'profileEditForm') {
      e.preventDefault();
      Profile.setName(e.target.name.value);
      route();
      applyGreetingToStaticDOM();
    }
  });

  // ============================================================
  // Onboarding (1er lancement)
  // ============================================================
  function maybeShowWelcome() {
    if (Profile.welcomeDone()) return;
    const overlay = document.getElementById('welcomeOverlay');
    if (!overlay) return;
    const form = document.getElementById('welcomeForm');
    const skip = document.getElementById('welcomeSkipBtn');
    const input = document.getElementById('welcomeName');
    if (!form || !skip || !input) return;

    const dialog = overlay.querySelector('.welcome-dialog');
    const background = [
      document.getElementById('appHeader'),
      document.getElementById('main'),
      document.querySelector('.bottom-nav')
    ].filter(Boolean);

    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    // Le fond ne doit pas être atteignable au clavier ni annoncé tant que le modal est ouvert
    background.forEach(el => { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });

    const close = () => {
      overlay.hidden = true;
      document.body.classList.remove('no-scroll');
      background.forEach(el => { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
      Profile.markWelcomeDone();
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (name) Profile.setName(name);
      close();
      applyGreetingToStaticDOM();
    });

    skip.addEventListener('click', close);

    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab' || !dialog) return;
      // Piège de focus : Tab reste dans le modal
      const focusables = dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    setTimeout(() => input.focus(), 150);
  }

  // ============================================================
  // Header
  // ============================================================

  window.addEventListener('hashchange', route);

  // Recherche : écouteur délégué (remplace les onsubmit inline → CSP stricte)
  document.addEventListener('submit', (e) => {
    const f = e.target.closest && e.target.closest('form.search-bar');
    if (!f) return;
    e.preventDefault();
    const field = f.querySelector('[name="q"]');
    window.location.hash = '/recherche?q=' + encodeURIComponent(field ? field.value : '');
  });

  backBtn.addEventListener('click', () => {
    if (history.length > 1) history.back();
    else window.location.hash = '#/';
  });

  favToggleBtn.addEventListener('click', () => {
    const path = favToggleBtn.dataset.fiche;
    if (!path) return;
    Favs.toggle(path);
    updateFavBtn();
  });

  // Démarrage : un seul appel pour éviter d'écraser la home statique
  applyGreetingToStaticDOM();
  route();
  maybeShowWelcome();
})();
