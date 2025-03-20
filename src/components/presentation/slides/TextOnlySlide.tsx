'use client';

import React from 'react';
import { SlideContent, TextAlignment, VerticalAlignment } from '../../../types/slides';
import { defaultTheme } from '../../../utils/theme';
import { SlideBackground } from './SlideBackground';

interface TextOnlySlideProps {
  content: SlideContent;
}

const getTextAlignmentClass = (alignment: TextAlignment = 'left'): string => {
  const alignmentMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  return alignmentMap[alignment];
};

const getVerticalAlignmentClass = (alignment: VerticalAlignment = 'center'): string => {
  const alignmentMap = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  };
  return alignmentMap[alignment];
};

export const TextOnlySlide: React.FC<TextOnlySlideProps> = ({ content }) => {
  const textAlignClass = getTextAlignmentClass(content.textAlignment);
  const verticalAlignClass = getVerticalAlignmentClass(content.verticalAlignment);

  return (
    <div className="absolute inset-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      <SlideBackground imagePath="/Cover.png" overlayOpacity={60} />
      <div className={`relative flex-1 flex flex-col ${verticalAlignClass} justify-center w-full ${defaultTheme.spacing.container} px-8 z-10`}>
        <div className={`w-full ${textAlignClass}`}>
          <h2 className={`w-full mb-6 text-2xl mobile-lg:text-3xl md:text-5xl font-normal ${content.customFont || defaultTheme.fonts.heading} leading-normal`} style={{ color: content.customTextColor || defaultTheme.colors.text.accent }}>
            {content.header}
          </h2>
          {content.body && (
            <div className={`w-full text-base mobile-lg:text-xl md:text-2xl font-normal ${defaultTheme.fonts.body} leading-relaxed`} style={{ color: defaultTheme.colors.text.primary }}>
              {content.body}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 