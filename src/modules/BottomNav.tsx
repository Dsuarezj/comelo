import { Home, List, UtensilsCrossed, User, LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Text from '../elements/Text';

interface NavItem {
  path: string;
  icon: LucideIcon;
  labelKey: string;
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { path: '/', icon: Home, labelKey: 'nav.home' },
    { path: '/shopping-lists', icon: List, labelKey: 'nav.lists' },
    { path: '/recipes', icon: UtensilsCrossed, labelKey: 'nav.recipes' },
    { path: '/profile', icon: User, labelKey: 'nav.profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary-100 border-t border-primary-200 rounded-t-3xl shadow-lg z-50">
      <div className="flex justify-around items-center h-20 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2
                rounded-xl transition-all
                ${isActive ? 'text-neutral-900 scale-110' : 'text-neutral-600 hover:text-neutral-900'}
              `.trim().replace(/\s+/g, ' ')}
            >
              <Icon
                size={28}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <Text variant="caption" className="font-medium">
                {t(item.labelKey)}
              </Text>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
