import React, { useState, useEffect, useRef } from 'react';
import { Settings, ArrowUpRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';

export default function TopDestinations({ onOpenOfferModal }) {
  const [scrollPos, setScrollPos] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const trackRef = useRef(null);

  // Auto-scroll loop: smoothly advance every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (trackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        const cardWidth = 360; // card + gap
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          trackRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const handleScrollUpdate = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Estimate active node based on current scroll position
      const cardWidth = 360;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveNodeIndex(Math.min(Math.max(0, index), DESTINATIONS.length - 1));
    }
  };

  const handleScroll = (direction) => {
    if (trackRef.current) {
      const cardWidth = 360;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5,
        behavior: 'smooth'
      });
      setTimeout(handleScrollUpdate, 350);
    }
  };

  const scrollToDestination = (index) => {
    if (trackRef.current) {
      const cardWidth = 360;
      trackRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveNodeIndex(index);
      setTimeout(handleScrollUpdate, 350);
    }
  };

  // Quadratic Bezier arc math
  const getArcPoint = (t) => {
    const p0 = { x: 30, y: 15 };
    const p1 = { x: 450, y: 85 };
    const p2 = { x: 870, y: 15 };
    const oneMinusT = 1 - t;
    return {
      x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
      y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
    };
  };

  const tValues = [0.06, 0.20, 0.35, 0.50, 0.65, 0.80, 0.94];
  const arcNodes = tValues.map((t, i) => {
    const dest = DESTINATIONS[i % DESTINATIONS.length];
    const point = getArcPoint(t);
    return {
      ...point,
      dest,
      destIndex: i,
      isActive: i === (activeNodeIndex % tValues.length)
    };
  });

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
              <path 
                d="M 30 15 Q 450 85 870 15" 
                stroke="#d97706" 
                strokeWidth="2" 
                strokeDasharray="4 8" 
                strokeLinecap="round"
                fill="none" 
              />

              {arcNodes.map((node, idx) => (
                <g 
                  key={idx}
                  className={`flag-node-group ${node.isActive ? 'active-node' : ''}`}
                  onClick={() => scrollToDestination(node.destIndex)}
                  style={{ cursor: 'pointer' }}
                >
                  {node.isActive && (
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={18} 
                      fill="none" 
                      stroke="#d97706" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="active-pulse-ring"
                    />
                  )}

                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={node.isActive ? 13 : 10} 
                    fill="#ffffff" 
                    stroke={node.isActive ? '#b45309' : '#d4b3a2'} 
                    strokeWidth={node.isActive ? 2.5 : 1.5} 
                    className="flag-node-circle"
                  />

                  <text 
                    x={node.x} 
                    y={node.y + (node.isActive ? 4 : 3)} 
                    fontSize={node.isActive ? "12" : "10"} 
                    textAnchor="middle" 
                    className="flag-node-emoji"
                  >
                    {node.dest.flag}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Multi-Card Side-by-Side Showcase Carousel */}
        <div className="multi-card-showcase-wrapper">
          <button 
            className={`slider-nav-btn nav-btn-left ${!canScrollLeft ? 'disabled' : ''}`} 
            onClick={() => handleScroll('left')} 
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            className="dest-cards-scroll-track"
            ref={trackRef}
            onScroll={handleScrollUpdate}
          >
            {DESTINATIONS.map((dest, idx) => (
              <div 
                key={dest.id}
                className="destination-side-card"
                onClick={() => onOpenOfferModal && onOpenOfferModal(dest.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenOfferModal && onOpenOfferModal(dest.name);
                  }
                }}
              >
                {/* Photo Header */}
                <div className="side-card-photo-box">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="side-card-img" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="side-card-flag-badge">
                    <span className="side-badge-flag">{dest.flag}</span>
                    <span className="side-badge-name">{dest.name}</span>
                  </div>

                  <span className="side-card-pkg-pill">
                    {dest.packagesCount} Curated Tours
                  </span>
                </div>

                {/* Content Body */}
                <div className="side-card-body-box">
                  <span className="side-card-category">{dest.category} · {dest.packagesCount} PACKAGES</span>
                  <h3 className="side-card-title">{dest.name}</h3>
                  <p className="side-card-desc">{dest.description}</p>

                  <div className="side-card-cta-row">
                    <button 
                      className="btn-explore-side"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOfferModal && onOpenOfferModal(dest.name);
                      }}
                    >
                      <span>Explore All Tours</span>
                      <span className="side-btn-badge-icon">
                        <ArrowUpRight size={14} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className={`slider-nav-btn nav-btn-right ${!canScrollRight ? 'disabled' : ''}`} 
            onClick={() => handleScroll('right')} 
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Supporting Caption Footer */}
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
              <span className="face-flag">🇹🇭</span>
              <span className="face-flag">🇲🇻</span>
            </div>
            <span>View All Destinations & Get Custom Offer</span>
            <span className="btn-badge-icon">
              <ArrowUpRight size={15} />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .destinations-section {
          position: relative;
          background-color: #faece1;
          background-image: url('/curated-destinations-bg.png');
          background-size: 100% 100%;
          background-position: center center;
          background-repeat: no-repeat;
          padding: 55px 0 65px;
          overflow: hidden;
        }

        .destinations-header {
          text-align: center;
          margin-bottom: 22px;
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
          font-size: clamp(26px, 3.5vw, 42px);
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin: 0 0 4px 0;
        }

        .accent-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
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
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.08));
        }

        .flag-node-group:hover .flag-node-circle {
          transform: scale(1.15);
          stroke: #b45309;
        }

        .active-pulse-ring {
          animation: spinPulse 6s linear infinite;
        }

        @keyframes spinPulse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Multi-Card Side-by-Side Showcase */
        .multi-card-showcase-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 30px;
          display: flex;
          align-items: center;
        }

        .dest-cards-scroll-track {
          display: flex;
          gap: 22px;
          width: 100%;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          padding: 12px 6px 20px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .dest-cards-scroll-track::-webkit-scrollbar {
          display: none;
        }

        /* Individual Destination Side-by-Side Card */
        .destination-side-card {
          flex: 0 0 340px;
          width: 340px;
          scroll-snap-align: start;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.07);
          border: 1px solid rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .destination-side-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(74, 56, 40, 0.16);
        }

        .side-card-photo-box {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .side-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .destination-side-card:hover .side-card-img {
          transform: scale(1.06);
        }

        .side-card-flag-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 700;
          font-size: 11.5px;
          color: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .side-card-pkg-pill {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(6px);
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 9999px;
        }

        .side-card-body-box {
          padding: 22px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: left;
        }

        .side-card-category {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b45309;
          margin-bottom: 6px;
        }

        .side-card-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .side-card-desc {
          font-size: 13px;
          color: #57534e;
          line-height: 1.55;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .side-card-cta-row {
          display: flex;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #f5f5f4;
        }

        .btn-explore-side {
          background: #18181b;
          color: #ffffff;
          border: none;
          padding: 9px 16px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-explore-side:hover {
          background: #d97706;
          transform: translateY(-1px);
        }

        .side-btn-badge-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Nav Arrow Buttons */
        .slider-nav-btn {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          z-index: 10;
          transition: all 0.2s ease;
        }

        .slider-nav-btn:hover:not(.disabled) {
          background: #18181b;
          color: #ffffff;
          transform: scale(1.08);
        }

        .slider-nav-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none;
        }

        .nav-btn-left { left: -16px; }
        .nav-btn-right { right: -16px; }

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

        @media (max-width: 768px) {
          .destination-side-card { flex: 0 0 280px; width: 280px; }
          .side-card-photo-box { height: 175px; }
          .side-card-title { font-size: 18px; }
          .nav-btn-left { left: 4px; }
          .nav-btn-right { right: 4px; }
        }

        @media (max-width: 600px) {
          .flight-path-container { display: none; }
          .destinations-h2 { font-size: clamp(24px, 6.5vw, 32px); }
          .facepile-btn { width: 100%; max-width: 320px; justify-content: center; font-size: 12px; padding: 8px 14px; }
        }
      `}</style>
    </section>
  );
}
