import React, { useState, useEffect } from 'react';
import { Menu, Bell, ArrowLeft, X, Clock, Star, ArrowUpRight } from 'lucide-react';
import { PACKAGES } from '../data/travelData';

// 8 Featured Desh Destinations matching reference layout
const DESH_DESTINATIONS = [
  {
    id: 'agra',
    name: 'Agra',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=85',
    tagline: 'City of Love & Taj Mahal'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85',
    tagline: 'Gods Own Country'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=85',
    tagline: 'Spiritual Capital of India'
  },
  {
    id: 'himachal',
    name: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
    tagline: 'Valley of the Gods'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=85',
    tagline: 'Land of Royal Forts'
  },
  {
    id: 'goa',
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=85',
    tagline: 'Pearl of the Orient'
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=85',
    tagline: 'The Heart of Incredible India'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1000&q=85',
    tagline: 'City of Lakes & Venetian Palaces'
  }
];

export default function DeshPage({ onBack, onSelectPackage, onOpenOfferModal }) {
  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter packages for selected destination
  const activePackages = selectedDest
    ? PACKAGES.filter(p => p.destinationName.toLowerCase().includes(selectedDest.name.toLowerCase()) || p.category === 'Domestic').slice(0, 4)
    : [];

  return (
    <div className="desh-page-fixed">
      {/* HERO BANNER WITH CLEAN ARCH ARTWORK BACKGROUND */}
      <section className="desh-hero-banner">
        <img src="/desh-bg.jpg" alt="Indian Palace Clean Background Arch" className="hero-bg-img" />
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
          
          {/* Row 1: 3 Columns (Agra, Kerala, Varanasi) */}
          <div className="card-row row-3">
            {DESH_DESTINATIONS.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="mental-dest-card"
                onClick={() => setSelectedDest(item)}
              >
                <img src={item.image} alt={item.name} className="dest-photo" />
                <div className="dest-gradient-mask" />
                <span className="dest-serif-title">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Row 2: 2 Columns (Himachal Pradesh, Rajasthan) */}
          <div className="card-row row-2">
            {DESH_DESTINATIONS.slice(3, 5).map((item) => (
              <div 
                key={item.id} 
                className="mental-dest-card"
                onClick={() => setSelectedDest(item)}
              >
                <img src={item.image} alt={item.name} className="dest-photo" />
                <div className="dest-gradient-mask" />
                <span className="dest-serif-title">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Row 3: 2 Columns (Goa, Madhya Pradesh) */}
          <div className="card-row row-2">
            {DESH_DESTINATIONS.slice(5, 7).map((item) => (
              <div 
                key={item.id} 
                className="mental-dest-card"
                onClick={() => setSelectedDest(item)}
              >
                <img src={item.image} alt={item.name} className="dest-photo" />
                <div className="dest-gradient-mask" />
                <span className="dest-serif-title">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Row 4: Single Centered Card (Udaipur) */}
          <div className="card-row row-center">
            <div 
              className="mental-dest-card card-wide-center"
              onClick={() => setSelectedDest(DESH_DESTINATIONS[7])}
            >
              <img src={DESH_DESTINATIONS[7].image} alt={DESH_DESTINATIONS[7].name} className="dest-photo" />
              <div className="dest-gradient-mask" />
              <span className="dest-serif-title">{DESH_DESTINATIONS[7].name}</span>
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

      <style>{`
        .desh-page-fixed {
          position: relative;
          background-color: #f6f2ea;
          min-height: 100vh;
          color: #2d2319;
          padding-bottom: 80px;
          font-family: var(--font-sans);
        }

        /* HERO BANNER WITH CLEAN ARTWORK BACKGROUND */
        .desh-hero-banner {
          position: relative;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-bottom: 60px;
        }

        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          mask-image: linear-gradient(180deg, #000 55%, rgba(0, 0, 0, 0.5) 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, #000 55%, rgba(0, 0, 0, 0.5) 80%, transparent 100%);
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(246, 242, 234, 0) 0%, rgba(246, 242, 234, 0.05) 45%, rgba(246, 242, 234, 0.6) 80%, #f6f2ea 100%);
          pointer-events: none;
        }

        .relative-hero-z {
          position: relative;
          z-index: 10;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Nav Bar */
        .desh-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 10px;
        }

        .nav-icon-btn {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(180, 83, 9, 0.2);
          color: #2d2319;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-icon-btn:hover {
          background: #ffffff;
          transform: scale(1.05);
        }

        .lotus-emblem-center {
          width: 44px;
          height: 36px;
        }

        .lotus-svg {
          width: 100%;
          height: 100%;
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
          color: #2d2319;
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
          color: #b45309;
          font-size: 11px;
        }

        .sub-caption-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #8c7355;
          text-transform: uppercase;
        }

        .hero-sub-paragraph {
          font-size: 15px;
          font-weight: 500;
          color: #6b5c4d;
          max-width: 520px;
          margin: 14px auto 0;
          line-height: 1.6;
        }

        /* CARDS SECTION */
        .desh-cards-section {
          position: relative;
          z-index: 10;
          margin-top: -50px;
        }

        .max-w-cards {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
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

        /* Destination Card */
        .mental-dest-card {
          position: relative;
          height: 250px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(0,0,0,0.07);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .mental-dest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(45, 35, 25, 0.2);
        }

        .dest-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .mental-dest-card:hover .dest-photo {
          transform: scale(1.06);
        }

        .dest-gradient-mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%);
        }

        .dest-serif-title {
          position: absolute;
          bottom: 18px;
          left: 20px;
          color: #ffffff;
          font-family: var(--font-serif-italic);
          font-size: 26px;
          font-weight: 500;
          z-index: 10;
          text-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        /* Drawer Modal */
        .dest-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
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
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #eae5db;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s;
        }

        .drawer-item-card:hover {
          transform: translateY(-3px);
          border-color: #b45309;
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
          color: #b45309;
        }

        .drawer-item-name {
          font-size: 14px;
          font-weight: 800;
          color: #2d2319;
          margin-top: 2px;
        }

        .drawer-item-desc {
          font-size: 12px;
          color: #786958;
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
          color: #b45309;
        }

        .btn-view-link {
          font-size: 11px;
          font-weight: 700;
          color: #2d2319;
        }

        @media (max-width: 768px) {
          .desh-hero-banner {
            min-height: 400px;
            padding-bottom: 40px;
          }
          .hero-main-title {
            font-size: clamp(54px, 13vw, 84px);
            margin-bottom: 8px;
          }
          .hero-sub-paragraph {
            font-size: 13.5px;
            padding: 0 14px;
          }
          .desh-cards-section {
            margin-top: 10px;
          }
          .row-3, .row-2 { grid-template-columns: 1fr; gap: 16px; }
          .mental-dest-card { height: 260px; }
          .card-wide-center { width: 100%; }
          .drawer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
