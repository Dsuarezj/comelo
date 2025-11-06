import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { NavigationProvider } from './components';
import HomePage from './pages/HomePage';
import ListsPage from './pages/ListsPage';
import RecipesPage from './pages/RecipesPage';
import ProfilePage from './pages/ProfilePage';
import './i18n';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <Router>
      <NavigationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </NavigationProvider>
    </Router>
  );
}

export default App;
