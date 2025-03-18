'use client';

import React, { useEffect } from 'react';
import { SlideLayout } from './SlideLayout';
import { TextOnlySlide } from './slides/TextOnlySlide';
import { TextImageSlide } from './slides/TextImageSlide';
import { CoverSlide } from './slides/CoverSlide';
import { ModelSlide } from './slides/ModelSlide';
import { TwoColumnTextSlide } from './slides/TwoColumnTextSlide';
import { usePresentationContext } from '../../context/PresentationContext';
import { Slide, PresentationConfig } from '../../types/slides';
import { generatePDF } from '../../utils/pdfGenerator';

export const Presentation: React.FC = () => {
  const { currentSlide, nextSlide, previousSlide, currentSlideIndex, presentationTitle, totalSlides } = usePresentationContext();

  const handleGeneratePDF = async () => {
    try {
      const slides = document.querySelectorAll('.slide-content');
      if (slides.length === 0) {
        console.error('No slides found');
        return;
      }

      await generatePDF({
        title: presentationTitle,
        slides: Array.from(slides) as HTMLElement[]
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Handle PDF generation (Command + Shift + P)
      if (event.metaKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        handleGeneratePDF();
        return;
      }

      // Handle navigation
      switch (event.key) {
        case 'ArrowRight':
        case 'Space':
          nextSlide();
          break;
        case 'ArrowLeft':
          previousSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, previousSlide, handleGeneratePDF]);

  const renderSlide = (slide: Slide) => {
    const slideContent = (
      <div className="slide-content" data-slide-index={currentSlideIndex}>
        {(() => {
          switch (slide.type) {
            case 'cover':
            case 'cover-2':
              return <CoverSlide content={slide.content} />;
            case 'text-only':
              return <TextOnlySlide content={slide.content} />;
            case 'text-image-right':
              return (
                <TextImageSlide
                  content={slide.content}
                  image={slide.image!}
                  imageOnLeft={false}
                />
              );
            case 'text-image-left':
              return (
                <TextImageSlide
                  content={slide.content}
                  image={slide.image!}
                  imageOnLeft={true}
                />
              );
            case 'two-column-text':
              return <TwoColumnTextSlide content={slide.content} />;
            case 'model':
              return <ModelSlide content={{ texturePath: slide.content?.texturePath }} />;
            case 'custom':
              // Handle custom components here
              return null;
            default:
              return <div>Unsupported slide type</div>;
          }
        })()}
      </div>
    );

    return slideContent;
  };

  if (!currentSlide) {
    return <div>No slides available</div>;
  }

  return (
    <SlideLayout>
      {renderSlide(currentSlide)}
    </SlideLayout>
  );
}; 