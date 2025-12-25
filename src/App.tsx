import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './contexts/NavigationContext';
import HomePage from './pages/HomePage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage';
import RecipesPage from './pages/RecipesPage';
import CreateListPage from './pages/CreateListPage';
import SearchRecipesPage from './pages/SearchRecipesPage';
import PlanWeekPage from './pages/PlanWeekPage';
import PWAUpdateBanner from './components/PWAUpdateBanner';
import SplashScreen from './components/SplashScreen';
import { usePWA } from './hooks/usePWA';
import { LocalStorageService, StorageKeys } from './utils/storage';
import { sessionService } from './services/SessionService';
import './i18n';

function App() {
  const { hasUpdate, reloadForUpdate } = usePWA();
  const [showSplash, setShowSplash] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const splashShown = LocalStorageService.get(StorageKeys.SPLASH_SHOWN, false);
    
    if (!splashShown) {
      setShowSplash(true);
    } else {
      initializeServices().then(() => {
        setIsInitialized(true);
      }).catch(() => {
        setIsInitialized(true);
      });
    }
  }, []);

  const initializeServices = async () => {
    try {
      await sessionService.init();
    } catch (error) {
      console.error('Error inicializando servicios:', error);
    }
  };

  const handleSplashComplete = () => {
    LocalStorageService.set(StorageKeys.SPLASH_SHOWN, true);
    setShowSplash(false);
    setIsInitialized(true);
  };

  if (showSplash) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        backgroundTask={initializeServices}
        minDuration={1500}
      />
    );
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <Router>
      <NavigationProvider>
        <PWAUpdateBanner show={hasUpdate} onUpdate={reloadForUpdate} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shopping-lists" element={<ShoppingListsPage />} />
          <Route path="/shopping-lists/:listId" element={<ShoppingListDetailPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/create-list" element={<CreateListPage />} />
          <Route path="/search-recipes" element={<SearchRecipesPage />} />
          <Route path="/plan-week" element={<PlanWeekPage />} />
        </Routes>
      </NavigationProvider>
    </Router>
  );
}

export default App;
