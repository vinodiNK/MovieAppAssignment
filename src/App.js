import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetail from './pages/MovieDetail';
import Signup from './pages/Signup';


function App() {
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
