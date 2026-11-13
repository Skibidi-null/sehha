// Offline support: app shell cached on install, exercise photos cached the first time they're viewed.
const V = 'sehha-20261113180809';
const SHELL = ['./', 'index.html', 'app.js', 'style.css', 'manifest.webmanifest', 'exdb.json', 'icons/icon-180.png', 'icons/icon-192.png', 'fonts/grotesk.woff2', 'fonts/grotesk-ext.woff2', 'fonts/mono.woff2', 'fonts/naskh.ttf'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => {
    if (r.ok) { const cp = r.clone(); caches.open(V).then((c) => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match('index.html'))));
});
