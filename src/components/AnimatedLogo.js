import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import FolkDevilsLogo from './FolkDevilsLogo';

const AnimatedLogo = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    const letterOrder = ['F', 'O', 'L1', 'K', 'D', 'E', 'V', 'I', 'L2', 'S'];
    const letters = letterOrder.map(id => logo.querySelector(`#letter-${id}`));

    // Initial setup: ensure all letters are visible and at their original size
    gsap.set(letters, { 
      opacity: 1, 
      scale: 1,
      transformOrigin: 'center center' // This sets the transform origin to the center of each letter
    });

    // Create a timeline for the sequential animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 15 }); // Add repeatDelay for 8 seconds between cycles

    letters.forEach((letter) => {
      tl.to(letter, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out",
        transformOrigin: 'center center' // Ensure scaling happens from the center
      })
      .to(letter, {
        scale: 1,
        duration: 0.5,
        ease: "power2.in",
        transformOrigin: 'center center' // Ensure scaling happens from the center
      });
    });

    // Add hover effect
    letters.forEach(letter => {
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
          transformOrigin: 'center center' // Ensure scaling happens from the center
        });
      });

      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.in',
          transformOrigin: 'center center' // Ensure scaling happens from the center
        });
      });
    });

    // Animate accents continuously
    const accents = logo.querySelectorAll('#elements > g');
    const accentsTimeline = gsap.to(accents, {
      y: "+=5",
      rotation: "+=5",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      transformOrigin: 'center center', // Center the rotation of accents
      stagger: {
        each: 0.1,
        from: "random"
      }
    });

    // Add hover effect to accent-04 for blinking eyes
    const accent04 = logo.querySelector('#elements #accent-04');
    const eyes = accent04.querySelectorAll('#eyes path');

    const blink = () => {
      const tl = gsap.timeline();
      tl.to(eyes, {
        scaleY: 0.2,
        scaleX: .5,
        duration: 0.1,
        ease: 'power2.inOut',
        transformOrigin: 'center center'
      })
      .to(eyes, {
        scaleY: 1,
        scaleX: 1,
        duration: 0.1,
        ease: 'power2.inOut',
        transformOrigin: 'center center'
      });
    };

    accent04.addEventListener('mouseenter', blink);
    accent04.addEventListener('mouseleave', blink);

    // Add hover effect to accent-04 for animating lips
    const lips = accent04.querySelector('#lips path');

    const randomShapes = [
      'M132 168.5C132.5 169.5 134.285 171 137 171C141.5 171 142.693 168.268 143 167.5C143.307 166.732 143.5 166 143.5 164.5C143.5 162.438 142.375 160.5 142 160C141.25 159 140.5 158.5 138 158C136 157.6 134.562 157.939 132.5 160C131.5 161 131 163.5 131 164.5C131 165.5 131.567 167.633 132 168.5Z', // Original path data
      'M130.5 167C131.233 168.832 134.285 171 137 171C141.5 171 143 170 144.5 168.5C146 167 145.707 165.5 145 165.5C144.5 165.5 143.833 166 143.5 166.5C142 168 138.5 169 136 168.5C134 168.1 133.5 167.5 132.5 166.5C132 165.5 131.566 165 131 165C130 165 130.14 166.1 130.5 167Z', // Another slightly modified path data
   'M126 155.5C125 158 125 160.5 125.5 162C126 163.5 126.5 164 126.5 164C126.5 164 129.042 167.458 130.5 166C131 165.5 131 164.5 129.5 164C128.36 163.62 127 162 127 159C127 156 128.807 154.578 129 154C129.193 153.422 129.006 152.753 128.5 152.5C127.5 152 127 153 126 155.5Z',
   'M127.253 156.5C125.753 166.5 131.253 170 135.253 171C146.253 173 151.753 162.5 152.253 161.5C152.753 160.5 152.46 160 151.753 160C151.253 160 151.086 160.5 150.753 161C148.753 165 144.163 165.69 136.5 163.5C129.5 161.5 128.253 161 128.753 157C128.753 156.833 129.259 154.753 128.753 154.5C127.753 154 127.482 155.409 127.253 156.5Z'
   
    ];
    const originalShape = lips.getAttribute('d');

    const animateLips = () => {
      const randomShape = randomShapes[Math.floor(Math.random() * randomShapes.length)];
      gsap.to(lips, {
        attr: { d: randomShape },
        duration: 0.5,
        ease: 'power2.inOut'
      });
    };

    const resetLips = () => {
      gsap.to(lips, {
        attr: { d: originalShape },
        duration: 0.5,
        ease: 'power2.inOut'
      });
    };

    accent04.addEventListener('mouseenter', animateLips);
    accent04.addEventListener('mouseleave', resetLips);

    // Add hover effect to accent-01 to accent-09 for scaling and rotating
    for (let i = 1; i <= 9; i++) {
      const accent = logo.querySelector(`#elements #accent-0${i}`);
      
      const scaleAndRotate = () => {
        accentsTimeline.pause(); // Pause continuous animation
        gsap.to(accent, {
          scale: 1.15,
          rotation: gsap.utils.random(-10, 10),
          duration: 0.3,
          ease: 'power2.inOut',
          transformOrigin: 'center center'
        });
      };

      const resetScaleAndRotate = () => {
        gsap.to(accent, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          transformOrigin: 'center center'
        }).then(() => {
          accentsTimeline.play(); // Resume continuous animation
        });
      };

      accent.addEventListener('mouseenter', scaleAndRotate);
      accent.addEventListener('mouseleave', resetScaleAndRotate);
    }

    // Cleanup event listeners on unmount
    return () => {
      letters.forEach(letter => {
        letter.removeEventListener('mouseenter', () => {});
        letter.removeEventListener('mouseleave', () => {});
      });
      accent04.removeEventListener('mouseenter', blink);
      accent04.removeEventListener('mouseleave', blink);
      accent04.removeEventListener('mouseenter', animateLips);
      accent04.removeEventListener('mouseleave', resetLips);

      for (let i = 1; i <= 9; i++) {
        const accent = logo.querySelector(`#elements #accent-0${i}`);
        accent.removeEventListener('mouseenter', () => {});
        accent.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <div ref={logoRef}>
      <FolkDevilsLogo />
    </div>
  );
};

export default AnimatedLogo;
