import React, { useState } from 'react';
import { Search, Settings, Compass, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { HeroCloudEffect } from './CloudEffect';

export default function HeroSection({ onOpenOfferModal, onSelectDestination }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onOpenOfferModal(searchQuery);
  };

  return (
    <section className="hero-container">
      {/* Dark Overlay Gradient */}
      <div className="hero-overlay" />

      {/* Main Content */}
      <div className="container hero-content">
        {/* Headline H1 */}
        <h1 className="hero-headline">
          Rediscover Yourself<br />
          With Every <span className="accent-serif">Journey</span>
        </h1>

        {/* Subhead Paragraph */}
        <p className="hero-subhead">
          Plan domestic & international trips with handpicked stays, smooth transfers, sightseeing, and complete travel support from consultation to return.
        </p>

        {/* Search Bar Pill & CTA */}
        <form onSubmit={handleSearch} className="hero-search-form">
          <div className="hero-search-pill">
            <div className="search-input-group">
              <Compass size={18} className="search-icon-left" />
              <input
                type="text"
                placeholder="Where do you want to travel? (e.g. Kashmir, Bali, Dubai, Maldives...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <button type="submit" className="search-submit-btn">
              <span>Get Your Offer</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Trust Badges Bar */}
        <div className="hero-trust-bar">
          <div className="trust-item">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>100% Customized Trips</span>
          </div>
          <div className="trust-item">
            <Sparkles size={14} className="text-amber-300" />
            <span>14 Handpicked Destinations</span>
          </div>
          <div className="trust-item">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Dedicated Human Support</span>
          </div>
        </div>
      </div>

      {/* Volumetric Fluffy Cloud Effect */}
      <HeroCloudEffect />

      <style>{`
        .hero-container {
          position: relative;
          min-height: 740px;
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85');
          background-size: cover;
          background-position: center bottom;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 130px;
          padding-bottom: 140px;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(15, 20, 16, 0.8) 0%, 
            rgba(15, 20, 16, 0.5) 60%, 
            rgba(15, 20, 16, 0.25) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-eyebrow-wrapper {
          margin-bottom: 24px;
        }

        .hero-headline {
          color: #ffffff;
          font-size: clamp(38px, 5.8vw, 74px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }

        .hero-subhead {
          color: rgba(255, 255, 255, 0.92);
          font-size: clamp(15px, 1.8vw, 18px);
          font-weight: 400;
          max-width: 600px;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        /* Search Form Pill */
        .hero-search-form {
          width: 100%;
          max-width: 620px;
          margin-bottom: 24px;
        }

        .hero-search-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-radius: var(--radius-pill);
          padding: 6px 8px 6px 20px;
          box-shadow: 0 14px 40px rgba(0,0,0,0.3);
          transition: var(--transition-smooth);
        }

        .hero-search-pill:focus-within {
          box-shadow: 0 16px 44px rgba(0,0,0,0.4), 0 0 0 3px rgba(255,255,255,0.4);
        }

        .search-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .search-icon-left {
          color: #9ca3af;
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 15px;
          font-family: var(--font-sans);
          color: var(--text-dark);
          background: transparent;
        }

        .search-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: var(--radius-pill);
          background-color: var(--text-dark);
          color: #ffffff;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
          white-space: nowrap;
        }

        .search-submit-btn:hover {
          background-color: #272a25;
          transform: translateY(-1px);
        }

        /* Trust Bar */
        .hero-trust-bar {
          display: flex;
          align-items: center;
          gap: 24px;
          color: rgba(255,255,255,0.85);
          font-size: 12px;
          font-weight: 600;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Vehicle Graphic */
        .hero-vehicle-wrapper {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          width: 320px;
          max-width: 80vw;
          pointer-events: none;
        }

        .hero-vehicle-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%);
        }

        /* Cloud Transition Band */
        .cloud-transition-band {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 4;
          line-height: 0;
          pointer-events: none;
        }

        .cloud-svg {
          width: 100%;
          height: 110px;
        }

        @media (max-width: 768px) {
          .hero-container {
            min-height: 600px;
            padding-top: 110px;
            padding-bottom: 90px;
          }
          .hero-headline {
            font-size: clamp(32px, 8vw, 46px);
            margin-bottom: 16px;
          }
          .hero-subhead {
            font-size: 14px;
            padding: 0 12px;
            margin-bottom: 28px;
          }
          .hero-search-form {
            padding: 0 10px;
          }
          .hero-search-pill {
            flex-direction: column;
            padding: 8px 12px;
            border-radius: 24px;
            gap: 8px;
          }
          .search-input-group {
            width: 100%;
            padding: 6px 4px;
          }
          .search-submit-btn {
            width: 100%;
            justify-content: center;
            padding: 12px 20px;
            border-radius: 9999px;
          }
          .hero-trust-bar {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px 18px;
            font-size: 11px;
            padding: 0 10px;
          }
        }
      `}</style>
    </section>
  );
}
