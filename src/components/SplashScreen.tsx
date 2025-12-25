import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentPhrase, setCurrentPhrase] = useState(2);

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

  const getOpacity = (index: number) => {
    if (index === currentPhrase) return 1;
    const distance = Math.abs(index - currentPhrase);
    if (distance === 1) return 0.4;
    if (distance === 2) return 0.25;
    return 0.1;
  };

  return (
    <div className="fixed inset-0 bg-[#5EE67E] flex items-center overflow-hidden px-12 py-24">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {phrases.map((phrase, index) => {
          const isActive = index === currentPhrase;
          const opacity = getOpacity(index);

          return (
            <div key={phrase} className="relative flex items-center gap-4">
              {isActive && (
                <svg
                  className="absolute -left-12 w-8 h-8 text-neutral-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <h2
                className="text-6xl font-black leading-tight transition-opacity duration-500"
                style={{
                  opacity: opacity,
                  color: isActive ? '#2d2d2d' : '#4d8a5f'
                }}
              >
                {phrase}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
