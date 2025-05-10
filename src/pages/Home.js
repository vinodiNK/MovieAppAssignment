import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    MenuItem,
    Select,
    Slider,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    discoverMovies,
    fetchTopRated,
    fetchTrending,
    fetchUpcoming,
    getGenres,
    searchMovies,
} from '../api';
import { MovieContext } from '../context/MovieContext';

function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [visibleTrending, setVisibleTrending] = useState(8);
  const [visibleTopRated, setVisibleTopRated] = useState(8);
  const [visibleUpcoming, setVisibleUpcoming] = useState(8);
  const [visibleFilteredMovies, setVisibleFilteredMovies] = useState(8);
  const [visibleSearchResults, setVisibleSearchResults] = useState(8);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();
  const { favorites, toggleFavorite, setLastSearch } = useContext(MovieContext);

  useEffect(() => {
    const loadInitialData = async () => {
      const lastSearchTerm = localStorage.getItem('lastSearch');
      if (lastSearchTerm) {
        setQuery(lastSearchTerm);
        handleSearch(lastSearchTerm);
      }

      const [trendData, topData, upData, genreData] = await Promise.all([
        fetchTrending(),
        fetchTopRated(),
        fetchUpcoming(),
        getGenres(),
      ]);
      setTrending(trendData.results || []);
      setTopRated(topData.results || []);
      setUpcoming(upData.results || []);
      setGenres(genreData);
    };

    loadInitialData();
  }, []);

  const handleSearch = async (searchTerm = query) => {
    localStorage.setItem('lastSearch', searchTerm);
    setLastSearch(searchTerm);
    const data = await searchMovies(searchTerm, 1);
    setSearchResults(data.results || []);
  };

  const handleFilter = async () => {
    const data = await discoverMovies({
      genreId: selectedGenre,
      year: selectedYear,
      rating,
    });
    setFilteredMovies(data.results || []);
  };

  const renderMovies = (movies) => (
    <Grid container spacing={3} justifyContent="center">
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: 250, // Set a fixed width
                maxWidth: 250, // Ensure it doesn't stretch beyond this width
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                onClick={() => navigate(`/movie/${movie.id}`)}
                sx={{
                  cursor: 'pointer',
                  objectFit: 'cover', // Ensure the image covers the space and doesn't stretch
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
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
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const renderFilterControls = () => (
    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" mb={4}>
      <Select
        displayEmpty
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <MenuItem value="">All Genres</MenuItem>
        {genres.map((g) => (
          <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
        ))}
      </Select>

      <Select
        displayEmpty
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <MenuItem value="">All Years</MenuItem>
        {Array.from({ length: 25 }, (_, i) => {
          const year = 2025 - i;
          return <MenuItem key={year} value={year}>{year}</MenuItem>;
        })}
      </Select>

      <Box width={200}>
        <Typography gutterBottom>Minimum Rating: {rating}</Typography>
        <Slider
          value={rating}
          min={0}
          max={10}
          step={0.5}
          onChange={(e, value) => setRating(value)}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={handleFilter}>
        Apply Filters
      </Button>
    </Box>
  );

  const renderLoadMoreButton = (category, setVisibleCount, visibleCount) => (
    category.length > visibleCount && (
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setVisibleCount((prev) => prev + 8)}
        >
          Load More
        </Button>
      </Box>
    )
  );

  return (
    <Container sx={{ py: 5 }}>
      <Box display="flex" justifyContent="center" mb={2}>
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
          My Favorites ({favorites.length})
        </Button>
      </Box>

      {renderFilterControls()}

      {query && searchResults.length === 0 ? (
        <Typography variant="h6" align="center">No results found</Typography>
      ) : query ? (
        <>
          <Typography variant="h4" gutterBottom>Search Results</Typography>
          {renderMovies(searchResults.slice(0, visibleSearchResults))}
          {renderLoadMoreButton(searchResults, setVisibleSearchResults, visibleSearchResults)}
        </>
      ) : filteredMovies.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>Filtered Movies</Typography>
          {renderMovies(filteredMovies.slice(0, visibleFilteredMovies))}
          {renderLoadMoreButton(filteredMovies, setVisibleFilteredMovies, visibleFilteredMovies)}
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>Trending Movies</Typography>
          {renderMovies(trending.slice(0, visibleTrending))}
          {renderLoadMoreButton(trending, setVisibleTrending, visibleTrending)}

          <Typography variant="h4" gutterBottom>Top Rated Movies</Typography>
          {renderMovies(topRated.slice(0, visibleTopRated))}
          {renderLoadMoreButton(topRated, setVisibleTopRated, visibleTopRated)}

          <Typography variant="h4" gutterBottom>Upcoming Movies</Typography>
          {renderMovies(upcoming.slice(0, visibleUpcoming))}
          {renderLoadMoreButton(upcoming, setVisibleUpcoming, visibleUpcoming)}
        </>
      )}
    </Container>
  );
}

export default Home;
