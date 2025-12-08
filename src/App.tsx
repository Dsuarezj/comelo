import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { NavigationProvider } from './contexts/NavigationContext';
import HomePage from './pages/HomePage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage';
import RecipesPage from './pages/RecipesPage';
import ProfilePage from './pages/ProfilePage';
import PWAUpdateBanner from './components/PWAUpdateBanner';
import { usePWA } from './hooks/usePWA';
import './i18n';

function App() {
  const { hasUpdate, reloadForUpdate } = usePWA();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          registration.update();
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }
  }, []);

  return (
    <Router>
      <NavigationProvider>
        <PWAUpdateBanner show={hasUpdate} onUpdate={reloadForUpdate} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shopping-lists" element={<ShoppingListsPage />} />
          <Route path="/shopping-lists/:listId" element={<ShoppingListDetailPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </NavigationProvider>
    </Router>
  );
}

export default App;
