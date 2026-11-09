/* 林克的解題冒險 — 離線快取。只清自己的舊快取（quest-），不動其他遊戲的。更新時 build.py 的 VER 加一。 */
var CACHE='quest-v1';
var FILES=['./','./index.html','./gen.js?v=1','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./fonts/round.woff2'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('quest-')===0&&k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;var u=new URL(e.request.url);if(u.origin!==location.origin)return;
  if(u.pathname.indexOf('/quest/')!==0&&u.pathname!=='/quest')return; /* 只管自己的資料夾 */
  if(/\.cfg$/.test(u.pathname))return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(function(r){if(r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put('./index.html',cp)})}return r}).catch(function(){return caches.match('./index.html')}));return}
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(x){if(x.ok){var cp=x.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp)})}return x})}))});
