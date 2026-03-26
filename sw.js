// Önbellek adını her güncellemede değiştirmek (v1, v2...) tarayıcının yeni dosyaları çekmesini sağlar.
const CACHE_NAME = 'maas-hesap-v4';

// Uygulamanın hafızasına alınacak tüm dosyalar
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

// 1. Kurulum: Dosyaları tarayıcı hafızasına (Cache) yükle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dosyalar önbelleğe alınıyor...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // Yeni versiyonun hemen aktif olmasını sağlar
});

// 2. Aktivasyon: Eski önbellekleri temizle
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

// 3. Veri Getirme (Fetch): ERR_FAILED hatasını önleyen strateji
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // İnternet varsa dosyayı getir ve önbelleği güncelle
        if (event.request.method === 'GET') {
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // İnternet yoksa veya bağlantı koptuysa hafızadaki (Cache) dosyayı göster
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || new Response("Sayfa şu an çevrimdışı.", {
            status: 404,
            statusText: "Offline Mode"
          });
        });
      })
  );
});
