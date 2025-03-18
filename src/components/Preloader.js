import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ progress, isLoading }) => {
  const overlayRef = useRef(null);
  const progressBarRef = useRef(null);
  const textRef = useRef(null);
  const letterRefs = useRef([]);

  useEffect(() => {
    // Split the "Loading" text into individual spans
    if (textRef.current) {
      const text = "LOADING";
      textRef.current.innerHTML = text
        .split('')
        .map((letter, i) => `<span class="inline-block loading-letter">${letter}</span>`)
        .join('');
      
      // Store refs to each letter
      letterRefs.current = Array.from(textRef.current.querySelectorAll('.loading-letter'));
    }
  }, []);

  useEffect(() => {
    // Animate the progress bar width based on loading progress
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [progress]);

  useEffect(() => {
    // When loading is complete, animate out the preloader
    if (!isLoading && overlayRef.current) {
      const tl = gsap.timeline();
      
      // Animate each letter up and fade out
      letterRefs.current.forEach((letter, i) => {
        tl.to(letter, {
          y: -30,
          opacity: 0,
          duration: 0.3,
          ease: "back.in(1.7)"
        }, i * 0.05);
      });

      // Animate progress bar
      tl.to(progressBarRef.current.parentElement, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in"
      }, "<0.2");

      // Use clip-path for the circle animation
      tl.to(overlayRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [isLoading]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        clipPath: "circle(100% at 50% 50%)"
      }}
      className="bg-black"
    >
      <div
        ref={textRef}
        className="text-white text-xl font-bold mb-4 tracking-[0.1em] font-rubik"
        style={{
          fontWeight: 700
        }}
      >
        LOADING
      </div>
      <div
        style={{
          width: '160px',
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            width: '0%',
            height: '100%',
            backgroundColor: '#ffffff',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default Preloader; 