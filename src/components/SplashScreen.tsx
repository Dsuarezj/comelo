import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const LINE_HEIGHT = 72;
const VISIBLE_COUNT = 7;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const basePhrase = [
    'Organiza fácil',
    'Explora recetas',
    'Crea tu lista',
    'Personaliza',
    'A tu ritmo',
    'Sin estrés'
  ];

  const phrases = [...basePhrase, ...basePhrase, ...basePhrase];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= basePhrase.length * 2) {
          return basePhrase.length;
        }
        return next;
      });
    }, 600);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  const centerIndex = Math.floor(VISIBLE_COUNT / 2);

  const getVisiblePhrases = () => {
    const result = [];
    for (let i = -centerIndex; i <= centerIndex; i++) {
      const phraseIndex = currentIndex + i;
      const normalizedIndex = ((phraseIndex % phrases.length) + phrases.length) % phrases.length;
      result.push({
        text: phrases[normalizedIndex],
        offset: i,
        key: `${currentIndex}-${i}`,
      });
    }
    return result;
  };

  const getOpacity = (offset: number) => {
    const distance = Math.abs(offset);
    if (distance === 0) return 1;
    if (distance === 1) return 0.45;
    if (distance === 2) return 0.25;
    return 0.12;
  };

  const visiblePhrases = getVisiblePhrases();

  return (
    <div className="fixed inset-0 bg-[#5EE67E] overflow-hidden">
      <div
        className="absolute left-8 flex items-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg
          className="w-8 h-8 text-neutral-800"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M19 12L13 6M19 12L13 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        className="absolute left-20"
        style={{
          top: '50%',
          transform: `translateY(-${LINE_HEIGHT / 2}px)`,
        }}
      >
        {visiblePhrases.map((item) => {
          const isActive = item.offset === 0;
          const opacity = getOpacity(item.offset);

          return (
            <h2
              key={item.key}
              className="absolute font-black whitespace-nowrap transition-all duration-500 ease-out"
              style={{
                fontSize: '52px',
                lineHeight: `${LINE_HEIGHT}px`,
                opacity: opacity,
                color: isActive ? '#2d2d2d' : '#4d8a5f',
                transform: `translateY(${item.offset * LINE_HEIGHT}px)`,
              }}
            >
              {item.text}
            </h2>
          );
        })}
      </div>
    </div>
  );
}
