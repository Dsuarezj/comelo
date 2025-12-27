import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProviders, useSplashInit } from './contexts';
import HomePage from './pages/HomePage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage';
import RecipesPage from './pages/RecipesPage';
import CreateListPage from './pages/CreateListPage';
import SearchRecipesPage from './pages/SearchRecipesPage';
import PlanWeekPage from './pages/PlanWeekPage';
import OnboardingPage from './pages/OnboardingPage';
import PWAUpdateBanner from './components/PWAUpdateBanner';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import { usePWA } from './hooks/usePWA';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { LocalStorageService, StorageKeys } from './utils/storage';
import { sessionService } from './services/SessionService';
import { translationService } from './services/TranslationService';
import './i18n';

const SPLASH_MIN_DURATION = 1_500;

async function initializeApp() {
  await sessionService.init();
  await translationService.warmVersions();
  await translationService.preloadEssentials();
}

function AppContent() {
  const { hasUpdate, reloadForUpdate } = usePWA();
  const { isOnline, wasOffline } = useNetworkStatus();
  const location = useLocation();
  const hasOnboarding = LocalStorageService.get<boolean>(StorageKeys.HAS_ONBOARDING, false);

  useSplashInit(SPLASH_MIN_DURATION, initializeApp);

  if (!hasOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <>
      <PWAUpdateBanner show={hasUpdate} onUpdate={reloadForUpdate} />
      <NetworkStatusBanner isOnline={isOnline} wasOffline={wasOffline} />
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
