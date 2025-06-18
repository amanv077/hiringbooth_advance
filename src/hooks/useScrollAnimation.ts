'use client';

import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return elementRef;
}

export function useParallaxEffect() {
  useEffect(() => {
    // Add JS class to enable animations
    document.documentElement.classList.add('js');
    
    // Initialize scroll animations
    const initScrollAnimations = () => {
      const scrollElements = document.querySelectorAll('.scroll-animate');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      scrollElements.forEach((element) => {
        observer.observe(element);
        // Immediately show elements that are already in viewport
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add('in-view');
        }
      });

      return observer;
    };

    // Simple parallax effect for desktop
    const handleScroll = () => {
      if (window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-cta, .parallax-hero, .parallax-features');
        
        parallaxElements.forEach((element) => {
          const rate = scrolled * -0.2;
          (element as HTMLElement).style.backgroundPositionY = `${rate}px`;
        });
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const observer = initScrollAnimations();
      
      // Cleanup function
      return () => {
        observer.disconnect();
      };
    }, 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.classList.remove('js');
    };
  }, []);
}
