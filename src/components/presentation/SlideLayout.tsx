'use client';

import React, { useState } from 'react';
import { usePresentationContext } from '../../context/PresentationContext';
import { generatePDF } from '../../utils/pdfGenerator';
import { defaultTheme } from '../../utils/theme';

interface SlideLayoutProps {
  children: React.ReactNode;
}

interface CapturedSlide {
  element: HTMLElement;
  index: number;
}

const formatPageNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const SlideLayout: React.FC<SlideLayoutProps> = ({ children }) => {
  const { currentSlideIndex, presentationTitle, goToSlide, totalSlides } = usePresentationContext();
  const [exportStatus, setExportStatus] = useState<string>('');

  const handlePrint = async () => {
    try {
      setExportStatus('Starting PDF export...');
      console.log('Starting PDF export process...', { totalSlides });

      // Store current slide index to restore later
      const originalSlideIndex = currentSlideIndex;

      // Create a container for all slides
      const printContainer = document.createElement('div');
      printContainer.style.position = 'fixed';
      printContainer.style.left = '-9999px';
      printContainer.style.top = '-9999px';
      printContainer.style.zIndex = '-9999';
      document.body.appendChild(printContainer);

      try {
        // Navigate through each slide and capture it
        const capturedSlides: CapturedSlide[] = [];

        for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
          // Go to the slide we want to capture
          goToSlide(slideIndex);
          
          // Wait for slide transition and content to load
          await new Promise(resolve => setTimeout(resolve, 300));

          // Get the current slide
          const currentSlide = document.querySelector('.slide-content');
          if (!currentSlide) {
            console.error(`Failed to find slide ${slideIndex + 1}`);
            continue;
          }

          setExportStatus(`Capturing slide ${slideIndex + 1} of ${totalSlides}...`);
          console.log(`Processing slide ${slideIndex + 1} of ${totalSlides}`);
          
          // Deep clone the slide immediately
          const clonedSlide = currentSlide.cloneNode(true) as HTMLElement;
          capturedSlides.push({
            element: clonedSlide,
            index: slideIndex
          });
        }

        if (capturedSlides.length === 0) {
          throw new Error('No slides were captured');
        }

        setExportStatus(`Generating PDF with ${capturedSlides.length} slides...`);
        console.log(`Found ${capturedSlides.length} slides, generating PDF...`);

        // Sort slides by index to ensure correct order
        capturedSlides.sort((a, b) => a.index - b.index);

        await generatePDF({
          title: presentationTitle,
          slides: capturedSlides.map(slide => slide.element)
        });

        setExportStatus('PDF generated successfully!');
        console.log('PDF generation complete!');

        // Restore original slide
        goToSlide(originalSlideIndex);
      } finally {
        // Clean up
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
        
        // Clear status after a delay
        setTimeout(() => setExportStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportStatus('Error generating PDF');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: defaultTheme.colors.background }}
      />
      <div className="relative w-full h-full">
        {/* Header bar with title, page number, and print button */}
        <div className="w-full px-6 py-4 flex justify-between items-center text-white absolute top-0 z-20">
          <h1 className={`text-xs ${defaultTheme.fonts.body} font-light tracking-wider`}>{presentationTitle}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className={`invisible px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-xs ${defaultTheme.fonts.body} font-light tracking-wider transition-colors`}
                disabled={!!exportStatus}
              >
                {exportStatus || 'Export PDF'}
              </button>
              <div className={`text-xs ${defaultTheme.fonts.body} font-light tracking-wider`}>
                {formatPageNumber(currentSlideIndex + 1)} / {formatPageNumber(totalSlides)}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pt-16">
          <div className="slide-container w-full h-full flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 