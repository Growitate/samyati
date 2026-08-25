import React from 'react';
import { Star, BadgeCheck, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
    destination: 'Kashmir Valley',
    tripType: 'Honeymoon',
    rating: 5,
    quote: 'Our Kashmir honeymoon was beyond fairy-tale. Samyati arranged a shikara sunrise on Dal Lake and a private meadow dinner in Gulmarg. Every detail felt like it was planned by a best friend who truly knows you.',
  },
  {
    id: 2,
    name: 'Rahul & Anjali Mehta',
    location: 'Bengaluru, India',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80',
    destination: 'Bali, Indonesia',
    tripType: 'Couple Holiday',
    rating: 5,
    quote: 'We tried booking Bali ourselves twice and always felt overwhelmed. Samyati gave us the perfect mix — jungle trekking, rice terrace walks, spa days and a surprise beachside dinner. The best 10 days of our lives.',
  },
  {
    id: 3,
    name: 'Vikram Nair',
    location: 'Kochi, India',
    avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=120&q=80',
    destination: 'Rajasthan Circuit',
    tripType: 'Family Tour',
    rating: 5,
    quote: 'My parents are in their 60s and I was nervous about a Rajasthan trip. Samyati thought of everything — comfortable AC rides, gentle itineraries, and fort entrances with minimal walking. My mother said it was her dream trip.',
  },
  {
    id: 4,
    name: 'Sunita Agarwal',
    location: 'New Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    destination: 'Switzerland',
    tripType: 'Solo Travel',
    rating: 5,
    quote: 'Going solo to Switzerland felt daunting. Samyati\'s local guide made every day feel safe, joyful and adventurous. I came back a completely different person. Already planning my next solo trip through them.',
  },
  {
    id: 5,
    name: 'The Patel Family',
    location: 'Ahmedabad, India',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=120&q=80',
    destination: 'Andaman Islands',
    tripType: 'Group Tour',
    rating: 5,
    quote: 'Seven of us — grandparents, kids, cousins — for Andaman. Samyati kept every single person happy. The glass-bottom boat, the bioluminescent beach at night, the fresh seafood. This trip is all our family talks about.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="trev-section" id="testimonials">

      {/* ── Header ──────────────────────────────── */}
      <div className="trev-header">
        <div className="container">
          <div className="trev-eyebrow">
            <span className="trev-eyebrow-dot" />
            Traveller Reviews
          </div>
          <h2 className="trev-title">
            Trusted by <span className="trev-title-accent">12,000+</span> Happy Travellers
          </h2>
          <p className="trev-subtitle">
            Real journeys, real memories — from families, couples and solo explorers across India.
          </p>

          {/* Rating bar */}
          <div className="trev-rating-bar">
            <div className="trev-score-block">
              <span className="trev-score">4.9</span>
              <div className="trev-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} className="trev-star" />)}
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
        </div>
      </div>

      {/* ── Cards ───────────────────────────────── */}
      <div className="trev-cards-section">
        <div className="container">
          <div className="trev-cards-grid">
            {REVIEWS.map((rev, idx) => (
              <article key={rev.id} className={`trev-card ${idx === 0 ? 'trev-card-featured' : ''}`}>
                <div className="trev-card-top">
                  <Quote size={28} className="trev-quote-icon" />
                  <div className="trev-card-stars">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="trev-star" />
                    ))}
                  </div>
                </div>

                <p className="trev-card-quote">"{rev.quote}"</p>

                <div className="trev-card-footer">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="trev-card-avatar"
                    loading="lazy"
                  />
                  <div className="trev-card-person">
                    <div className="trev-card-name-row">
                      <span className="trev-card-name">{rev.name}</span>
                      <BadgeCheck size={14} className="trev-verified" />
                    </div>
                    <span className="trev-card-location">{rev.location}</span>
                    <span className="trev-card-trip">✈ {rev.tripType} · {rev.destination}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ══ Section ═══════════════════════════════════════════════ */
        .trev-section {
          background: #fefce8;
        }

        /* ══ Header ════════════════════════════════════════════════ */
        .trev-header {
          background: #0f1410;
          padding: 64px 0 52px;
        }

        .trev-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d97706;
          margin-bottom: 16px;
        }

        .trev-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d97706;
          flex-shrink: 0;
        }

        .trev-title {
          font-size: clamp(26px, 5vw, 50px);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.12;
          margin-bottom: 12px;
        }

        .trev-title-accent {
          color: #d97706;
        }

        .trev-subtitle {
          font-size: clamp(13px, 2vw, 15px);
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          max-width: 480px;
          margin-bottom: 32px;
        }

        /* Rating bar */
        .trev-rating-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 16px 22px;
          width: fit-content;
          flex-wrap: wrap;
          row-gap: 12px;
        }

        .trev-score-block {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trev-score {
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .trev-stars {
          display: flex;
          gap: 2px;
        }

        .trev-star {
          color: #f59e0b;
          fill: #f59e0b;
          flex-shrink: 0;
        }

        .trev-score-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }

        .trev-rating-sep {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        .trev-review-count {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .trev-review-count strong {
          color: #ffffff;
        }

        .trev-platforms {
          display: flex;
          gap: 6px;
        }

        .trev-platform-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .g-tag {
          background: rgba(66,133,244,0.15);
          color: #93c5fd;
          border: 1px solid rgba(66,133,244,0.2);
        }

        .t-tag {
          background: rgba(52,168,83,0.15);
          color: #86efac;
          border: 1px solid rgba(52,168,83,0.2);
        }

        /* ══ Cards ═════════════════════════════════════════════════ */
        .trev-cards-section {
          padding: 48px 0 72px;
        }

        .trev-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        /* ── Card ─────────────────────────────────────────────────── */
        .trev-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* Featured first card spans 2 rows on desktop */
        .trev-card-featured {
          grid-row: span 2;
          background: #0f1410;
          border-color: rgba(217,119,6,0.25);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.18),
            0 0 0 1px rgba(217,119,6,0.12);
        }

        .trev-card-featured .trev-card-quote {
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          line-height: 1.75;
        }

        .trev-card-featured .trev-quote-icon {
          color: rgba(217,119,6,0.4);
        }

        .trev-card-featured .trev-card-name {
          color: #ffffff;
        }

        .trev-card-featured .trev-card-location,
        .trev-card-featured .trev-card-trip {
          color: rgba(255,255,255,0.4);
        }

        .trev-card-featured .trev-card-footer {
          border-top-color: rgba(255,255,255,0.08);
        }

        .trev-card-featured .trev-card-avatar {
          border-color: #d97706;
        }

        .trev-card-featured .trev-verified {
          color: #60a5fa;
        }

        /* Card internals */
        .trev-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .trev-quote-icon {
          color: #e5e7eb;
          flex-shrink: 0;
        }

        .trev-card-stars {
          display: flex;
          gap: 2px;
        }

        .trev-card-quote {
          font-size: 13.5px;
          color: #374151;
          line-height: 1.7;
          font-style: italic;
          flex: 1;
        }

        .trev-card-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid #f3f4f6;
          margin-top: auto;
        }

        .trev-card-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 2px solid #fde68a;
        }

        .trev-card-person {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .trev-card-name-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .trev-card-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .trev-verified {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .trev-card-location {
          font-size: 11.5px;
          color: #9ca3af;
          line-height: 1.2;
        }

        .trev-card-trip {
          font-size: 11px;
          font-weight: 600;
          color: #d97706;
          margin-top: 1px;
        }

        /* ══ Responsive ════════════════════════════════════════════ */

        /* Tablet: 2-column grid */
        @media (max-width: 1024px) {
          .trev-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .trev-card-featured {
            grid-column: span 2;
            grid-row: span 1;
          }
        }

        /* Mobile: single column, full-width cards */
        @media (max-width: 640px) {
          .trev-header {
            padding: 48px 0 40px;
          }

          .trev-cards-section {
            padding: 36px 0 56px;
          }

          .trev-cards-grid {
            grid-template-columns: 1fr;
          }

          .trev-card-featured {
            grid-column: span 1;
          }

          .trev-rating-bar {
            width: 100%;
            padding: 14px 16px;
          }

          .trev-rating-sep {
            display: none;
          }

          .trev-score-block {
            gap: 6px;
          }

          .trev-card {
            padding: 20px;
          }

          .trev-card-featured .trev-card-quote {
            font-size: 14px;
          }

          .trev-card-avatar {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </section>
  );
}
