import { X, Download, HelpCircle, Shield, FileText, Cloud, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../i18n/languages';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { t, i18n } = useTranslation();
  const { canInstall, install } = usePWA();

  const handleInstall = async () => {
    await install();
    onClose();
  };

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem('comelo_language', langCode);
  };

  const currentLanguage = getLanguageByCode(i18n.language);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl z-50 animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">
              {t('menu.title')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={24} className="text-neutral-600" />
            </button>
          </div>

          {canInstall && (
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                {t('menu.tools')}
              </h3>
              <button
                onClick={handleInstall}
                className="w-full flex items-center gap-4 p-4 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <Download size={20} className="text-neutral-700" />
                <span className="text-neutral-900 font-medium">
                  {t('menu.installApp')}
                </span>
              </button>
            </section>
          )}

          <section className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              {t('menu.settings')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 px-4">
                <Globe size={20} className="text-neutral-700" />
                <span className="flex-1 text-neutral-900 font-medium">
                  {t('menu.language')}
                </span>
                <div className="w-8 h-6 flex items-center justify-center bg-neutral-100 rounded text-xs font-bold text-neutral-700 border border-neutral-300">
                  {currentLanguage.flag}
                </div>
              </div>

              <div className="pl-12 space-y-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                      currentLanguage.code === lang.code ? 'bg-neutral-50' : ''
                    }`}
                  >
                    <span className="text-sm text-neutral-700">{lang.name}</span>
                    {currentLanguage.code === lang.code && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              {t('menu.information')}
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-neutral-100 rounded-xl transition-colors">
                <HelpCircle size={20} className="text-neutral-700" />
                <span className="text-neutral-900 font-medium">
                  {t('menu.supportCenter')}
                </span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-neutral-100 rounded-xl transition-colors">
                <Shield size={20} className="text-neutral-700" />
                <span className="text-neutral-900 font-medium">
                  {t('menu.privacyPolicy')}
                </span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-neutral-100 rounded-xl transition-colors">
                <FileText size={20} className="text-neutral-700" />
                <span className="text-neutral-900 font-medium">
                  {t('menu.termsOfService')}
                </span>
              </button>
            </div>
          </section>

          <button className="w-full flex items-center justify-center gap-3 p-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            <Cloud size={20} />
            <span>{t('menu.connectDropbox')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
