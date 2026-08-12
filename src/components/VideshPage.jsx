import React, { useState, useEffect } from 'react';
import { Menu, Globe, ArrowRight, X, Clock, Star, ArrowUpRight, Compass, Plane } from 'lucide-react';
import { PACKAGES } from '../data/travelData';

// 7 Featured Videsh Destinations matching the uploaded reference layout mockup
const VIDESH_DESTINATIONS = [
  {
    id: 'greece',
    name: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=85',
    tagline: 'Santorini Domes & Aegean Sea',
    category: 'International'
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=85',
    tagline: 'Alpine Peaks & Lakes',
    category: 'International'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=85',
    tagline: 'Burj Khalifa & Futuristic Skyline',
    category: 'International'
  },
  {
    id: 'paris',
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=85',
    tagline: 'City of Romance & Eiffel Tower',
    category: 'International'
  },
  {
    id: 'bali',
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85',
    tagline: 'Tropical Villas & Sacred Gates',
    category: 'International'
  },
  {
    id: 'new-york',
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=85',
    tagline: 'Statue of Liberty & Manhattan',
    category: 'International'
  },
  {
    id: 'maldives',
    name: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85',
    tagline: 'Overwater Villas & Turquoise Lagoons',
    category: 'International'
  }
];

export default function VideshPage({ onBack, onSelectPackage, onOpenOfferModal }) {
  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter packages matching selected destination or general international
  const activePackages = selectedDest
    ? PACKAGES.filter(p => 
        p.category === 'International' && 
        (p.destinationName.toLowerCase().includes(selectedDest.name.toLowerCase()) || 
         p.title.toLowerCase().includes(selectedDest.name.toLowerCase()))
      ).concat(
        PACKAGES.filter(p => p.category === 'International' && !p.destinationName.toLowerCase().includes(selectedDest.name.toLowerCase()))
      ).slice(0, 4)
    : [];

  return (
    <div className="videsh-page-fixed">
      {/* HERO BANNER WITH VIDESH WORLD LANDMARKS BACKGROUND */}
      <section className="videsh-hero-banner">
        <img src="/videsh-bg.png" alt="Videsh World Landmarks Background" className="videsh-hero-bg-img" />
        <div className="videsh-hero-bg-overlay" />

        <div className="container relative-videsh-z">
          {/* Top Header Spacer */}
          <div style={{ paddingTop: '80px' }} />

          {/* Single Clean Hero Title Block */}
          <div className="videsh-hero-content">
            <h1 className="videsh-main-title">Videsh</h1>

            <div className="videsh-sub-row">
              <span className="videsh-star-accent">✦</span>
              <span className="videsh-caption-text">EXPLORE THE WORLD</span>
              <span className="videsh-star-accent">✦</span>
            </div>

            <p className="videsh-hero-desc">
              Discover breathtaking destinations around the globe and create unforgettable memories.
            </p>
          </div>
        </div>
      </section>

      {/* TOP DESTINATIONS SECTION HEADER & CARDS GRID */}
      <section className="videsh-cards-section">
        <div className="container max-w-videsh">
          
          {/* Section Divider Header with Flight Trace */}
          <div className="videsh-section-header">
            <div className="header-title-flex">
              <span className="videsh-star-accent">✦</span>
              <h2 className="videsh-section-heading">TOP DESTINATIONS</h2>
              <span className="videsh-star-accent">✦</span>
            </div>

            {/* Flight Path Graphic */}
            <div className="flight-path-decoration">
              <svg viewBox="0 0 120 30" className="flight-line-svg">
                <path d="M5,25 Q60,-5 115,20" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <Plane size={14} className="flight-plane-icon" />
            </div>
          </div>

          {/* Row 1: 3 Columns (Greece, Switzerland, Dubai) */}
          <div className="videsh-card-row row-3">
            {VIDESH_DESTINATIONS.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="videsh-dest-card"
                onClick={() => setSelectedDest(item)}
              >
                <div className="card-photo-wrapper">
                  <img src={item.image} alt={item.name} className="videsh-card-photo" />
                </div>

                <div className="videsh-card-footer">
                  <div className="videsh-card-text">
                    <h3 className="videsh-card-title">{item.name}</h3>
                    <span className="videsh-card-caption">Explore</span>
                  </div>

                  <div className="card-arrow-ring">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 3 Columns (Paris, Bali, New York) */}
          <div className="videsh-card-row row-3">
            {VIDESH_DESTINATIONS.slice(3, 6).map((item) => (
              <div 
                key={item.id} 
                className="videsh-dest-card"
                onClick={() => setSelectedDest(item)}
              >
                <div className="card-photo-wrapper">
                  <img src={item.image} alt={item.name} className="videsh-card-photo" />
                </div>

                <div className="videsh-card-footer">
                  <div className="videsh-card-text">
                    <h3 className="videsh-card-title">{item.name}</h3>
                    <span className="videsh-card-caption">Explore</span>
                  </div>

                  <div className="card-arrow-ring">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: Single Centered Wide Card (Maldives) */}
          <div className="videsh-card-row row-center">
            <div 
              className="videsh-dest-card card-wide-center"
              onClick={() => setSelectedDest(VIDESH_DESTINATIONS[6])}
            >
              <div className="card-photo-wrapper photo-wide">
                <img src={VIDESH_DESTINATIONS[6].image} alt={VIDESH_DESTINATIONS[6].name} className="videsh-card-photo" />
              </div>

              <div className="videsh-card-footer">
                <div className="videsh-card-text">
                  <h3 className="videsh-card-title">{VIDESH_DESTINATIONS[6].name}</h3>
                  <span className="videsh-card-caption">Explore</span>
                </div>

                <div className="card-arrow-ring">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ACTIVE DESTINATION PACKAGES DRAWER MODAL */}
      {selectedDest && (
        <div className="dest-drawer-backdrop" onClick={() => setSelectedDest(null)}>
          <div className="dest-drawer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="drawer-tag">🌐 {selectedDest.name} Expeditions</span>
                <h3 className="drawer-heading">{selectedDest.name} — {selectedDest.tagline}</h3>
              </div>

              <button onClick={() => setSelectedDest(null)} className="btn-drawer-close">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-grid">
              {activePackages.map((pkg) => (
                <div key={pkg.id} className="drawer-item-card" onClick={() => onSelectPackage(pkg)}>
                  <img src={pkg.image} alt={pkg.title} className="drawer-item-img" />
                  <div className="drawer-item-body">
                    <span className="drawer-item-dur">{pkg.duration}</span>
                    <h4 className="drawer-item-name">{pkg.title}</h4>
                    <p className="drawer-item-desc">{pkg.description}</p>
                    <div className="drawer-item-footer">
                      <strong className="drawer-item-price">{pkg.price}</strong>
                      <span className="btn-view-link">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .videsh-page-fixed {
          position: relative;
          background-color: #f8fafc;
          min-height: 100vh;
          color: #0f172a;
          padding-bottom: 80px;
          font-family: var(--font-sans);
        }

        /* HERO BANNER WITH VIDESH WORLD LANDMARKS BACKGROUND */
        .videsh-hero-banner {
          position: relative;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-bottom: 50px;
        }

        .videsh-hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          mask-image: linear-gradient(180deg, #000 60%, rgba(0, 0, 0, 0.4) 82%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, #000 60%, rgba(0, 0, 0, 0.4) 82%, transparent 100%);
        }

        .videsh-hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(248, 250, 252, 0.1) 0%, rgba(248, 250, 252, 0.3) 55%, rgba(248, 250, 252, 0.95) 100%);
          pointer-events: none;
        }

        .relative-videsh-z {
          position: relative;
          z-index: 10;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Nav Bar */
        .videsh-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 10px;
        }

        .videsh-nav-btn {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(15, 23, 42, 0.12);
          color: #0f172a;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .videsh-nav-btn:hover {
          background: #ffffff;
          transform: scale(1.05);
        }

        .videsh-brand-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .compass-icon-wrapper {
          color: #8c7355;
        }

        .compass-star {
          display: block;
        }

        .videsh-logo-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #1e293b;
        }

        .videsh-explore-btn {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          color: #1e293b;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .videsh-explore-btn:hover {
          background: #f1f5f9;
          transform: scale(1.03);
        }

        /* Hero Title */
        .videsh-hero-content {
          text-align: center;
          margin-top: 20px;
        }

        .videsh-main-title {
          font-family: var(--font-serif-italic);
          font-size: clamp(72px, 12vw, 110px);
          font-weight: 400;
          color: #1e2b48;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .videsh-sub-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .videsh-star-accent {
          color: #947249;
          font-size: 11px;
        }

        .videsh-caption-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #78644e;
          text-transform: uppercase;
        }

        .videsh-hero-desc {
          font-size: 14px;
          color: #475569;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* CARDS SECTION */
        .videsh-cards-section {
          position: relative;
          z-index: 10;
          margin-top: -20px;
        }

        .max-w-videsh {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Section Header Divider */
        .videsh-section-header {
          position: relative;
          text-align: center;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-title-flex {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .videsh-section-heading {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #475569;
          text-transform: uppercase;
        }

        .flight-path-decoration {
          position: absolute;
          right: 40px;
          top: -10px;
          display: flex;
          align-items: center;
        }

        .flight-line-svg {
          width: 80px;
          height: 24px;
        }

        .flight-plane-icon {
          color: #947249;
          transform: rotate(15deg);
          margin-left: -6px;
        }

        /* Card Rows */
        .videsh-card-row {
          display: grid;
          gap: 20px;
          margin-bottom: 20px;
        }

        .row-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .row-center {
          display: flex;
          justify-content: center;
        }

        .card-wide-center {
          width: 100%;
        }

        /* Destination Card */
        .videsh-dest-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          border: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
        }

        .videsh-dest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
        }

        .card-photo-wrapper {
          width: 100%;
          height: 210px;
          overflow: hidden;
        }

        .photo-wide {
          height: 240px;
        }

        .videsh-card-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .videsh-dest-card:hover .videsh-card-photo {
          transform: scale(1.06);
        }

        .videsh-card-footer {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
        }

        .videsh-card-title {
          font-family: var(--font-serif-italic);
          font-size: 24px;
          font-weight: 500;
          color: #0f172a;
          line-height: 1.1;
          margin: 0;
        }

        .videsh-card-caption {
          font-style: italic;
          font-size: 13px;
          color: #947249;
          display: block;
          margin-top: 2px;
          font-family: var(--font-serif-italic);
        }

        .card-arrow-ring {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #947249;
          transition: all 0.25s ease;
        }

        .videsh-dest-card:hover .card-arrow-ring {
          background: #947249;
          border-color: #947249;
          color: #ffffff;
          transform: translateX(2px);
        }

        /* Drawer Modal */
        .dest-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .dest-drawer-modal {
          background: #ffffff;
          border-radius: 24px;
          padding: 32px;
          max-width: 840px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .drawer-tag {
          font-size: 11px;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .drawer-heading {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .btn-drawer-close {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .drawer-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .drawer-item-card {
          background: #f8fafc;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }

        .drawer-item-card:hover {
          transform: translateY(-3px);
          border-color: #0284c7;
        }

        .drawer-item-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .drawer-item-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .drawer-item-dur {
          font-size: 11px;
          font-weight: 700;
          color: #0284c7;
        }

        .drawer-item-name {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2px;
        }

        .drawer-item-desc {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .drawer-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
        }

        .drawer-item-price {
          font-size: 15px;
          color: #0284c7;
        }

        .btn-view-link {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
        }

        @media (max-width: 768px) {
          .videsh-hero-banner {
            min-height: 400px;
            padding-bottom: 40px;
          }
          .videsh-main-title {
            font-size: clamp(54px, 13vw, 84px);
            margin-bottom: 8px;
          }
          .videsh-hero-desc {
            font-size: 13.5px;
            padding: 0 14px;
          }
          .row-3 { grid-template-columns: 1fr; gap: 16px; }
          .videsh-card { height: 260px; }
          .drawer-grid { grid-template-columns: 1fr; }
          .flight-path-decoration { display: none; }
        }
      `}</style>
    </div>
  );
}
