/**
 * KURMAGRAM VEDIC VILLAGE — SERVICE WORKER REGISTRATION & OFFLINE INDICATOR
 */

(function () {
  'use strict';

  // 1. Service Worker Registration
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          // Success
        })
        .catch((err) => {
          console.warn('SW registration skipped:', err);
        });
    });
  }

  // 2. Offline / Online Status Toast Indicator
  function updateOnlineStatus() {
    const offlineBadge = document.getElementById('offlineNoticeBadge');
    if (!offlineBadge) return;

    if (!navigator.onLine) {
      offlineBadge.classList.add('visible');
    } else {
      offlineBadge.classList.remove('visible');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  document.addEventListener('DOMContentLoaded', updateOnlineStatus);
})();
