import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from '../modules/BottomNav';
import NavigationHeader from './NavigationHeader';
import { useNavigationContext } from '../contexts';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  customHeader?: ReactNode;
  headerProps?: HeaderProps;
}

export default function Layout({
  children,
  showBottomNav = true,
  customHeader,
  headerProps,
}: LayoutProps) {
  const location = useLocation();
  const { pushToStack, clearStack } = useNavigationContext();

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/') {
      clearStack();
    } else if (headerProps) {
      pushToStack(currentPath);
    }
  }, [location.pathname, headerProps]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {customHeader && customHeader}

      {!customHeader && headerProps && (
        <NavigationHeader {...headerProps} />
      )}

      <main className={showBottomNav ? 'pb-24' : ''}>
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
