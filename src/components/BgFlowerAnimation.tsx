'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export const BgFlowerAnimation = () => {
  const flowersRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const flowerImages = [
    '/flower_01.png',
    '/flower_02.png',
    '/flower_03.png'
  ];

  useEffect(() => {
    const animateFlowers = () => {
      flowersRef.current.forEach((flower, index) => {
        if (!flower) return;

        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 2;

        gsap.set(flower, {
          x: startX,
          y: -100,
          rotation: 0,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0
        });

        gsap.to(flower, {
          duration,
          y: window.innerHeight + 100,
          x: endX,
          rotation: Math.random() * 360,
          opacity: 1,
          ease: "none",
          delay,
          onComplete: () => {
            animateFlower(flower);
          }
        });
      });
    };

    const animateFlower = (flower: HTMLDivElement) => {
      const startX = Math.random() * window.innerWidth;
      const endX = startX + (Math.random() - 0.5) * 200;
      const duration = 3 + Math.random() * 2;

      gsap.set(flower, {
        x: startX,
        y: -100,
        rotation: 0,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0
      });

      gsap.to(flower, {
        duration,
        y: window.innerHeight + 100,
        x: endX,
        rotation: Math.random() * 360,
        opacity: 1,
        ease: "none",
        onComplete: () => {
          animateFlower(flower);
        }
      });
    };

    setIsLoaded(true);
    animateFlowers();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none"
    >
      <div className="relative w-full h-full">
        {flowerImages.map((src, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) {
                flowersRef.current[index] = el;
              }
            }}
            className={`absolute opacity-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={src}
              alt={`Flower ${index + 1}`}
              width={200}
              height={200}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 