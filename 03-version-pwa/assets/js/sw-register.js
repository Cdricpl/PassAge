/* ============================================================
   Pass'âge — Enregistrement du service worker
   Externalisé pour permettre une CSP sans 'unsafe-inline' (scripts).
   ============================================================ */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      // Un worker déjà en attente (onglet resté ouvert pendant une mise à jour)
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      // Un nouveau worker découvert pendant cette session
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            nw.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
      reg.update();
    }).catch(() => {});
  });
}
