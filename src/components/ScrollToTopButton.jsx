import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollTo } from '../smoothScroll';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }

      if (scrollTop > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    scrollTo(0);
  };

  // SVG circular calculation: radius 20 => circumference = 2 * PI * 20 ≈ 125.66
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      <button
        onClick={handleScrollToTop}
        className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
        aria-label="Scroll back to top"
        title="Scroll to Top"
      >
        {/* Circular Progress Ring */}
        <svg className="scroll-progress-svg" width="48" height="48" viewBox="0 0 48 48">
          {/* Subtle Background Track */}
          <circle
            className="progress-track"
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            strokeWidth="2"
          />
          {/* Active Dynamic Progress Gold Ring */}
          <circle
            className="progress-indicator"
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Icon */}
        <div className="arrow-icon-wrapper">
          <ArrowUp size={18} className="top-arrow-icon" />
        </div>
      </button>

      <style>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 999;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(11, 17, 33, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #fef08a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px) scale(0.88);
          transition: 
            opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease;
          padding: 0;
        }

        .scroll-to-top-btn.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        /* SVG Ring Positioning */
        .scroll-progress-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
          pointer-events: none;
        }

        .progress-track {
          stroke: rgba(255, 255, 255, 0.1);
        }

        .progress-indicator {
          stroke: url(#goldGradient) #f59e0b;
          stroke: #f59e0b;
          transition: stroke-dashoffset 0.12s linear;
        }

        .arrow-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .top-arrow-icon {
          color: #fef08a;
          stroke-width: 2.2px;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
        }

        /* Hover State with Gold Ambient Aura */
        .scroll-to-top-btn:hover {
          background: rgba(15, 23, 42, 0.96);
          border-color: rgba(245, 158, 11, 0.6);
          transform: translateY(-4px) scale(1.08);
          box-shadow: 
            0 14px 36px rgba(0, 0, 0, 0.5), 
            0 0 24px rgba(245, 158, 11, 0.4);
        }

        .scroll-to-top-btn:hover .progress-indicator {
          stroke: #fbbf24;
        }

        .scroll-to-top-btn:hover .top-arrow-icon {
          transform: translateY(-3px);
          color: #ffffff;
        }

        /* Active / Click State */
        .scroll-to-top-btn:active {
          transform: translateY(-1px) scale(0.96);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .scroll-to-top-btn {
            bottom: 22px;
            right: 22px;
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </>
  );
}
