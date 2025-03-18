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
  }, [nextSlide, previousSlide]);

  const handleGeneratePDF = async () => {
    if (!currentSlide) return;

    // Create a container for all slides
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1000';
    container.style.opacity = '0';
    document.body.appendChild(container);

    try {
      // Get all slides from the context
      const slideElements = Array.from({ length: totalSlides }, (_, i) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide-content';
        slideDiv.setAttribute('data-slide-index', i.toString());
        container.appendChild(slideDiv);
        return slideDiv;
      });

      await generatePDF({
        title: presentationTitle,
        slides: slideElements
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  };

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