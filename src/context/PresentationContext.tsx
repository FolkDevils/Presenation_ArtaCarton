'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PresentationConfig, Slide } from '../types/slides';

interface PresentationContextType {
  currentSlideIndex: number;
  totalSlides: number;
  presentationTitle: string;
  currentSlide: Slide | null;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (index: number) => void;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export const usePresentationContext = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentationContext must be used within a PresentationProvider');
  }
  return context;
};

interface PresentationProviderProps {
  children: React.ReactNode;
  config: PresentationConfig;
}

export const PresentationProvider: React.FC<PresentationProviderProps> = ({
  children,
  config,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => 
      prev < config.slides.length - 1 ? prev + 1 : prev
    );
  }, [config.slides.length]);

  const previousSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < config.slides.length) {
      setCurrentSlideIndex(index);
    }
  }, [config.slides.length]);

  const value = {
    currentSlideIndex,
    totalSlides: config.slides.length,
    presentationTitle: config.title,
    currentSlide: config.slides[currentSlideIndex] || null,
    nextSlide,
    previousSlide,
    goToSlide,
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}; 