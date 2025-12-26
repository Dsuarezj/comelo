import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SplashScreen from '../components/SplashScreen';
import { LocalStorageService, StorageKeys } from '../utils/storage';
import { sessionService } from '../services/SessionService';

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const hasOnboarding = LocalStorageService.get(StorageKeys.HAS_ONBOARDING, false);
    
    if (!hasOnboarding) {
      setIsVisible(true);
      runInitialTask();
    } else {
      initializeServices().then(() => {
        setIsInitialized(true);
      }).catch(() => {
        setIsInitialized(true);
      });
    }
  }, []);

  const initializeServices = async () => {
    try {
      await sessionService.init();
    } catch (error) {
      console.error('Error inicializando servicios:', error);
    }
  };

  const runInitialTask = async () => {
    const startTime = Date.now();
    const isDesktop = window.innerWidth >= 768;
    const minDuration = isDesktop ? 5000 : 1500;

    try {
      await initializeServices();
    } catch (error) {
      console.error('Error en tarea inicial:', error);
    }

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minDuration - elapsed);

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    LocalStorageService.set(StorageKeys.HAS_ONBOARDING, true);
    setIsVisible(false);
    setIsInitialized(true);
  };

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

  if (!isInitialized && !isVisible) {
    return null;
  }

  return (
    <SplashContext.Provider value={{ show, hide, isVisible }}>
      {isVisible && <SplashScreen />}
      {isInitialized && children}
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

