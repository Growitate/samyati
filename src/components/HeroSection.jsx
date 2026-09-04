import React, { useState } from 'react';
import { Compass, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HeroSection({ onOpenOfferModal, onSelectDestination }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onOpenOfferModal(searchQuery || 'Custom Trip');
  };

  return (
    <section className="hero-combined-section">
      {/* Translucent Soft Vignette Overlay */}
      <div className="hero-combined-overlay" />

      <div className="container hero-combined-container">
        <div className="hero-combined-split">
          {/* Left Column: Professionally Aligned Headline, Subhead, Search & Badges */}
          <div className="hero-combined-left">
            {/* Headline H1 with Staggered Word Reveal */}
            <h1 className="hero-combined-title">
              <span className="title-word-mask line-1">
                <span className="reveal-word word-1">Rediscover</span>{' '}
                <span className="reveal-word word-2">Yourself</span>
              </span>{' '}
              <span className="title-word-mask line-2">
                <span className="reveal-word word-3">With</span>{' '}
                <span className="reveal-word word-4">Every</span>{' '}
                <span className="reveal-word word-5 title-gold-italic">Journey</span>
              </span>
            </h1>

            {/* Subhead Paragraph */}
            <p className="hero-combined-subhead">
              Handcrafted domestic & international journeys with luxury stays, smooth transfers, and 24/7 dedicated support.
            </p>

            {/* Quick Search Bar Pill */}
            <form onSubmit={handleSearch} className="hero-combined-search-form">
              <div className="hero-combined-search-pill">
                <div className="search-input-wrapper">
                  <Compass size={18} className="search-icon-left" />
                  <input
                    type="text"
                    placeholder="Search e.g. Kashmir, Bali, Dubai..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-field"
                  />
                </div>

                <button type="submit" className="search-submit-btn-dark">
                  <span>Get Your Offer</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>

            {/* Trust Badges Bar */}
            <div className="hero-combined-trust-bar">
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


        </div>
      </div>

      <style>{`
        .hero-combined-section {
          position: relative;
          min-height: 690px;
          background-image: url('/hero-bright-mountain.jpg');
          background-size: cover;
          background-position: center 55%;
          display: flex;
          align-items: center;
          padding-top: 70px;
          padding-bottom: 80px;
          overflow: hidden;
        }

        .hero-combined-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 35% 35%, rgba(254, 243, 199, 0.22) 0%, rgba(0, 0, 0, 0) 70%),
            linear-gradient(90deg, rgba(16, 24, 34, 0.82) 0%, rgba(16, 24, 34, 0.5) 52%, rgba(0, 0, 0, 0.05) 100%),
            linear-gradient(180deg, rgba(16, 24, 34, 0.28) 0%, rgba(0, 0, 0, 0) 50%, rgba(16, 24, 34, 0.25) 100%);
          z-index: 1;
        }

        .hero-combined-container {
          position: relative;
          z-index: 20;
          width: 100%;
        }

        .hero-combined-split {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          position: relative;
          min-height: 490px;
          transform: translateY(-25px);
        }

        .hero-combined-left {
          max-width: 1000px;
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-ai-badge-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border: 1.5px solid #d97706;
          border-radius: 9999px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-decoration: none;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(217, 119, 6, 0.35);
          transition: all 0.3s ease;
        }

        .hero-ai-badge-link:hover {
          background: #d97706;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(217, 119, 6, 0.5);
        }

        .hero-combined-title {
          font-size: clamp(38px, 5.2vw, 70px);
          line-height: 1.35;
          letter-spacing: 0.035em;
          word-spacing: 0.08em;
          transform: translateY(35px);
          margin-bottom: 20px;
        }

        .title-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 4px;
        }

        .reveal-word {
          display: inline-block;
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 800;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
          opacity: 0;
          transform: translateY(115%);
          animation: wordSlideUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        .word-1 { animation-delay: 0.1s; }
        .word-2 { animation-delay: 0.22s; }
        .word-3 { animation-delay: 0.36s; }
        .word-4 { animation-delay: 0.48s; }
        .word-5 {
          animation: wordSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards, goldShimmer 4s ease-in-out 1s infinite;
          animation-delay: 0.6s, 1s;
        }

        @keyframes wordSlideUp {
          0% {
            opacity: 0;
            transform: translateY(115%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title-gold-italic,
        .title-teal-italic {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 1.16em;
          background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #fef08a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #f59e0b;
          margin-left: 0.15em;
          display: inline-block;
          vertical-align: baseline;
          filter: drop-shadow(0 2px 14px rgba(245, 158, 11, 0.4));
        }

        @keyframes goldShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-combined-subhead {
          color: rgba(255, 255, 255, 0.94);
          font-size: clamp(16px, 1.85vw, 20px);
          font-weight: 400;
          line-height: 1.9;
          letter-spacing: 0.04em;
          word-spacing: 0.04em;
          max-width: 900px;
          width: 100%;
          margin-top: 8px;
          transform: translateY(30px);
          margin-bottom: 28px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
        }

        /* Search Form Pill */
        .hero-combined-search-form {
          width: 100%;
          max-width: 680px;
          margin-top: 18px;
          transform: translateY(4px);
          margin-bottom: 34px;
        }

        .hero-combined-search-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 9999px;
          padding: 5px 6px 5px 18px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.25s ease;
        }

        .hero-combined-search-pill:focus-within {
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(45, 212, 191, 0.5);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .search-icon-left {
          color: #9ca3af;
        }

        .search-input-field {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
          font-family: var(--font-sans);
          color: #141613;
          background: transparent;
        }

        .search-submit-btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 22px;
          border-radius: 9999px;
          background-color: #141613;
          color: #ffffff;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .search-submit-btn-dark:hover {
          background-color: #272a25;
          transform: translateY(-1px);
        }

        /* Trust Bar */
        .hero-combined-trust-bar {
          display: flex;
          align-items: center;
          gap: 28px;
          color: rgba(255, 255, 255, 0.92);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          flex-wrap: wrap;
          margin-top: 16px;
          transform: translateY(12px);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Right Callout Feature */
        .hero-combined-right-callout {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-bottom: 45px;
        }

        .callout-eyebrow-gold {
          color: #f59e0b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        .callout-gold-bar-box {
          border-left: 2px solid #f59e0b;
          padding-left: 16px;
        }

        .callout-title-text {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 500;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        @media (max-width: 990px) {
          .hero-combined-split {
            flex-direction: column;
            align-items: flex-start;
            gap: 32px;
            min-height: auto;
            transform: none;
          }
          .hero-combined-right-callout {
            align-self: flex-start;
            padding-bottom: 0;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .hero-combined-section {
            min-height: 85vh;
            padding-top: 55px;
            padding-bottom: 130px;
            background-position: center 50%;
          }
          .hero-combined-left {
            transform: translateY(0px);
          }
          .hero-combined-title {
            font-size: clamp(32px, 8.2vw, 44px);
            margin-bottom: 22px;
            line-height: 1.25;
            letter-spacing: 0.01em;
          }
          .hero-combined-subhead {
            font-size: 14.5px;
            margin-bottom: 28px;
            line-height: 1.75;
            letter-spacing: 0.02em;
          }
          .hero-combined-search-form {
            max-width: 100%;
            margin-bottom: 28px;
          }
          .hero-combined-search-pill {
            flex-direction: row;
            padding: 4px 5px 4px 14px;
            border-radius: 9999px;
            gap: 6px;
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          .search-input-wrapper {
            width: auto;
            flex: 1;
            padding: 4px 0;
            gap: 8px;
          }
          .search-icon-left {
            width: 16px;
            height: 16px;
          }
          .search-input-field {
            font-size: 12.5px;
          }
          .search-submit-btn-dark {
            width: auto;
            padding: 9px 15px;
            border-radius: 9999px;
            font-size: 12.5px;
            font-weight: 800;
            background: #0f172a;
            white-space: nowrap;
          }
          .hero-combined-trust-bar {
            gap: 10px 16px;
            font-size: 12px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
}
