'use client';

import React from 'react';
import ModelViewer from '../../three/ModelViewer';
import { SlideBackground } from './SlideBackground';

interface ModelSlideProps {
  content?: {
    header?: string;
    texturePath?: string;
  };
}

export const ModelSlide: React.FC<ModelSlideProps> = ({ content }) => {
  return (
    <div className="absolute inset-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      <SlideBackground 
        gradient={{
          from: '#000000',
          to: '#1a1a1a'
        }}
      />
      <div className="relative flex-1 flex items-center justify-center w-full h-full z-10">
        <ModelViewer texturePath={content?.texturePath || "/caseTexture_01.png"} />
      </div>
    </div>
  );
}; 