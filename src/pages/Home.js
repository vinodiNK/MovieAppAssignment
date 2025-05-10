import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { fetchTrending, searchMovies } from '../api';
import './PageStyles.css';

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrending = async () => {
      const data = await fetchTrending();
      setMovies(data.results);
    };
    loadTrending();
  }, []);

  const handleSearch = async () => {
    const data = await searchMovies(query, 1);
    setMovies(data.results);
    setPage(2);
    setHasMore(data.page < data.total_pages);
  };

  const fetchMoreData = async () => {
    const data = await searchMovies(query, page);
    setMovies((prev) => [...prev, ...data.results]);
    setPage(page + 1);
    setHasMore(data.page < data.total_pages);
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies..." />
        <button onClick={handleSearch}>Search</button>
      </div>

      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              <p className="movie-title">{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
              <p>Rating: {movie.vote_average}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Home;