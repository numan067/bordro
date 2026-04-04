const CACHE_NAME = 'maas-hesap-v6';
const assets = [
  './',
  './index.html',
  './script.js',
  './manifest.json',
  './tes.html',
  './sosyal.html',
  './enf.html',
  './sozlesme.html',
  './icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

// Reklam banner'ının görünmesini sağlayan kritik fetch ayarı
self.addEventListener('fetch', event => {
  // Eğer istek bir görsel ise veya dış bir URL (coinpayu) ise direkt internetten çek
  if (event.request.url.includes('coinpayu.com')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
