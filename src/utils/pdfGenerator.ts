'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { defaultTheme } from './theme';

interface PDFGeneratorConfig {
  title: string;
  slides: Element[];
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

const createPrintContainer = () => {
  // Create a container with fixed 16:9 dimensions
  const container = document.createElement('div');
  
  // Position far off-screen and behind other content
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.zIndex = '-9999';
  
  // Set dimensions and other styles
  container.style.width = `${SLIDE_WIDTH}px`;
  container.style.height = `${SLIDE_HEIGHT}px`;
  container.style.overflow = 'hidden';
  container.style.background = 'linear-gradient(to bottom right, #440974, #25021d)';
  container.style.pointerEvents = 'none'; // Prevent any interaction
  container.id = 'print-container';
  
  document.body.appendChild(container);
  return container;
};

const cloneSlideForPrint = (originalSlide: Element) => {
  const clone = originalSlide.cloneNode(true) as HTMLElement;
  
  // Reset any transform/scale styles that might affect print quality
  clone.style.transform = 'none';
  clone.style.width = '100%';
  clone.style.height = '100%';
  
  // Remove any animation elements or background effects
  const bgAnimations = clone.getElementsByClassName('BgFlowerAnimation');
  for (const animation of bgAnimations) {
    if (animation instanceof HTMLElement) {
      animation.remove();
    }
  }

  // Handle logo container sizing
  const logoContainers = clone.getElementsByClassName('md:w-[800px]');
  for (const container of logoContainers) {
    if (container instanceof HTMLElement) {
      container.style.width = '800px';
      container.style.maxWidth = '41.67%'; // Equivalent to md:w-[800px] relative to 1920px
    }
  }

  // Handle logo image aspect ratio
  const logoImages = clone.getElementsByClassName('aspect-[2.78/1]');
  for (const img of logoImages) {
    if (img instanceof HTMLElement) {
      img.style.aspectRatio = '2.78/1';
      img.style.width = '100%';
      img.style.position = 'relative';
    }
  }

  // Ensure text is properly sized for 1920x1080
  const headerElements = clone.getElementsByTagName('h2');
  for (const header of headerElements) {
    header.style.fontSize = '64px';
    header.style.lineHeight = '1.2';
  }
  
  const bodyElements = clone.getElementsByClassName('text-base');
  for (const body of bodyElements) {
    if (body instanceof HTMLElement) {
      body.style.fontSize = '32px';
      body.style.lineHeight = '1.5';
    }
  }

  // Handle any Next.js Image components
  const nextImages = clone.getElementsByTagName('img');
  for (const img of nextImages) {
    // Remove Next.js specific attributes that might interfere with rendering
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    // Ensure image covers its container properly
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
  }

  // Remove any GSAP or animation-related elements
  const scripts = clone.getElementsByTagName('script');
  for (const script of Array.from(scripts)) {
    script.remove();
  }

  // Adjust container paddings and margins for 1920x1080
  const containers = clone.getElementsByClassName(defaultTheme.spacing.container);
  for (const container of containers) {
    if (container instanceof HTMLElement) {
      container.style.maxWidth = '1440px'; // Equivalent to max-w-7xl
      container.style.padding = '0 32px'; // Equivalent to px-8
    }
  }

  return clone;
};

interface CapturedSlide {
  canvas: HTMLCanvasElement;
  index: number;
}

const captureSlide = async (slideContent: Element, printContainer: HTMLElement, index: number): Promise<CapturedSlide> => {
  console.log(`Preparing slide ${index + 1} for capture...`);
  
  // Clear the container
  printContainer.innerHTML = '';
  
  // Clone and prepare slide for print
  const printSlide = cloneSlideForPrint(slideContent);
  printContainer.appendChild(printSlide);

  // Wait a bit for images to load
  await new Promise(resolve => setTimeout(resolve, 300));

  console.log(`Capturing slide ${index + 1}...`);
  
  // Capture the slide
  const canvas = await html2canvas(printContainer, {
    scale: 2, // Higher quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    logging: true, // Enable logging for debugging
  });

  console.log(`Slide ${index + 1} captured successfully`);
  return { canvas, index };
};

export const generatePDF = async (config: PDFGeneratorConfig) => {
  console.log('Initializing PDF generation...');
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    compress: true
  });

  try {
    // Create hidden container for print
    const printContainer = createPrintContainer();
    console.log('Print container created');
    
    // Process each slide
    const capturedSlides: CapturedSlide[] = [];
    for (let i = 0; i < config.slides.length; i++) {
      const captured = await captureSlide(config.slides[i], printContainer, i);
      capturedSlides.push(captured);
    }

    // Sort slides by index to ensure correct order
    capturedSlides.sort((a, b) => a.index - b.index);

    // Add each slide to the PDF
    capturedSlides.forEach((captured, i) => {
      if (i > 0) {
        pdf.addPage();
      }

      const imgData = captured.canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
      console.log(`Added slide ${i + 1} to PDF`);
    });

    // Clean up
    if (document.body.contains(printContainer)) {
      document.body.removeChild(printContainer);
    }
    console.log('Print container cleaned up');

    // Save the PDF
    const filename = `${config.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    console.log(`Saving PDF as: ${filename}`);
    pdf.save(filename);
    console.log('PDF saved successfully');

  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
}; 