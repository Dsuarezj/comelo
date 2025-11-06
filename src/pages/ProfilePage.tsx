import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Text from '../elements/Text';

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <Layout
      headerProps={{
        title: t('profile.title'),
        showBackButton: true
      }}
    >
      <div className="px-6 pt-8">
        <Text variant="body" color="muted">
          {t('profile.comingSoon')}
        </Text>
      </div>
    </Layout>
  );
}
