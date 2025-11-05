import { ShoppingList } from '../types';
import { ListItem } from '../components';
import { List as ListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ListSectionProps {
  lists: ShoppingList[];
  onListClick: (id: string) => void;
}

export default function ListSection({ lists, onListClick }: ListSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {lists.map((list) => (
        <ListItem
          key={list.id}
          title={list.name}
          subtitle={t('lists.itemsCount', { count: list.items.length })}
          icon={ListIcon}
          iconBgColor="bg-blue-100 text-blue-600"
          onClick={() => onListClick(list.id)}
        />
      ))}
    </div>
  );
}
