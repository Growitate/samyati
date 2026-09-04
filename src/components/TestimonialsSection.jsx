import React from 'react';
import { Star } from 'lucide-react';

const MARQUEE_PHOTOS = [
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
];

export default function TestimonialsSection() {
  return (
    <section className="trev-section" id="testimonials">
      {/* ── Dark Header Social Proof Banner ──────────────────────── */}
      <div className="trev-header">
        <div className="container">
          <div className="trev-header-split">
            <div className="trev-header-left">
              <div className="trev-eyebrow">
                <span className="trev-eyebrow-dot" />
                Traveller Reviews
              </div>
              <h2 className="trev-title">
                Trusted by <span className="trev-title-accent">1200+</span> Happy Travellers
              </h2>
              <p className="trev-subtitle">
                Real journeys, real memories — from families, couples and solo explorers across India.
              </p>
            </div>

            <div className="trev-header-right">
              {/* Rating block */}
              <div className="trev-rating-bar">
                <div className="trev-score-block">
                  <span className="trev-score">4.9</span>
                  <div className="trev-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="trev-star" />
                    ))}
                  </div>
                  <span className="trev-score-sub">/ 5.0</span>
                </div>
                <div className="trev-rating-sep" />
                <div className="trev-review-count">
                  <strong>2,400+</strong> verified reviews
                  <div className="trev-platforms">
                    <span className="trev-platform-tag g-tag">G Google</span>
                    <span className="trev-platform-tag t-tag">✦ TripAdvisor</span>
                  </div>
                </div>
              </div>

              <div className="trev-trust-pills">
                <span className="trev-trust-pill">✓ 98% 5-Star Rating</span>
                <span className="trev-trust-pill">✓ 100% Verified Guests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Photo Strip Marquee placed directly below Testimonials Banner */}
      <div className="photo-marquee-container">
        <div className="photo-marquee-track">
          {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((img, idx) => (
            <div key={idx} className="marquee-photo-tile">
              <img src={img} alt={`Expedition ${idx + 1}`} className="tile-photo" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* ══ Section ═══════════════════════════════════════════════ */
        .trev-section {
          background: #0f1410;
          overflow: hidden;
        }

        /* ══ Header ════════════════════════════════════════════════ */
        .trev-header {
          background: #0f1410;
          padding: 36px 0 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .trev-header-split {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .trev-header-left {
          max-width: 580px;
          flex: 1;
        }

        .trev-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .trev-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ea580c;
          margin-bottom: 10px;
        }

        .trev-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ea580c;
          flex-shrink: 0;
        }

        .trev-title {
          font-size: clamp(26px, 3.8vw, 42px);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .trev-title-accent {
          color: #f97316;
        }

        .trev-subtitle {
          font-size: clamp(13.5px, 1.6vw, 15px);
          color: rgba(255,255,255,0.75);
          line-height: 1.55;
          margin-bottom: 0;
        }

        .trev-trust-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .trev-trust-pill {
          font-size: 11.5px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 5px 14px;
          border-radius: 9999px;
        }

        /* Rating bar */
        .trev-rating-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 12px 20px;
          width: fit-content;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          flex-wrap: wrap;
          row-gap: 8px;
        }

        .trev-score-block {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trev-score {
          font-size: 22px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
        }

        .trev-stars {
          display: flex;
          gap: 3px;
        }

        .trev-star {
          color: #f59e0b;
          fill: #f59e0b;
        }

        .trev-score-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }

        .trev-rating-sep {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.15);
        }

        .trev-review-count {
          font-size: 12.5px;
          color: rgba(255,255,255,0.85);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .trev-review-count strong {
          color: #ffffff;
          font-weight: 700;
        }

        .trev-platforms {
          display: flex;
          gap: 6px;
        }

        .trev-platform-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.9);
        }

        .g-tag {
          color: #93c5fd;
        }

        .t-tag {
          color: #86efac;
        }

        /* ── Auto-scrolling Photo Strip Marquee ──────────────────── */
        .photo-marquee-container {
          position: relative;
          overflow: hidden;
          padding: 20px 0 24px;
          background: #ffffff;
        }

        .photo-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueePhotos 35s linear infinite;
        }

        .photo-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marqueePhotos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .marquee-photo-tile {
          flex: 0 0 220px;
          height: 155px;
          margin: 0 10px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease;
        }

        .marquee-photo-tile:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .tile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 900px) {
          .trev-header {
            padding: 36px 0;
          }
          .trev-header-split {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .trev-header-right {
            align-items: flex-start;
          }
          .trev-trust-pills {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .photo-marquee-container {
            padding: 20px 0 32px;
          }
          .marquee-photo-tile {
            flex: 0 0 170px;
            height: 125px;
            border-radius: 14px;
            margin: 0 7px;
          }
        }
      `}</style>
    </section>
  );
}
