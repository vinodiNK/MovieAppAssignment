// src/pages/Favorites.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import './PageStyles.css';

function Favorites() {
  const { favorites, toggleFavorite } = useContext(MovieContext);
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="container">
        <h2>Your Favorite Movies</h2>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>You haven't added any favorites yet.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Favorite Movies</h2>
      <div className="movie-grid">
        {favorites.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
            <p className="movie-title">
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </p>
            <p>Rating: {movie.vote_average}</p>
            <button onClick={() => toggleFavorite(movie)}>★ Remove Favorite</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
