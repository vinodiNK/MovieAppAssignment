const API_KEY = '5bdd13d82455ab36162c20d3e63cfd14'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';


export const fetchTrending = async () => {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch trending movies: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in fetchTrending:", error.message);
    throw error;
  }
};

export const fetchTopRated = async () => {
  try {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch top-rated movies: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in fetchTopRated:", error.message);
    throw error;
  }
};

export const fetchUpcoming = async () => {
  try {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch upcoming movies: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in fetchUpcoming:", error.message);
    throw error;
  }
};

export const searchMovies = async (query, page = 1, filterQuery = '') => {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}${filterQuery}`;
  console.log("Fetching URL:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch search results: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in searchMovies:", error.message);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    if (!res.ok) {
      throw new Error(`Failed to fetch movie details: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getMovieDetails:", error.message);
    throw error;
  }
};

// Add getGenres function to fetch movie genres
export const getGenres = async () => {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch genres: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getGenres:", error.message);
    throw error;
  }
};