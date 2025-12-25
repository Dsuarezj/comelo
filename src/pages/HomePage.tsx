import { ListPlus, Search, CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ActionCard from '../components/ActionCard';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { usePWA } from '../hooks/usePWA';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showInstallPrompt, showIOSInstructions, install, dismissPrompt } = usePWA();

  return (
    <Layout showBottomNav={true}>
      <PWAInstallPrompt
        showBanner={showInstallPrompt}
        showIOSModal={showIOSInstructions}
        onInstall={install}
        onDismiss={dismissPrompt}
      />
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-3 text-center">
          {t('home.greeting')}
        </h1>
        <p className="text-neutral-600 leading-relaxed mb-10 text-center">
          {t('home.subtitle')}
        </p>

        <div className="space-y-4">
          <ActionCard
            icon={<ListPlus size={28} strokeWidth={1.5} />}
            title={t('home.createList.title')}
            description={t('home.createList.description')}
            onClick={() => navigate('/create-list')}
          />

          <ActionCard
            icon={<Search size={28} strokeWidth={1.5} />}
            title={t('home.searchRecipes.title')}
            description={t('home.searchRecipes.description')}
            onClick={() => navigate('/search-recipes')}
          />

          <ActionCard
            icon={<CalendarCheck size={28} strokeWidth={1.5} />}
            title={t('home.planWeek.title')}
            description={t('home.planWeek.description')}
            onClick={() => navigate('/plan-week')}
          />
        </div>
      </div>
    </Layout>
  );
}
