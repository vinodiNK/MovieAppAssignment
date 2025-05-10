import { createContext, useEffect, useState } from 'react';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [lastSearch, setLastSearch] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === movie.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prevFavorites, movie];
      }
    });
  };

  return (
    <MovieContext.Provider value={{ lastSearch, setLastSearch, favorites, toggleFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};
