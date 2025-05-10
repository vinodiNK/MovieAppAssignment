import { createContext, useEffect, useState } from 'react';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [lastSearch, setLastSearch] = useState('');

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    const storedSearch = localStorage.getItem('lastSearch');
    if (storedSearch) {
      setLastSearch(storedSearch);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <MovieContext.Provider
      value={{ favorites, toggleFavorite, lastSearch, setLastSearch }}
    >
      {children}
    </MovieContext.Provider>
  );
};
