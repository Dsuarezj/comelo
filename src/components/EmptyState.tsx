import { LucideIcon } from 'lucide-react';
import Text from '../elements/Text';

import Button from '../elements/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {Icon && (
        <div className="mb-4 p-4 bg-neutral-100 rounded-full">
          <Icon size={48} className="text-neutral-400" />
        </div>
      )}
      <Text variant="h3" className="mb-2">
        {title}
      </Text>
      {description && (
        <Text variant="body" color="muted" className="mb-6">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
