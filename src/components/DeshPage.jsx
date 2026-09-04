import React, { useState, useEffect } from 'react';
import { Menu, Bell, ArrowLeft, X, Clock, Star, ArrowUpRight, Plane } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { scrollTo } from '../smoothScroll';

// Featured Desh Destinations matching reference layout
const DESH_DESTINATIONS = [
  {
    id: 'kashmir',
    name: 'Kashmir',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=85',
    tagline: 'Paradise on Earth'
  },
  {
    id: 'himachal',
    name: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
    tagline: 'Valley of the Gods'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85',
    tagline: 'Gods Own Country'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=85',
    tagline: 'Land of Royal Forts'
  },
  {
    id: 'andaman',
    name: 'Andaman Islands',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
    tagline: 'Emerald Turquoise Island Escape'
  },
  {
    id: 'northeast',
    name: 'North East',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85',
    tagline: 'Paradise Unexplored & Seven Sisters'
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=85',
    tagline: 'Spiritual Capital & Heritage of India'
  }
];

export default function DeshPage({ onBack, onSelectPackage, onSelectDestination, onOpenOfferModal }) {
  const { packages: PACKAGES } = usePackages();
  const [selectedDest, setSelectedDest] = useState(null);

  const handleCardClick = (item) => {
    const destObj = { ...item, category: 'Domestic' };
    if (onSelectDestination) {
      onSelectDestination(destObj);
    } else {
      setSelectedDest(item);
    }
  };

  useEffect(() => {
    scrollTo(0, { immediate: true });
  }, []);

  // Filter packages for selected destination
  const activePackages = selectedDest
    ? PACKAGES.filter(p => p.destinationName.toLowerCase().includes(selectedDest.name.toLowerCase()) || p.category === 'Domestic').slice(0, 4)
    : [];

  return (
    <div className="desh-page-fixed">
      {/* HERO BANNER WITH FAMOUS TAJ MAHAL HERITAGE BACKGROUND */}
      <section className="desh-hero-banner">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=90"
          alt="Famous Taj Mahal Golden Hour Heritage Banner"
          className="hero-bg-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85';
          }}
        />
        <div className="hero-bg-overlay" />

        <div className="container relative-hero-z">
          {/* Top Header Spacer */}
          <div style={{ paddingTop: '80px' }} />

          {/* Single Clean Hero Title Block */}
          <div className="hero-title-content">
            <h1 className="hero-main-title">Desh</h1>

            <div className="hero-sub-row">
              <span className="star-accent">✦</span>
              <span className="sub-caption-text">EXPLORE THE SOUL OF INDIA</span>
              <span className="star-accent">✦</span>
            </div>

            <p className="hero-sub-paragraph">
              Handcrafted domestic journeys through heritage palaces, royal forts, tranquil backwaters, and Himalayan valleys.
            </p>
          </div>
        </div>
      </section>

      {/* DESTINATION CARDS GRID SECTION */}
      <section className="desh-cards-section">
        <div className="container max-w-cards">

          {/* Section Divider Header with Flight Trace */}
          <div className="desh-section-header">
            <div className="header-title-flex">
              <span className="star-accent">✦</span>
              <h2 className="desh-section-heading">TOP DESTINATIONS</h2>
              <span className="star-accent">✦</span>
            </div>

            {/* Flight Path Graphic */}
            <div className="flight-path-decoration">
              <svg viewBox="0 0 120 30" className="flight-line-svg">
                <path d="M5,25 Q60,-5 115,20" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <Plane size={14} className="flight-plane-icon" />
            </div>
          </div>

          {/* Row 1: 3 Columns (Kashmir, Himachal Pradesh, Kerala) */}
          <div className="card-row row-3">
            {DESH_DESTINATIONS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="desh-dest-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="card-photo-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="dest-photo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="desh-card-footer">
                  <div>
                    <h3 className="desh-card-title">{item.name}</h3>
                    <p className="desh-card-tagline">{item.tagline}</p>
                  </div>
                  <span className="btn-card-explore" title="Explore Packages">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 2 Columns (Rajasthan, Andaman Islands) */}
          <div className="card-row row-2">
            {DESH_DESTINATIONS.slice(3, 5).map((item) => (
              <div
                key={item.id}
                className="desh-dest-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="card-photo-wrapper photo-wide">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="dest-photo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="desh-card-footer">
                  <div>
                    <h3 className="desh-card-title">{item.name}</h3>
                    <p className="desh-card-tagline">{item.tagline}</p>
                  </div>
                  <span className="btn-card-explore" title="Explore Packages">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: 2 Columns (North East, Varanasi) */}
          <div className="card-row row-2">
            {DESH_DESTINATIONS.slice(5, 7).map((item) => (
              <div
                key={item.id}
                className="desh-dest-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="card-photo-wrapper photo-wide">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="dest-photo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85';
                    }}
                  />
                </div>
                <div className="desh-card-footer">
                  <div>
                    <h3 className="desh-card-title">{item.name}</h3>
                    <p className="desh-card-tagline">{item.tagline}</p>
                  </div>
                  <span className="btn-card-explore" title="Explore Packages">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ACTIVE DESTINATION PACKAGES DRAWER MODAL */}
      {selectedDest && (
        <div className="dest-drawer-backdrop" onClick={() => setSelectedDest(null)}>
          <div className="dest-drawer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="drawer-tag">🇮🇳 {selectedDest.name} Expeditions</span>
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

      {/* Styled JSX */}
      <style>{`
        .desh-page-fixed {
          position: relative;
          background-color: #fefce8;
          min-height: 100vh;
          color: #2d2319;
          padding-bottom: 80px;
          font-family: var(--font-sans);
        }

        /* HERO BANNER WITH CLEAN ARTWORK BACKGROUND */
        .desh-hero-banner {
          position: relative;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-bottom: 50px;
        }

        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0.25) 100%);
          pointer-events: none;
        }

        .relative-hero-z {
          position: relative;
          z-index: 10;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Title */
        .hero-title-content {
          text-align: center;
          margin-top: 24px;
        }

        .hero-main-title {
          font-family: var(--font-serif-italic);
          font-size: clamp(72px, 12vw, 110px);
          font-weight: 400;
          color: #ffffff;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          line-height: 0.9;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .hero-sub-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .star-accent {
          color: #fcd34d;
          font-size: 12px;
        }

        .sub-caption-text {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #fef08a;
          text-transform: uppercase;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .hero-sub-paragraph {
          font-size: 14.5px;
          font-weight: 500;
          color: #f1f5f9;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
          max-width: 540px;
          margin: 12px auto 0;
          line-height: 1.55;
        }

        /* CARDS SECTION */
        .desh-cards-section {
          position: relative;
          z-index: 10;
          padding-top: 48px;
          margin-top: 0;
        }

        .max-w-cards {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Section Header Divider */
        .desh-section-header {
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

        .desh-section-heading {
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

        .card-row {
          display: grid;
          gap: 20px;
          margin-bottom: 20px;
        }

        .row-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .row-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .row-center {
          display: flex;
          justify-content: center;
        }

        .card-wide-center {
          width: 55%;
        }

        /* Destination Card matching Videsh layout */
        .desh-dest-card {
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

        .desh-dest-card:hover {
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

        .dest-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .desh-dest-card:hover .dest-photo {
          transform: scale(1.06);
        }

        .desh-card-footer {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          gap: 12px;
        }

        .desh-card-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }

        .desh-card-tagline {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .btn-card-explore {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .desh-dest-card:hover .btn-card-explore {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: rotate(45deg);
        }

        /* Drawer Backdrop Modal */
        .dest-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
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
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
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
          color: #b45309;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .drawer-heading {
          font-size: 24px;
          font-weight: 800;
          color: #2d2319;
        }

        .btn-drawer-close {
          background: #f6f4ed;
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
          background: #fdfbf7;
          border: 1px solid #efe8da;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .drawer-item-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(45,35,25,0.1);
        }

        .drawer-item-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .drawer-item-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .drawer-item-dur {
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          margin-bottom: 4px;
        }

        .drawer-item-name {
          font-size: 16px;
          font-weight: 800;
          color: #2d2319;
          margin-bottom: 6px;
        }

        .drawer-item-desc {
          font-size: 12px;
          color: #786c5e;
          line-height: 1.4;
          margin-bottom: 14px;
          flex: 1;
        }

        .drawer-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #efe8da;
          padding-top: 12px;
        }

        .drawer-item-price {
          font-size: 15px;
          color: #1e293b;
        }

        .btn-view-link {
          font-size: 12px;
          font-weight: 700;
          color: #b45309;
        }

        @media (max-width: 768px) {
          .row-3, .row-2, .drawer-grid {
            grid-template-columns: 1fr;
          }
          .card-wide-center {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
