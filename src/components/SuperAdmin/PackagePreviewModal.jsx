import React from 'react';
import { X, Clock, Star, MapPin, Check, Sparkles, Shield, DollarSign, Image as ImageIcon, Building2 } from 'lucide-react';

export default function PackagePreviewModal({ isOpen, packageData, onClose }) {
  if (!isOpen || !packageData) return null;

  return (
    <div className="preview-modal-backdrop" onClick={onClose}>
      <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Sandbox Notice */}
        <div className="sandbox-top-bar">
          <div className="sandbox-badge">
            <Sparkles size={14} className="text-gold" />
            <span>LIVE CUSTOMER VIEW PREVIEW (SANDBOX)</span>
          </div>
          <button className="preview-close-btn" onClick={onClose} title="Close Preview">
            <X size={18} />
          </button>
        </div>

        {/* Preview Content Body */}
        <div className="preview-body">
          {/* Hero Banner */}
          <div className="preview-hero">
            <img
              src={packageData.image || 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85'}
              alt={packageData.title}
              className="preview-hero-img"
            />
            <div className="preview-hero-overlay"></div>
            <div className="preview-hero-info">
              <span className={`preview-cat-badge ${packageData.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                {packageData.category} Tour • {packageData.destinationName}
              </span>
              <h1 className="preview-pkg-title">{packageData.title}</h1>
              <div className="preview-badges-row">
                <div className="preview-badge">
                  <Clock size={13} />
                  <span>{packageData.duration}</span>
                </div>
                <div className="preview-badge">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span>{packageData.rating || '4.9'} ({packageData.reviewsCount || 120} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Strip */}
          {Array.isArray(packageData.gallery) && packageData.gallery.length > 0 && (
            <div className="preview-gallery-strip">
              <div className="gallery-strip-header">
                <ImageIcon size={15} className="text-gold" />
                <span>Tour Photo Showcase ({packageData.gallery.length} Photos)</span>
              </div>
              <div className="gallery-strip-row">
                {packageData.gallery.map((imgUrl, i) => (
                  <div key={i} className="gallery-strip-thumb">
                    <img src={imgUrl} alt={`Tour Photo ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content & Pricing Grid */}
          <div className="preview-card-grid">
            <div className="preview-left-column">
              {/* Tour Overview */}
              <div className="preview-section">
                <h3 className="preview-section-title">Tour Overview</h3>
                <p className="preview-description">
                  {packageData.description || 'Curated luxury travel itinerary.'}
                </p>
              </div>

              {/* Hotel Tier Pricing Preview */}
              {Array.isArray(packageData.hotelPricingOptions) && packageData.hotelPricingOptions.length > 0 && (
                <div className="preview-section">
                  <h3 className="preview-section-title">Hotel & Room Category Pricing Options</h3>
                  <div className="hotel-tier-table-preview">
                    {packageData.hotelPricingOptions.map((h, idx) => (
                      <div key={idx} className="tier-preview-row">
                        <div className="tier-name-badge">
                          <Building2 size={14} className="text-gold" />
                          <span>{h.hotelName}</span>
                        </div>
                        <div className="tier-prices-badge">
                          <span>2 Pax: <strong>{h.price2Pax}</strong></span>
                          <span>4 Pax: <strong>{h.price4Pax}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Itinerary */}
              {Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 && (
                <div className="preview-section">
                  <h3 className="preview-section-title">Day-by-Day Itinerary ({packageData.itinerary.length} Days)</h3>
                  <div className="preview-itinerary-list">
                    {packageData.itinerary.map((day, idx) => (
                      <div key={idx} className="preview-itinerary-item">
                        <div className="preview-day-num">Day {day.day || idx + 1}</div>
                        <div className="preview-day-content">
                          <h4 className="preview-day-title">{day.title}</h4>
                          <p className="preview-day-text">{day.description || day.details}</p>
                          {Array.isArray(day.highlights) && day.highlights.length > 0 && (
                            <div className="preview-highlights-row">
                              {day.highlights.map((tag, tIdx) => (
                                <span key={tIdx} className="preview-highlight-tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions */}
              {Array.isArray(packageData.inclusions) && packageData.inclusions.length > 0 && (
                <div className="preview-section">
                  <h3 className="preview-section-title">What is Included</h3>
                  <div className="preview-inclusions-grid">
                    {packageData.inclusions.map((inc, idx) => (
                      <div key={idx} className="preview-inc-item">
                        <Check size={14} className="text-emerald-600" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Booking Sidebar Preview */}
            <div className="preview-right-sidebar">
              <div className="pricing-card-box">
                <span className="price-label">All-Inclusive Starting Price</span>
                <div className="price-flex">
                  <span className="main-price">{packageData.price}</span>
                  {packageData.originalPrice && packageData.originalPrice !== packageData.price && (
                    <span className="strike-price">{packageData.originalPrice}</span>
                  )}
                </div>
                <span className="price-sub">Per person on twin sharing basis</span>

                <button className="preview-book-btn" disabled>
                  <span>Request Custom Price Quote</span>
                </button>

                <div className="trust-pills-list">
                  <div className="trust-pill">
                    <Shield size={14} className="text-gold" />
                    <span>100% Curated & Handpicked Stays</span>
                  </div>
                  <div className="trust-pill">
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>24x7 Dedicated Human Concierge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .preview-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10003;
          padding: 24px;
        }

        .preview-modal-container {
          background: #ffffff;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 24px;
          max-width: 960px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.22);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #141613;
        }

        .sandbox-top-bar {
          background: #fefce8;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sandbox-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #92400e;
        }

        .text-gold { color: #d97706; }

        .preview-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-close-btn:hover {
          background: #0f172a;
          color: #ffffff;
        }

        .preview-body {
          overflow-y: auto;
          flex-grow: 1;
        }

        /* Hero */
        .preview-hero {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
        }

        .preview-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%);
        }

        .preview-hero-info {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          color: #ffffff;
        }

        .preview-cat-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        .cat-dom { background: #0f172a; color: #ffffff; }
        .cat-int { background: #d97706; color: #ffffff; }

        .preview-pkg-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px;
          line-height: 1.15;
        }

        .preview-badges-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preview-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        /* Gallery Strip */
        .preview-gallery-strip {
          padding: 16px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .gallery-strip-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 10px;
        }

        .gallery-strip-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .gallery-strip-thumb {
          width: 120px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: #cbd5e1;
        }

        .gallery-strip-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Grid */
        .preview-card-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          padding: 24px;
        }

        .preview-left-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .preview-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
        }

        .preview-section-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
        }

        .preview-description {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }

        /* Hotel Tier Preview */
        .hotel-tier-table-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tier-preview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 10px 14px;
          border-radius: 10px;
        }

        .tier-name-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #92400e;
          font-size: 13px;
        }

        .tier-prices-badge {
          display: flex;
          gap: 14px;
          font-size: 12.5px;
          color: #475569;
        }

        .tier-prices-badge strong {
          color: #0f172a;
        }

        /* Itinerary */
        .preview-itinerary-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .preview-itinerary-item {
          display: flex;
          gap: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .preview-day-num {
          background: #0f172a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          height: fit-content;
        }

        .preview-day-content {
          flex: 1;
        }

        .preview-day-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .preview-day-text {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 8px;
        }

        .preview-highlights-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .preview-highlight-tag {
          font-size: 11px;
          color: #92400e;
          background: #fefce8;
          border: 1px solid #fde68a;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        /* Inclusions */
        .preview-inclusions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .preview-inc-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
        }

        /* Pricing Card */
        .pricing-card-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 20px;
        }

        .price-label {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
          display: block;
          margin-bottom: 4px;
        }

        .price-flex {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }

        .main-price {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
        }

        .strike-price {
          font-size: 15px;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .price-sub {
          font-size: 12px;
          color: #64748b;
          display: block;
          margin-bottom: 18px;
        }

        .preview-book-btn {
          width: 100%;
          padding: 12px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: not-allowed;
          opacity: 0.85;
          margin-bottom: 18px;
        }

        .trust-pills-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .trust-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }
      `}</style>
    </div>
  );
}
