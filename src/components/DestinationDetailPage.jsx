import React, { useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Sparkles, Heart, Sun, ArrowRight, ShieldCheck, Crown } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { scrollTo } from '../smoothScroll';

export default function DestinationDetailPage({ destination, onBack, onSelectPackage, onOpenOfferModal }) {
  const { packages: PACKAGES } = usePackages();
  useEffect(() => {
    scrollTo(0, { immediate: true });
  }, [destination]);

  if (!destination) return null;

  // Filter packages for this destination
  const destinationPackages = PACKAGES.filter(p => {
    const destName = (destination.name || '').toLowerCase();
    const destId = (destination.id || '').toLowerCase();
    const pkgDest = (p.destinationName || '').toLowerCase();
    const pkgDestId = (p.destinationId || '').toLowerCase();
    const pkgTitle = (p.title || '').toLowerCase();
    return (
      (destId && pkgDestId && destId === pkgDestId) ||
      pkgDest.includes(destName) ||
      pkgTitle.includes(destName) ||
      destName.includes(pkgDest) ||
      (destName.includes('uttar pradesh') && (pkgDest.includes('varanasi') || pkgTitle.includes('varanasi') || pkgTitle.includes('ayodhya') || pkgTitle.includes('prayagraj')))
    );
  });

  // Fallback packages if no exact match found
  const displayPackages = destinationPackages.length > 0
    ? destinationPackages
    : PACKAGES.filter(p => p.category === (destination.category || 'Domestic')).slice(0, 4);

  return (
    <div className="destination-detail-page">
      {/* HERO BANNER WITH VIBRANT DESTINATION SCENIC BACKGROUND */}
      <div className="dest-hero-banner">
        <img
          src={destination.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90'}
          alt={destination.name}
          className="dest-hero-bg-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90';
          }}
        />
        <div className="dest-hero-overlay" />

        <div className="container relative-hero-content">
          {/* Breadcrumb Navigation */}
          <button onClick={onBack} className="btn-back-breadcrumb">
            <ArrowLeft size={16} />
            <span>Back to {destination.category === 'International' ? 'Videsh' : 'Desh'}</span>
          </button>

          {/* Hero Content */}
          <div className="dest-hero-text-block">
            <span className="dest-hero-badge">
              {destination.category || 'Curated Destination'}
            </span>
            <h1 className="dest-hero-title">{destination.name}</h1>
            <p className="dest-hero-tagline">{destination.tagline || destination.description}</p>
          </div>
        </div>
      </div>

      {/* QUICK STATS BAR */}
      <div className="dest-stats-bar">
        <div className="container stats-flex">
          <div className="stat-box">
            <Clock size={18} className="stat-icon text-amber-500" />
            <div>
              <span className="stat-label">Ideal Duration</span>
              <strong className="stat-value">4 to 7 Days</strong>
            </div>
          </div>
          <div className="stat-box">
            <Sun size={18} className="stat-icon text-amber-500" />
            <div>
              <span className="stat-label">Best Time to Visit</span>
              <strong className="stat-value">October – April</strong>
            </div>
          </div>
          <div className="stat-box">
            <Sparkles size={18} className="stat-icon text-amber-500" />
            <div>
              <span className="stat-label">Available Packages</span>
              <strong className="stat-value">{displayPackages.length} Handcrafted Tours</strong>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL PACKAGE CARDS LIST SECTION MATCHING REFERENCE SCREENSHOT */}
      <section className="dest-packages-section">
        <div className="container max-w-cards-list">
          <div className="packages-section-header">
            <div>
              <span className="section-eyebrow">CURATED ITINERARIES</span>
              <h2 className="section-title">Packages & Expeditions for {destination.name}</h2>
            </div>
            <p className="section-subtitle">
              Select any package below to view complete day-by-day itineraries, stays, and pricing details.
            </p>
          </div>

          <div className="horizontal-packages-list">
            {displayPackages.map((pkg, idx) => {
              const parseNum = (val) => {
                if (typeof val === 'number') return val;
                if (!val) return 0;
                const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
                return isNaN(num) ? 0 : num;
              };

              const numPrice = parseNum(pkg.price) || 24900;
              const numOrigPrice = parseNum(pkg.originalPrice) || Math.round(numPrice * 1.33);
              const savings = Math.max(0, numOrigPrice - numPrice);
              const discountPercent = numOrigPrice > 0 ? Math.round((savings / numOrigPrice) * 100) : 25;

              return (
                <div
                  key={pkg.id}
                  className="horizontal-pkg-card"
                  onClick={() => onSelectPackage(pkg)}
                >
                  {/* Left Photo Thumbnail Container */}
                  <div className="card-photo-col">
                    <img src={pkg.image || destination.image} alt={pkg.title} className="card-photo-img" />

                    {/* Top-Left 25% Off Orange Badge */}
                    <span className="badge-discount">{discountPercent > 0 ? `${discountPercent}% Off` : '25% Off'}</span>

                    {/* Top Ribbon Featured Badge */}
                    <div className="badge-featured-ribbon">
                      <Crown size={11} className="mr-1" />
                      <span>Featured</span>
                    </div>

                    {/* Top-Right Heart Icon */}
                    <button className="icon-btn-topright" onClick={(e) => e.stopPropagation()}>
                      <Heart size={16} />
                    </button>

                    {/* Bottom-Right Pin Icon */}
                    <button className="icon-btn-bottomright" onClick={(e) => e.stopPropagation()}>
                      <MapPin size={16} />
                    </button>

                    {/* Carousel Dots Indicator */}
                    <div className="carousel-dots-indicator">
                      <span className="dot active" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>

                  {/* Right Content Block (Title, Inclusions, Pricing & View Details Button) */}
                  <div className="card-details-col">
                    <div className="card-details-main">
                      <h3 className="pkg-spec-title">
                        {destination.name}: {pkg.title}
                      </h3>

                      <p className="pkg-inclusions-line">
                        Accommodations, Flights, Transfers, Tours And Excursions, Activities
                      </p>

                      <div className="pkg-location-row">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{pkg.destinationName || destination.name}</span>
                      </div>
                    </div>

                    {/* Far-Right Pricing & Action Column */}
                    <div className="card-pricing-col">
                      <div className="duration-block">
                        <span className="duration-label">Duration</span>
                        <strong className="duration-value">{pkg.duration || '5 Days'}</strong>
                      </div>

                      <div className="price-tag-block">
                        <span className="price-orig-strikethrough">
                          Starting From <del>₹{numOrigPrice.toLocaleString('en-IN')}</del>
                        </span>
                        <div className="price-main-highlight">
                          ₹{numPrice.toLocaleString('en-IN')}
                        </div>
                        {savings > 0 && (
                          <span className="price-savings-text">You save ₹{savings.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      <button className="btn-pro-view-details">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .destination-detail-page {
          min-height: 100vh;
          background-color: #f6f7f9;
          padding-bottom: 90px;
        }

        .dest-hero-banner {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: flex-end;
          padding-bottom: 45px;
          padding-top: 120px;
          overflow: hidden;
          background: #0f172a;
        }

        .dest-hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          z-index: 1;
          transition: transform 0.6s ease;
        }

        .dest-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.65) 100%);
          z-index: 2;
        }

        .relative-hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
        }

        .btn-back-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 9999px;
          cursor: pointer;
          margin-bottom: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-back-breadcrumb:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #0f172a;
          transform: translateX(-4px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.25);
        }

        .dest-hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 9999px;
          margin-bottom: 14px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .dest-hero-title {
          color: #ffffff;
          font-size: clamp(34px, 5vw, 54px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 10px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .dest-hero-tagline {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          max-width: 650px;
          line-height: 1.5;
        }

        /* Stats Bar */
        .dest-stats-bar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .stats-flex {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 18px 0;
          flex-wrap: wrap;
          gap: 20px;
        }

        .stat-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          display: block;
          font-size: 14.5px;
          color: #0f172a;
          font-weight: 700;
        }

        /* Packages Section */
        .dest-packages-section {
          padding-top: 45px;
        }

        .max-w-cards-list {
          max-width: 1140px;
          margin: 0 auto;
        }

        .packages-section-header {
          margin-bottom: 32px;
        }

        .section-eyebrow {
          color: #d97706;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .section-title {
          font-size: clamp(20px, 4vw, 24px);
          font-weight: 800;
          color: #0f172a;
          margin-top: 3px;
          margin-bottom: 4px;
          line-height: 1.25;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        /* Horizontal Package Cards List (Matching Reference Screenshot) */
        .horizontal-packages-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .horizontal-pkg-card {
          display: grid;
          grid-template-columns: 310px 1fr;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
          border: 1px solid #eef2f6;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .horizontal-pkg-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);
          border-color: #e2e8f0;
        }

        /* Left Photo Col */
        .card-photo-col {
          position: relative;
          height: 100%;
          min-height: 220px;
          overflow: hidden;
          border-radius: 20px 0 0 20px;
        }

        .card-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .horizontal-pkg-card:hover .card-photo-img {
          transform: scale(1.05);
        }

        .badge-discount {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #ff5722;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
          z-index: 2;
        }

        .badge-featured-ribbon {
          position: absolute;
          top: 0;
          left: 105px;
          background: #f97316;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 0 0 8px 8px;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
          z-index: 2;
        }

        .icon-btn-topright {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .icon-btn-topright:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #ef4444;
        }

        .icon-btn-bottomright {
          position: absolute;
          bottom: 14px;
          right: 14px;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
        }

        .carousel-dots-indicator {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 2;
        }

        .carousel-dots-indicator .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
        }

        .carousel-dots-indicator .dot.active {
          background: #ffffff;
          width: 8px;
          height: 8px;
        }

        /* Right Content Col */
        .card-details-col {
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .card-details-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pkg-spec-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .pkg-inclusions-line {
          font-size: 13.5px;
          color: #475569;
          font-weight: 500;
          line-height: 1.5;
        }

        .pkg-location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        /* Pricing & Button Column */
        .card-pricing-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          min-width: 190px;
          text-align: right;
        }

        .duration-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .duration-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .duration-value {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .price-tag-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .price-orig-strikethrough {
          font-size: 11px;
          color: #94a3b8;
        }

        .price-orig-strikethrough del {
          color: #ef4444;
          font-weight: 600;
        }

        .price-main-highlight {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
        }

        .price-savings-text {
          font-size: 11.5px;
          font-weight: 700;
          color: #10b981;
          margin-top: 2px;
        }

        .btn-pro-view-details {
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          padding: 12px 26px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
          white-space: nowrap;
        }

        .btn-pro-view-details:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3);
        }

        @media (max-width: 900px) {
          .horizontal-pkg-card {
            grid-template-columns: 1fr;
            border-radius: 14px;
          }
          .card-photo-col {
            height: 125px;
            min-height: 125px;
            border-radius: 14px 14px 0 0;
          }
          .card-details-col {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px 14px;
            gap: 10px;
          }
          .pkg-spec-title {
            font-size: 14px;
            line-height: 1.25;
          }
          .pkg-inclusions-line {
            font-size: 11.5px;
            line-height: 1.4;
          }
          .card-pricing-col {
            align-items: flex-start;
            width: 100%;
            text-align: left;
            gap: 8px;
          }
          .duration-label, .price-orig-strikethrough {
            font-size: 10px;
          }
          .duration-value {
            font-size: 13px;
          }
          .price-main-highlight {
            font-size: 19px;
          }
          .duration-block, .price-tag-block {
            align-items: flex-start;
          }
          .btn-pro-view-details {
            width: 100%;
            text-align: center;
            padding: 8px 14px;
            font-size: 12px;
          }
        }

        @media (max-width: 768px) {
          .stats-flex {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            padding: 14px 6px;
          }
          .stat-box {
            flex-direction: column;
            text-align: center;
            align-items: center;
            gap: 4px;
          }
          .stat-label {
            font-size: 10.5px;
            line-height: 1.2;
          }
          .stat-value {
            font-size: 12px;
            line-height: 1.2;
          }
          .stat-icon {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}
