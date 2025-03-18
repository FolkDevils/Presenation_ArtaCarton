'use client';

import React from 'react';
import Image from 'next/image';
import { SlideContent, ImageContent } from '../../../types/slides';
import { defaultTheme, getGradientStyle } from '../../../utils/theme';

interface TextImageSlideProps {
  content: SlideContent;
  image: ImageContent;
  imageOnLeft?: boolean;
}

export const TextImageSlide: React.FC<TextImageSlideProps> = ({
  content,
  image,
  imageOnLeft = false,
}) => {
  const ContentSection = (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className={`w-full ${defaultTheme.spacing.container}`}>
        <h2 className={`w-full mb-6 text-2xl uppercase mobile-lg:text-3xl md:text-5xl font-normal ${defaultTheme.fonts.heading} leading-normal`} style={{ color: defaultTheme.colors.text.accent }}>
          {content.header}
        </h2>
        <div className={`w-full text-base mobile-lg:text-xl md:text-2xl font-normal ${defaultTheme.fonts.body} leading-relaxed`} style={{ color: defaultTheme.colors.text.primary }}>
          {content.body}
        </div>
      </div>
    </div>
  );

  const ImageSection = (
    <div className="flex-1 relative min-h-[400px] md:min-h-[600px]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      {imageOnLeft ? (
        <>
          {ImageSection}
          {ContentSection}
        </>
      ) : (
        <>
          {ContentSection}
          {ImageSection}
        </>
      )}
    </div>
  );
}; 