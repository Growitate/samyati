import React, { useState, useEffect, useRef } from 'react';
import { Settings, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Smooth Incrementing Counter with Easing Curve
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth Ease Out Expo curve
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.floor(easeOut * target);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref} className="animated-counter-val">
      {count}{suffix}
    </span>
  );
}

const STAT_TILES = [
  {
    target: 60,
    suffix: '+',
    label: 'Destinations',
    labelBg: 'var(--bg-eyebrow-yellow)',
    caption: 'Handpicked countries across 6 continents'
  },
  {
    target: 15,
    suffix: '+',
    label: 'Years Experience',
    labelBg: 'var(--bg-pink)',
    caption: 'Creating bespoke expeditions since 2009'
  },
  {
    target: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    labelBg: 'var(--bg-light-blue)',
    caption: '5-star reviews from world travellers'
  }
];

// Authentic Google Reviews from Customers (6 Added Reviews)
const GOOGLE_REVIEWS = [
  {
    id: 'manish-arya',
    name: 'MANISH ARYA',
    initial: 'M',
    color: '#0d9488',
    rating: 5,
    time: '4 months ago',
    quote: 'We had a wonderful experience with Samyati World Private Limited (Samyati The World) for our Singapore trip. Their coordination and assistance throughout the journey were excellent and made everything smooth and hassle-free. Overall, it was a well-organized and memorable trip. Thank you for the great service!',
  },
  {
    id: 'anmol-khare',
    name: 'Anmol Khare',
    initial: 'A',
    color: '#9333ea',
    rating: 5,
    time: '4 months ago',
    quote: 'Was planning a trip to Mussoorie, but it was constantly getting delayed or cancelled as we were not able to find proper tour package with good hotels and within our budget. We tried Samyati and thank God we tried it. They provided affordable and comfortable hotel stays with great tour package. Making my long time trip a very enjoyable and memorable one.',
  },
  {
    id: 'praharsh-singh',
    name: 'Praharsh Singh',
    badge: 'Local Guide',
    initial: 'P',
    color: '#d97706',
    rating: 5,
    time: 'a year ago',
    quote: 'Samyati helped me plan my year end trip to Kasol last year. The tour package was affordable and the stay was nice. Me and my friends had a lot of fun in the fairy forest in Kulga and the new year’s eve party was a banger.',
  },
  {
    id: 'chandan-sharma',
    name: 'chandan sharma',
    initial: 'C',
    color: '#2563eb',
    rating: 5,
    time: '3 months ago',
    quote: 'The booking process was smooth and professional. The staff was polite, helpful, and always available for support. Vehicle condition was clean and comfortable, and the overall trip was well managed. Timing, safety, and customer service were excellent. Highly recommended for anyone looking for a stress-free and enjoyable travel experience.',
  },
  {
    id: 'tarang-mehrotra',
    name: 'Tarang Mehrotra',
    initial: 'T',
    color: '#7c3aed',
    rating: 5,
    time: '3 months ago',
    quote: 'Very professional service by Samyati The World. From booking to trip completion, the communication was clear and prompt. Appreciated the effort put into making our holiday hassle-free.',
  },
  {
    id: 'anant-pratap-singh',
    name: 'Anant Pratap Singh',
    initial: 'A',
    color: '#0284c7',
    rating: 5,
    time: 'a year ago',
    quote: 'A great company to travel either solo or with group. I have contact this company many times to visit many places of uttarakhand, they handled every situation very efficiently and provide all type of support.',
  }
];

// Multi-color Official Google G Logo
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" className="google-icon-svg" aria-label="Google Review">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

// Blue Verified Checkmark Badge
const VerifiedBadge = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" className="verified-blue-badge" aria-label="Verified Customer">
    <circle cx="12" cy="12" r="10" fill="#1d9bf0" />
    <path
      d="M8.5 12.2l2.3 2.3 4.8-4.8"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

function GoogleReviewCard({ rev }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = rev.quote.length > 135;
  const displayText = isExpanded || !isLong ? rev.quote : rev.quote.slice(0, 130) + '...';

  return (
    <div className="google-review-card">
      {/* Top Header: Avatar + User Info + Google G Logo */}
      <div className="gcard-header">
        <div className="gcard-user-meta">
          <div className="gcard-avatar" style={{ backgroundColor: rev.color }}>
            <span>{rev.initial}</span>
          </div>
          <div className="gcard-user-info">
            <h4 className="gcard-name">{rev.name}</h4>
            {rev.badge && <span className="gcard-badge">{rev.badge}</span>}
          </div>
        </div>

        <div className="gcard-logo">
          <GoogleIcon />
        </div>
      </div>

      {/* Stars Row + Blue Verified Badge */}
      <div className="gcard-rating-row">
        <div className="gcard-stars">
          {[...Array(rev.rating)].map((_, i) => (
            <Star key={i} size={16} className="star-icon-gold-filled" />
          ))}
        </div>
        <VerifiedBadge />
      </div>

      {/* Review Body */}
      <p className="gcard-text">
        {displayText}
      </p>

      {/* Read More / Read Less Toggle */}
      {isLong && (
        <button 
          type="button" 
          className="gcard-readmore-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

export default function StatsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="stats-section" id="reviews">
      <div className="container">
        {/* Eyebrow */}
        <div className="stats-header">
          <div className="eyebrow-pill">
            <Settings className="gear-icon" size={12} />
            <span>Our Journey in Numbers</span>
            <Settings className="gear-icon" size={12} />
          </div>
        </div>

        {/* Hero Stat Block */}
        <div className="hero-stat-block">
          {/* Floating Traveler Avatars */}
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Traveler 1" className="avatar float-avatar-1" />
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Traveler 2" className="avatar float-avatar-2" />
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Traveler 3" className="avatar float-avatar-3" />
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Traveler 4" className="avatar float-avatar-4" />

          {/* Oversized Numeral with Incrementing Animation */}
          <div className="numeral-container">
            <h2 className="hero-stat-num">
              <AnimatedCounter target={1200} suffix="+" duration={1900} />
            </h2>
            
            {/* Sticky-note Post-It Badge */}
            <div className="postit-badge">
              <span>Happy Travellers</span>
            </div>
          </div>
        </div>

        {/* 3-Column Secondary Stat Row with Animated Numbers */}
        <div className="secondary-stats-grid">
          {STAT_TILES.map((tile, idx) => (
            <div key={idx} className="stat-tile">
              <span className="stat-serif-num">
                <AnimatedCounter target={tile.target} suffix={tile.suffix} duration={1600} />
              </span>
              <div className="stat-label-pill" style={{ backgroundColor: tile.labelBg }}>
                <span>{tile.label}</span>
              </div>
              <div className="tile-divider" />
              <p className="tile-caption">{tile.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Google Reviews Carousel with Navigation Buttons */}
      <div 
        className="google-reviews-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left / Right Arrow Navigation Buttons */}
        <button 
          type="button" 
          className="carousel-nav-btn nav-prev"
          onClick={() => handleScroll('left')}
          aria-label="Previous review"
        >
          <ChevronLeft size={20} />
        </button>

        <button 
          type="button" 
          className="carousel-nav-btn nav-next"
          onClick={() => handleScroll('right')}
          aria-label="Next review"
        >
          <ChevronRight size={20} />
        </button>

        <div className="side-fade-gradient fade-left" />
        <div className="side-fade-gradient fade-right" />
        
        {/* Continuous Auto-scrolling and Interactive Scroll Track */}
        <div 
          ref={scrollRef}
          className={`google-reviews-track ${isPaused ? 'paused-track' : ''}`}
        >
          {[...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS].map((rev, idx) => (
            <GoogleReviewCard key={`${rev.id}-${idx}`} rev={rev} />
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          position: relative;
          background-color: #fefce8;
          padding-top: 42px;
          padding-bottom: 36px;
          overflow: hidden;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 20px;
        }

        /* Hero Stat Block */
        .hero-stat-block {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 36px;
        }

        .numeral-container {
          position: relative;
          display: inline-block;
        }

        .hero-stat-num {
          font-size: clamp(64px, 10vw, 120px);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        /* Sticky Post-It Note */
        .postit-badge {
          position: absolute;
          top: -12px;
          right: -40px;
          background: #ffffff;
          color: var(--text-dark);
          font-size: 13px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 4px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          transform: rotate(-6deg);
        }

        /* Floating Avatars */
        .avatar {
          position: absolute;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ffffff;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          transition: transform 0.4s ease;
        }

        .avatar:hover {
          transform: scale(1.15);
        }

        .float-avatar-1 { width: 56px; height: 56px; top: 10px; left: 8%; }
        .float-avatar-2 { width: 46px; height: 46px; bottom: 0px; left: 16%; }
        .float-avatar-3 { width: 60px; height: 60px; top: -10px; right: 12%; }
        .float-avatar-4 { width: 50px; height: 50px; bottom: 10px; right: 20%; }

        /* Secondary Stats 3-Column */
        .secondary-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 960px;
          margin: 0 auto 28px;
        }

        .stat-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-serif-num {
          font-family: var(--font-serif-italic);
          font-size: clamp(38px, 5vw, 56px);
          font-style: italic;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label-pill {
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .tile-divider {
          width: 40px;
          height: 1px;
          background: rgba(0,0,0,0.15);
          margin-bottom: 12px;
        }

        .tile-caption {
          font-size: 13px;
          color: var(--text-muted);
          max-width: 220px;
          line-height: 1.4;
        }

        /* ── Google Reviews Carousel ──────────────────────────── */
        .google-reviews-wrapper {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 10px 0 20px;
        }

        .side-fade-gradient {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 10;
          pointer-events: none;
        }

        .fade-left {
          left: 0;
          background: linear-gradient(90deg, #fefce8 0%, rgba(254, 252, 232, 0) 100%);
        }

        .fade-right {
          right: 0;
          background: linear-gradient(-90deg, #fefce8 0%, rgba(254, 252, 232, 0) 100%);
        }

        /* Carousel Navigation Buttons */
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 25;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          color: #374151;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .carousel-nav-btn:hover {
          background: #111827;
          color: #ffffff;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-prev {
          left: 20px;
        }

        .nav-next {
          right: 20px;
        }

        .google-reviews-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marqueeReviews 45s linear infinite;
          padding: 12px 24px;
        }

        .google-reviews-track.paused-track,
        .google-reviews-track:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeReviews {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Google Review Card Matching Reference Image 1 */
        .google-review-card {
          flex: 0 0 310px;
          width: 310px;
          background: #ffffff;
          border-radius: 18px;
          padding: 22px 20px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          user-select: text;
          text-align: left;
        }

        .google-review-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.09);
        }

        /* Header with Avatar & Google Logo */
        .gcard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 12px;
        }

        .gcard-user-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gcard-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .gcard-user-info {
          display: flex;
          flex-direction: column;
        }

        .gcard-name {
          font-size: 14.5px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .gcard-badge {
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
          margin-top: 1px;
        }

        .gcard-logo {
          flex-shrink: 0;
          padding-top: 2px;
        }

        .google-icon-svg {
          display: block;
        }

        /* Rating Row */
        .gcard-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .gcard-stars {
          display: flex;
          gap: 2.5px;
        }

        .star-icon-gold-filled {
          fill: #f59e0b;
          color: #f59e0b;
        }

        .verified-blue-badge {
          display: block;
          flex-shrink: 0;
        }

        /* Review Content */
        .gcard-text {
          font-size: 13.5px;
          line-height: 1.58;
          color: #374151;
          font-weight: 400;
          margin-bottom: 8px;
          flex: 1;
        }

        .gcard-readmore-btn {
          background: none;
          border: none;
          padding: 0;
          font-size: 12.5px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          text-align: left;
          width: fit-content;
          transition: color 0.2s;
        }

        .gcard-readmore-btn:hover {
          color: #111827;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .avatar { display: none; }
          .postit-badge { right: 0; top: -20px; }
          .secondary-stats-grid { grid-template-columns: 1fr; gap: 24px; }
          .google-review-card { flex: 0 0 280px; width: 280px; padding: 18px 16px; }
          .carousel-nav-btn { display: none; }
          .side-fade-gradient { width: 30px; }
        }
      `}</style>
    </section>
  );
}
