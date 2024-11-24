const movies = document.querySelector('#movies');
const input = document.querySelector('#search__input');
const favouriteMoviesIndex = document.querySelector('#header-index');
const favouriteMovies = document.querySelector('.header__subtitle');
const favouriteMoviesList = document.querySelector('#modal');

const moviesStorage = JSON.parse(localStorage.getItem("movies")) || [];
let moviesArray = [];

let debounceTime = (() => {
    let timer = null;
    return (cb, ms) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(cb, ms);
    }
})()

function getMovies(inputValue) {
    fetch(`https://www.omdbapi.com/?apikey=5a1ce3c3&s=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayMovies(data, inputValue);
        })
        .catch(error => console.log(error));
}

function displayMovies(data, inputValue) {
    if(data.Search){
        movies.innerHTML = '';
        data.Search.forEach(movie => {
            const notFound = document.querySelector('.not-found');
            if(notFound){
                notFound.remove();
            }
            const movieCard = `<div class="movie">
                    <img 
                    src="${movie.Poster}" 
                    alt="${inputValue}" 
                    class="movie__poster"
                    />
                    <h3 class="movie__title">${movie.Title}</h3>
                    <p class="movie__year">Year: ${movie.Year}</p>
                    <p class="movie__type">Type: ${movie.Type}</p>
                    <div><i class="fa-duotone fa-solid fa-heart movie__favourite" id="movie__favourite"></i></div>
                </div>`
                movies.innerHTML += movieCard;
        });

    }else{
        movies.innerHTML = `<h2 class="not-found">Movies not found</h2>`;
    }
    const buttons = document.querySelectorAll('#movie__favourite');
    if (buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                addToFavourite(e);
                removeFromFavourite(button);
                button.style.color = 'red';
            })
        })
    }
}

function addToFavourite(e){
    const moviesList = {
        title: e.target.closest('.movie').querySelector('.movie__title').textContent,
        poster: e.target.closest('.movie').querySelector('.movie__poster').src,
        year: e.target.closest('.movie').querySelector('.movie__year').textContent,
        type: e.target.closest('.movie').querySelector('.movie__type').textContent,
    }
    console.log(localStorage);
    const movie = e.target.closest('.movie');
    const alreadyAdded = moviesArray.some(item => item.querySelector('.movie__title').textContent === movie.querySelector('.movie__title').textContent);
    if(!alreadyAdded){
        // moviesStorage.push(moviesList);
        localStorage.setItem("movies", JSON.stringify(moviesList));
        moviesArray.push(movie);
        console.log(moviesArray.length);
        favouriteMoviesIndex.innerHTML = moviesArray.length;
        favouriteMoviesList.innerHTML += movie.outerHTML;
    }else{
        alert('This movie is already in your favourites');
    }
    
}



function removeFromFavourite(){
    const movies = modal.querySelectorAll('.movie');
    movies.forEach(movie => {
        movie.addEventListener('click', (e) => {
            const modalRemove = movie.querySelectorAll('.movie__favourite');
            const movieToDelete = modalRemove[0].closest('.movie');
            const movieTitle = movie.querySelector('.movie__title').textContent;
            movieToDelete.remove();
            moviesArray = moviesArray.filter(item =>
                item.querySelector('.movie__title').textContent !== movieTitle
            );
            favouriteMoviesIndex.innerHTML = moviesArray.length;
        })
    })
    
}

function inputHandler(e){
    debounceTime(() => {
        const searchQuery = e.target.value.trim();
        if(searchQuery){
            getMovies(searchQuery);
        }
    }, 1000)
}

function openModal(){
    favouriteMoviesList.classList.toggle('modal--active');
}

favouriteMovies.addEventListener('click', openModal)
input.addEventListener('input', inputHandler);