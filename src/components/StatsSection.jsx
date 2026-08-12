import React from 'react';
import { Settings } from 'lucide-react';

const STAT_TILES = [
  {
    num: '60+',
    label: 'Destinations',
    labelBg: 'var(--bg-eyebrow-yellow)',
    caption: 'Handpicked countries across 6 continents'
  },
  {
    num: '15+',
    label: 'Years Experience',
    labelBg: 'var(--bg-pink)',
    caption: 'Creating bespoke expeditions since 2009'
  },
  {
    num: '98%',
    label: 'Satisfaction Rate',
    labelBg: 'var(--bg-light-blue)',
    caption: '5-star reviews from world travellers'
  }
];

const MARQUEE_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=400&q=80',
];

export default function StatsSection() {
  return (
    <section className="stats-section">
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

          {/* Oversized Numeral */}
          <div className="numeral-container">
            <h2 className="hero-stat-num">12,000+</h2>
            
            {/* Sticky-note Post-It Badge */}
            <div className="postit-badge">
              <span>Happy Travellers</span>
            </div>
          </div>
        </div>

        {/* 3-Column Secondary Stat Row */}
        <div className="secondary-stats-grid">
          {STAT_TILES.map((tile, idx) => (
            <div key={idx} className="stat-tile">
              <span className="stat-serif-num">{tile.num}</span>
              <div className="stat-label-pill" style={{ backgroundColor: tile.labelBg }}>
                <span>{tile.label}</span>
              </div>
              <div className="tile-divider" />
              <p className="tile-caption">{tile.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-scrolling Photo Strip Marquee */}
      <div className="photo-marquee-container">
        <div className="top-gradient-mask" />
        <div className="marquee-track">
          {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((img, idx) => (
            <div key={idx} className="marquee-photo-tile">
              <img src={img} alt={`Expedition ${idx + 1}`} className="tile-photo" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          position: relative;
          background-color: #fef7d8;
          background-image: url('/journey-numbers-bg.png');
          background-size: 100% 100%;
          background-position: center center;
          background-repeat: no-repeat;
          padding-top: 80px;
          padding-bottom: 0;
          overflow: hidden;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 30px;
        }

        /* Hero Stat Block */
        .hero-stat-block {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 70px;
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
          gap: 30px;
          max-width: 960px;
          margin: 0 auto 60px;
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

        /* Photo Marquee */
        .photo-marquee-container {
          position: relative;
          overflow: hidden;
          padding-top: 20px;
        }

        .top-gradient-mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: linear-gradient(180deg, var(--bg-pale-yellow) 0%, rgba(254, 246, 199, 0) 100%);
          z-index: 5;
        }

        .marquee-photo-tile {
          flex: 0 0 220px;
          height: 160px;
          margin: 0 10px;
          border-radius: 20px 20px 0 0;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .tile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .avatar { display: none; }
          .postit-badge { right: 0; top: -20px; }
          .secondary-stats-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </section>
  );
}
