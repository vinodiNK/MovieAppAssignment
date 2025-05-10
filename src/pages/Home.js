import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTopRated, fetchTrending, fetchUpcoming, searchMovies } from '../api';
import { MovieContext } from '../context/MovieContext';
import './Home.css';
import './PageStyles.css';

function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const navigate = useNavigate();
  const { favorites, toggleFavorite, setLastSearch } = useContext(MovieContext);

  useEffect(() => {
    const loadInitialMovies = async () => {
      const [trendData, topData, upData] = await Promise.all([
        fetchTrending(),
        fetchTopRated(),
        fetchUpcoming(),
      ]);
      setTrending(trendData.results || []);
      setTopRated(topData.results || []);
      setUpcoming(upData.results || []);
    };

    loadInitialMovies();

    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
      setQuery(lastSearch);
      handleSearch(lastSearch);
    }
  }, []);

  const handleSearch = async (searchTerm = query) => {
    localStorage.setItem('lastSearch', searchTerm);
    setLastSearch(searchTerm);
    const data = await searchMovies(searchTerm, 1);
    setSearchResults(data.results || []);
  };

  const renderMovieSection = (title, movies) => (
    <div className="section">
      <h2>{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
            <p className="movie-title">
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </p>
            <p>Rating: {movie.vote_average}</p>
            <button onClick={() => toggleFavorite(movie)}>
              {favorites.some((fav) => fav.id === movie.id)
                ? '★ Remove Favorite'
                : '☆ Add to Favorites'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button onClick={() => handleSearch()}>Search</button>
        <Link to="/favorites" className="favorites-link">★ My Favorites</Link>
      </div>

      {query && searchResults.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Not this movie</p>
      ) : query ? (
        renderMovieSection('Search Results', searchResults)
      ) : (
        <>
          {renderMovieSection('Trending Movies', trending)}
          {renderMovieSection('Top Rated', topRated)}
          {renderMovieSection('Upcoming', upcoming)}
        </>
      )}
    </div>
  );
}

export default Home;
