import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function TourCategories({ onSelectCategory, onNavigate }) {
  const handleDeshClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (onNavigate) onNavigate('desh');
    if (onSelectCategory) onSelectCategory('desh');
    window.location.hash = '#desh';
  };

  const handleVideshClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (onNavigate) onNavigate('videsh');
    if (onSelectCategory) onSelectCategory('videsh');
    window.location.hash = '#videsh';
  };

  return (
    <section className="jaipur-window-section" id="categories">
      <div className="container">
        {/* Clean Title Header */}
        <div className="jaipur-header">
          <h2 className="jaipur-title">
            Choose Your Realm — <span className="accent-serif">Desh</span> or <span className="accent-serif">Videsh</span>
          </h2>
        </div>

        {/* Realm Cards Grid */}
        <div className="jaipur-window-grid">
          {/* Desh Card */}
          <div 
            className="jaipur-arch-card card-desh-arch"
            onClick={handleDeshClick}
          >
            <div className="arch-window-frame">
              <img 
                src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=85" 
                alt="Desh Domestic Holidays" 
                className="arch-img" 
              />
              <div className="arch-overlay overlay-desh" />

              {/* Bottom Content */}
              <div className="arch-card-content">
                <h3 className="arch-heading">Desh</h3>

                <button 
                  className="btn-explore btn-explore-desh"
                  onClick={handleDeshClick}
                >
                  <span>Explore Packages</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Videsh Card */}
          <div 
            className="jaipur-arch-card card-videsh-arch"
            onClick={handleVideshClick}
          >
            <div className="arch-window-frame">
              <img 
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85" 
                alt="Videsh International Holidays" 
                className="arch-img" 
              />
              <div className="arch-overlay overlay-videsh" />

              {/* Bottom Content */}
              <div className="arch-card-content">
                <h3 className="arch-heading">Videsh</h3>

                <button 
                  className="btn-explore btn-explore-videsh"
                  onClick={handleVideshClick}
                >
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
          background-color: #fef9c3;
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

        /* Jaipur Window Grid */
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

        /* Curved Rectangle / Soft Square Window Frame */
        .arch-window-frame {
          position: relative;
          height: 320px;
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 14px 36px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 32px 24px 28px;
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
          background: linear-gradient(180deg, rgba(20, 14, 8, 0.15) 0%, rgba(20, 14, 8, 0.85) 100%);
        }

        .overlay-videsh {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(9, 30, 66, 0.15) 0%, rgba(9, 30, 66, 0.85) 100%);
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
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .btn-explore {
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
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
          .jaipur-window-section { padding: 32px 0 44px; }
          .jaipur-header { margin-bottom: 24px; }
          .jaipur-title { font-size: clamp(24px, 6vw, 30px); }
          .jaipur-window-grid { flex-direction: column; gap: 16px; padding: 0 16px; }
          .jaipur-arch-card { width: 100%; max-width: 100%; }
          .arch-window-frame { height: 210px; border-radius: 20px; padding: 20px 16px 16px; }
          .arch-card-content { gap: 10px; }
          .arch-heading { font-size: 24px; }
          .btn-explore { padding: 8px 16px; font-size: 12px; border-radius: 9999px; }
        }
      `}</style>
    </section>
  );
}
