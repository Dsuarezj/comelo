import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Text from '../elements/Text';

export default function ShoppingListsPage() {
  const { t } = useTranslation();

  return (
    <Layout
      headerProps={{
        title: t('lists.title'),
        showBackButton: true
      }}
    >
      <div className="px-6 pt-8">
        <Text variant="body" color="muted">
          {t('lists.comingSoon')}
        </Text>
      </div>
    </Layout>
  );
}
