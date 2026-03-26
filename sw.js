const CACHE_NAME = 'maas-hesap-v5';

// Tüm yerel sayfaları listeye ekledik
const assets = [
  './',
  './index.html',
  './script.js',
  './manifest.json',
  './tes.html',
  './sosyal.html',
  './enf.html',
  './sozlesme.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (event.request.method === 'GET') {
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || new Response("İnternet bağlantısı gerekli.", {
            status: 404,
            statusText: "Offline"
          });
        });
      })
  );
});
