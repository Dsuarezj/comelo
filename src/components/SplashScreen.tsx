import { useTranslation } from 'react-i18next';

export default function SplashScreen() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 px-6 max-w-md text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
        </div>

        <p className="text-gray-600 text-base leading-relaxed">
          {t('splash.adSpace')}
        </p>
      </div>
    </div>
  );
}
