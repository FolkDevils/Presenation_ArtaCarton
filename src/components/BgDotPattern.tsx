'use client';

import React from 'react';

interface BgDotPatternProps {
  className?: string;
}

const BgDotPattern: React.FC<BgDotPatternProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
            <mask id="gradientMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)" />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="white" mask="url(#gradientMask)" />
        </svg>
      </div>
    </div>
  );
};

export default BgDotPattern; 