const C='ems-v4';
const CDN=['cdnjs.cloudflare.com','cdn.jsdelivr.net','unpkg.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(C).then(x=>x.put(r,c)).catch(()=>{})}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(!/^https?:$/.test(u.protocol))return;
 if(u.hostname.includes('firebaseio.com')||u.hostname.includes('googleapis.com')&&u.pathname.includes('identitytoolkit')||u.hostname.includes('securetoken')||u.hostname.includes('firebasedatabase'))return;
 /* libraries and fonts: version is in the URL, so use the saved copy at once */
 if(CDN.includes(u.hostname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))));return}
 /* the app itself: show the saved copy immediately, refresh it in the background */
 if(u.origin===self.location.origin){const key=r.mode==='navigate'?new Request(new URL('./index.html',self.location).href):r;
  e.respondWith(caches.match(key,{ignoreSearch:true}).then(m=>{
   const net=fetch(r.mode==='navigate'?key:r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const old=m&&(m.headers.get('etag')||m.headers.get('last-modified')||m.headers.get('content-length')),nw=res.headers.get('etag')||res.headers.get('last-modified')||res.headers.get('content-length');
      if(m&&old&&nw&&old!==nw&&r.mode==='navigate')self.clients.matchAll().then(l=>l.forEach(c=>c.postMessage({type:'ems-updated'})));put(key,res.clone())}return res});
   if(m){e.waitUntil(net.catch(()=>{}));return m}
   return net.catch(()=>caches.match('./index.html').then(x=>x||caches.match('./')))}));return}
 e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return self.clients.openWindow('./')}))});
