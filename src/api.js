// src/api.js
import axios from 'axios';

const API_KEY = '5bdd13d82455ab36162c20d3e63cfd14'; // Replace with your actual TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrending = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  return res.data;
};

export const fetchTopRated = async () => {
  const res = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  return res.data;
};

export const fetchUpcoming = async () => {
  const res = await axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  return res.data;
};

export const searchMovies = async (query, page = 1) => {
  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
      page,
    },
  });
  return res.data;
};

export const getMovieDetails = async (movieId) => {
  const res = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`);
  return res.data;
};

export const getGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return res.data.genres;
};

export const discoverMovies = async ({ genreId, year, rating }) => {
  const res = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId || '',
      primary_release_year: year || '',
      'vote_average.gte': rating || '',
      sort_by: 'popularity.desc',
    },
  });
  return res.data;
};
