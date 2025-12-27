import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import SplashScreen from '../components/SplashScreen';

interface SplashOptions {
  onFadeStart?: () => void;
}

interface SplashContextType {
  show: (minDuration?: number, options?: SplashOptions) => void;
  markReady: () => void;
}

const SplashContext = createContext<SplashContextType | null>(null);

const DEFAULT_MIN_DURATION = 1_500;
const FADE_OUT_DURATION = 400;

type SplashPhase = 'idle' | 'waiting' | 'ready' | 'closing';

interface SplashState {
  phase: SplashPhase;
  targetEndTime: number;
  onFadeStart: (() => void) | null;
}

const initialState: SplashState = {
  phase: 'idle',
  targetEndTime: 0,
  onFadeStart: null,
};

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const [state, setState] = useState<SplashState>(initialState);

  const show = useCallback((minDuration: number = DEFAULT_MIN_DURATION, options?: SplashOptions) => {
    const newTargetEnd = Date.now() + minDuration;
    
    setState(prev => {
      if (prev.phase === 'idle') {
        return {
          phase: 'waiting',
          targetEndTime: newTargetEnd,
          onFadeStart: options?.onFadeStart ?? null,
        };
      }
      return {
        ...prev,
        targetEndTime: Math.max(prev.targetEndTime, newTargetEnd),
      };
    });
  }, []);

  const markReady = useCallback(() => {
    setState(prev => prev.phase === 'waiting' ? { ...prev, phase: 'ready' } : prev);
  }, []);

  useEffect(() => {
    if (state.phase !== 'ready') return;

    const remaining = Math.max(0, state.targetEndTime - Date.now());

    const timer = setTimeout(() => {
      setState(prev => {
        prev.onFadeStart?.();
        return { ...prev, phase: 'closing' };
      });
    }, remaining);

    return () => clearTimeout(timer);
  }, [state.phase, state.targetEndTime]);

  useEffect(() => {
    if (state.phase !== 'closing') return;

    const timer = setTimeout(() => setState(initialState), FADE_OUT_DURATION);

    return () => clearTimeout(timer);
  }, [state.phase]);

  const isVisible = state.phase !== 'idle';
  const isClosing = state.phase === 'closing';

  return (
    <SplashContext.Provider value={{ show, markReady }}>
      {isVisible && <SplashScreen isClosing={isClosing} />}
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

export function useSplashInit(
  minDuration: number,
  init: () => Promise<void>,
  onFadeStart?: () => void
) {
  const splash = useSplash();

  useEffect(() => {
    splash.show(minDuration, { onFadeStart });
    init().finally(() => splash.markReady());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

