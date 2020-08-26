// API 
const url = 'https://api.football-data.org/';
const options = {
   headers: {
      'X-Auth-Token': '357cb42174964e989a55ce4058a14fa1'
   }
}

// blok kode yg akan di panggil jika fetch berhasil
function status(response) {
   if (response.status == 200) {
      // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
      return Promise.resolve(response);
   } else {
      console.log(`Error : ${response.status}`);
      // Method reject() akan membuat blok catch terpanggil
      return Promise.reject(new Error(response.statusText));
   }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
   return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
   // Parameter error berasal dari Promise.reject()
   console.log(`Error : ${error}`);
}

// fungsi untuk mengubah http menjadi https
function toHttps(url) {
   return url.replace(/^http:\/\//i, 'https://');
}

// Blok kode untuk memperbarui konten current matchday 
function updateDOMCurrentMatchday(currentMatchdaySchedule, currentMatchday) {
   // template html
   const html = `
   <div class="container">
      <h5 class="heading-1" id="currentMatchday">Pertandingan Matchday Ke-${currentMatchday}</h5>
      <div class="row" id="currentMatchdayContainer">
      ${currentMatchdaySchedule.map(match =>
      `<div class="col m6 s12">
            <div class="card">
               <div class="card-content">
                  <div class="match">
                     <div class="match__contra" id="matchContra">
                        <figure class="figure-club">
                           <p class="figure-club__name">${match.awayTeam.name}</p>
                           <small class="figure-club__vs">VS</small>
                           <p class="figure-club__name">${match.homeTeam.name}</p>
                        </figure>
                     </div>
                     <div class="match__info">
                        <h6 class="match__date">${match.utcDate.split('T')[0].replace(/-/g, '/')}</h6>
                        <p class="match__kickoff">${match.utcDate.split('T')[1].slice(0, -1)}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>`).join('')}
      </div>
   </div>`;

   // sisipkan template html ke dalam elemen yg id nya currentMatchday
   document.getElementById('currentMatchday').innerHTML = html;
}

// fungsi untuk memperbarui konten klasemen liga serie-A
function updateDOMstandings(standings, season) {
   // template html
   const html = `
   <div class="container">
      <div class="table" id="standingsContainer">
         <div class="table__header">
            <h5 class="heading-1">Klasemen Liga Serie-A</h5>
            <h6 class="sub-heading-1" id="season">Musim ${season}</h6>
         </div>
         <table class="highlight">
            <thead class="table__heading">
               <tr>
                  <th>Klub</th>
                  <th>M</th>
                  <th>M</th>
                  <th>S</th>
                  <th>K</th>
                  <th>Poin</th>
               </tr>
            </thead>
            <tbody id="tbodyStandings">
               ${standings.map(team => `
               <tr>
                  <td width="80%" class="td-club">
                     <p class="td-club__position">${team.position}</p>
                     <img src="${toHttps(team.team.crestUrl)}" alt="logo ${team.team.name}" class="td-club__img">
                     <h6 class="td-club__name">${team.team.name}</h6>
                  </td>
                  <td>${team.playedGames}</td>
                  <td>${team.won}</td>
                  <td>${team.draw}</td>
                  <td>${team.lost}</td>
                  <td>${team.points}</td>
               </tr>
               `).join('')}
            </tbody>
         </table>
      </div>
   </div>
   `;

   // sisipkan template html ke dalam elemen yg id nya sectionStandings
   document.getElementById('sectionStandings').innerHTML = html;
}

// memperbarui konten clubs
function updateDOMClubs(teams, season) {
   // template html
   const html = `
   <div class="container">
      <h5 class="heading-1" id="heading">Daftar Team Liga Serie-A</h5>
      <h6 class="sub-heading-1" id="season">Musim ${season}</h6>
      <div class="row">
         ${teams.map(team => `
         <div class="col s12 m6">
            <div class="club-card">
               <div class="club-card__header">
                  <img src="${toHttps(team.crestUrl)}" alt="logo ${team.name}" class="club-card__img">
               </div>
               <h4 class="club-card__title">${team.name}</h4>
               <div class="club-card__body">
                  <div class="club-card__info">
                     <h6>Stadium</h6>
                     <p>${team.venue}</p>
                  </div>
               </div>
               <div class="club-card__footer">
                  <a href="${team.website}" target="_blank" class="club-card__icon">
                     <i class="large material-icons">near_me</i>
                  </a>
                  <a href="./team.html?id=${team.id}" class="club-card__icon">
                     <i class="large material-icons">visibility</i>
                  </a>
                  <a href="#" class="club-card__icon icon-fav">
                     <i class="large material-icons" data-id="${team.id}">favorite</i>
                  </a>
               </div>
            </div>
         </div>`).join('')}
      </div>
   </div>`;

   // sisipkan template html ke dalam elemen yg id nya clubs
   document.getElementById('clubs').innerHTML = html;
}

// Blok kode untuk mendapatkan data jadwal pertandingan liga serie-A berdasarkan matchday saat ini / sekarang
function getCurrentMatchday(currentMatchday) {
   if ('caches' in window) {
      caches.match(`${url}v2/competitions/SA/matches?status=FINISHED`).then(response => {
         if (response) {
            response.json().then(data => {
               const matches = data.matches;
               const currentMatchdaySchedule = matches.filter(match => match.matchday == currentMatchday);
               // memanggil fungsi updateDOMCurrentMatchday untuk memperbarui konten pertandingan matchday saat ini
               updateDOMCurrentMatchday(currentMatchdaySchedule, currentMatchday);
            })
         }
      })
   }

   fetch(`${url}v2/competitions/SA/matches?status=FINISHED`, options)
      .then(status)
      .then(json)
      .then(data => {
         const matches = data.matches;
         const currentMatchdaySchedule = matches.filter(match => match.matchday == currentMatchday);
         // memanggil fungsi updateDOMCurrentMatchday untuk memperbarui konten pertandingan matchday saat ini
         updateDOMCurrentMatchday(currentMatchdaySchedule, currentMatchday);
      })
      .catch(error);
}

// Blok kode untuk mendapatkan info matchday saat ini dari liga serie-A
function getInfoMatchday() {
   if ('caches' in window) {
      caches.match(`${url}v2/competitions/SA`).then(response => {
         if (response) {
            response.json().then(data => {
               const currentMatchday = data.currentSeason.currentMatchday;
               // memanggil fungsi getCurrentMatchday untuk mendapatkan data jadwal pertandingan liga serie-A berdasarkan matchday saat ini
               getCurrentMatchday(currentMatchday);
            })
         }
      })
   }

   fetch(`${url}v2/competitions/SA`, options)
      .then(status)
      .then(json)
      .then(data => {
         const currentMatchday = data.currentSeason.currentMatchday;
         // memanggil fungsi getCurrentMatchday untuk mendapatkan data jadwal pertandingan liga serie-A berdasarkan matchday saat ini
         getCurrentMatchday(currentMatchday);
      })
      .catch(error);
}

// Blok kode untuk mendapatkan data standings / klasemen liga serie-A
function getStandings() {
   if ('caches' in window) {
      caches.match(`${url}v2/competitions/SA/standings`).then(response => {
         if (response) {
            response.json().then(data => {
               const standings = data.standings[0].table;
               const startDate = data.season.startDate.split('-')[0];
               const endDate = data.season.endDate.split('-')[0];
               const season = `${startDate}-${endDate}`
               // memanggil fungsi updateDOMstandings untuk memperbarui konten klasemen
               updateDOMstandings(standings, season);
            })
         }
      })
   }

   fetch(`${url}v2/competitions/SA/standings`, options)
      .then(status)
      .then(json)
      .then(data => {
         const standings = data.standings[0].table;
         const startDate = data.season.startDate.split('-')[0];
         const endDate = data.season.endDate.split('-')[0];
         const season = `${startDate}-${endDate}`
         // memanggil fungsi updateDOMstandings untuk memperbarui konten klasemen
         updateDOMstandings(standings, season);
      })
      .catch(error);
}

// mendapatkan data semua team / club dari liga Serie-A
function getAllTeams() {
   if ('caches' in window) {
      caches.match(`${url}v2/competitions/SA/teams`).then(response => {
         if (response) {
            response.json().then(data => {
               const endDate = data.season.endDate.split('-')[0];
               const startDate = data.season.startDate.split('-')[0];
               const season = `${startDate}-${endDate}`;
               const teams = data.teams;
               // memanggil fungsi updateDOMClubs untuk memperbarui konten daftar team liga seriea
               updateDOMClubs(teams, season);
            })
         }
      })
   }

   fetch(`${url}v2/competitions/SA/teams`, options)
      .then(status)
      .then(json)
      .then(data => {
         const endDate = data.season.endDate.split('-')[0];
         const startDate = data.season.startDate.split('-')[0];
         const season = `${startDate}-${endDate}`;
         const teams = data.teams;
         // memanggil fungsi updateDOMClubs untuk memperbarui konten daftar team liga seriea
         updateDOMClubs(teams, season);
         // menseleksi semua button icon love / favorite
         const favoriteButtons = document.querySelectorAll('.icon-fav');
         // looping data favoriteButtons
         favoriteButtons.forEach(favBtn => {
            // kasih event listener untuk setiap button icon favorite
            favBtn.addEventListener('click', (e) => {
               e.preventDefault();
               // ambil data-id dari target button yg di-klik
               const idTeam = e.target.dataset.id;
               // filter teams yg id team nya sama dengan idTeam / data-id dari target button yg di-klik
               const team = teams.filter(team => team.id == idTeam)[0];
               // munculkan popup, apakah ingin menambahkan team ke favorite atau tidak
               if (confirm(`Tambahkan ${team.name} ke favorite?`)) {
                  addToFavorite(team);
               }
            })
         })
      })
      .catch(error);
}

// mendapatkan data team serie-A berdasarkan id
function getTeamById() {
   return new Promise((resolve, reject) => {
      // Ambil nilai query parameter (?id=)
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      if ('caches' in window) {
         caches.match(`${url}v2/teams/${id}`).then(response => {
            if (response) {
               response.json().then(data => {
                  const players = data.squad.filter(player => player.position !== null ? player.position : player.position = '-');
                  const currentYear = new Date().getFullYear();

                  // template html
                  const html = `
                  <div class="container">
                     <div class="row">
                        <div class="col s12 offset-l2 l8">
                           <div class="team team-card">
                              <div class="team-card__header">
                                 <img src="${toHttps(data.crestUrl)}" class="team__img" alt="logo ${data.name}">
                                 <h5 class="team__name">${data.name}</h5>
                              </div>
                              <div class="team-card__info">
                                 <div class="team__info">
                                    <i class="material-icons">location_on</i>
                                    <address>${data.address}</address>
                                 </div>
                                 <div class="team__info">
                                    <i class="material-icons">call</i>
                                    <p>${data.phone}</p>
                                 </div>
                                 <div class="team__info">
                                    <i class="material-icons">language</i>
                                    <p>${data.website}</p>
                                 </div>
                                 <div class="team__info">
                                    <i class="material-icons">email</i>
                                    <p>${data.email}</p>
                                 </div>
                              </div>
                              <div class="team-card__squad">
                                 <h5 class="team-card__title">Squad</h5>
                                 <table class="table-squad">
                                    <thead>
                                       <tr>
                                          <th class="th-name">Name</th>
                                          <th>Position</th>
                                          <th>Age</th>
                                          <th>Nationality</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       ${players.map(player => `
                                       <tr>
                                          <td class="td-player-name">${player.name}</td>
                                          <td>${player.position}</td>
                                          <td>${currentYear - (+player.dateOfBirth.split('-')[0])}</td>
                                          <td>${player.nationality}</td>
                                       </tr>`).join('')}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>`;

                  // sisipkan template html ke dalam elemen yg id nya rowDetail
                  document.getElementById('detailClub').innerHTML = html;
                  // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                  resolve(data);
               })
            }
         })
      }

      fetch(`${url}v2/teams/${id}`, options)
         .then(status)
         .then(json)
         .then(data => {
            const players = data.squad.filter(player => player.position !== null ? player.position : player.position = '-');
            const currentYear = new Date().getFullYear();

            // template html
            const html = `
            <div class="container">
               <div class="row">
                  <div class="col s12 offset-l2 l8">
                     <div class="team team-card">
                        <div class="team-card__header">
                           <img src="${toHttps(data.crestUrl)}" class="team__img" alt="logo ${data.name}">
                           <h5 class="team__name">${data.name}</h5>
                        </div>
                        <div class="team-card__info">
                           <div class="team__info">
                              <i class="material-icons">location_on</i>
                              <address>${data.address}</address>
                           </div>
                           <div class="team__info">
                              <i class="material-icons">call</i>
                              <p>${data.phone}</p>
                           </div>
                           <div class="team__info">
                              <i class="material-icons">language</i>
                              <p>${data.website}</p>
                           </div>
                           <div class="team__info">
                              <i class="material-icons">email</i>
                              <p>${data.email}</p>
                           </div>
                        </div>
                        <div class="team-card__squad">
                           <h5 class="team-card__title">Squad</h5>
                           <table class="table-squad">
                              <thead>
                                 <tr>
                                    <th class="th-name">Name</th>
                                    <th>Position</th>
                                    <th>Age</th>
                                    <th>Nationality</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 ${players.map(player => `
                                 <tr>
                                    <td class="td-player-name">${player.name}</td>
                                    <td>${player.position}</td>
                                    <td>${currentYear - (+player.dateOfBirth.split('-')[0])}</td>
                                    <td>${player.nationality}</td>
                                 </tr>`).join('')}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>`;

            // sisipkan template html ke dalam elemen yg id nya detailClub
            document.getElementById('detailClub').innerHTML = html;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
         })
         .catch(error);
   })
}

// mendapatkan semua team favorit yg tersimpan di indexed DB
function getFavoriteTeams() {
   getAll().then(teams => {
      let html = '';
      // cek apakah ada team yg disimpan di indexed DB
      if (teams.length == 0) {
         // jika tidak ada team yg disimpan di indexed DB
         html = `
         <div class="container">
            <h5 class="heading-1" id="heading">Belum ada team favorite :)</h5>
         </div> `;
      } else {
         // jika ada team yg disimpan di indexed DB
         html = `
         <div class="container">
            <h5 class="heading-1" id="heading">Daftar Team Favorite</h5>
            <div class="row" id="rowfavoritesContainer">
               ${teams.map(team => `
               <div class="col s12 m6">
                  <div class="club-card">
                     <div class="club-card__header">
                        <img src="${toHttps(team.crestUrl)}" alt="logo ${team.name}" class="club-card__img">
                     </div>
                     <h4 class="club-card__title">${team.name}</h4>
                     <div class="club-card__body">
                        <div class="club-card__info">
                           <h6>Stadium</h6>
                           <p>${team.venue}</p>
                        </div>
                     </div>
                     <div class="club-card__footer">
                        <a href="${team.website}" target="_blank" class="club-card__icon">
                           <i class="large material-icons">near_me</i>
                        </a>
                        <a href="./team.html?id=${team.id}&favorite=true" class="club-card__icon">
                           <i class="large material-icons">visibility</i>
                        </a>
                        <button type="button" class="club-card__icon btn-del" data-id="${team.id}" data-name="${team.name}">
                           <i class="large material-icons">delete</i>
                        </button>
                     </div>
                  </div>
               </div>`).join('')}
            </div>
         </div>`;
      }
      // Sisipkan template html ke dalam elemen yang id nya #favorite
      document.getElementById('favorite').innerHTML = html;

      // menseleski semua btn delete
      const btnDeletes = document.querySelectorAll('.btn-del');
      btnDeletes.forEach(btn => {
         // ambil attribute data-id & name dari tiap2 btn delete
         const id = +btn.getAttribute('data-id');
         const name = btn.getAttribute('data-name');
         // element parent dari btn delete yaitu col s12 m6
         const currentCol = btn.parentElement.parentElement.parentElement;
         // menambahkan event listener untuk tiap2 btn delete
         btn.addEventListener('click', () => {
            // munculkan confirm sekaligus melakukan pengecekan pada confirm
            if (confirm(`Hapus ${name} dari favorite?`)) {
               // panggil fungsi deleteById untuk menghapus team dari favorite berdasarkan id jika user memilih confirm yes
               deleteById(id, name)
               // hapus column
               currentCol.remove();
            }
         });
      });
   })
}

