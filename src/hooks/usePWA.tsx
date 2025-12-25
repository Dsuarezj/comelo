import { useState, useEffect, useCallback } from 'react';

export type PWAInstallState = 'loading' | 'available' | 'rejected' | 'installed' | 'not_supported';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  installState: PWAInstallState;
  canInstall: boolean;
  showInstallPrompt: boolean;
  showIOSInstructions: boolean;
  hasUpdate: boolean;
  install: () => Promise<void>;
  dismissPrompt: () => void;
  reloadForUpdate: () => void;
}

const STORAGE_KEYS = {
  INSTALL_STATE: 'pwa-install-state',
  PROMPT_SEEN: 'pwa-prompt-seen',
  PROMPT_DISMISSED: 'pwa-prompt-dismissed',
  FIRST_VISIT: 'first-visit',
  ENGAGEMENT_START: 'pwa-engagement-start',
};

const ENGAGEMENT_TIME = 5 * 60 * 1000;
const REJECTION_COOLDOWN = 72 * 60 * 60 * 1000;

export function usePWA(): PWAState {
  const [installState, setInstallState] = useState<PWAInstallState>('loading');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isStandalone = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
  }, []);

  const isIOS = useCallback(() => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }, []);

  const canInstall = installState === 'available' || (isIOS() && !isStandalone());

  const shouldShowInstallPrompt = useCallback(() => {
    if (isStandalone()) {
      return false;
    }

    const promptDismissed = localStorage.getItem(STORAGE_KEYS.PROMPT_DISMISSED);
    if (promptDismissed) {
      const dismissedTime = parseInt(promptDismissed, 10);
      if (Date.now() - dismissedTime < REJECTION_COOLDOWN) {
        return false;
      }
    }

    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    if (!firstVisit) {
      return false;
    }

    const promptSeen = localStorage.getItem(STORAGE_KEYS.PROMPT_SEEN);
    if (promptSeen === 'true') {
      return false;
    }

    const engagementStart = localStorage.getItem(STORAGE_KEYS.ENGAGEMENT_START);
    if (!engagementStart) {
      localStorage.setItem(STORAGE_KEYS.ENGAGEMENT_START, Date.now().toString());
      return false;
    }

    const elapsed = Date.now() - parseInt(engagementStart, 10);
    return elapsed >= ENGAGEMENT_TIME;
  }, [isStandalone]);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      if (isIOS()) {
        setShowIOSInstructions(true);
        localStorage.setItem(STORAGE_KEYS.PROMPT_SEEN, 'true');
      }
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setInstallState('installed');
      localStorage.setItem(STORAGE_KEYS.INSTALL_STATE, 'installed');
      setShowInstallPrompt(false);
    } else {
      setInstallState('rejected');
      localStorage.setItem(STORAGE_KEYS.INSTALL_STATE, 'rejected');
      localStorage.setItem(STORAGE_KEYS.PROMPT_DISMISSED, Date.now().toString());
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
    localStorage.setItem(STORAGE_KEYS.PROMPT_SEEN, 'true');
  }, [deferredPrompt, isIOS]);

  const dismissPrompt = useCallback(() => {
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem(STORAGE_KEYS.PROMPT_DISMISSED, Date.now().toString());
    localStorage.setItem(STORAGE_KEYS.PROMPT_SEEN, 'true');
  }, []);

  const reloadForUpdate = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    if (!firstVisit) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, Date.now().toString());
    }

    if (isStandalone()) {
      setInstallState('installed');
      localStorage.setItem(STORAGE_KEYS.INSTALL_STATE, 'installed');
      return;
    }

    const savedState = localStorage.getItem(STORAGE_KEYS.INSTALL_STATE) as PWAInstallState;
    if (savedState) {
      setInstallState(savedState);
    } else {
      setInstallState('not_supported');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallState('available');
      localStorage.setItem(STORAGE_KEYS.INSTALL_STATE, 'available');
    };

    const handleAppInstalled = () => {
      setInstallState('installed');
      localStorage.setItem(STORAGE_KEYS.INSTALL_STATE, 'installed');
      setShowInstallPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  useEffect(() => {
    const checkEngagement = setInterval(() => {
      if (shouldShowInstallPrompt() && (deferredPrompt || isIOS())) {
        setShowInstallPrompt(true);
        if (isIOS()) {
          setShowIOSInstructions(true);
        }
        clearInterval(checkEngagement);
      }
    }, 30000);

    return () => clearInterval(checkEngagement);
  }, [shouldShowInstallPrompt, deferredPrompt, isIOS]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        setHasUpdate(true);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSWMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    };
  }, []);

  return {
    installState,
    canInstall,
    showInstallPrompt,
    showIOSInstructions,
    hasUpdate,
    install,
    dismissPrompt,
    reloadForUpdate,
  };
}
