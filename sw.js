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

self.addEventListener('install', function(event) {
  console.log('Service worker installed!');
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/', 
        'style.css',
        'script.js',
        'manifest.json',
        // Add any other static files you need 
        'who-mgrs-data/wfh-boys-zscore-expanded-tables.csv',
        'who-mgrs-data/wfh-girls-zscore-expanded-tables.csv',
        'who-mgrs-data/lhfa-boys-zscore-expanded-tables.csv',
        'who-mgrs-data/lhfa-girls-zscore-expanded-tables.csv' // Cache WHO data files
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
      // If not in cache, fetch from network (if available)
      return fetch(event.request).then(function(response) {
        // Clone the response so we can cache it
        const responseClone = response.clone(); 
        console.log('Fetched from network:', event.request.url);
        caches.open('v1').then(function(cache) {
          cache.put(event.request, responseClone); 
        });
        return response;
      }).catch(function(error) {
        // If there's an error fetching from the network, return a basic offline page
        console.error('Request failed:', error);
        return caches.match('/offline.html'); 
      });
    })
  );
});
