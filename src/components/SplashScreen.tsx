import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const LINE_HEIGHT = 72;

interface SplashScreenProps {
  duration?: number;
  onComplete?: () => void;
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

function DesktopSplash() {
  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center z-50">
      <Loader2 className="w-16 h-16 text-gray-400 animate-spin mb-6" />
      <p className="text-gray-600 text-lg text-center max-w-md px-4">
        Tenemos un espacio para publicidad que llega a muchos usuarios
      </p>
    </div>
  );
}

function MobileSplash() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const basePhrases = t('splash.phrases', { returnObjects: true }) as string[];
  const phrases = [...basePhrases, ...basePhrases, ...basePhrases];
  const startOffset = basePhrases.length;

  useEffect(() => {
    setCurrentIndex(startOffset);
  }, [startOffset]);

  useEffect(() => {
    let isMounted = true;
    const phraseCount = basePhrases.length;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= startOffset + phraseCount) {
          setTimeout(() => {
            if (isMounted) {
              setIsTransitioning(false);
              setCurrentIndex(startOffset);
              setTimeout(() => {
                if (isMounted) setIsTransitioning(true);
              }, 50);
            }
          }, 500);
        }
        return next;
      });
    }, 700);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [startOffset, basePhrases.length]);

  const getOpacity = (index: number) => {
    const centerIndex = currentIndex - 2;
    const distance = Math.abs(index - centerIndex);
    if (distance === 0) return 1;
    if (distance === 1) return 0.5;
    if (distance === 2) return 0.3;
    return 0.15;
  };

  const translateY = -(currentIndex * LINE_HEIGHT);

  return (
    <div className="fixed inset-0 bg-[#5EE67E] overflow-hidden flex items-center z-50">
      <div
        className="absolute left-6 z-20"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <svg
          className="w-12 h-12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12H20M20 12L14 6M20 12L14 18"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
            transform: `translateY(${translateY + LINE_HEIGHT * (startOffset - 2)}px)`,
            transition: isTransitioning ? 'transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          }}
        >
          {phrases.map((phrase, index) => {
            const centerIndex = currentIndex - 2;
            const isActive = index === centerIndex;
            const opacity = getOpacity(index);

            return (
              <h2
                key={`${phrase}-${index}`}
                className="font-black whitespace-nowrap"
                style={{
                  fontSize: '46px',
                  lineHeight: `${LINE_HEIGHT}px`,
                  height: `${LINE_HEIGHT}px`,
                  opacity: opacity,
                  color: isActive ? '#1a1a1a' : '#3d7a4d',
                  transform: `translateX(${isActive ? 12 : 0}px)`,
                  transition: 'opacity 600ms cubic-bezier(0.25, 0.1, 0.25, 1), color 600ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              >
                {phrase}
              </h2>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SplashScreen({ duration, onComplete }: SplashScreenProps) {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (duration && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return isDesktop ? <DesktopSplash /> : <MobileSplash />;
}
