import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../elements/Button';
import Card from '../elements/Card';
import Text from '../elements/Text';

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
      <Card padding="md" className="shadow-lg border-2 border-blue-500">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-xl p-2 flex-shrink-0">
            <RefreshCw size={20} className="text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <Text variant="body" className="font-semibold mb-1">
              {t('pwa.update.title')}
            </Text>
            <Text variant="small" color="muted" className="mb-3">
              {t('pwa.update.description')}
            </Text>

            <Button variant="primary" size="sm" onClick={onUpdate}>
              {t('pwa.update.reload')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
