'use client';

import React from 'react';
import { SlideContent, TextAlignment, VerticalAlignment } from '../../../types/slides';
import { defaultTheme } from '../../../utils/theme';

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
    <div className="h-full w-full flex items-center justify-center">
      <div className={`flex-1 flex flex-col ${verticalAlignClass} justify-center w-full ${defaultTheme.spacing.container} px-8`}>
        <div className={`w-full ${textAlignClass}`}>
          <h2 className={`w-full mb-6 text-2xl uppercase mobile-lg:text-3xl md:text-5xl font-normal ${defaultTheme.fonts.heading} leading-normal`} style={{ color: defaultTheme.colors.text.accent }}>
            {content.header}
          </h2>
          <div className={`w-full text-base mobile-lg:text-xl md:text-2xl font-normal ${defaultTheme.fonts.body} leading-relaxed`} style={{ color: defaultTheme.colors.text.primary }}>
            {content.body}
          </div>
        </div>
      </div>
    </div>
  );
}; 