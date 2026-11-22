/**
 * KURMAGRAM VEDIC VILLAGE — SERVICE WORKER
 * Offline shell and asset caching for 100% resilient static browsing.
 */

const CACHE_NAME = 'kurmagram-shell-v1';

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'css/styles.css',
  'js/config.js',
  'js/motion.js',
  'js/app.js',
  'js/sw-register.js',
  'manifest.json',
  'assets/svg/logo.svg',
  'assets/svg/hero-landscape.svg',
  'assets/svg/products/sunni.svg',
  'assets/svg/products/anjan.svg',
  'assets/svg/products/verm.svg',
  'assets/svg/products/goark.svg',
  'assets/svg/products/pain.svg',
  'assets/svg/products/rice.svg',
  'assets/svg/products/sesame.svg',
  'assets/svg/products/groundnut.svg',
  'vendor/fonts/fonts.css',
  'vendor/qrcode.min.js',
  'vendor/gsap.min.js',
  'vendor/ScrollTrigger.min.js',
  'vendor/lenis.min.js',
  'vendor/fuse.min.js',
  'vendor/confetti.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some cache assets failed to fetch during install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset, fetch fresh copy in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Fallback for document navigation
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
