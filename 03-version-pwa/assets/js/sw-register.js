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
      // L'app installée reste souvent ouverte en arrière-plan pendant des
      // jours : on revérifie à chaque retour au premier plan, et toutes les
      // 30 minutes tant qu'elle est affichée.
      const check = () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); };
      document.addEventListener('visibilitychange', check);
      setInterval(check, 30 * 60 * 1000);
    }).catch(() => {});
  });
}
