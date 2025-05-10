import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import './PageStyles.css';

function Favorites() {
  const { favorites } = useContext(MovieContext);
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Your Favorite Movies</h2>
      <div className="movie-grid">
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          favorites.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;