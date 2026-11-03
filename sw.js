const CACHE='vita-hero-20261103-v3';
const FILES=['./','./index.html','./styles.css','./theme.css','./brand.css','./icons.css','./release.css','./app.js','./clinical.js','./referencias.html','./references.js','./review.css','./manifest.webmanifest','./assets/vita-mascot.png','./assets/vita-logo.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>/^(vita-|medcalc-|clinica-)/.test(k)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)))}return r}).catch(()=>caches.match(e.request).then(r=>r||Response.error())))});
