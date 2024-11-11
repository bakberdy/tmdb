const loadWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const watchlistContainer = document.getElementById('watchlist');
    watchlistContainer.innerHTML = '';
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = '<p style="text-align:center; color:#333;">Your watchlist is empty.</p>';
    } else {
        watchlist.forEach(movie => {
            watchlistContainer.innerHTML += `
                        <div class="movie-item" onclick="fetchMovieDetails(${movie.id})">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path ? movie.poster_path : '/default_poster_path.jpg'}" alt="${movie.title}">
                            <div class="movie-title">${movie.title}</div>
                            <div class="movie-actions">
                                <button onclick="event.stopPropagation(); removeFromWatchlist(${movie.id})">Remove</button>
                            </div>
                        </div>
                    `;
        });
    }
};

const removeFromWatchlist = (movieId) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    loadWatchlist();
};

const fetchMovieDetails = async (movieId) => {
    const apiKey = 'YOUR_TMDB_API_KEY';
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
            `;
    modal.classList.add('active');
    document.getElementById('overlay').classList.add('active');
};

const closeModal = () => {
    document.getElementById('movieModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
};

// Load watchlist when the page is loaded
document.addEventListener('DOMContentLoaded', loadWatchlist);
