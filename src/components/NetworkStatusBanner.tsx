import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff, CheckCircle2, X } from 'lucide-react';

enum BannerStatus {
  Hidden = 'hidden',
  Showing = 'showing',
  Visible = 'visible',
  Dismissed = 'dismissed',
}

interface NetworkStatusBannerProps {
  isOnline: boolean;
  wasOffline: boolean;
}

export default function NetworkStatusBanner({ isOnline, wasOffline }: NetworkStatusBannerProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<BannerStatus>(BannerStatus.Hidden);

  useEffect(() => {
    if (!isOnline) {
      setStatus(BannerStatus.Showing);
      setTimeout(() => setStatus(BannerStatus.Visible), 10);
    } else if (wasOffline) {
      setStatus(BannerStatus.Showing);
      setTimeout(() => setStatus(BannerStatus.Visible), 10);
      const timer = setTimeout(() => {
        setStatus(BannerStatus.Showing);
        setTimeout(() => setStatus(BannerStatus.Hidden), 300);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setStatus(BannerStatus.Showing);
      setTimeout(() => setStatus(BannerStatus.Hidden), 300);
    }
  }, [isOnline, wasOffline]);

  const handleDismiss = () => {
    setStatus(BannerStatus.Showing);
    setTimeout(() => setStatus(BannerStatus.Dismissed), 300);
  };

  if (status === BannerStatus.Hidden || status === BannerStatus.Dismissed) {
    return null;
  }

  const isVisible = status === BannerStatus.Visible;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`mx-3 mt-2 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 text-xs font-medium ${
          !isOnline
            ? 'bg-neutral-900 text-white border border-neutral-800'
            : 'bg-[#5EE67E] text-neutral-900 border border-[#4dd66a]'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff size={14} className="flex-shrink-0" />
            <span className="flex-1 truncate">{t('network.offline.message')}</span>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-0.5 rounded hover:bg-white/20 transition-colors"
              aria-label={t('common.close')}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <CheckCircle2 size={14} className="flex-shrink-0" />
            <span className="flex-1 truncate">{t('network.online.message')}</span>
          </>
        )}
      </div>
    </div>
  );
}

