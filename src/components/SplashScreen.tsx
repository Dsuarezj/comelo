import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowRight } from 'lucide-react';

const LINE_HEIGHT = 72;
const SCROLL_DURATION = 700;
const SPLASH_PHRASES_CACHE_KEY = 'splash_phrases_cache';

function getCachedPhrases(language: string): string[] | null {
  try {
    const cached = localStorage.getItem(`${SPLASH_PHRASES_CACHE_KEY}_${language}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
  }
  return null;
}

function setCachedPhrases(language: string, phrases: string[]) {
  try {
    localStorage.setItem(`${SPLASH_PHRASES_CACHE_KEY}_${language}`, JSON.stringify(phrases));
  } catch {
  }
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
}

interface SplashProps {
  isClosing?: boolean;
}

function DesktopSplash({ isClosing }: SplashProps) {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center z-50"
      style={{
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 400ms ease-out'
      }}
    >
      <Loader2 className="w-16 h-16 text-gray-400 animate-spin mb-6" />
      <p className="text-gray-600 text-lg text-center max-w-md px-4">
        Tenemos un espacio para publicidad que llega a muchos usuarios
      </p>
    </div>
  );
}

function MobileSplash({ isClosing }: SplashProps) {
  const { t, ready, i18n: i18nInstance } = useTranslation();
  const [tick, setTick] = useState(0);
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentLanguage = i18nInstance.language || 'es';
  const cachedPhrases = useMemo(() => getCachedPhrases(currentLanguage), [currentLanguage]);
  const translatedPhrases = ready ? (t('splash.phrases', { returnObjects: true }) as string[]) : null;
  
  const basePhrases = useMemo(() => {
    if (translatedPhrases && Array.isArray(translatedPhrases) && translatedPhrases.length > 0) {
      setCachedPhrases(currentLanguage, translatedPhrases);
      return translatedPhrases;
    }
    if (cachedPhrases) {
      return cachedPhrases;
    }
    return [];
  }, [translatedPhrases, cachedPhrases, currentLanguage]);

  const phraseCount = basePhrases.length || 1;
  const centerY = LINE_HEIGHT * 2;
  const animationDuration = SCROLL_DURATION * 0.7;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animate = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / animationDuration, 1);
    const easedProgress = easeOutCubic(progress);
    
    setOffset(easedProgress * LINE_HEIGHT);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setTick(prev => prev + 1);
      setOffset(0);
    }
  }, [animationDuration]);

  useEffect(() => {
    const startAnimation = () => {
      startTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    };

    const interval = setInterval(startAnimation, SCROLL_DURATION);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const activeIndex = tick % phraseCount;

  const getPhraseForSlot = (slotOffset: number) => {
    const index = ((activeIndex + slotOffset) % phraseCount + phraseCount) % phraseCount;
    return basePhrases[index];
  };

  const getVisualDistance = (slotOffset: number) => {
    const visualY = (slotOffset + 2) * LINE_HEIGHT - offset;
    return Math.abs(visualY - centerY) / LINE_HEIGHT;
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const getOpacity = (slotOffset: number) => {
    const distance = getVisualDistance(slotOffset);
    if (distance < 0.5) return 1;
    if (distance < 1) return lerp(1, 0.5, (distance - 0.5) * 2);
    if (distance < 2) return lerp(0.5, 0.3, (distance - 1));
    if (distance < 3) return lerp(0.3, 0.15, (distance - 2));
    return 0.15;
  };

  const getColorIntensity = (slotOffset: number) => {
    const distance = getVisualDistance(slotOffset);
    return clamp(1 - distance, 0, 1);
  };

  const getColor = (slotOffset: number) => {
    const intensity = getColorIntensity(slotOffset);
    const r = Math.round(lerp(0x3d, 0x1a, intensity));
    const g = Math.round(lerp(0x7a, 0x1a, intensity));
    const b = Math.round(lerp(0x4d, 0x1a, intensity));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getXOffset = (slotOffset: number) => {
    const distance = getVisualDistance(slotOffset);
    const intensity = clamp(1 - distance, 0, 1);
    return intensity * 12;
  };

  const slots = [-2, -1, 0, 1, 2, 3];

  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 bg-[#5EE67E] overflow-hidden flex items-center z-50"
      style={{
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 400ms ease-out'
      }}
    >
      <div
        className="absolute left-6 z-20"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
<ArrowRight className="w-12 h-12 text-[#1a1a1a]" strokeWidth={2.5} />
      </div>

      <div
        className="absolute left-20 right-6 overflow-hidden"
        style={{
          top: `calc(50% - ${LINE_HEIGHT * 2.5}px)`,
          height: `${LINE_HEIGHT * 5}px`,
        }}
      >
        <div
          style={{
            transform: `translateY(${-offset}px)`,
          }}
        >
          {slots.map((slotOffset) => {
            const phrase = getPhraseForSlot(slotOffset);
            const opacity = getOpacity(slotOffset);
            const yPosition = (slotOffset + 2) * LINE_HEIGHT;
            const xOffset = getXOffset(slotOffset);
            const color = getColor(slotOffset);

            return (
              <h2
                key={slotOffset}
                className="font-black whitespace-nowrap absolute left-0 right-0"
                style={{
                  fontSize: 'clamp(24px, 7.5vw, 40px)',
                  lineHeight: `${LINE_HEIGHT}px`,
                  height: `${LINE_HEIGHT}px`,
                  top: `${yPosition}px`,
                  opacity: opacity,
                  color: color,
                  transform: `translateX(${xOffset}px)`,
                }}
              >
                {phrase || ''}
              </h2>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SplashScreen({ isClosing }: SplashProps) {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopSplash isClosing={isClosing} /> : <MobileSplash isClosing={isClosing} />;
}
