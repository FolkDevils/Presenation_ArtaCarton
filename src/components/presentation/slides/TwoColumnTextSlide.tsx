'use client';

import React from 'react';
import { SlideContent } from '../../../types/slides';
import { defaultTheme } from '../../../utils/theme';

interface TwoColumnTextSlideProps {
  content: SlideContent;
}

export const TwoColumnTextSlide: React.FC<TwoColumnTextSlideProps> = ({ content }) => {
  // Split the supporting text into paragraphs
  const text = content.supportingText || content.body || '';
  const paragraphs = text.split('\n\n');
  
  // Split header into two parts if it contains a line break
  const [firstLine, ...restLines] = content.header.split('\n');

  // Process text with color configuration
  const processText = (text: string, defaultColor: string = defaultTheme.colors.text.primary) => {
    if (!content.colorConfig) {
      return <span style={{ color: defaultColor }}>{text}</span>;
    }

    const words = text.split(' ');
    return words.map((word, index) => {
      const colorConfig = content.colorConfig?.find(
        config => config.word.toLowerCase() === word.toLowerCase()
      );
      return (
        <span 
          key={index} 
          style={{ color: colorConfig ? colorConfig.color : defaultColor }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="h-full px-8 md:px-16 w-full flex items-center justify-center">
      <div className={`flex-1 flex flex-col md:flex-row w-full ${defaultTheme.spacing.container} gap-8 md:gap-16`}>
        {/* Left Column - Large Header */}
        <div className="flex-1 pt-8 flex flex-col justify-start">
          <h2 className={`w-full text-2xl mobile-lg:text-3xl md:text-7xl font-normal ${defaultTheme.fonts.heading} text-left leading-tight md:w-full`}>
            <span className="block">{processText(firstLine)}</span>
            <span className="block mt-2">{processText(restLines.join(' '))}</span>
          </h2>
        </div>

        {/* Right Column - Supporting Text */}
        <div className="flex-1 flex flex-col justify-center">
          <div className={`w-full text-base mobile-lg:text-xl md:text-lg font-normal ${defaultTheme.fonts.body} text-left leading-loose md:w-full`} style={{ color: defaultTheme.colors.text.secondary }}>
            {paragraphs.map((paragraph, index) => (
              <React.Fragment key={index}>
                <p className="py-8 leading-relaxed">{paragraph}</p>
                {index < paragraphs.length - 1 && (
                  <div className="h-px" style={{ backgroundColor: defaultTheme.colors.text.secondary }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 