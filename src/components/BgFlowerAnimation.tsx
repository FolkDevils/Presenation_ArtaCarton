'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface BgFlowerAnimationProps {
  animateFlowers?: boolean;
}

const BgFlowerAnimation: React.FC<BgFlowerAnimationProps> = ({ animateFlowers = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowersRef = useRef<(HTMLImageElement | null)[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!animateFlowers) {
      flowersRef.current.forEach((flower) => {
        if (flower) {
          gsap.killTweensOf(flower);
        }
      });
      return;
    }

    const flowers = flowersRef.current.filter((flower): flower is HTMLImageElement => flower !== null);
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const totalHeight = viewportHeight + 100;

    const resetFlower = (flower: HTMLImageElement) => {
      gsap.set(flower, {
        y: -80,
        rotation: gsap.utils.random(-360, 360),
        opacity: 0,
      });

      gsap.to(flower, {
        opacity: gsap.utils.random(0.5, 1),
        duration: 1,
        ease: "power1.in"
      });

      animateFall(flower);
    };

    const animateFall = (flower: HTMLImageElement) => {
      const duration = gsap.utils.random(10, 15);
      const swayAmount = gsap.utils.random(30, 100);
      const swayDuration = gsap.utils.random(2, 5);

      gsap.to(flower, {
        y: totalHeight,
        duration: duration,
        ease: "none",
        onComplete: () => resetFlower(flower),
      });

      gsap.to(flower, {
        x: `+=${swayAmount}`,
        rotation: `+=${gsap.utils.random(180, 360)}`,
        duration: swayDuration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    };

    const animateFlowersFunc = () => {
      flowers.forEach((flower) => {
        gsap.set(flower, {
          x: gsap.utils.random(0, viewportWidth + 0),
          y: gsap.utils.random(-500, totalHeight + 200),
          rotation: gsap.utils.random(-360, 360),
          scale: gsap.utils.random(0.7, 1),
          opacity: gsap.utils.random(0.3, 1),
        });

        animateFall(flower);
      });

      setIsLoaded(true);
    };

    const imagePromises = flowers.map((flower) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.src = flower.src;
      });
    });

    Promise.all(imagePromises).then(animateFlowersFunc);

    return () => {
      flowers.forEach((flower) => {
        gsap.killTweensOf(flower);
      });
    };
  }, [animateFlowers]);

  const flowerImages = Array(30).fill(null).map((_, index) => {
    const flowerNumber = (index % 3) + 1;
    return `/flower_0${flowerNumber}.png`;
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
    >
      {flowerImages.map((src, index) => (
        <img
          key={index}
          ref={(el) => {
            flowersRef.current[index] = el;
          }}
          src={src}
          alt={`Falling flower ${index + 1}`}
          className={`absolute w-12 h-12 object-contain ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.5s ease-in' }}
        />
      ))}
    </div>
  );
};

export default BgFlowerAnimation; 