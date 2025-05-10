import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api';
import './PageStyles.css';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      const data = await getMovieDetails(id);
      setMovie(data);
    };
    loadMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p><strong>Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      {movie.videos.results[0] && (
        <a href={`https://www.youtube.com/watch?v=${movie.videos.results[0]?.key}`} target="_blank" rel="noreferrer">
          Watch Trailer
        </a>
      )}
    </div>
  );
}

export default MovieDetail;