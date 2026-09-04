import React from 'react';
import { Compass, ArrowUpRight } from 'lucide-react';

export default function FounderStorySection({ onNavigate }) {
  return (
    <section className="founder-story-section" id="story">
      <div className="container">
        {/* Section Header with Company-Focused Title */}
        <div className="story-header">
          <div className="eyebrow-pill mb-3">
            <Compass className="gear-icon" size={13} />
            <span>About Samyati The World</span>
            <Compass className="gear-icon" size={13} />
          </div>

          <h2 className="story-h2">
            Crafting Meaningful Journeys, <br />
            <span className="accent-serif">Driven by Purpose</span>
          </h2>
        </div>

        {/* 1. About Narrative Paragraph Box (FIRST) */}
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

        {/* View More About Us Button */}
        <div className="story-cta-box">
          <button 
            onClick={() => {
              if (onNavigate) {
                onNavigate('about');
              } else {
                window.location.hash = '#about';
              }
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }} 
            className="btn-pill btn-pill-dark btn-story-more"
            aria-label="View More About Us"
          >
            <span>View More About Us</span>
            <span className="btn-badge-icon">
              <ArrowUpRight size={16} />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .story-cta-box {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-story-more {
          padding: 12px 14px 12px 28px;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }

        .btn-story-more:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.18);
        }

        .founder-story-section {
          padding: 48px 0 44px;
          background-color: var(--bg-card);
        }

        .story-header {
          text-align: center;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .mb-3 { margin-bottom: 12px; }

        .story-h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.18;
          margin-top: 8px;
          text-align: center;
        }

        .story-h2 .accent-serif {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 1.18em;
          color: #d97706;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          vertical-align: baseline;
          padding: 0 0.08em;
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
          padding: 40px 48px;
          max-width: 900px;
          margin: 0 auto 28px;
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
          .founder-story-section { padding: 48px 0; }
          .story-header { margin-bottom: 28px; }
          .story-h2 { font-size: clamp(24px, 6.5vw, 32px); }
          .story-narrative-card { padding: 22px 18px; border-radius: 20px; margin-bottom: 24px; }
          .quote-mark { font-size: 45px; top: -12px; left: 14px; }
          .narrative-p { font-size: 13.5px; line-height: 1.6; margin-bottom: 12px; }
          .highlight-quote { font-size: 14px; padding: 12px 14px; border-left-width: 3px; }
          .founders-grid { grid-template-columns: 1fr; gap: 16px; margin-bottom: 28px; }
          .mission-vision-grid { grid-template-columns: 1fr; gap: 16px; }
          .mv-card { padding: 18px 16px; gap: 14px; border-radius: 18px; }
          .mv-icon-wrapper { width: 40px; height: 40px; }
          .mv-title { font-size: 16px; margin-bottom: 6px; }
          .mv-desc { font-size: 12.5px; line-height: 1.55; }
          .story-cta-box { margin-top: 28px; }
          .btn-story-more { padding: 10px 14px 10px 22px; font-size: 13.5px; }
        }
      `}</style>
    </section>
  );
}
