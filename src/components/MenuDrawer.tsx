import { X, Download, HelpCircle, Shield, FileText, Cloud, Globe, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';
import { getLanguageByCode } from '../i18n/languages';
import { useState } from 'react';
import LanguageModal from './LanguageModal';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { t, i18n } = useTranslation();
  const { canInstall, install } = usePWA();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleInstall = async () => {
    await install();
    onClose();
  };

  const handleLanguageModalClose = () => {
    setIsLanguageModalOpen(false);
  };

  const currentLanguage = getLanguageByCode(i18n.language);

  if (!isOpen && !isLanguageModalOpen) return null;

  return (
    <>
      {!isLanguageModalOpen && (
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
                <button
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <Globe size={20} className="text-neutral-700" />
                  <span className="flex-1 text-left text-neutral-900 font-medium">
                    {t('menu.language')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">{currentLanguage.name}</span>
                    <ChevronRight size={20} className="text-neutral-400" />
                  </div>
                </button>
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
      )}

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={handleLanguageModalClose}
        onLanguageSelected={onClose}
      />
    </>
  );
}
