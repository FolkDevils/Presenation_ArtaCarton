'use client';

import React from 'react';
import Image from 'next/image';
import { SlideContent } from '../../../types/slides';
import { defaultTheme } from '../../../utils/theme';
import { SlideBackground } from './SlideBackground';

interface CoverSlideProps {
  content: SlideContent;
}

export const CoverSlide: React.FC<CoverSlideProps> = ({ content }) => {
  return (
    <div className="absolute inset-0 w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      <SlideBackground imagePath="/Cover.png" overlayOpacity={60} />
      <div className="relative flex-1 flex flex-col items-center justify-center w-full px-8 z-10">
        <div className="w-full max-w-[1920px] flex flex-col items-center">
          {!content.customFont && (
            <div className="w-full md:w-[400px] mb-6">
              <Image
                src="/artaLogo.svg"
                alt="Arta Logo"
                width={400}
                height={165}
                className="w-full h-auto"
                priority
              />
            </div>
          )}
          <div className="w-full text-center">
            {content.eyebrow && (
              <div className={`w-full text-xs tracking-wider mb-4 font-thin ${defaultTheme.fonts.body}`} style={{ color: defaultTheme.colors.text.primary }}>
                {content.eyebrow}
              </div>
            )}
            <h2 
              className={`w-full mb-6 text-4xl mobile-lg:text-6xl md:text-8xl font-normal leading-normal ${content.customFont || defaultTheme.fonts.heading}`} 
              style={{ color: content.customTextColor || defaultTheme.colors.text.accent }}
            >
              {content.header}
            </h2>
            {content.body && (
              <div className={`w-full text-base mobile-lg:text-xl md:text-2xl font-thin ${defaultTheme.fonts.body} leading-relaxed`} style={{ color: defaultTheme.colors.text.primary }}>
                {content.body}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 