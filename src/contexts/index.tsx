import { ReactNode } from 'react';
import { SplashProvider } from './SplashContext';
import { NavigationProvider } from './NavigationContext';

export { SplashProvider, useSplash } from './SplashContext';
export { NavigationProvider, useNavigationContext } from './NavigationContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SplashProvider>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </SplashProvider>
  );
}

