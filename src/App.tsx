import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProviders } from './contexts';
import HomePage from './pages/HomePage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage';
import RecipesPage from './pages/RecipesPage';
import CreateListPage from './pages/CreateListPage';
import SearchRecipesPage from './pages/SearchRecipesPage';
import PlanWeekPage from './pages/PlanWeekPage';
import OnboardingPage from './pages/OnboardingPage';
import PWAUpdateBanner from './components/PWAUpdateBanner';
import { usePWA } from './hooks/usePWA';
import { LocalStorageService, StorageKeys } from './utils/storage';
import './i18n';

function AppContent() {
  const { hasUpdate, reloadForUpdate } = usePWA();
  const location = useLocation();
  const hasOnboarding = LocalStorageService.get<boolean>(StorageKeys.HAS_ONBOARDING, false);

  if (!hasOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <>
      <PWAUpdateBanner show={hasUpdate} onUpdate={reloadForUpdate} />
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/shopping-lists" element={<ShoppingListsPage />} />
        <Route path="/shopping-lists/:listId" element={<ShoppingListDetailPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/create-list" element={<CreateListPage />} />
        <Route path="/search-recipes" element={<SearchRecipesPage />} />
        <Route path="/plan-week" element={<PlanWeekPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Router>
        <AppContent />
      </Router>
    </AppProviders>
  );
}
