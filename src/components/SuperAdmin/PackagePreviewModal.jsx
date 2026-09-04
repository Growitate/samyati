import React from 'react';
import { X, Clock, Star, MapPin, Check, Sparkles, Shield, DollarSign } from 'lucide-react';

export default function PackagePreviewModal({ isOpen, packageData, onClose }) {
  if (!isOpen || !packageData) return null;

  return (
    <div className="preview-modal-backdrop" onClick={onClose}>
      <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Sandbox Notice */}
        <div className="sandbox-top-bar">
          <div className="sandbox-badge">
            <Sparkles size={14} className="text-amber-400" />
            <span>LIVE CUSTOMER VIEW PREVIEW (SANDBOX)</span>
          </div>
          <button className="preview-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="preview-body">
          {/* Hero Banner */}
          <div className="preview-hero">
            <img
              src={packageData.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
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
                  <Clock size={14} />
                  <span>{packageData.duration}</span>
                </div>
                <div className="preview-badge">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span>{packageData.rating} ({packageData.reviewsCount || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Summary Card */}
          <div className="preview-card-grid">
            <div className="preview-left-column">
              <div className="preview-section">
                <h3 className="preview-section-title">Tour Overview</h3>
                <p className="preview-description">
                  {packageData.description || 'No description provided.'}
                </p>
              </div>

              {/* Itinerary */}
              {Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 && (
                <div className="preview-section">
                  <h3 className="preview-section-title">Day-by-Day Itinerary ({packageData.itinerary.length} Days)</h3>
                  <div className="preview-itinerary-list">
                    {packageData.itinerary.map((day, idx) => (
                      <div key={idx} className="preview-itinerary-item">
                        <div className="preview-day-num">Day {day.day || idx + 1}</div>
                        <div className="preview-day-content">
                          <h4 className="preview-day-title">{day.title}</h4>
                          <p className="preview-day-text">{day.details}</p>
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
                        <Check size={14} className="text-emerald-500" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Booking Sidebar Preview */}
            <div className="preview-right-sidebar">
              <div className="pricing-box">
                <span className="price-label">All-Inclusive Starting Price</span>
                <div className="price-flex">
                  <span className="main-price">{packageData.price}</span>
                  {packageData.originalPrice && packageData.originalPrice !== packageData.price && (
                    <span className="strike-price">{packageData.originalPrice}</span>
                  )}
                </div>
                <span className="price-per-person">Per person on twin sharing basis</span>

                <button className="preview-book-btn" disabled>
                  <span>Request Custom Offer</span>
                </button>

                <div className="preview-trust-features">
                  <div className="trust-item">
                    <Shield size={14} className="text-amber-500" />
                    <span>100% Curated & Guaranteed Stays</span>
                  </div>
                  <div className="trust-item">
                    <Sparkles size={14} className="text-emerald-500" />
                    <span>24/7 Dedicated Human Concierge</span>
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
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          padding: 24px;
        }

        .preview-modal-container {
          background: #0b1120;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          width: 100%;
          max-width: 960px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
          color: #f8fafc;
        }

        .sandbox-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: rgba(245, 158, 11, 0.1);
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
        }

        .sandbox-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f59e0b;
        }

        .preview-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #94a3b8;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .preview-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .preview-body {
          flex: 1;
          overflow-y: auto;
        }

        .preview-hero {
          position: relative;
          height: 280px;
          width: 100%;
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
          background: linear-gradient(to top, #0b1120 0%, rgba(11, 17, 32, 0.5) 60%, transparent 100%);
        }

        .preview-hero-info {
          position: absolute;
          bottom: 20px;
          left: 30px;
          right: 30px;
        }

        .preview-cat-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .cat-dom { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .cat-int { background: rgba(236, 72, 153, 0.2); color: #f472b6; }

        .preview-pkg-title {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 10px;
        }

        .preview-badges-row {
          display: flex;
          gap: 12px;
        }

        .preview-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          color: #e2e8f0;
        }

        .preview-card-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          padding: 30px;
        }

        .preview-section {
          margin-bottom: 24px;
        }

        .preview-section-title {
          font-size: 16px;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .preview-description {
          font-size: 13.5px;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0;
        }

        .preview-itinerary-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .preview-itinerary-item {
          display: flex;
          gap: 14px;
        }

        .preview-day-num {
          background: #f59e0b;
          color: #0f172a;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          height: fit-content;
        }

        .preview-day-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px;
        }

        .preview-day-text {
          font-size: 12.5px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
        }

        .preview-inclusions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .preview-inc-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #cbd5e1;
        }

        .pricing-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .price-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .price-flex {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .main-price {
          font-size: 26px;
          font-weight: 800;
          color: #34d399;
        }

        .strike-price {
          font-size: 14px;
          color: #64748b;
          text-decoration: line-through;
        }

        .price-per-person {
          font-size: 11px;
          color: #94a3b8;
        }

        .preview-book-btn {
          width: 100%;
          background: #f59e0b;
          color: #0f172a;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          margin-top: 10px;
          opacity: 0.9;
        }

        .preview-trust-features {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #cbd5e1;
        }

        @media (max-width: 768px) {
          .preview-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
