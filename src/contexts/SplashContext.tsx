import { createContext, useContext, useState, ReactNode } from 'react';
import SplashScreen from '../components/SplashScreen';

interface SplashContextType {
  show: (task?: () => Promise<void> | void, minDuration?: number) => Promise<void>;
  hide: () => void;
  isVisible: boolean;
}

const SplashContext = createContext<SplashContextType | null>(null);

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const [isVisible, setIsVisible] = useState(false);

  const show = async (task?: () => Promise<void> | void, minDuration = 0): Promise<void> => {
    setIsVisible(true);
    const startTime = Date.now();

    if (task) {
      try {
        const result = task();
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        console.error('Error en tarea del splash:', error);
      }
    }

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minDuration - elapsed);

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    setIsVisible(false);
  };

  const hide = () => {
    setIsVisible(false);
  };

  return (
    <SplashContext.Provider value={{ show, hide, isVisible }}>
      {isVisible && <SplashScreen />}
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash(): SplashContextType {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error('useSplash debe usarse dentro de SplashProvider');
  }
  return context;
}

