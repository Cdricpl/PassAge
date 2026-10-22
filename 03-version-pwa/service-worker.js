/* ============================================================
   Pass'âge — Service Worker
   Stratégie : app shell pre-cached + cache-first pour les assets,
   network-first pour le HTML (avec fallback offline).
   ============================================================ */

const VERSION = 'v-2026-10-22-1103';
const SHELL_CACHE = `passage-shell-${VERSION}`;
const RUNTIME_CACHE = `passage-runtime-${VERSION}`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/styles.css?v=2026-10-22-1103',
  './assets/js/app.js?v=2026-10-22-1103',
  './assets/js/content.js?v=2026-10-22-1103',
  './assets/js/sw-register.js?v=2026-10-22-1103',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/icons/logo-sfa.jpg',
  './assets/policy.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const activation = (async () => {
    const keys = await caches.keys();
    const old = keys.filter(k => ![SHELL_CACHE, RUNTIME_CACHE].includes(k));
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    return old.some(k => k.startsWith('passage-'));   // vrai = mise à jour, pas 1re installation
  })();
  event.waitUntil(activation);
  // Mise à jour : on recharge toutes les fenêtres ouvertes pour que chacun
  // passe à la nouvelle version sans devoir fermer l'app — y compris les
  // pages qui tournent encore avec l'ancien code. Les notes sont sauvegardées
  // à chaque frappe : rien n'est perdu.
  // Important : APRÈS l'activation, hors waitUntil. Le rechargement passe par
  // ce service worker, qui ne répond qu'une fois activé : l'attendre dans
  // waitUntil bloquerait les deux.
  activation.then(async (isUpdate) => {
    if (!isUpdate) return;
    const wins = await self.clients.matchAll({ type: 'window' });
    wins.forEach(c => c.navigate(c.url).catch(() => {}));
  });
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return;

  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            event.waitUntil(caches.open(RUNTIME_CACHE).then(c => c.put(req, clone)));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then(c => c || caches.match('./index.html'))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        event.waitUntil(
          fetch(req).then(res => {
            if (res.ok) return caches.open(RUNTIME_CACHE).then(c => c.put(req, res.clone()));
          }).catch(() => {})
        );
        return cached;
      }
      return fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          event.waitUntil(caches.open(RUNTIME_CACHE).then(c => c.put(req, clone)));
        }
        return res;
      }).catch(() => Response.error()); // pas de fallback HTML pour une image/un script : mieux vaut un échec net
    })
  );
});
