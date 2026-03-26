const CACHE_NAME = 'maas-hesap-v1';
const assets = [
  './',
  './index.html',
  './script.js',
  './tes.html',
  './sosyal.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
