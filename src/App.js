import { createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetail from './pages/MovieDetail';
import Signup from './pages/Signup';

function App() {
   // State to track the current theme mode (light or dark)
  const [mode, setMode] = useState('light');

  // Create MUI theme with dynamic color based on mode
  const theme = createTheme({
    palette: {
      mode: mode, // 'light' or 'dark'
    },
  });

  // Toggle theme mode
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Store the current theme in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Store the mode in localStorage whenever it changes
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  
  return (
    <MovieProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </MovieProvider>
  );
}

export default App;
