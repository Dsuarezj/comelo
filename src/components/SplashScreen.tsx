import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

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
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#5EE67E] flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/icons/image.png"
          alt="Comelo"
          className="w-48 h-48 mb-8 object-contain"
        />

        <div className="relative h-20 w-full max-w-md">
          {phrases.map((phrase, index) => {
            const isActive = index === currentPhrase;
            const isPrevious = index === (currentPhrase - 1 + phrases.length) % phrases.length;
            const isNext = index === (currentPhrase + 1) % phrases.length;

            let translateY = '100%';
            let opacity = 0;

            if (isActive) {
              translateY = '0%';
              opacity = 1;
            } else if (isPrevious) {
              translateY = '-100%';
              opacity = 0;
            } else if (isNext) {
              translateY = '100%';
              opacity = 0;
            }

            return (
              <div
                key={phrase}
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{
                  transform: `translateY(${translateY})`,
                  opacity: opacity
                }}
              >
                <h2 className="text-4xl font-bold text-neutral-800 text-center">
                  {phrase}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
