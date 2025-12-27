import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { StorageKeys } from '../utils/storage';

interface NavigationContextType {
  navigationStack: string[];
  pushToStack: (route: string) => void;
  goBack: () => string | null;
  clearStack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [navigationStack, setNavigationStack] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(StorageKeys.NAV_STACK);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(StorageKeys.NAV_STACK, JSON.stringify(navigationStack));
    } catch {}
  }, [navigationStack]);

  const pushToStack = useCallback((route: string) => {
    setNavigationStack(prev => {
      if (prev[prev.length - 1] === route) return prev;
      return [...prev, route];
    });
  }, []);

  const goBack = useCallback(() => {
    if (navigationStack.length <= 1) return null;

    const backRoute = navigationStack[navigationStack.length - 2];
    setNavigationStack(prev => prev.slice(0, -1));

    return backRoute;
  }, [navigationStack]);

  const clearStack = useCallback(() => {
    setNavigationStack([]);
  }, []);

  const canGoBack = navigationStack.length > 1;

  return (
    <NavigationContext.Provider value={{
      navigationStack,
      pushToStack,
      goBack,
      clearStack,
      canGoBack
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
