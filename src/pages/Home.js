import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchTopRated,
    fetchTrending,
    fetchUpcoming,
    searchMovies,
} from '../api';
import { MovieContext } from '../context/MovieContext';

function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [visibleTrending, setVisibleTrending] = useState(8);
  const [visibleTopRated, setVisibleTopRated] = useState(8);
  const [visibleUpcoming, setVisibleUpcoming] = useState(8);

  const navigate = useNavigate();
  const { favorites, toggleFavorite, setLastSearch } = useContext(MovieContext);

  // Load last search term from localStorage on component mount
  useEffect(() => {
    const lastSearchTerm = localStorage.getItem('lastSearch');
    if (lastSearchTerm) {
      setQuery(lastSearchTerm);
      handleSearch(lastSearchTerm); // Fetch results for last search term
    }

    // Fetch the initial movie data (trending, top rated, upcoming)
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
  }, []);

  // Handle search and store search term in localStorage
  const handleSearch = async (searchTerm = query) => {
    localStorage.setItem('lastSearch', searchTerm);  // Store the search term in localStorage
    setLastSearch(searchTerm);  // Update context with the search term
    const data = await searchMovies(searchTerm, 1);  // Fetch search results
    setSearchResults(data.results || []);
  };

  const renderMovies = (movies) => (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="300"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie.id}`)}
              sx={{ cursor: 'pointer' }}
            />
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating: {movie.vote_average}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                color={favorites.some((fav) => fav.id === movie.id) ? 'secondary' : 'primary'}
                onClick={() => toggleFavorite(movie)}
              >
                {favorites.some((fav) => fav.id === movie.id)
                  ? '★ Remove Favorite'
                  : '☆ Add to Favorites'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderSection = (title, movies, visibleCount, setVisibleCount) => (
    <Box my={5}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      {renderMovies(movies.slice(0, visibleCount))}
      {visibleCount < movies.length && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setVisibleCount((prev) => prev + 8)}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Container sx={{ py: 5 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={() => handleSearch()}>
          Search
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={() => navigate('/favorites')}
        >
          My Favorites
        </Button>
      </Box>

      {query && searchResults.length === 0 ? (
        <Typography variant="h6" align="center">No results found</Typography>
      ) : query ? (
        renderSection('Search Results', searchResults, searchResults.length, () => {})
      ) : (
        <>
          {renderSection('Trending Movies', trending, visibleTrending, setVisibleTrending)}
          {renderSection('Top Rated', topRated, visibleTopRated, setVisibleTopRated)}
          {renderSection('Upcoming', upcoming, visibleUpcoming, setVisibleUpcoming)}
        </>
      )}
    </Container>
  );
}

export default Home;
