// On install - caching the application shell
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('sw-cache').then(function(cache) {
      // cache any static files that make up the application shell
      return cache.add('/index.html');
    })
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.delete('sw-cache'))
})
// On network request
self.addEventListener('fetch', function(event) {

  let request = event.request,
    acceptHeader = request.headers.get('Accept');

  if (acceptHeader.indexOf('text/html') !== -1) {
    event.respondWith(
      // Try the cache
      caches.match(event.request).then(function(response) {
        //If response found return it, else fetch again
        return response || fetch(event.request);
      })
    );
  }

})
