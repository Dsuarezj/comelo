import { X, Download, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../elements/Button';
import Card from '../elements/Card';
import Text from '../elements/Text';

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
  if (!showBanner) {
    return null;
  }

  if (showIOSModal) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-white rounded-t-3xl w-full p-6 pb-8 animate-slide-up">
          <div className="flex justify-between items-start mb-4">
            <Text variant="h3">{useTranslation().t('pwa.installIOS.title')}</Text>
            <button
              onClick={onDismiss}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <Text variant="body" color="muted" className="mb-6">
            {useTranslation().t('pwa.installIOS.description')}
          </Text>

          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="bg-secondary-100 rounded-full p-2 h-fit">
                <Share size={20} className="text-secondary-600" />
              </div>
              <div>
                <Text variant="body" className="font-medium mb-1">
                  {useTranslation().t('pwa.installIOS.step1')}
                </Text>
                <Text variant="small" color="muted">
                  {useTranslation().t('pwa.installIOS.step1Description')}
                </Text>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary-100 rounded-full p-2 h-fit">
                <Download size={20} className="text-primary-600" />
              </div>
              <div>
                <Text variant="body" className="font-medium mb-1">
                  {useTranslation().t('pwa.installIOS.step2')}
                </Text>
                <Text variant="small" color="muted">
                  {useTranslation().t('pwa.installIOS.step2Description')}
                </Text>
              </div>
            </div>
          </div>

          <Button variant="secondary" fullWidth onClick={onDismiss}>
            {useTranslation().t('pwa.installIOS.gotIt')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
      <Card padding="md" className="shadow-lg">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-2 flex-shrink-0">
            <Download size={20} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <Text variant="body" className="font-semibold mb-1">
              {useTranslation().t('pwa.install.title')}
            </Text>
            <Text variant="small" color="muted" className="mb-3">
              {useTranslation().t('pwa.install.description')}
            </Text>

            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={onInstall}>
                {useTranslation().t('pwa.install.install')}
              </Button>
              <Button variant="secondary" size="sm" onClick={onDismiss}>
                {useTranslation().t('pwa.install.later')}
              </Button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </Card>
    </div>
  );
}
