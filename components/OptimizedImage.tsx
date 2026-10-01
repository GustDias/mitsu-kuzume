'use client';

import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function OptimizedImage({ src, alt, className = '' }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy" // <-- Lazy load nativo do navegador
        decoding="async"
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      />
    </div>
  );
}