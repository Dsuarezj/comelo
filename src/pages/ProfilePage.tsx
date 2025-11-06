import { useTranslation } from 'react-i18next';
import { Header, Layout } from '../components';
import { Text } from '../elements';

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <Layout showHeader header={<Header />}>
      <div className="px-6 pt-8">
        <Text variant="h1" className="mb-4">
          {t('profile.title')}
        </Text>
        <Text variant="body" color="muted">
          {t('profile.comingSoon')}
        </Text>
      </div>
    </Layout>
  );
}
