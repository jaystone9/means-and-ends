const C='me-1795675489';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
 e.waitUntil(self.registration.showNotification(d.title||'Gus here',{body:d.body||'One lesson. That is all I ask. That and a fry.',icon:'icons/icon-192.png',badge:'icons/badge-96.png',tag:'me-remind',data:{url:'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w)return w.focus()}return clients.openWindow('./')}))});
// When the push service drops or rotates a signup, sign up again right away; the app saves the new one next time it opens.
self.addEventListener('pushsubscriptionchange',e=>{e.waitUntil((async()=>{try{const o=e.oldSubscription&&e.oldSubscription.options;if(o&&o.applicationServerKey)await self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:o.applicationServerKey})}catch(x){}})())});
// Network first so a new version shows up at once; the cache is the offline fallback. Fonts are cached too.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);const font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(u.origin!==self.location.origin&&!font)return;
 if(font){e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const cp=r.clone();caches.open(C+'-f').then(c=>c.put(e.request,cp)).catch(()=>{});return r})));return}
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{})}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||caches.match('index.html'))))});
