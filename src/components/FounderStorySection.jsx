import React from 'react';
import { Sparkles, Heart, Target, Compass, Users } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';

export default function FounderStorySection() {
  return (
    <section className="founder-story-section" id="story">
      <div className="container">
        {/* Section Header */}
        <div className="story-header">
          <div className="eyebrow-pill mb-3">
            <Compass className="gear-icon" size={13} />
            <span>Our Founding Story & Philosophy</span>
            <Compass className="gear-icon" size={13} />
          </div>

          <h2 className="story-h2">
            Born From College Friendship &<br />
            A Passion to <span className="accent-serif">Inspire</span>
          </h2>
        </div>

        {/* 3 Founders Card Row */}
        <div className="founders-grid">
          {BRAND_INFO.founders.map((f, i) => (
            <div key={i} className="founder-card">
              <div className="founder-avatar-chip">
                <Users size={20} />
              </div>
              <h3 className="founder-name">{f.name}</h3>
              <span className="founder-role">{f.role}</span>
              <div className="founder-badge-mini">Co-Founder</div>
            </div>
          ))}
        </div>

        {/* Story Paragraph Box */}
        <div className="story-narrative-card">
          <div className="quote-mark">“</div>
          <p className="narrative-p">
            Samyati The World began long before it became a company—with three college friends, a shared love for travel, and a dream of creating journeys that truly mean something.
          </p>
          <p className="narrative-p">
            After gaining hands-on experience across the travel industry, <strong>Aniket Shrivastava</strong>, <strong>Shardul Vikram Singh</strong>, and <strong>Gourav Dixit</strong> came together again—combining their strengths in marketing & growth, operations & finance, and sales & contracting. But Samyati was never meant to be just another travel company.
          </p>
          <p className="narrative-p highlight-quote">
            It was created with a simple belief: <em>people don’t merely travel to see new places; they travel to feel alive, create stories, and sometimes, rediscover a part of themselves they had forgotten.</em>
          </p>
          <p className="narrative-p">
            Because with Samyati The World, every destination is more than a place—it is an invitation to <strong>Rediscover Yourself With Every Journey</strong>.
          </p>
        </div>

        {/* Mission & Vision 2-Column Split */}
        <div className="mission-vision-grid">
          {/* Mission */}
          <div className="mv-card mv-mission">
            <div className="mv-icon-wrapper">
              <Heart size={24} className="text-pink-500" />
            </div>
            <div className="mv-content">
              <span className="mv-label">OUR MISSION</span>
              <h3 className="mv-title">Personal, Transparent & Meaningful</h3>
              <p className="mv-desc">{BRAND_INFO.mission}</p>
            </div>
          </div>

          {/* Vision */}
          <div className="mv-card mv-vision">
            <div className="mv-icon-wrapper">
              <Target size={24} className="text-amber-500" />
            </div>
            <div className="mv-content">
              <span className="mv-label">OUR VISION</span>
              <h3 className="mv-title">India’s Most Trusted Custom Travel Brand</h3>
              <p className="mv-desc">{BRAND_INFO.vision}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .founder-story-section {
          padding: 100px 0;
          background-color: var(--bg-card);
        }

        .story-header {
          text-align: center;
          margin-bottom: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mb-3 { margin-bottom: 12px; }

        .story-h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.18;
          margin-top: 8px;
        }

        /* Founders Grid */
        .founders-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 900px;
          margin: 0 auto 50px;
        }

        .founder-card {
          background: #ffffff;
          border-radius: var(--radius-card);
          padding: 28px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: var(--transition-smooth);
        }

        .founder-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .founder-avatar-chip {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--bg-eyebrow-yellow);
          color: var(--text-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .founder-name {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 4px;
        }

        .founder-role {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .founder-badge-mini {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--bg-pink);
          color: var(--text-dark);
          padding: 3px 10px;
          border-radius: 9999px;
        }

        /* Story Narrative Box */
        .story-narrative-card {
          position: relative;
          background: #ffffff;
          border-radius: 28px;
          padding: 44px 50px;
          max-width: 900px;
          margin: 0 auto 60px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.05);
        }

        .quote-mark {
          position: absolute;
          top: -20px;
          left: 30px;
          font-size: 80px;
          font-family: var(--font-serif-italic);
          color: var(--bg-eyebrow-yellow);
          line-height: 1;
        }

        .narrative-p {
          font-size: 15px;
          color: var(--text-dark);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .narrative-p:last-child {
          margin-bottom: 0;
        }

        .highlight-quote {
          font-size: 17px;
          color: var(--text-dark);
          background: var(--bg-pale-yellow);
          padding: 16px 20px;
          border-left: 4px solid #d97706;
          border-radius: 8px;
        }

        /* Mission & Vision Grid */
        .mission-vision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          max-width: 900px;
          margin: 0 auto;
        }

        .mv-card {
          background: #ffffff;
          border-radius: var(--radius-card);
          padding: 32px;
          display: flex;
          gap: 20px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
        }

        .mv-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mv-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          display: block;
          margin-bottom: 4px;
        }

        .mv-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 10px;
        }

        .mv-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .founders-grid { grid-template-columns: 1fr; }
          .mission-vision-grid { grid-template-columns: 1fr; }
          .story-narrative-card { padding: 30px 24px; }
        }
      `}</style>
    </section>
  );
}
