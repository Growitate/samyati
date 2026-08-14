import React, { useRef, useState } from 'react';
import { Settings, Clock, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { PACKAGES } from '../data/travelData';

export default function FeaturedTours({ onSelectPackage, onNavigate }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const scrollRef = useRef(null);

  // Filter packages by category ('All', 'Domestic', 'International')
  const displayPackages = filterCategory === 'All' 
    ? PACKAGES 
    : PACKAGES.filter((p) => p.category === filterCategory);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 374;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleRedirect = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page;
    }
  };

  return (
    <section className="featured-section" id="tours">
      <div className="container">
        {/* Header Row */}
        <div className="featured-header">
          <div className="header-left">
            <div className="eyebrow-pill mb-2">
              <Settings className="gear-icon" size={12} />
              <span>Handcrafted Packages</span>
              <Settings className="gear-icon" size={12} />
            </div>
            <h2 className="section-h2">
              Packages <span className="accent-serif">Crafted</span> Around<br />Your Travel Style
            </h2>
          </div>

          <div className="header-right">
            {/* Quick Realm Links */}
            <div className="filter-pill-group">
              <button 
                className="filter-btn active"
                onClick={() => handleRedirect('desh')}
                title="Explore Desh Domestic Packages"
              >
                🇮🇳 Domestic
              </button>
              <button 
                className="filter-btn active"
                onClick={() => handleRedirect('videsh')}
                title="Explore Videsh International Packages"
              >
                ✈️ International
              </button>
            </div>

            {/* Manual Navigation Arrow Buttons */}
            <div className="carousel-arrows-group">
              <button 
                className="carousel-arrow-btn"
                onClick={() => handleScroll('left')}
                title="Scroll Left"
                aria-label="Previous tours"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="carousel-arrow-btn"
                onClick={() => handleScroll('right')}
                title="Scroll Right"
                aria-label="Next tours"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Manual Horizontal Scroll Carousel */}
        <div className="manual-carousel-container" ref={scrollRef}>
          <div className="manual-carousel-track">
            {displayPackages.map((tour) => (
              <div 
                key={tour.id} 
                className="tour-card"
                onClick={() => onSelectPackage(tour)}
              >
                {/* Photo Block with Tag */}
                <div className="card-photo-wrapper">
                  <img src={tour.image} alt={tour.title} className="card-photo" />
                  <span className="category-tag-pill">{tour.destinationName}</span>
                  <div className="rating-badge">
                    <Star size={12} className="star-icon" />
                    <span>{tour.rating} ({tour.reviewsCount})</span>
                  </div>
                </div>

                {/* Light Gray Card Body */}
                <div className="card-body">
                  <h3 className="tour-card-title">{tour.title}</h3>
                  <p className="tour-card-desc">{tour.description}</p>
                  
                  <div className="card-divider" />

                  {/* Footer Row */}
                  <div className="card-footer">
                    <div className="price-block">
                      <span className="price-label">Starting From</span>
                      <div className="price-flex">
                        <span className="price-val">{tour.price}</span>
                        <span className="price-orig">{tour.originalPrice}</span>
                      </div>
                    </div>

                    <div className="card-action-right">
                      <div className="duration-badge">
                        <Clock size={12} />
                        <span>{tour.duration}</span>
                      </div>

                      <button className="view-details-icon-btn" title="View Day-by-Day Itinerary">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .featured-section {
          padding: 90px 0;
          background-color: #ffffff;
          overflow: hidden;
        }

        .featured-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 36px;
        }

        .mb-2 { margin-bottom: 10px; }

        .section-h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.15;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
        }

        /* Exactly 2 Filter Boxes on Far Right */
        .filter-pill-group {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          padding: 5px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }

        .filter-btn {
          border: none;
          background: transparent;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-btn.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        /* Carousel Navigation Arrow Buttons */
        .carousel-arrows-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .carousel-arrow-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
        }

        .carousel-arrow-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2);
        }

        .carousel-arrow-btn:active {
          transform: scale(0.96);
        }

        /* Manual Horizontal Scroll Carousel */
        .manual-carousel-container {
          width: 100%;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          padding: 10px 4px 24px;
          position: relative;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .manual-carousel-container::-webkit-scrollbar {
          display: none;
        }

        .manual-carousel-track {
          display: flex;
          gap: 24px;
          width: max-content;
        }

        .tour-card {
          flex: 0 0 350px;
          width: 350px;
          background-color: var(--bg-card, #f8fafc);
          border-radius: var(--radius-card, 20px);
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
          transition: var(--transition-smooth, all 0.3s ease);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          border: 1px solid #e2e8f0;
        }

        .tour-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.1);
        }

        .card-photo-wrapper {
          position: relative;
          width: 100%;
          height: 230px;
          overflow: hidden;
        }

        .card-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .tour-card:hover .card-photo {
          transform: scale(1.06);
        }

        .category-tag-pill {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: #ffffff;
          color: var(--text-dark, #0f172a);
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .rating-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star-icon {
          color: #f59e0b;
          fill: #f59e0b;
        }

        .card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .tour-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-dark, #0f172a);
          line-height: 1.35;
          margin-bottom: 8px;
        }

        .tour-card-desc {
          font-size: 13px;
          color: var(--text-muted, #64748b);
          line-height: 1.5;
          margin-bottom: 18px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-divider {
          height: 1px;
          background-color: #e2e8f0;
          margin-bottom: 14px;
        }

        .card-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .price-block {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 10px;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .price-flex {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .price-val {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-dark, #0f172a);
        }

        .price-orig {
          font-size: 11px;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .card-action-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .duration-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          color: #0f172a;
        }

        .view-details-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0f172a;
          transition: var(--transition-smooth);
        }

        .tour-card:hover .view-details-icon-btn {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        @media (max-width: 768px) {
          .featured-section { padding: 60px 0; }
          .featured-header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
          .header-right { width: 100%; justify-content: flex-start; }
          .tour-card { flex: 0 0 285px; width: 285px; }
          .card-photo-wrapper { height: 190px; }
          .card-body { padding: 18px 16px; }
          .tour-card-title { font-size: 15px; }
        }

        @media (max-width: 480px) {
          .filter-btn { padding: 6px 14px; font-size: 12px; }
          .tour-card { flex: 0 0 270px; width: 270px; }
        }
      `}</style>
    </section>
  );
}
