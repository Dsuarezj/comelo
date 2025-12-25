import { X, Download, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PWAInstallPromptProps {
  showBanner: boolean;
  showIOSModal: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export default function PWAInstallPrompt({
  showBanner,
  showIOSModal,
  onInstall,
  onDismiss,
}: PWAInstallPromptProps) {
  const { t } = useTranslation();

  if (!showBanner) {
    return null;
  }

  if (showIOSModal) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-surface rounded-t-3xl w-full p-6 pb-8 animate-slide-up">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              {t('pwa.installIOS.title')}
            </h3>
            <button
              onClick={onDismiss}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-neutral-500 mb-6">
            {t('pwa.installIOS.description')}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="bg-secondary-100 rounded-full p-2 h-fit">
                <Share size={20} className="text-secondary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 mb-1">
                  {t('pwa.installIOS.step1')}
                </p>
                <p className="text-sm text-neutral-500">
                  {t('pwa.installIOS.step1Description')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary-100 rounded-full p-2 h-fit">
                <Download size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 mb-1">
                  {t('pwa.installIOS.step2')}
                </p>
                <p className="text-sm text-neutral-500">
                  {t('pwa.installIOS.step2Description')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-full py-3 px-4 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
          >
            {t('pwa.installIOS.gotIt')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 animate-slide-up">
      <div className="bg-surface rounded-2xl p-4 shadow-lg border border-neutral-200">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-2 flex-shrink-0">
            <Download size={20} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900 mb-1">
              {t('pwa.install.title')}
            </p>
            <p className="text-sm text-neutral-500 mb-3">
              {t('pwa.install.description')}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onInstall}
                className="py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                {t('pwa.install.install')}
              </button>
              <button
                onClick={onDismiss}
                className="py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                {t('pwa.install.later')}
              </button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
