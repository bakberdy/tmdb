const apiKey = 'c4c06d05d28a577ed7881fc04d189e98';

const searchMovies = async (query) => {
    if (!query) return [];
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const data = await response.json();
    return data.results;
};

document.getElementById('searchInput').addEventListener('input', async (event) => {
    const query = event.target.value;
    const suggestions = await searchMovies(query);
    displayMovies(suggestions);
});

const fetchMovies = async () => {
    const sortBy = document.getElementById('sort').value;
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortBy}`);
    const data = await response.json();
    displayMovies(data.results);
};

const displayMovies = (movies) => {
    const movieContainer = document.getElementById('movieGrid');
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path ? movie.poster_path : '/default_poster_path.jpg'}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>${movie.release_date}</p>
                `;
        movieCard.addEventListener('click', () => fetchMovieDetails(movie.id));
        movieContainer.appendChild(movieCard);
    });
};

const fetchMovieDetails = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`);
    const movie = await response.json();
    showMovieModal(movie);
};

const showMovieModal = (movie) => {
    const modal = document.getElementById('movieModal');
    modal.innerHTML = `
                <h2>${movie.title}</h2>
                <p>${movie.overview}</p>
                <p>Rating: ${movie.vote_average}</p>
                <p>Runtime: ${movie.runtime} mins</p>
                <h3>Cast</h3>
                ${movie.credits.cast.slice(0, 5).map(actor => `<p>${actor.name}</p>`).join('')}
                <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
            `;
    modal.classList.add('active');
    document.getElementById('overlay').classList.add('active');
};

const closeModal = () => {
    document.getElementById('movieModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
};

const addToWatchlist = (movieId, movieTitle, moviePosterPath) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.some(movie => movie.id === movieId)) {
        watchlist.push({ id: movieId, title: movieTitle, poster_path: moviePosterPath });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${movieTitle} has been added to your watchlist!`);
    } else {
        alert(`${movieTitle} is already in your watchlist!`);
    }
};


fetchMovies();