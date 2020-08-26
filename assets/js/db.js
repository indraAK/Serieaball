const dbPromised = idb.open('serieaball', 1, (upgradeDb) => {
   if (!upgradeDb.objectStoreNames.contains('teams')) {
      upgradeDb.createObjectStore('teams')
   }
});

// blok fungsi untuk menambahkan team di indexed DB
function addToFavorite(team) {
   dbPromised
      .then(db => {
         const trx = db.transaction('teams', 'readwrite');
         const store = trx.objectStore('teams');
         store.put(team, team.id);
         return trx.complete;
      })
      .then(() => {
         M.toast({ html: `<span class="toast-success">${team.name} berhasil di tambahkan ke favorit</span>` });
         showNotification('Penambahan team favorit', `${team.name} telah berhasil di tambahkan ke favorit`);
      })
      .catch(() => {
         M.toast({ html: `${team.name} sudah di tambahkan ke favorite` });
      })
}

// blok fungsi untuk mendapatkan data team yang tersimpan di indexed DB
function getAll() {
   return new Promise((resolve, reject) => {
      dbPromised
         .then(db => {
            const trx = db.transaction('teams', 'readonly');
            const store = trx.objectStore('teams');
            return store.getAll();
         })
         .then(team => {
            resolve(team);
         })
   })
}

// fungsi untuk mendapatkan data team favorite berdasarkan id yang tersimpan di indexed DB
function getById(id) {
   return new Promise((resolve, reject) => {
      dbPromised
         .then(db => {
            const trx = db.transaction('teams', 'readonly');
            const store = trx.objectStore('teams');
            return store.get(+id);
         })
         .then(team => {
            resolve(team);
         })
   })
}

// fungsi untuk menghapus team dari favorite berdasarkan id
function deleteById(id, name) {
   dbPromised
      .then(db => {
         const trx = db.transaction('teams', 'readwrite');
         const store = trx.objectStore('teams');
         store.delete(id);
         return trx.complete;
      })
      .then(() => {
         M.toast({ html: `<span class="toast-success">${name} berhasil di hapus dari favorit` });
         showNotification('Penghapusan team favorit', `${name} telah berhasil di hapus dari favorit`);
      })
}
