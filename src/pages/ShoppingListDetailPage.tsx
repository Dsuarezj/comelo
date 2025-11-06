import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Text from '../elements/Text';
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
    } catch (error) {
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
        <div className="px-6 pt-8">
          <Text variant="body" color="muted">
            {t('common.loading')}
          </Text>
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
        <Text variant="h3" className="mb-4">
          {list.name}
        </Text>
        
        {list.items.length === 0 ? (
          <Text variant="body" color="muted">
            {t('lists.emptyList')}
          </Text>
        ) : (
          <div className="space-y-2">
            {list.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  className="w-5 h-5 rounded border-gray-300"
                  readOnly
                />
                <div className="flex-1">
                  <Text
                    variant="body"
                    className={item.completed ? 'line-through text-gray-400' : ''}
                  >
                    {item.name}
                  </Text>
                  <Text variant="caption" color="muted">
                    {item.quantity} {item.unit}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
