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
import { usePWA } from './hooks/usePWA';
import './i18n';

function App() {
  const { hasUpdate, reloadForUpdate } = usePWA();

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
