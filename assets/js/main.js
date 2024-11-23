const movies = document.querySelector('.movies__container');


fetch('https://www.omdbapi.com/?apikey=5a1ce3c3&s=batman')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.Search){
            data.Search.forEach(movie => {
                const movieCard = `<div class="movie__card">
                        <img 
                        src="${movie.Poster}" 
                        alt="" 
                        class="movie__poster"
                        />
                        <h3 class="movie__title">${movie.Title}</h3>
                        <p class="movie__year">Year: ${movie.Year}</p>
                        <p class="movie__type">Type: ${movie.Type}</p>
                    </div>`
                    movies.innerHTML += movieCard;
            });

        }
    })
