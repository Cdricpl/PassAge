/* ============================================================
   Pass'âge — Enregistrement du service worker
   Externalisé pour permettre une CSP sans 'unsafe-inline' (scripts).
   ============================================================ */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      reg.update();
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }).catch(() => {});
  });
}
