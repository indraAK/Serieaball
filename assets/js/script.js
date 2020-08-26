// Periksa Service Worker
if ('serviceWorker' in navigator) {
   registerServiceWorker();
   requestPermission();
} else {
   console.log('Browser ini tidak mendukung service worker');
}

// Fungsi untuk registrasi service worker
function registerServiceWorker() {
   navigator.serviceWorker.register('/service-worker.js')
      .then((resgistration) => console.log('Pendaftaran service worker berhasil!'))
      .catch((err) => console.log(`Pendaftaran service worker gagal ${err}`))
}

// Fungsi untuk Meminta ijin menggunakan Notification API
function requestPermission() {
   // Periksa fitur Notification API
   if ("Notification" in window) {
      Notification.requestPermission().then(result => {
         if (result == 'denied') {
            console.log('Fitur notifikasi tidak diijinkan.');
            return;
         } else if (result == 'default') {
            console.error('Pengguna menutup kotak dialog permintaan ijin.');
            return;
         } else {
            console.log('Notifikasi diijinkan!');
         }

         navigator.serviceWorker.ready.then(() => {
            if ('PushManager' in window) {
               navigator.serviceWorker.getRegistration().then(registration => {
                  registration.pushManager.subscribe({
                     userVisibleOnly: true,
                     applicationServerKey: urlBase64ToUint8Array('BC-CBiM4CjDvh6Q2dsLOj1bsEsiYiKEgxXpB-izmNTYxrRa9k2PQkvJJkvHfQyZSInVJqkSShZCZGHen-w17IxU')
                  }).then(subscribe => {
                     console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                     console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('p256dh')))));
                     console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('auth')))));
                  }).catch(e => {
                     console.error('Tidak dapat melakukan subscribe ', e.message);
                  })
               })
            }
         });
      })
   } else {
      console.error("Browser tidak mendukung notifikasi.");
   }
}

// fungsi untuk mengubah string menjadi uint8array
function urlBase64ToUint8Array(base64String) {
   const padding = '='.repeat((4 - base64String.length % 4) % 4);
   const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

   const rawData = window.atob(base64);
   const outputArray = new Uint8Array(rawData.length);
   for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
   }

   return outputArray;
}