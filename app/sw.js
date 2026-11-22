const V='cf-399a153040';
const ARQ=["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png", "xlsx.full.min.js"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return Promise.all(ARQ.map(function(u){ return c.add(new Request(u,{cache:'reload'})).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET') return;
  var u=new URL(r.url);
  if(u.origin!==location.origin) return;
  e.respondWith((async function(){
    var c=await caches.open(V);
    var hit=await c.match(r,{ignoreSearch:true});
    var rede=fetch(r).then(function(res){ if(res && res.ok) c.put(r,res.clone()); return res; }).catch(function(){ return null; });
    if(hit){ e.waitUntil(rede); return hit; }
    var res=await rede;
    return res||Response.error();
  })());
});
