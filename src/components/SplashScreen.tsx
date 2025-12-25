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

  return (
    <div className="fixed inset-0 bg-[#5EE67E] flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex items-center gap-1">
              <span className="text-8xl font-black text-neutral-800 leading-none">C</span>
              <div className="w-16 h-16 rounded-full bg-neutral-800 relative">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 32L28 40L44 24"
                    stroke="#5EE67E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex gap-1 -mt-2">
            <span className="text-8xl font-black text-neutral-800 leading-none">ME</span>
          </div>
          <div className="flex gap-1 -mt-2">
            <span className="text-8xl font-black text-neutral-800 leading-none">LO</span>
          </div>
        </div>

        <div className="relative h-24 w-full max-w-md px-8">
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
