import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { Text } from '../elements';

export default function ListsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <div className="px-6 pt-8">
        <Text variant="h1" className="mb-4">
          {t('lists.title')}
        </Text>
        <Text variant="body" color="muted">
          {t('lists.comingSoon')}
        </Text>
      </div>
    </div>
  );
}
