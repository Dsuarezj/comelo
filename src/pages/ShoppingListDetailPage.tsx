import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ShoppingList } from '../types';
import { shoppingListService } from '../services/ShoppingListService';

export default function ShoppingListDetailPage() {
  const { listId } = useParams<{ listId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, [listId]);

  const loadList = async () => {
    if (!listId) {
      navigate('/shopping-lists');
      return;
    }

    try {
      const foundList = await shoppingListService.getListById(listId);
      if (foundList) {
        setList(foundList);
      } else {
        navigate('/shopping-lists');
      }
    } catch {
      navigate('/shopping-lists');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout
        headerProps={{
          title: t('common.loading'),
          showBackButton: true
        }}
      >
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <p className="text-neutral-500">
            {t('common.loading')}
          </p>
        </div>
      </Layout>
    );
  }

  if (!list) {
    return null;
  }

  return (
    <Layout
      headerProps={{
        title: list.name,
        showBackButton: true
      }}
    >
      <div className="px-6 pt-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          {list.name}
        </h3>

        {list.items.length === 0 ? (
          <p className="text-neutral-500">
            {t('lists.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {list.items.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-lg p-4 shadow-sm border border-neutral-200 flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  className="w-5 h-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  readOnly
                />
                <div className="flex-1">
                  <p className={`text-neutral-900 ${item.completed ? 'line-through text-neutral-400' : ''}`}>
                    {item.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
