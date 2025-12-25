import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PWAUpdateBannerProps {
  show: boolean;
  onUpdate: () => void;
}

export default function PWAUpdateBanner({ show, onUpdate }: PWAUpdateBannerProps) {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
      <div className="bg-surface rounded-2xl p-4 shadow-lg border-2 border-secondary-500">
        <div className="flex items-start gap-3">
          <div className="bg-secondary-100 rounded-xl p-2 flex-shrink-0">
            <RefreshCw size={20} className="text-secondary-600" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900 mb-1">
              {t('pwa.update.title')}
            </p>
            <p className="text-sm text-neutral-500 mb-3">
              {t('pwa.update.description')}
            </p>

            <button
              onClick={onUpdate}
              className="py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              {t('pwa.update.reload')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
