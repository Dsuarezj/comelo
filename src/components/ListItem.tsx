import { ArrowRight, LucideIcon } from 'lucide-react';
import Text from '../elements/Text';

import Badge from '../elements/Badge';
import Card from '../elements/Card';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  badge?: string;
  onClick?: () => void;
  showArrow?: boolean;
}

export default function ListItem({
  title,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-100',
  badge,
  onClick,
  showArrow = true,
}: ListItemProps) {
  return (
    <Card
      onClick={onClick}
      padding="sm"
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`${iconBgColor} rounded-lg p-2`}>
            <Icon size={20} className="text-current" />
          </div>
        )}
        <div>
          <Text variant="body" className="font-medium">
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" color="muted">
              {subtitle}
            </Text>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && <Badge variant="info">{badge}</Badge>}
        {showArrow && <ArrowRight size={20} className="text-gray-400" />}
      </div>
    </Card>
  );
}
