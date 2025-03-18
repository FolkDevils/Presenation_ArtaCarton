import React from 'react';
import Image from 'next/image';

interface SlideBackgroundProps {
  imagePath?: string;
  overlayOpacity?: number;
  gradient?: {
    from: string;
    to: string;
  };
}

export const SlideBackground: React.FC<SlideBackgroundProps> = ({ 
  imagePath,
  overlayOpacity = 50,
  gradient
}) => {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {imagePath ? (
        <>
          <Image
            src={imagePath}
            alt="Slide Background"
            fill
            className="object-cover"
            sizes="100vw"
            quality={100}
            priority
          />
          <div 
            className="absolute inset-0 bg-black" 
            style={{ opacity: overlayOpacity / 100 }} 
          />
        </>
      ) : gradient && (
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})`
          }}
        />
      )}
    </div>
  );
}; 