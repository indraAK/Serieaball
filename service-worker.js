importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {

   //  mendaftarkan aset yang digunakan untuk application shell ke dalam cache sebelum aplikasi ditampilkan.
   workbox.precaching.precacheAndRoute([
      { url: "/", revision: "1" },
      { url: "/index.html", revision: "1" },
      { url: "/team.html", revision: "1" },
      { url: "/manifest.json", revision: "1" },
      { url: "/push.js", revision: "1" },
      { url: "/assets/css/materialize.min.css", revision: "1" },
      { url: "/assets/css/style.css", revision: "1" },
      { url: "/assets/images/logo.png", revision: "1" },
      { url: "/assets/images/android-icon-192x192.png", revision: "1" },
      { url: "/assets/images/icon_512x512.png", revision: "1" },
      { url: "/assets/images/apple-icon.png", revision: "1" },
      { url: "/assets/images/favicon-32x32", revision: "1" },
      { url: "/assets/js/api.js", revision: "1" },
      { url: "/assets/js/materialize.min.js", revision: "1" },
      { url: "/assets/js/nav.js", revision: "1" },
      { url: "/assets/js/idb.js", revision: "1" },
      { url: "/assets/js/db.js", revision: "1" },
      { url: "/assets/js/notification.js", revision: "1" },
      { url: "/assets/js/script.js", revision: "1" },
      { url: "/assets/pages/home.html", revision: "1" },
      { url: "/assets/pages/clubs.html", revision: "1" },
      { url: "/assets/pages/favorite.html", revision: "1" },
      { url: "https://fonts.googleapis.com/icon?family=Material+Icons", revision: "1" },
      { url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&display=swap", revision: "1" },
      { url: "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2", revision: "1" },
   ],
      {
         ignoreUrlParametersMatching: [/.*/]
      }
   );

   // meyimpan cache Images
   workbox.routing.registerRoute(
      new RegExp(/\.(?:png|jpg|jpeg|svg)$/),
      workbox.strategies.cacheFirst({
         cacheName: 'images',
         plugins: [
            new workbox.expiration.Plugin({
               maxEntries: 60, // maks 60 berkas 
               maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            }),
         ],
      }),
   );

   // menyimpan cache Stylesheets
   workbox.routing.registerRoute(
      new RegExp('\.css$'),
      workbox.strategies.cacheFirst({
         cacheName: 'stylesheets',
         plugins: [
            new workbox.expiration.Plugin({
               maxEntries: 30 /* maks 30 berkas */,
               maxAgeSeconds: 60 * 60 * 24 * 30,
            })
         ]
      })
   );

   // menyimpan cache JavaScript
   workbox.routing.registerRoute(
      new RegExp('\.js$'),
      workbox.strategies.cacheFirst({
         cacheName: 'javascript',
         plugins: [
            new workbox.expiration.Plugin({
               maxEntries: 30 /* maks 30 berkas */,
               maxAgeSeconds: 60 * 60 * 24 * 30,
            })
         ]
      })
   );

   // menyimpan cache Pages
   workbox.routing.registerRoute(
      new RegExp('/pages/'),
      workbox.strategies.staleWhileRevalidate({
         cacheName: 'pages'
      })
   );

   // Menyimpan cache dari CSS Google Fonts
   workbox.routing.registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      workbox.strategies.staleWhileRevalidate({
         cacheName: 'google-fonts-stylesheets',
      })
   );

   // Menyimpan cache untuk file font selama 1 tahun
   workbox.routing.registerRoute(
      /^https:\/\/fonts\.gstatic\.com/,
      workbox.strategies.cacheFirst({
         cacheName: 'google-fonts-webfonts',
         plugins: [
            new workbox.cacheableResponse.Plugin({
               statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
               maxAgeSeconds: 60 * 60 * 24 * 365,
               maxEntries: 30,
            }),
         ],
      })
   );

   // Menyimpan cache API dari https://api.football-data.org/
   workbox.routing.registerRoute(
      new RegExp('https://api.football-data.org/'),
      workbox.strategies.staleWhileRevalidate({
         cacheName: 'api-football-data'
      })
   );

} else {
   console.log(`Boo! Workbox didn't load`);
}

// menambahkan event push
self.addEventListener('push', (event) => {
   let body;

   if (event.data) {
      body = event.data.text();
   } else {
      body = 'Push message no payload';
   }

   const options = {
      body: body,
      icon: '/assets/images/icon_192x192.png',
      vibrate: [100, 50, 100],
      data: {
         dateOfArrival: Date.now(),
         primaryKey: 1
      }
   }

   event.waitUntil(
      self.registration.showNotification('Testing Push Notification', options)
   )
})
