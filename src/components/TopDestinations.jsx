import React, { useState } from 'react';
import { Settings, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';

export default function TopDestinations({ onOpenOfferModal }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = DESTINATIONS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? DESTINATIONS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === DESTINATIONS.length - 1 ? 0 : prev + 1));
  };

  // Quadratic Bezier arc math: start (30,15), control (450,100), end (870,15)
  const getArcPoint = (t) => {
    const p0 = { x: 30, y: 15 };
    const p1 = { x: 450, y: 100 };
    const p2 = { x: 870, y: 15 };
    const oneMinusT = 1 - t;
    return {
      x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
      y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
    };
  };

  // 7 nodes along arc
  const tValues = [0.06, 0.20, 0.35, 0.50, 0.65, 0.80, 0.94];
  const offsetIndices = [-3, -2, -1, 0, 1, 2, 3];

  const visibleNodes = tValues.map((t, i) => {
    const destIndex = (currentIndex + offsetIndices[i] + DESTINATIONS.length * 10) % DESTINATIONS.length;
    const dest = DESTINATIONS[destIndex];
    const point = getArcPoint(t);
    return {
      ...point,
      destIndex,
      flag: dest.flag,
      name: dest.name,
      isActive: i === 3 // Center node is active
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
            Top <span className="accent-serif">Destinations</span> This Season
          </h2>

          {/* Dotted Flight Path Arc SVG with Country Flag Nodes */}
          <div className="flight-path-container">
            <svg viewBox="0 0 900 95" fill="none" className="flight-arc-svg">
              {/* Swooping curved dashed arc line */}
              <path 
                d="M 30 15 Q 450 100 870 15" 
                stroke="#d97706" 
                strokeWidth="2.5" 
                strokeDasharray="4 8" 
                strokeLinecap="round"
                fill="none" 
              />

              {/* Flag nodes positioned along bezier curve */}
              {visibleNodes.map((node, idx) => (
                <g 
                  key={idx}
                  className={`flag-node-group ${node.isActive ? 'active-node' : ''}`}
                  onClick={() => setCurrentIndex(node.destIndex)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Active glowing ring */}
                  {node.isActive && (
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={21} 
                      fill="none" 
                      stroke="#d97706" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="active-pulse-ring"
                    />
                  )}

                  {/* Node Circle */}
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={node.isActive ? 15 : 11} 
                    fill="#ffffff" 
                    stroke={node.isActive ? '#b45309' : '#d4b3a2'} 
                    strokeWidth={node.isActive ? 3 : 2} 
                    className="flag-node-circle"
                  />

                  {/* Flag Icon */}
                  <text 
                    x={node.x} 
                    y={node.y + (node.isActive ? 5 : 4)} 
                    fontSize={node.isActive ? "14" : "12"} 
                    textAnchor="middle" 
                    className="flag-node-emoji"
                  >
                    {node.flag}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Two-Panel Featured Destination Card */}
        <div className="card-slider-wrapper">
          <button className="slider-btn btn-prev" onClick={handlePrev} aria-label="Previous destination">
            <ChevronLeft size={20} />
          </button>

          <div className="destination-panel-card">
            {/* Left Photo Panel */}
            <div className="panel-photo-side">
              <img src={current.image} alt={current.name} className="panel-img" />
              <div className="country-badge">
                <span className="badge-flag">{current.flag}</span>
                <span className="badge-name">{current.name}</span>
              </div>
            </div>

            {/* Right White Content Panel */}
            <div className="panel-info-side">
              <span className="tours-count">{current.category} · {current.packagesCount} Curated Packages</span>
              <h3 className="panel-title">{current.name}</h3>
              <p className="panel-desc">{current.description}</p>
              
              <div className="panel-cta-row">
                <button onClick={() => onOpenOfferModal(current.name)} className="btn-pill btn-pill-dark">
                  <span>Explore All Tours</span>
                  <span className="btn-badge-icon">
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <button className="slider-btn btn-next" onClick={handleNext} aria-label="Next destination">
            <ChevronRight size={20} />
          </button>
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
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
        }

        .accent-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
        }

        .flight-path-container {
          width: 100%;
          max-width: 820px;
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

        .card-slider-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 860px;
          margin: 0 auto 24px;
        }

        .destination-panel-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #ffffff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.07);
          width: 100%;
        }

        .panel-photo-side {
          position: relative;
          height: 310px;
        }

        .panel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .country-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          padding: 5px 12px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 12px;
          color: #1a1a1a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .panel-info-side {
          padding: 30px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .tours-count {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b45309;
          margin-bottom: 8px;
        }

        .panel-title {
          font-size: 26px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .panel-desc {
          font-size: 13.5px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .panel-cta-row {
          display: flex;
          align-items: center;
        }

        .btn-pill-dark {
          background: #18181b;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-pill-dark:hover {
          background: #27272a;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .btn-badge-icon {
          width: 22px;
          height: 22px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slider-btn {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          z-index: 10;
          transition: all 0.2s ease;
        }

        .slider-btn:hover {
          background: #18181b;
          color: #ffffff;
          transform: scale(1.08);
        }

        .btn-prev { left: -20px; }
        .btn-next { right: -20px; }

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

        @media (max-width: 840px) {
          .destination-panel-card { grid-template-columns: 1fr; }
          .panel-photo-side { height: 230px; }
          .panel-info-side { padding: 24px 22px; }
          .slider-btn { display: none; }
        }
      `}</style>
    </section>
  );
}
