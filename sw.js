const CACHE_NAME = 'maas-hesap-v3';
const assets = [
  'index.html',
  'script.js',
  'manifest.json',
  'tes.html',
  'sosyal.html'
];

// Yükleme aşamasında dosyaları önbelleğe al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// ERR_FAILED hatasını önlemek için güvenli strateji
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // İnternet varsa güncel dosyayı cache'e de at
        if (event.request.method === 'GET') {
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // İnternet yoksa veya hata varsa cache'den getir
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || new Response("İnternet bağlantısı gerekli.", {
            status: 404,
            statusText: "Not Found"
          });
        });
      })
  );
});
