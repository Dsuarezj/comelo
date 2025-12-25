import { Plus, ClipboardList, ChefHat, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Layout from '../components/Layout';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { usePWA } from '../hooks/usePWA';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ActionCard({ icon, title, description, onClick }: ActionCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-sm border border-neutral-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-primary-600">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
        </div>
        <button
          onClick={onClick}
          className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showInstallPrompt, showIOSInstructions, install, dismissPrompt } = usePWA();

  return (
    <Layout customHeader={<Header />}>
      <PWAInstallPrompt
        showBanner={showInstallPrompt}
        showIOSModal={showIOSInstructions}
        onInstall={install}
        onDismiss={dismissPrompt}
      />
      <div className="px-6 pt-8 pb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-3">
          {t('home.greeting')}
        </h1>
        <p className="text-neutral-600 leading-relaxed mb-10">
          {t('home.subtitle')}
        </p>

        <div className="space-y-4">
          <ActionCard
            icon={<ClipboardList size={28} strokeWidth={1.5} />}
            title={t('home.createList.title')}
            description={t('home.createList.description')}
            onClick={() => navigate('/create-list')}
          />

          <ActionCard
            icon={<ChefHat size={28} strokeWidth={1.5} />}
            title={t('home.searchRecipes.title')}
            description={t('home.searchRecipes.description')}
            onClick={() => navigate('/search-recipes')}
          />

          <ActionCard
            icon={<CalendarDays size={28} strokeWidth={1.5} />}
            title={t('home.planWeek.title')}
            description={t('home.planWeek.description')}
            onClick={() => navigate('/plan-week')}
          />
        </div>
      </div>
    </Layout>
  );
}
