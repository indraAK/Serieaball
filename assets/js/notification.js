// fungsi untuk menampilkan notifikasi ketika ada tambah / hapus data
function showNotification(titleText, messageText) {
   const title = titleText;
   const options = {
      body: messageText,
      icon: './assets/images/icon_192x192.png',
      badge: './assets/images/icon_192x192.png',
      requireInteraction: true,
      data: {
         dateOfArrival: Date.now(),
         primaryKey: 1
      }
   }

   if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
         registration.showNotification(title, options);
      })
   } else {
      console.log('Fitur notifikasi tidak diijinkan');
   }
}