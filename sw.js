const CACHE_NAME = 'po-mahyu-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Proses Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Hapus cache lama kalau ada update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Biar API tetep jalan lancar (Network First)
self.addEventListener('fetch', event => {
  // Jangan cache request API POST ke Google Apps Script
  if (event.request.method === 'POST') {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
