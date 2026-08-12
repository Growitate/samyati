import React, { useState } from 'react';
import { X, Send, CheckCircle2, PhoneCall, Calendar, Users, MapPin, Sparkles } from 'lucide-react';
import { DESTINATIONS, BRAND_INFO } from '../data/travelData';

export default function OfferModal({ isOpen, onClose, initialDestination = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Domestic',
    destination: initialDestination || 'Kashmir',
    travellers: '2 Travellers',
    budget: 'Standard (Flexible)',
    travelMonth: 'Next Month'
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Samyati The World!\nI would like to get an offer for my trip:\n- Name: ${formData.name}\n- Phone: ${formData.phone}\n- Destination: ${formData.destination} (${formData.category})\n- Travellers: ${formData.travellers}\n- Budget: ${formData.budget}\n- Month: ${formData.travelMonth}`
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="modal-header">
              <div className="eyebrow-pill mb-2">
                <Sparkles size={12} />
                <span>Samyati The World — Custom Offer</span>
              </div>
              <h2 className="modal-title">Get Your Personalized <span className="accent-serif">Offer</span></h2>
              <p className="modal-sub">Tell us your travel dreams and budget. We will curate a 100% custom itinerary with dedicated human support.</p>
            </div>

            <form onSubmit={handleSubmit} className="offer-form">
              <div className="form-grid">
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aniket Shrivastava"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9589110765"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Category Choice */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Domestic">🇮🇳 Domestic Holidays (7 Destinations)</option>
                    <option value="International">✈️ International Holidays (7 Destinations)</option>
                  </select>
                </div>

                {/* Destination Choice */}
                <div className="form-group">
                  <label className="form-label">Preferred Destination</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="form-select"
                  >
                    {DESTINATIONS.filter(d => d.category === formData.category).map(d => (
                      <option key={d.id} value={d.name}>{d.flag} {d.name} — {d.tagline}</option>
                    ))}
                    <option value="Other / Customized">🌍 Other Custom Destination</option>
                  </select>
                </div>

                {/* Travellers */}
                <div className="form-group">
                  <label className="form-label">Number of Travellers</label>
                  <select
                    value={formData.travellers}
                    onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                    className="form-select"
                  >
                    <option value="Solo Traveller">Solo Traveller</option>
                    <option value="Couple (Honeymoon)">Couple / Honeymoon</option>
                    <option value="Family (3-5 People)">Family (3–5 People)</option>
                    <option value="Group (6+ People)">Group Departure (6+ People)</option>
                  </select>
                </div>

                {/* Travel Month */}
                <div className="form-group">
                  <label className="form-label">Travel Timeframe</label>
                  <select
                    value={formData.travelMonth}
                    onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                    className="form-select"
                  >
                    <option value="Within 2 Weeks">Within 2 Weeks</option>
                    <option value="Next Month">Next Month</option>
                    <option value="In 2-3 Months">In 2–3 Months</option>
                    <option value="Flexible / Exploring">Flexible Dates</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-pill btn-pill-dark w-full-submit">
                <span>Submit & Get Your Offer</span>
                <span className="btn-badge-icon">
                  <Send size={16} />
                </span>
              </button>
            </form>
          </div>
        ) : (
          <div className="submitted-view">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>

            <h3 className="success-title">Offer Request Received!</h3>
            <p className="success-sub">
              Thank you, <strong>{formData.name}</strong>! Our travel specialists at <strong>Samyati The World</strong> are curating a custom offer for <strong>{formData.destination}</strong>.
            </p>

            <div className="whatsapp-quick-connect">
              <p className="wa-title">Want instant confirmation on WhatsApp?</p>
              <a
                href={`https://wa.me/91${BRAND_INFO.phone}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-pill-emerald"
              >
                <PhoneCall size={16} />
                <span>Chat Instantly on WhatsApp (+91 {BRAND_INFO.phone})</span>
              </a>
            </div>

            <button onClick={onClose} className="btn-pill btn-pill-dark mt-4">
              <span>Back to Explorer</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-container {
          position: relative;
          background: #ffffff;
          border-radius: 28px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--bg-card);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-dark);
          transition: var(--transition-smooth);
        }

        .modal-close-btn:hover {
          background: var(--text-dark);
          color: #ffffff;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.2;
          margin-top: 8px;
        }

        .modal-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .form-input, .form-select {
          padding: 10px 14px;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          font-size: 14px;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--text-dark);
        }

        .w-full-submit {
          width: 100%;
          justify-content: center;
          padding: 14px;
        }

        /* Submitted View */
        .submitted-view {
          text-align: center;
          padding: 20px 0;
        }

        .success-icon-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .success-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .success-sub {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .whatsapp-quick-connect {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .wa-title {
          font-size: 13px;
          font-weight: 700;
          color: #166534;
          margin-bottom: 10px;
        }

        .btn-pill-emerald {
          background: #10b981;
          color: #ffffff;
          text-decoration: none;
          padding: 10px 20px;
          font-weight: 700;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 9999px;
        }

        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .modal-container { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
