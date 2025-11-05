import { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const aspectRatioStyles = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  'auto': '',
};

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export default function Image({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
  rounded = 'md',
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`${aspectRatioStyles[aspectRatio]} ${roundedStyles[rounded]} overflow-hidden bg-gray-100 relative`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <span className="text-sm">Image not found</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`
            w-full h-full
            ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300
            ${className}
          `.trim().replace(/\s+/g, ' ')}
        />
      )}
    </div>
  );
}
