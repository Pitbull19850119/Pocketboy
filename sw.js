// PocketBoy Service Worker: immer zuerst die neueste Version aus dem Netz holen,
// offline auf die gespeicherte Kopie zurückfallen. So sind Updates automatisch – ohne Daten zu löschen.
const CACHE = 'pocketboy-app';
const LOCAL = ['./', 'index.html', 'emu.html', 'manifest.json', 'icon.png', 'noise.png', 'demo.gb'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL)).catch(()=>{})); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // fremde Server (Emulator-Kern, Cover) nicht anfassen
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
