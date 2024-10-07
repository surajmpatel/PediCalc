self.addEventListener('install', function(event) {
  console.log('Service worker installed!');
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/', // Cache the main page
        'style.css', // Cache CSS
        'script.js', // Cache JavaScript
        'manifest.json' // Cache the manifest
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Fetching resource:', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found in cache:', event.request.url);
        return response;
      }
      return fetch(event.request).then(function(response) {
        console.log('Fetched from network:', event.request.url);
        return response;
      });
    })
  );
});
