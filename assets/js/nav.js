document.addEventListener('DOMContentLoaded', (event) => {
   // menseleksi semua elemen class nav__link / tautan menu
   const links = document.querySelectorAll('.nav-link');
   links.forEach(link => {
      // tambahkan event listener untuk setiap tautan menu
      link.addEventListener('click', e => {
         let pageTarget = 'home';

         // cek target elemen yg di-klik
         if (e.target.classList.contains('nav-link')) {
            pageTarget = e.target.getAttribute('href').substr(1);
            links.forEach(link => link.classList.remove('active')) // hapus semua class active pada nav__link
            e.target.classList.add('active'); // tambahkan class active pada target elemen yg di-klik
         } else {
            pageTarget = e.target.dataset.target.toLowerCase();
            links.forEach(link => link.classList.remove('active'))
            e.target.parentElement.classList.add('active');
         }

         // muat konten halaman yg di panggil
         loadPage(pageTarget);
      });
   });

   // Load page content
   let pageTarget = window.location.hash.substr(1);
   if (pageTarget == "") pageTarget = "home";
   loadPage(pageTarget);

   // fungsi untuk memuat halaman
   function loadPage(page) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
         if (this.readyState == 4) {
            const content = document.querySelector(".main-content");
            // periksa halaman
            if (page == 'home') {
               getInfoMatchday();
               getStandings();
            } else if (page == 'clubs') {
               getAllTeams();
               links.forEach(link => link.classList.remove('active'))
               links.forEach(link => link.getAttribute('href').includes(page) ? link.classList.add('active') : false);
            } else if (page == 'favorite') {
               getFavoriteTeams();
               links.forEach(link => link.classList.remove('active'))
               links.forEach(link => link.getAttribute('href').includes(page) ? link.classList.add('active') : false);
            }

            if (this.status == 200) {
               content.innerHTML = xhttp.responseText;
            } else if (this.status == 404) {
               content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
               content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
         }
      };
      xhttp.open("GET", `/assets/pages/${page}.html`, true);
      xhttp.send();
   }
});