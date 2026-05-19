/* ============================================================
   Pass'âge — Service Worker
   Stratégie : app shell pre-cached + cache-first pour les assets,
   network-first pour le HTML (avec fallback offline).
   ============================================================ */

const VERSION = 'v18-2026-05-fixes';
const SHELL_CACHE = `passage-shell-${VERSION}`;
const RUNTIME_CACHE = `passage-runtime-${VERSION}`;

// App shell : ressources pré-cachées dès l'install (offline dès la 1ère visite installée)
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/styles.css',
  './assets/js/app.js?v=2026-05-08-01',
  './assets/js/content.js?v=2026-05-08-01',
  './assets/js/sw-register.js?v=2026-05-08-01',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/policy.html'
];

// ---- Install : pré-cache du shell ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ---- Activate : nettoyage des anciennes versions ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => ![SHELL_CACHE, RUNTIME_CACHE].includes(k))
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ---- Fetch : stratégie hybride ----
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return; // les ressources externes passent en réseau direct

  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    // Network-first pour le HTML : on récupère les nouvelles versions si possible,
    // mais on tombe sur le cache (puis sur l'index) en mode hors-ligne.
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then(c => c || caches.match('./index.html'))
        )
    );
    return;
  }

  // Cache-first pour les assets statiques (CSS, JS, icônes)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        // Mise à jour silencieuse en arrière-plan (stale-while-revalidate)
        fetch(req).then(res => {
          if (res.ok) caches.open(RUNTIME_CACHE).then(c => c.put(req, res.clone()));
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

