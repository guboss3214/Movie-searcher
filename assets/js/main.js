const movies = document.querySelector('#movies');
const input = document.querySelector('#search__input');
const favouriteMoviesIndex = document.querySelector('#header-index');
const favouriteMovies = document.querySelector('.header__subtitle');
const favouriteMoviesList = document.querySelector('#modal');

let moviesStorage = JSON.parse(localStorage.getItem("movies")) || [];

if (!Array.isArray(moviesStorage)) {
    moviesStorage = [];
    localStorage.setItem("movies", JSON.stringify(moviesStorage));
}

let debounceTime = (() => {
    let timer = null;
    return (cb, ms) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(cb, ms);
    }
})();

function getMovies(inputValue) {
    fetch(`https://www.omdbapi.com/?apikey=5a1ce3c3&s=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            displayMovies(data);
        })
        .catch(error => console.log(error));
}


function displayMovies(data) {
    if (data.Search) {
        movies.innerHTML = '';
        data.Search.forEach(movie => {
            const notFound = document.querySelector('.not-found');
            if (notFound) {
                notFound.remove();
            }
            const movieCard = generateMovieCard(movie);
            movies.innerHTML += movieCard;
        });
    } else {
        movies.innerHTML = `<h2 class="not-found">Movies not found</h2>`;
    }
    const buttons = document.querySelectorAll('#movie__favourite');
    if (buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                addToFavourite(e, button);;
            });
        });
    }

    const movieCards = document.querySelectorAll('.movie');
    movieCards.forEach(card => {
        const cardTitle = card.querySelector('.movie__title').textContent;
        const storedMovie = moviesStorage.find(movie => movie.Title === cardTitle);

        if (storedMovie && storedMovie.Favourite) {
            const heartIcon = card.querySelector('#movie__favourite');
            heartIcon.style.color = 'red';
        }
    });
}

function generateMovieCard(movie) {
    return `
        <div class="movie">
            <img src="${movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '..//assets//images//no-img.jpg'}" alt="${movie.Title}" class="movie__poster" />
            <h3 class="movie__title">${movie.Title}</h3>
            <p class="movie__year">${movie.Year}</p>
            <p class="movie__type">${movie.Type}</p>
            <div>
                <i class="fa-duotone fa-solid fa-heart movie__favourite" id="movie__favourite"></i>
            </div>
        </div>
    `;
}

function addToFavourite(e, button) {
    const movieObject = {
        Title: e.target.closest('.movie').querySelector('.movie__title').textContent,
        Poster: e.target.closest('.movie').querySelector('.movie__poster').src,
        Year: e.target.closest('.movie').querySelector('.movie__year').textContent,
        Type: e.target.closest('.movie').querySelector('.movie__type').textContent,
        Favourite:  true,
    };
    const alreadyAdded = moviesStorage.some(movie => movie.Title === movieObject.Title);

    if (!alreadyAdded) {
        button.style.color = 'red';
        moviesStorage.push(movieObject);
        localStorage.setItem("movies", JSON.stringify(moviesStorage));
        favouriteMoviesList.innerHTML += generateMovieCard(movieObject);
        favouriteMoviesIndex.textContent = moviesStorage.length;
    } else {
        alert('This movie is already in your favourites');
    }
}


function removeFromFavourite(e) {
    if (e.target.classList.contains('movie__favourite')) {
        const movieCard = e.target.closest('.movie');
        const movieTitle = movieCard.querySelector('.movie__title').textContent;

        moviesStorage = moviesStorage.filter(movie => movie.Title !== movieTitle);
        localStorage.setItem("movies", JSON.stringify(moviesStorage));

        for(let i = 0; i < moviesStorage.length; i++) {
            if(moviesStorage[i].Title === movieTitle){
                moviesStorage[i].Favourite = false;
            }
        }

        movieCard.remove();
        favouriteMoviesIndex.textContent = moviesStorage.length;

        const movieCards = document.querySelectorAll('.movie');
        movieCards.forEach(card => {
            const cardTitle = card.querySelector('.movie__title').textContent;
            
            if(cardTitle === movieTitle){
                const favBtn = card.querySelector('.movie__favourite');
                favBtn.style.color = 'white';
            }
        })
            
    }
}

function loadFavourites() {
    favouriteMoviesList.innerHTML = '';
    moviesStorage.forEach(movie => {
        favouriteMoviesList.innerHTML += generateMovieCard(movie);
    });
    favouriteMoviesIndex.textContent = moviesStorage.length;
}

function inputHandler(e) {
    debounceTime(() => {
        const searchQuery = e.target.value.trim();
        if (searchQuery) {
            getMovies(searchQuery);
        }
    }, 1000);
}

function openModal() {
    loadFavourites();
    favouriteMoviesList.classList.toggle('modal--active');
}

document.addEventListener('DOMContentLoaded', loadFavourites);
favouriteMovies.addEventListener('click', openModal);
favouriteMoviesList.addEventListener('click', removeFromFavourite);
input.addEventListener('input', inputHandler);


