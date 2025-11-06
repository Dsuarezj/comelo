import { ReactNode } from 'react';
import { BottomNav } from '../modules';

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
  header?: ReactNode;
}

export default function Layout({
  children,
  showBottomNav = true,
  showHeader = false,
  header,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && header}

      <main className={showBottomNav ? 'pb-24' : ''}>
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
