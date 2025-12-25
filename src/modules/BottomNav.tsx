import { useState } from 'react';
import { Home, ShoppingCart, UtensilsCrossed, Menu, LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuDrawer from '../components/MenuDrawer';

interface NavItem {
  path: string;
  icon: LucideIcon;
  labelKey: string;
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: '/', icon: Home, labelKey: 'nav.home' },
    { path: '/shopping-lists', icon: ShoppingCart, labelKey: 'nav.lists' },
    { path: '/recipes', icon: UtensilsCrossed, labelKey: 'nav.recipes' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-100 rounded-t-3xl z-40">
        <div className="flex items-center h-20 px-6 max-w-md mx-auto">
          <div className="flex justify-around items-center flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex flex-col items-center justify-center gap-1 px-4 py-2
                    rounded-xl transition-all
                    ${isActive ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}
                  `.trim().replace(/\s+/g, ' ')}
                >
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-xs font-medium">
                    {t(item.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="ml-4 w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors"
          >
            <Menu size={24} className="text-white" strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
