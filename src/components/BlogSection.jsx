import React from 'react';
import { Settings, ArrowUpRight, Calendar, Clock } from 'lucide-react';

export default function BlogSection() {
  return (
    <section className="blog-section">
      <div className="container">
        {/* Header Row */}
        <div className="blog-header">
          <div className="header-left">
            <div className="eyebrow-pill mb-2">
              <Settings className="gear-icon" size={12} />
              <span>Travel Articles</span>
              <Settings className="gear-icon" size={12} />
            </div>
            <h2 className="section-h2">
              Stories From <span className="accent-serif">The Road</span>
            </h2>
          </div>

          <div className="header-right">
            <a href="#" className="btn-pill btn-pill-dark">
              <span>View All Articles</span>
              <span className="btn-badge-icon">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </div>
        </div>

        {/* 2-Column Unequal Layout (60% / 40%) */}
        <div className="blog-grid">
          {/* Left Featured Post (60%) */}
          <div className="blog-card blog-card-featured">
            <div className="featured-photo-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85" 
                alt="Patagonia wilderness" 
                className="featured-img" 
              />
              <div className="photo-dark-overlay" />

              <div className="dual-tags">
                <span className="tag-pill tag-dark">Featured Post</span>
                <span className="tag-pill tag-white">Adventure Travel</span>
              </div>

              <div className="featured-meta-content">
                <div className="meta-info-row">
                  <span><Calendar size={12} /> August 10, 2026</span>
                  <span><Clock size={12} /> 7 min read</span>
                </div>
                <h3 className="featured-title">
                  Chasing Sunrise Across Patagonia: A Master Class in Glacial Wilderness Trekking
                </h3>
              </div>
            </div>
          </div>

          {/* Right Standard Post (40%) */}
          <div className="blog-card blog-card-standard">
            <div className="standard-photo-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=700&q=80" 
                alt="Kyoto tea temple" 
                className="standard-img" 
              />
              <span className="tag-pill tag-white tag-top-left">Destination Guide</span>
            </div>

            <div className="standard-body">
              <div className="meta-info-row meta-dark">
                <span><Calendar size={12} /> July 28, 2026</span>
                <span><Clock size={12} /> 5 min read</span>
              </div>
              <h3 className="standard-title">
                The Hidden Zen Sanctuaries of Kyoto: Beyond the Tourist Trail
              </h3>
              <p className="standard-desc">
                Discover centuries-old moss gardens, private monk tea ceremonies, and silent bamboo groves away from the crowds.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blog-section {
          padding: 100px 0;
          background-color: #ffffff;
        }

        .blog-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
        }

        .mb-2 { margin-bottom: 8px; }

        .blog-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 28px;
        }

        .blog-card {
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          transition: var(--transition-smooth);
        }

        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.12);
        }

        /* Left Featured Card */
        .blog-card-featured {
          position: relative;
          min-height: 440px;
        }

        .featured-photo-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 440px;
        }

        .featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-dark-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%);
        }

        .dual-tags {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .tag-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .tag-dark {
          background: var(--text-dark);
          color: #ffffff;
        }

        .tag-white {
          background: #ffffff;
          color: var(--text-dark);
        }

        .featured-meta-content {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          z-index: 10;
          color: #ffffff;
        }

        .meta-info-row {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .meta-info-row span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .featured-title {
          font-size: 24px;
          font-weight: 800;
          line-height: 1.3;
          color: #ffffff;
        }

        /* Right Standard Card */
        .blog-card-standard {
          background-color: var(--bg-card);
          display: flex;
          flex-direction: column;
        }

        .standard-photo-wrapper {
          position: relative;
          height: 220px;
        }

        .standard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tag-top-left {
          position: absolute;
          top: 16px;
          left: 16px;
        }

        .standard-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .meta-dark {
          color: var(--text-muted);
        }

        .standard-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.35;
          margin-bottom: 8px;
        }

        .standard-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        @media (max-width: 800px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
          .blog-card-featured {
            min-height: 340px;
          }
          .featured-photo-wrapper {
            min-height: 340px;
          }
        }
      `}</style>
    </section>
  );
}
