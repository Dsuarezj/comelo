import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const LINE_HEIGHT = 72;
const ACTIVE_INDEX = 2;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  const phrases = [
    'Organiza fácil',
    'Explora recetas',
    'Crea tu lista',
    'Personaliza',
    'A tu ritmo',
    'Sin estrés'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
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

  const getOpacity = (visualIndex: number) => {
    const distance = Math.abs(visualIndex - ACTIVE_INDEX);
    if (distance === 0) return 1;
    if (distance === 1) return 0.45;
    if (distance === 2) return 0.25;
    return 0.12;
  };

  const translateY = -currentPhrase * LINE_HEIGHT;

  return (
    <div className="fixed inset-0 bg-[#5EE67E] overflow-hidden">
      <div className="absolute left-8 flex items-center" style={{ top: `calc(50% - ${LINE_HEIGHT / 2}px)` }}>
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
        className="absolute left-20 transition-transform duration-500 ease-out"
        style={{
          top: `calc(50% - ${(ACTIVE_INDEX + 0.5) * LINE_HEIGHT}px)`,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {phrases.map((phrase, index) => {
          const visualIndex = index - currentPhrase + ACTIVE_INDEX;
          const isActive = visualIndex === ACTIVE_INDEX;
          const opacity = getOpacity(visualIndex);

          return (
            <h2
              key={phrase}
              className="font-black transition-all duration-500 ease-out whitespace-nowrap"
              style={{
                fontSize: '52px',
                lineHeight: `${LINE_HEIGHT}px`,
                opacity: opacity,
                color: isActive ? '#2d2d2d' : '#4d8a5f',
              }}
            >
              {phrase}
            </h2>
          );
        })}
      </div>
    </div>
  );
}
