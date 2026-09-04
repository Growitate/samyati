import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Settings, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';

export default function TopDestinations({ onOpenOfferModal, onNavigate }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  const handleExploreDestination = (dest) => {
    if (onNavigate) {
      const targetPage = (dest.category || '').toLowerCase().includes('inter') ? 'videsh' : 'desh';
      onNavigate(targetPage);
    } else if (onOpenOfferModal) {
      onOpenOfferModal(dest.name);
    }
  };

  // Calculate actual card scroll step
  const getCardStep = () => {
    if (cardRefs.current && cardRefs.current[0]) {
      return cardRefs.current[0].offsetWidth + 24; // card width + gap
    }
    return window.innerWidth > 1100 ? 604 : window.innerWidth > 768 ? 544 : 334;
  };

  // Auto-scroll loop: advances smoothly every 4 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      if (trackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        const step = getCardStep();
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          trackRef.current.scrollBy({ left: step, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handleScrollUpdate = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      const leftOverflow = scrollLeft > 10;
      const rightOverflow = scrollLeft < scrollWidth - clientWidth - 10;

      setCanScrollLeft((prev) => (prev !== leftOverflow ? leftOverflow : prev));
      setCanScrollRight((prev) => (prev !== rightOverflow ? rightOverflow : prev));

      const step = getCardStep();
      const index = Math.min(Math.max(0, Math.round(scrollLeft / step)), DESTINATIONS.length - 1);
      setActiveCardIndex((prev) => (prev !== index ? index : prev));
    }
  };

  useEffect(() => {
    handleScrollUpdate();
    const handleResize = () => handleScrollUpdate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (direction) => {
    if (trackRef.current) {
      const step = getCardStep();
      trackRef.current.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth'
      });
      setTimeout(handleScrollUpdate, 350);
    }
  };

  const scrollToDestination = (index) => {
    if (trackRef.current) {
      const step = getCardStep();
      trackRef.current.scrollTo({
        left: index * step,
        behavior: 'smooth'
      });
      setActiveCardIndex(index);
      setTimeout(handleScrollUpdate, 350);
    }
  };

  // Static arc nodes — computed once, never re-computed on scroll/state change
  const arcNodes = useMemo(() => {
    const tValues = [0.06, 0.20, 0.35, 0.50, 0.65, 0.80, 0.94];
    const KEY_DEST_INDICES = [0, 2, 4, 6, 8, 10, 12];
    const p0 = { x: 30, y: 15 };
    const p1 = { x: 450, y: 85 };
    const p2 = { x: 870, y: 15 };

    return tValues.map((t, i) => {
      const oneMinusT = 1 - t;
      const x = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
      const y = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y;
      const destIdx = KEY_DEST_INDICES[i] || i;
      const dest = DESTINATIONS[destIdx] || DESTINATIONS[0];
      return { x, y, dest, destIndex: destIdx };
    });
  }, []); // empty deps — truly static, never re-runs

  return (
    <section className="destinations-section" id="destinations">
      <div className="container">
        {/* Header Block */}
        <div className="destinations-header">
          <div className="eyebrow-pill">
            <Settings className="gear-icon" size={12} />
            <span>Explore the World</span>
            <Settings className="gear-icon" size={12} />
          </div>

          <h2 className="destinations-h2">
            Top <span className="accent-serif">Escapes</span> for Upcoming Seasons
          </h2>

          {/* Dotted Flight Path Arc SVG with Country Flag Nodes */}
          <div className="flight-path-container">
            <svg viewBox="0 0 900 85" fill="none" className="flight-arc-svg">
              <defs>
                <linearGradient id="flightArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="25%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="75%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="arcGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#d97706" floodOpacity="0.35" />
                </filter>
              </defs>

              <path
                d="M 30 15 Q 450 85 870 15"
                stroke="url(#flightArcGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                filter="url(#arcGlow)"
              />

              {arcNodes.map((node, idx) => (
                <g key={idx}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={11}
                    fill="#ffffff"
                    stroke="#d97706"
                    strokeWidth="2.5"
                    className="flag-node-circle"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={4.5}
                    fill="#d97706"
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Multi-Card Side-by-Side 2-Panel Carousel */}
        <div
          className="multi-panel-showcase-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            className={`panel-scroll-arrow arrow-left ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous destinations"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            className="multi-panel-scroll-track"
            ref={trackRef}
            onScroll={handleScrollUpdate}
          >
            {DESTINATIONS.map((dest, idx) => (
              <div
                key={dest.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="destination-panel-card"
                onClick={() => handleExploreDestination(dest)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExploreDestination(dest);
                  }
                }}
              >
                {/* Left Photo Panel */}
                <div className="panel-photo-side">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="panel-img"
                    loading={idx < 3 ? "eager" : "lazy"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="country-badge">
                    <span className="badge-flag">{dest.flag}</span>
                    <span className="badge-name">{dest.name}</span>
                  </div>
                </div>

                {/* Right White Content Panel */}
                <div className="panel-info-side">
                  <span className="tours-count">{dest.category} · {dest.packagesCount} CURATED PACKAGES</span>
                  <h3 className="panel-title">{dest.name}</h3>
                  <p className="panel-desc">{dest.description}</p>

                  <div className="panel-cta-row">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExploreDestination(dest);
                      }}
                      className="btn-pill btn-pill-dark"
                      title={`Explore all ${dest.name} tours`}
                    >
                      <span>Explore All Tours</span>
                      <span className="btn-badge-icon">
                        <ArrowUpRight size={15} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`panel-scroll-arrow arrow-right ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next destinations"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Central Progress Dots Indicator Row */}
        <div className="carousel-dots-progress-bar">
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.id}
              className={`carousel-dot-item ${i === activeCardIndex ? 'active' : ''}`}
              onClick={() => scrollToDestination(i)}
              aria-label={`Scroll to ${d.name}`}
              title={d.name}
            />
          ))}
        </div>

        {/* Supporting Caption */}
        <div className="destinations-footer">
          <p className="footer-subcaption">
            From mist-wrapped mountain trails to sun-drenched coastal villages — hand-selected destinations that offer experiences lasting long after you return.
          </p>

          <button onClick={() => onOpenOfferModal()} className="btn-pill btn-pill-white facepile-btn">
            <div className="flag-facepile">
              <span className="face-flag">🇮🇳</span>
              <span className="face-flag">🇮🇩</span>
              <span className="face-flag">🇦🇪</span>
              <span className="face-flag">🇨🇭</span>
            </div>
            <span>View All Destinations & Get Offer</span>
            <span className="btn-badge-icon">
              <ArrowUpRight size={15} />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .destinations-section {
          position: relative;
          background-color: #fefce8;
          padding: 36px 0 40px;
          overflow: hidden;
        }

        .destinations-header {
          text-align: center;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 600;
          color: #78350f;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          margin-bottom: 8px;
        }

        .gear-icon {
          color: #d97706;
        }

        .destinations-h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: var(--text-dark, #141613);
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
        }

        .destinations-h2 .accent-serif,
        .accent-serif {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 1.18em;
          color: #d97706;
          vertical-align: baseline;
          padding: 0 0.08em;
          display: inline-block;
        }

        .flight-path-container {
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
        }

        .flight-arc-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .flag-node-circle {
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.08));
        }

        /* Multi-Panel Side-by-Side Track */
        .multi-panel-showcase-wrapper {
          position: relative;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
        }

        .multi-panel-scroll-track {
          display: flex;
          gap: 24px;
          width: 100%;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          padding: 14px 8px 20px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .multi-panel-scroll-track::-webkit-scrollbar {
          display: none;
        }

        /* Individual 2-Panel Card inside the multi-card row */
        .destination-panel-card {
          flex: 0 0 580px;
          width: 580px;
          scroll-snap-align: start;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          background: #ffffff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .destination-panel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 42px rgba(74, 56, 40, 0.16);
        }

        .panel-photo-side {
          position: relative;
          height: 290px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .panel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .destination-panel-card:hover .panel-img {
          transform: scale(1.05);
        }

        .country-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          padding: 4px 11px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 11.5px;
          color: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .panel-info-side {
          padding: 24px 24px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }

        .tours-count {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b45309;
          margin-bottom: 6px;
        }

        .panel-title {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .panel-desc {
          font-size: 12.5px;
          color: #555555;
          line-height: 1.55;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .panel-cta-row {
          display: flex;
          align-items: center;
          margin-top: auto;
        }

        .btn-pill-dark {
          background: #0f172a;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 7px 8px 7px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .btn-pill-dark:hover {
          background: #000000;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.28);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .btn-pill-dark:active {
          transform: translateY(0) scale(0.98);
        }

        .btn-badge-icon {
          width: 26px;
          height: 26px;
          background: #ffffff;
          color: #0f172a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .btn-pill-dark:hover .btn-badge-icon {
          transform: scale(1.08) translate(1px, -1px);
          background: #d97706;
          color: #ffffff;
        }

        /* Floating Nav Arrows */
        .panel-scroll-arrow {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
          z-index: 10;
          transition: all 0.2s ease;
        }

        .panel-scroll-arrow:hover:not(.disabled) {
          background: #18181b;
          color: #ffffff;
          transform: scale(1.08);
        }

        .panel-scroll-arrow.disabled {
          opacity: 0.25;
          cursor: not-allowed;
          box-shadow: none;
        }

        .arrow-left { left: -18px; }
        .arrow-right { right: -18px; }

        /* Central Progress Dots Indicator Row */
        .carousel-dots-progress-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 24px;
        }

        .carousel-dot-item {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #d4b3a2;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .carousel-dot-item:hover {
          background: #b45309;
        }

        .carousel-dot-item.active {
          width: 24px;
          background: #b45309;
        }

        /* Supporting Caption */
        .destinations-footer {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .footer-subcaption {
          font-size: 13.5px;
          color: #6b635b;
          max-width: 560px;
          line-height: 1.5;
        }

        .btn-pill-white {
          background: #ffffff;
          color: #18181b;
          border: 1px solid #e5e7eb;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .btn-pill-white:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .facepile-btn {
          padding-left: 12px;
        }

        .flag-facepile {
          display: flex;
          align-items: center;
          margin-right: 2px;
        }

        .face-flag {
          font-size: 14px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #f3f4f6;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          margin-left: -5px;
        }

        .face-flag:first-child { margin-left: 0; }

        @media (max-width: 1100px) {
          .destination-panel-card { flex: 0 0 520px; width: 520px; }
          .panel-photo-side { height: 260px; }
          .panel-info-side { padding: 20px; }
          .arrow-left { left: 4px; }
          .arrow-right { right: 4px; }
        }

        @media (max-width: 768px) {
          .destination-panel-card { flex: 0 0 310px; width: 310px; grid-template-columns: 1fr; border-radius: 18px; }
          .panel-photo-side { height: 190px; }
          .panel-info-side { padding: 18px; }
          .panel-title { font-size: 19px; }
          .arrow-left { left: 2px; }
          .arrow-right { right: 2px; }
        }

        @media (max-width: 600px) {
          .flight-path-container { display: block; max-width: 100%; margin: 6px auto 10px; }
          .destinations-h2 { font-size: clamp(24px, 6.5vw, 32px); }
          .facepile-btn { width: 100%; max-width: 320px; justify-content: center; font-size: 12px; padding: 8px 14px; }
        }
      `}</style>
    </section>
  );
}
