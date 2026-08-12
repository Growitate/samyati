import React, { useState } from 'react';
import { X, Clock, Check, XCircle, Star, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';

export default function PackageDetailsModal({ packageData, onClose, onOpenOfferModal }) {
  if (!packageData) return null;

  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container pkg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          <X size={20} />
        </button>

        {/* Hero Photo Header */}
        <div className="pkg-hero-banner">
          <img src={packageData.image} alt={packageData.title} className="pkg-hero-img" />
          <div className="banner-overlay" />

          <div className="banner-badges">
            <span className="badge-cat">{packageData.destinationName} ({packageData.category})</span>
            <div className="badge-rating">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span>{packageData.rating} ({packageData.reviewsCount} reviews)</span>
            </div>
          </div>

          <h2 className="banner-title">{packageData.title}</h2>
        </div>

        {/* Package Specs Bar */}
        <div className="pkg-specs-bar">
          <div className="spec-item">
            <Clock size={16} />
            <span>Duration: <strong>{packageData.duration}</strong></span>
          </div>

          <div className="spec-item">
            <Sparkles size={16} />
            <span>Starting Price: <strong className="text-price">{packageData.price}</strong> <span className="orig-price">{packageData.originalPrice}</span></span>
          </div>
        </div>

        {/* Overview */}
        <div className="pkg-section">
          <h3 className="section-title">Overview & Experience</h3>
          <p className="overview-text">{packageData.description}</p>
        </div>

        {/* Day-by-Day Itinerary Accordion / Tabs */}
        <div className="pkg-section">
          <h3 className="section-title">Day-by-Day Detailed Itinerary</h3>
          
          <div className="itinerary-list">
            {packageData.itinerary?.map((item, idx) => (
              <div 
                key={idx} 
                className={`itinerary-item ${activeDay === idx ? 'open' : ''}`}
                onClick={() => setActiveDay(idx === activeDay ? -1 : idx)}
              >
                <div className="item-header">
                  <span className="day-chip">Day {item.day}</span>
                  <h4 className="day-title">{item.title}</h4>
                </div>
                <p className="day-details">{item.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions & Exclusions Grid */}
        <div className="inc-exc-grid">
          {/* Inclusions */}
          <div className="inc-box">
            <h4 className="inc-heading text-emerald-600">
              <Check size={16} /> Included in Package
            </h4>
            <ul className="inc-list">
              {packageData.inclusions?.map((inc, i) => (
                <li key={i}><Check size={14} className="text-emerald-500 flex-shrink-0" /> <span>{inc}</span></li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="exc-box">
            <h4 className="inc-heading text-rose-600">
              <XCircle size={16} /> Excluded from Package
            </h4>
            <ul className="exc-list">
              {packageData.exclusions?.map((exc, i) => (
                <li key={i}><XCircle size={14} className="text-rose-400 flex-shrink-0" /> <span>{exc}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div className="pkg-modal-footer">
          <button 
            onClick={() => {
              onClose();
              onOpenOfferModal(packageData.title);
            }} 
            className="btn-pill btn-pill-dark w-full-cta"
          >
            <span>Get Offer For This Package</span>
            <span className="btn-badge-icon">
              <ArrowUpRight size={16} />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .pkg-modal {
          max-width: 720px;
          padding: 0;
          overflow: hidden;
        }

        .pkg-hero-banner {
          position: relative;
          height: 260px;
          width: 100%;
        }

        .pkg-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
        }

        .banner-badges {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .badge-cat {
          background: var(--text-dark);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
        }

        .badge-rating {
          background: rgba(255,255,255,0.9);
          color: var(--text-dark);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .banner-title {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          z-index: 10;
          line-height: 1.25;
        }

        .pkg-specs-bar {
          background: var(--bg-pale-yellow);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-dark);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .text-price {
          font-size: 18px;
          color: #d97706;
          margin-left: 4px;
        }

        .orig-price {
          font-size: 12px;
          color: #9ca3af;
          text-decoration: line-through;
          margin-left: 6px;
        }

        .pkg-section {
          padding: 24px 28px;
          border-bottom: 1px solid var(--border-light);
        }

        .section-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 12px;
        }

        .overview-text {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .itinerary-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .itinerary-item {
          background: var(--bg-card);
          padding: 14px 18px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .itinerary-item:hover {
          background: #eef0f2;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .day-chip {
          background: var(--text-dark);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .day-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .day-details {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 8px;
          line-height: 1.5;
        }

        .inc-exc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 24px 28px;
        }

        .inc-box, .exc-box {
          background: var(--bg-card);
          padding: 18px;
          border-radius: 16px;
        }

        .inc-heading {
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .inc-list, .exc-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          color: var(--text-dark);
        }

        .inc-list li, .exc-list li {
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }

        .pkg-modal-footer {
          padding: 20px 28px;
          background: #ffffff;
          border-top: 1px solid var(--border-light);
        }

        .w-full-cta {
          width: 100%;
          justify-content: center;
          padding: 12px;
        }

        @media (max-width: 600px) {
          .inc-exc-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
