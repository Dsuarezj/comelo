import { useTranslation } from 'react-i18next';

export default function ListsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 px-6 pt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('lists.title')}
      </h1>
      <p className="text-gray-600">Próximamente: Vista completa de listas</p>
    </div>
  );
}
