import { X, Download, HelpCircle, Shield, FileText, Cloud, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';
import { getLanguageByCode } from '../i18n/languages';
import { useState } from 'react';
import LanguageModal from './LanguageModal';
import MenuButton from './MenuButton';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  icon: typeof Download;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'highlighted';
  endContent?: React.ReactNode;
  showChevron?: boolean;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { t, i18n } = useTranslation();
  const { canInstall, install } = usePWA();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleInstall = async () => {
    await install();
    onClose();
  };

  const currentLanguage = getLanguageByCode(i18n.language);

  const sections: MenuSection[] = [
    ...(canInstall ? [{
      title: t('menu.tools'),
      items: [{
        icon: Download,
        label: t('menu.installApp'),
        onClick: handleInstall,
        variant: 'highlighted' as const
      }]
    }] : []),
    {
      title: t('menu.settings'),
      items: [{
        icon: Globe,
        label: t('menu.language'),
        onClick: () => setIsLanguageModalOpen(true),
        endContent: <span className="text-sm text-neutral-600">{currentLanguage.name}</span>,
        showChevron: true
      }]
    },
    {
      title: t('menu.information'),
      items: [
        {
          icon: HelpCircle,
          label: t('menu.supportCenter'),
          onClick: () => {}
        },
        {
          icon: Shield,
          label: t('menu.privacyPolicy'),
          onClick: () => {}
        },
        {
          icon: FileText,
          label: t('menu.termsOfService'),
          onClick: () => {}
        }
      ]
    }
  ];

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

              {sections.map((section, sectionIdx) => (
                <section key={sectionIdx} className="mb-6">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <MenuButton
                        key={itemIdx}
                        icon={item.icon}
                        label={item.label}
                        onClick={item.onClick}
                        variant={item.variant}
                        endContent={item.endContent}
                        showChevron={item.showChevron}
                      />
                    ))}
                  </div>
                </section>
              ))}

              <MenuButton
                icon={Cloud}
                label={t('menu.connectDropbox')}
                onClick={() => {}}
                variant="primary"
              />
            </div>
          </div>
        </>
      )}

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onLanguageSelected={onClose}
      />
    </>
  );
}
