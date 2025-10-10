"use client"

import React, { useEffect, useRef, useState } from 'react';
import Hero from './Hero';
import Features from './Features';
import Roadmap from './Roadmap';
import CTA from './CTA';
import Footer from './Footer';
import Navbar from './Navbar';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
  const roadmapRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref: { current: { scrollIntoView: (arg0: { behavior: string; }) => void; }; }) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // const text = ``  
  // console.log(text)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--neutral-950)] dark:to-[var(--primary-900)] transition-colors duration-300">
      <Navbar/>
      <Hero isVisible={isVisible} />
      <Features featuresRef={featuresRef} />
      <Roadmap roadmapRef={roadmapRef} />
      <CTA />
      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        .animate-on-scroll {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}