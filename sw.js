const CACHE_NAME = 'quran-v1';
const urlsToCache = [
  '.',
  'index.html',
  'https://ui-avatars.com/api/?name=Q&background=0b1220&color=fbbf24&size=192',
  'https://ui-avatars.com/api/?name=Q&background=0b1220&color=fbbf24&size=512'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME && caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
