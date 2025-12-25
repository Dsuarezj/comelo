import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

export default function RecipesPage() {
  const { t } = useTranslation();

  return (
    <Layout
      headerProps={{
        title: t('recipes.title'),
        showBackButton: true
      }}
    >
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-neutral-500 text-center">
          {t('recipes.comingSoon')}
        </p>
      </div>
    </Layout>
  );
}
