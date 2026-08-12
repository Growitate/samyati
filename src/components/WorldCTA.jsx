import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function WorldCTA({ onOpenOfferModal }) {
  return (
    <section className="world-cta-section" id="plan">
      <div className="container">
        <div className="world-cta-content">
          {/* Headline */}
          <h2 className="world-cta-heading">
            The Whole<br />
            W<span className="earth-o-symbol">🌍</span>rld is<br />
            <span className="accent-serif">Waiting</span> For You
          </h2>

          <div className="cta-button-wrapper">
            <button 
              onClick={() => onOpenOfferModal && onOpenOfferModal()} 
              className="btn-pill btn-pill-pink btn-large"
            >
              <span>Start Planning Your Trip</span>
              <span className="btn-badge-icon">
                <ArrowUpRight size={18} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .world-cta-section {
          position: relative;
          padding: 150px 0;
          background-color: #ffffff;
          background-image: url('/world-cta-bg.png');
          background-size: 100% 100%;
          background-position: center center;
          background-repeat: no-repeat;
          overflow: hidden;
          text-align: center;
        }

        .world-cta-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 0 auto;
        }

        .world-cta-heading {
          font-size: clamp(44px, 7.2vw, 92px);
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: 38px;
        }

        .earth-o-symbol {
          display: inline-block;
          font-size: 0.88em;
          line-height: 1;
          vertical-align: middle;
          margin: 0 0.01em;
          transform: translateY(-0.06em);
          filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
        }

        .accent-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
        }

        .btn-large {
          padding: 14px 16px 14px 34px;
          font-size: 16px;
          font-weight: 700;
          background: #18181b;
          color: #ffffff;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          transition: all 0.2s ease;
        }

        .btn-large:hover {
          background: #27272a;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }

        .btn-badge-icon {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .world-cta-section {
            padding: 90px 0;
            background-size: cover;
          }
          .world-cta-heading {
            font-size: clamp(34px, 8.5vw, 56px);
            margin-bottom: 24px;
          }
          .btn-large {
            width: 90%;
            max-width: 320px;
            justify-content: center;
            padding: 12px 16px 12px 24px;
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
}

