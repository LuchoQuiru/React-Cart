let CACHE_NAME = 'my-site-cache-v1';  
const urlsToCache = [
'/index.html',
//'/ofertas',
'/productos',
'/carrito',
'/pedidos',
];


self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            //console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;     // if valid response is found in cache return it
          } else {
            return fetch(event.request)     //fetch from internet
              .then(function(res) {
                return caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());    //save the response for future
                    return res;   // return the fetched data
                  })
              })
              .catch(function(err) {       // fallback mechanism
                /*return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                  .then(function(cache) {
                    return cache.match('/offline.html');
                  });*/
                return fetch(event.request);
              });
          }
        })
    );
  });
  
self.addEventListener('push', e => {
    const data = e.data.json()
    self.registration.showNotification(data.title,{
        body: data.message 
    })
})

