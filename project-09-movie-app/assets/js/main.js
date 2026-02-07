const API_KEY = '14a6fded69985064512e9a32925cdf9d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieWrapper = document.querySelector('.movie-container');
const searchInput = document.getElementById('home-movie-search');
const infoPanel = document.querySelector('.movie-info-panel');
const closePanel = document.querySelector('.close-panel');
const searchBtn = document.querySelector('.home-search-btn');

const navSearchInput = document.getElementById('nav-movie-search');
const searchDropdown = document.getElementById('search-results-dropdown');

const upcomingWrapper = document.getElementById('upcoming-movies-container');
const tagsEl = document.getElementById('tags-container');

const ticketWrapper = document.getElementById('ticket-wrapper');

let selectedGenre = []; // seçilen türlerin ID'leri tutulacak 

let currentPage = 1; //seçili sayfa
let totalPages = 1; //max sayfa
let lastUrl = ''; // hangi aramada kaldığımızı kaydeder

// sayfalama
const prevPage = document.querySelector('.bi-chevron-left').parentElement;
const nextPage = document.querySelector('.bi-chevron-right').parentElement;
const pageNum = document.querySelector('.page-num');

async function getMovies(url) {
    lastUrl = url;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
        showMovies(data.results);
        
        currentPage = data.page;
        
        totalPages = data.total_pages > 500 ? 485 : data.total_pages;
        
        pageNum.innerText = `${currentPage} / ${totalPages}`;
        
        prevPage.disabled = currentPage <= 1;
        nextPage.disabled = currentPage >= totalPages;

    } else {
        movieWrapper.innerHTML = `<h2>Üzgünüm knk, bir şeyler ters gitti...</h2>`;
    }
}

function showMovies(movies) {
    movieWrapper.innerHTML = '';

    movies.forEach(movie => {
        const { title, poster_path, vote_average, release_date, id } = movie;

        const movieCard = document.createElement("div");
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <a href="javascript:void(0)" class="movie-card-links" onclick="openDetails(${id})">
                <div class="image-box">
                    <img src="${poster_path ? IMG_URL + poster_path : 'assets/images/card.png'}" alt="${title}">
                    <div class="movie-rating">
                        <i class="bi bi-star-fill"></i> ${vote_average.toFixed(1)}
                    </div>
                </div>
                <div class="movie-card-text">
                    <h4 class="movie-card-title">${title}</h4>
                    <span class="movie-info">
                        <i class="bi bi-calendar-event"></i> ${release_date ? release_date.split('-')[0] : 'N/A'}
                    </span>
                </div>
            </a>
        `;

        movieWrapper.appendChild(movieCard);   
    });
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&language=tr-TR`;
            getMovies(searchUrl);
        } else {
            getMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`);
        };
    };
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm && searchTerm !== '') {
        getMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=tr-TR`);
    }
});

async function openDetails(id) {
    const movieRes = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
    const movieData = await movieRes.json();

    document.getElementById('panel-title').innerText = movieData.title;
    document.getElementById('panel-img').src = IMG_URL + movieData.poster_path;
    document.getElementById('panel-desc').innerText = movieData.overview;
    document.getElementById('panel-imdb').innerText = movieData.vote_average.toFixed(1);
    document.getElementById('panel-year').innerText = movieData.release_date.split('-')[0];
    
    infoPanel.style.display = 'flex';
}

closePanel.addEventListener('click', () => {
    infoPanel.style.display = 'none';
});

// navbar search input ile anlık olarak film aramayı ve filrtelemeyi ekledim
navSearchInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();

    if (searchTerm.length > 2) { 
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=tr-TR`);
        const data = await res.json();
        
        displayLiveResults(data.results.slice(0, 6)); 
    } else {
        searchDropdown.style.display = 'none';
    }
});

function displayLiveResults(results) {
    if (results.length === 0) {
        searchDropdown.style.display = 'none';
        return;
    }

    searchDropdown.innerHTML = results.map(movie => `
        <div class="result-item" onclick="openDetails(${movie.id})">
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/45x65'}" alt="${movie.title}">
            <div class="result-info">
                <h4>${movie.title}</h4>
                <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} • ⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
        </div>
    `).join('');

    searchDropdown.style.display = 'block';
}

document.addEventListener('click', (e) => {
    if (!navSearchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.style.display = 'none';
    }
});

async function getUpcomingMovies() {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=tr-TR&page=1`);
    const data = await res.json();
    
    const top5Upcoming = data.results.slice(0, 5);
    
    upcomingWrapper.innerHTML = ''; 

    top5Upcoming.forEach(movie => {
        const { poster_path, id, title } = movie;
        
        const card = document.createElement('div');
        card.classList.add('home-card');
        
        card.innerHTML = `
            <a href="javascript:void(0)" class="home-card" onclick="openDetails(${id})">
                <img src="${poster_path ? IMG_URL + poster_path : 'assets/images/home-card.png'}" alt="${title}">
                <div class="card-overlay">
                    <div class="overlay-content">
                        <i class="bi bi-play-circle-fill"></i>
                        <span>Detayları Gör</span>
                    </div>
                </div>
            </a>
        `;
        upcomingWrapper.appendChild(card);
    });
}

async function getGenres() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=tr-TR`);
    const data = await res.json();
    setGenres(data.genres);
}

function setGenres(genres) {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        
        t.addEventListener('click', () => {
            if(selectedGenre.includes(genre.id)){
                selectedGenre = selectedGenre.filter(id => id !== genre.id);
            } else {
                selectedGenre.push(genre.id);
            }
            
            getMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre.join(',')}&language=tr-TR`);
            
            highlightSelection();
        });
        tagsEl.appendChild(t);
    });
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('active');
        if(selectedGenre.includes(parseInt(tag.id))){
            tag.classList.add('active');
        }
    });
}

nextPage.addEventListener('click', () => {
    if (currentPage < totalPages) {
        pageCall(currentPage + 1);
    }
});

prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
        pageCall(currentPage - 1);
    }
});

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = new URLSearchParams(urlSplit[1]);
    queryParams.set('page', page);
    
    let newUrl = urlSplit[0] + '?' + queryParams.toString();
    getMovies(newUrl);
     
    //yumuşak kaydırma scrool efekti
    movieWrapper.scrollIntoView({ behavior: 'smooth' });
}

async function getTicketMovies() {
    // vizyondaki filmleri çekiyoruz
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=tr-TR&page=1`);
    const data = await res.json();
    
    // ilk 4 filmi bilet olarak gösteririz fazla kalabalık olmasın
    const movies = data.results.slice(0, 4);
    ticketWrapper.innerHTML = '';

    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview, release_date, id } = movie;
        
        // Rastgele seans saati ve salon simülasyonu
        const randomTime = ["14:30", "17:45", "20:00", "22:15"][Math.floor(Math.random() * 4)];
        const randomHall = Math.floor(Math.random() * 8) + 1;
        const randomPrice = (Math.random() * (15 - 10) + 10).toFixed(2); // 10$ - 15$ arası

        const ticketCard = document.createElement('div');
        ticketCard.classList.add('ticket-card');

        ticketCard.innerHTML = `
            <div class="ticket-img">
                <img src="${poster_path ? IMG_URL + poster_path : 'assets/images/home-card.png'}" alt="${title}">
                <div class="ticket-date">
                    <span class="day">${release_date.split('-')[2]}</span>
                    <span class="month">FEB</span>
                </div>
            </div>
            <div class="ticket-content">
                <div class="ticket-info-top">
                    <span class="genre">Şu an Vizyonda</span>
                    <div class="rating"><i class="bi bi-star-fill"></i> ${vote_average.toFixed(1)}</div>
                </div>
                <h3 class="ticket-movie-title">${title}</h3>
                <p class="ticket-desc">${overview.slice(0, 100)}...</p>

                <div class="ticket-details">
                    <div class="detail-item">
                        <i class="bi bi-geo-alt"></i>
                        <span>Salon ${randomHall}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-clock"></i>
                        <span class="ticket-clock">${randomTime}</span>
                    </div>
                </div>

                <div class="ticket-action">
                    <div class="price">$${randomPrice}</div>
                    <button class="buy-btn" onclick="openDetails(${id})">İncele & Al</button>
                </div>
            </div>
        `;
        ticketWrapper.appendChild(ticketCard);
    });
}

// Sayfa yüklendiğinde bunu da çalıştır
getUpcomingMovies();
getGenres();
getTicketMovies();


getMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`);