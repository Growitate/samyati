import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function TourCategories({ onNavigate }) {
  return (
    <section className="jaipur-window-section" id="categories">
      <div className="container">
        {/* Clean Title Header */}
        <div className="jaipur-header">
          <h2 className="jaipur-title">
            Choose Your Realm — <span className="accent-serif">Desh</span> or <span className="accent-serif">Videsh</span>
          </h2>
        </div>

        {/* Jaipur Castle Arched Window Grid */}
        <div className="jaipur-window-grid">
          {/* Desh Jaipur Arched Window Card */}
          <div 
            className="jaipur-arch-card card-desh-arch"
            onClick={() => onNavigate('desh')}
          >
            {/* Jaipur Arch Crest Motif */}
            <div className="arch-crest crest-desh">
              <svg viewBox="0 0 100 25" className="arch-svg">
                <path d="M0,25 C30,25 35,0 50,0 C65,0 70,25 100,25 Z" fill="#ffffff" />
              </svg>
            </div>

            <div className="arch-window-frame">
              <img 
                src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=85" 
                alt="Desh Domestic Holidays" 
                className="arch-img" 
              />
              <div className="arch-overlay overlay-desh" />

              {/* Top Badge */}
              <span className="arch-badge badge-desh">🇮🇳 देश (7 Destinations)</span>

              {/* Bottom Content */}
              <div className="arch-card-content">
                <h3 className="arch-heading">देश <span className="serif-sub">(Desh)</span></h3>

                <button className="btn-explore btn-explore-desh">
                  <span>Explore Packages</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Videsh Jaipur Arched Window Card */}
          <div 
            className="jaipur-arch-card card-videsh-arch"
            onClick={() => onNavigate('videsh')}
          >
            {/* Jaipur Arch Crest Motif */}
            <div className="arch-crest crest-videsh">
              <svg viewBox="0 0 100 25" className="arch-svg">
                <path d="M0,25 C30,25 35,0 50,0 C65,0 70,25 100,25 Z" fill="#ffffff" />
              </svg>
            </div>

            <div className="arch-window-frame">
              <img 
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85" 
                alt="Videsh International Holidays" 
                className="arch-img" 
              />
              <div className="arch-overlay overlay-videsh" />

              {/* Top Badge */}
              <span className="arch-badge badge-videsh">✈️ विदेश (7 Destinations)</span>

              {/* Bottom Content */}
              <div className="arch-card-content">
                <h3 className="arch-heading">विदेश <span className="serif-sub">(Videsh)</span></h3>

                <button className="btn-explore btn-explore-videsh">
                  <span>Explore Packages</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .jaipur-window-section {
          padding: 60px 0 80px;
          background-color: #ffffff;
        }

        .jaipur-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .jaipur-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.2;
        }

        /* Jaipur Arched Window Grid */
        .jaipur-window-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          max-width: 800px;
          margin: 0 auto;
        }

        .jaipur-arch-card {
          position: relative;
          width: 320px;
          cursor: pointer;
          transition: transform 0.4s ease, filter 0.4s ease;
        }

        .jaipur-arch-card:hover {
          transform: translateY(-8px);
        }

        /* Arch Crest Peak */
        .arch-crest {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 24px;
          z-index: 12;
        }

        .arch-svg {
          width: 100%;
          height: 100%;
        }

        /* Jaipur Palace Window Jharokha Dome Shape */
        .arch-window-frame {
          position: relative;
          height: 340px;
          width: 100%;
          border-radius: 160px 160px 24px 24px;
          overflow: hidden;
          box-shadow: 0 14px 36px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 24px 24px;
          border: 3px solid rgba(255, 255, 255, 0.8);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .card-desh-arch:hover .arch-window-frame {
          border-color: #d97706;
          box-shadow: 0 20px 44px rgba(217, 119, 6, 0.3);
        }

        .card-videsh-arch:hover .arch-window-frame {
          border-color: #0284c7;
          box-shadow: 0 20px 44px rgba(2, 132, 199, 0.3);
        }

        .arch-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .jaipur-arch-card:hover .arch-img {
          transform: scale(1.06);
        }

        .overlay-desh {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(20, 14, 8, 0.25) 0%, rgba(20, 14, 8, 0.85) 100%);
        }

        .overlay-videsh {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(9, 30, 66, 0.25) 0%, rgba(9, 30, 66, 0.85) 100%);
        }

        .arch-badge {
          position: relative;
          z-index: 10;
          align-self: center;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 9999px;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          margin-top: 10px;
        }

        .badge-desh {
          background: rgba(217, 119, 6, 0.95);
        }

        .badge-videsh {
          background: rgba(2, 132, 199, 0.95);
        }

        .arch-card-content {
          position: relative;
          z-index: 10;
          color: #ffffff;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .arch-heading {
          font-size: 30px;
          font-weight: 800;
          line-height: 1;
        }

        .serif-sub {
          font-family: var(--font-serif-italic);
          font-style: italic;
          font-weight: 400;
        }

        .btn-explore {
          border: none;
          padding: 9px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }

        .btn-explore-desh {
          background: #d97706;
          color: #ffffff;
        }

        .btn-explore-videsh {
          background: #0284c7;
          color: #ffffff;
        }

        .jaipur-arch-card:hover .btn-explore {
          transform: scale(1.05);
        }

        @media (max-width: 720px) {
          .jaipur-window-grid { flex-direction: column; }
          .jaipur-arch-card { width: 280px; }
          .arch-window-frame { height: 300px; }
        }
      `}</style>
    </section>
  );
}
