import React, { useState } from 'react';
import { X, Send, CheckCircle2, PhoneCall, Calendar, Users, MapPin, Sparkles, User, Phone, Globe, ShieldCheck, Clock, Award, ChevronDown } from 'lucide-react';
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
  const [selectedWaIndex, setSelectedWaIndex] = useState(2);

  if (!isOpen) return null;

  const currentWaRaw = BRAND_INFO.phones?.[selectedWaIndex]?.raw || '9589110765';
  const currentWaFormatted = BRAND_INFO.phones?.[selectedWaIndex]?.number || '+91-9589110765';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Samyati The World!\nI would like to get a personalized offer for my upcoming trip:\n\n• Traveler Name: ${formData.name}\n• Contact / WhatsApp: ${formData.phone}\n• Category: ${formData.category} Holidays\n• Destination: ${formData.destination}\n• Group Size: ${formData.travellers}\n• Travel Timeframe: ${formData.travelMonth}\n\nPlease share the best available package and itinerary options!`
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container luxury-offer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Decorative Gold Accent Line */}
        <div className="modal-accent-bar" />

        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!submitted ? (
          <div className="modal-inner-padding">
            {/* Header */}
            <div className="modal-header-pro">
              <div className="concierge-badge">
                <Sparkles size={13} className="sparkle-icon" />
                <span>SAMYATI CONCIERGE · CUSTOM TRIP</span>
              </div>
              
              <h2 className="modal-title-pro">
                Get Your Personalized <span className="serif-highlight">Offer</span>
              </h2>
              
              <p className="modal-subtitle-pro">
                Share your travel vision and group size. Our bespoke travel designers will craft a tailored day-by-day plan with transparent, best-available pricing.
              </p>

              {/* Trust Value Badges */}
              <div className="trust-pills-row">
                <div className="trust-pill-item">
                  <Clock size={12} className="pill-icon" />
                  <span>30-Minute Fast Response</span>
                </div>
                <div className="trust-pill-item">
                  <Award size={12} className="pill-icon" />
                  <span>100% Bespoke Plan</span>
                </div>
                <div className="trust-pill-item">
                  <ShieldCheck size={12} className="pill-icon" />
                  <span>Best Price Guarantee</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="pro-offer-form">
              <div className="pro-form-grid">
                {/* Full Name */}
                <div className="pro-input-group">
                  <label className="pro-label">
                    <span>Full Name</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="input-field-wrapper">
                    <User size={16} className="field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pro-input"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className="pro-input-group">
                  <label className="pro-label">
                    <span>Phone / WhatsApp Number</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="input-field-wrapper">
                    <Phone size={16} className="field-icon" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pro-input"
                    />
                  </div>
                </div>

                {/* Category Choice */}
                <div className="pro-input-group">
                  <label className="pro-label">Holiday Type</label>
                  <div className="input-field-wrapper select-field-wrapper">
                    <Globe size={16} className="field-icon" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="pro-select"
                    >
                      <option value="Domestic">Desh — Domestic Indian Escapes</option>
                      <option value="International">Videsh — International World Holidays</option>
                    </select>
                    <ChevronDown size={15} className="select-arrow-icon" />
                  </div>
                </div>

                {/* Destination Choice */}
                <div className="pro-input-group">
                  <label className="pro-label">Preferred Destination</label>
                  <div className="input-field-wrapper select-field-wrapper">
                    <MapPin size={16} className="field-icon" />
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="pro-select"
                    >
                      {DESTINATIONS.filter(d => d.category === formData.category).map(d => (
                        <option key={d.id} value={d.name}>{d.flag} {d.name} ({d.tagline})</option>
                      ))}
                      <option value="Other / Customized">🌍 Other Custom Destination</option>
                    </select>
                    <ChevronDown size={15} className="select-arrow-icon" />
                  </div>
                </div>

                {/* Travellers */}
                <div className="pro-input-group">
                  <label className="pro-label">Group / Travellers</label>
                  <div className="input-field-wrapper select-field-wrapper">
                    <Users size={16} className="field-icon" />
                    <select
                      value={formData.travellers}
                      onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                      className="pro-select"
                    >
                      <option value="Solo Traveller">Solo Adventurer (1 Person)</option>
                      <option value="Couple (Honeymoon)">Couple / Honeymoon (2 Persons)</option>
                      <option value="Family (3-5 People)">Family Holiday (3–5 Persons)</option>
                      <option value="Group (6+ People)">Group / Friends Tour (6+ Persons)</option>
                    </select>
                    <ChevronDown size={15} className="select-arrow-icon" />
                  </div>
                </div>

                {/* Travel Month */}
                <div className="pro-input-group">
                  <label className="pro-label">Estimated Travel Time</label>
                  <div className="input-field-wrapper select-field-wrapper">
                    <Calendar size={16} className="field-icon" />
                    <select
                      value={formData.travelMonth}
                      onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                      className="pro-select"
                    >
                      <option value="Within 2 Weeks">Immediate (Within 2 Weeks)</option>
                      <option value="Next Month">Next Month</option>
                      <option value="In 2-3 Months">In 2–3 Months</option>
                      <option value="Flexible / Exploring">Flexible Dates / Still Exploring</option>
                    </select>
                    <ChevronDown size={15} className="select-arrow-icon" />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button type="submit" className="pro-submit-btn">
                <span>Request Custom Itinerary & Offer</span>
              </button>

              <p className="privacy-micro-note">
                <ShieldCheck size={13} className="inline-shield" />
                <span>Your information is strictly protected. Zero spam or shared data.</span>
              </p>
            </form>
          </div>
        ) : (
          <div className="modal-inner-padding submitted-pro-view">
            <div className="success-icon-badge-pro">
              <CheckCircle2 size={40} className="check-success-svg" />
            </div>

            <span className="concierge-badge mb-2">
              <Sparkles size={12} />
              <span>REQUEST CONFIRMED</span>
            </span>

            <h3 className="success-title-pro">Offer Request Received!</h3>
            <p className="success-sub-pro">
              Thank you, <strong>{formData.name}</strong>. Our dedicated travel planners are preparing your custom vacation proposal for <strong>{formData.destination}</strong>.
            </p>

            <div className="summary-ticket-box">
              <div className="ticket-row">
                <span className="ticket-lbl">Destination</span>
                <span className="ticket-val">{formData.destination}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-lbl">Travel Group</span>
                <span className="ticket-val">{formData.travellers}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-lbl">Timeframe</span>
                <span className="ticket-val">{formData.travelMonth}</span>
              </div>
            </div>

            <div className="whatsapp-quick-connect-pro">
              <div className="wa-prompt-text">
                <p className="wa-title-pro">Need an instant itinerary quote?</p>
                <p className="wa-sub-pro">Select a travel specialist line to connect on WhatsApp:</p>
              </div>

              <div className="wa-number-selector-pills">
                {BRAND_INFO.phones?.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedWaIndex(idx)}
                    className={`wa-number-pill ${selectedWaIndex === idx ? 'active' : ''}`}
                  >
                    <span className="wa-pill-dot" />
                    <span className="wa-pill-num">{item.number}</span>
                    <span className="wa-pill-tag">{item.label}</span>
                  </button>
                ))}
              </div>

              <a
                href={`https://wa.me/91${currentWaRaw}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-action"
              >
                <PhoneCall size={17} />
                <span>Chat Instantly on WhatsApp ({currentWaFormatted})</span>
              </a>
            </div>

            <button onClick={onClose} className="btn-return-pro">
              <span>Return to Samyati Holidays</span>
            </button>
          </div>
        )}

        <style>{`
          .luxury-offer-modal {
            max-width: 640px;
            padding: 0;
            overflow: hidden;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 28px;
            box-shadow: 0 30px 70px -15px rgba(15, 23, 42, 0.35);
          }

          .modal-accent-bar {
            height: 4px;
            width: 100%;
            background: linear-gradient(90deg, #d97706 0%, #f59e0b 35%, #ec4899 70%, #6366f1 100%);
          }

          .modal-inner-padding {
            padding: 36px 36px 32px;
          }

          .modal-header-pro {
            text-align: center;
            margin-bottom: 24px;
          }

          .concierge-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fffbeb;
            border: 1px solid #fef3c7;
            color: #b45309;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 5px 14px;
            border-radius: 9999px;
            margin-bottom: 12px;
          }

          .sparkle-icon {
            color: #d97706;
          }

          .modal-title-pro {
            font-family: var(--font-sans);
            font-size: clamp(24px, 3.8vw, 30px);
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
            line-height: 1.2;
            margin-bottom: 10px;
          }

          .serif-highlight {
            font-family: var(--font-serif-italic);
            font-style: italic;
            font-weight: 600;
            color: #b45309;
          }

          .modal-subtitle-pro {
            font-size: 13.5px;
            color: #64748b;
            line-height: 1.55;
            max-width: 520px;
            margin: 0 auto 16px;
          }

          .trust-pills-row {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .trust-pill-item {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            background: #f1f5f9;
            padding: 4px 10px;
            border-radius: 9999px;
          }

          .pill-icon {
            color: #0284c7;
          }

          /* Form Styles */
          .pro-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 22px;
          }

          .pro-input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            text-align: left;
          }

          .pro-label {
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 3px;
          }

          .req-star {
            color: #e11d48;
          }

          .input-field-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            background: #fefce8;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            transition: all 0.2s ease;
          }

          .input-field-wrapper:focus-within {
            background: #ffffff;
            border-color: #0f172a;
            box-shadow: 0 0 0 3.5px rgba(15, 23, 42, 0.08);
          }

          .field-icon {
            position: absolute;
            left: 12px;
            color: #94a3b8;
            pointer-events: none;
            transition: color 0.2s ease;
          }

          .input-field-wrapper:focus-within .field-icon {
            color: #0f172a;
          }

          .pro-input, .pro-select {
            width: 100%;
            height: 44px;
            padding: 0 14px 0 38px;
            border: none;
            outline: none;
            background: transparent;
            font-size: 13.5px;
            font-family: var(--font-sans);
            color: #0f172a;
            font-weight: 500;
          }

          .pro-select {
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
            padding-right: 34px;
          }

          .select-arrow-icon {
            position: absolute;
            right: 12px;
            color: #64748b;
            pointer-events: none;
          }

          /* Submit Button */
          .pro-submit-btn {
            width: 100%;
            height: 50px;
            background: #0f172a;
            color: #ffffff;
            border: none;
            border-radius: 9999px;
            font-size: 14.5px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 0 10px 24px -6px rgba(15, 23, 42, 0.35);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .pro-submit-btn:hover {
            background: #1e293b;
            transform: translateY(-2px);
            box-shadow: 0 14px 30px -6px rgba(15, 23, 42, 0.45);
          }

          .submit-arrow-ring {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.25s ease;
          }

          .pro-submit-btn:hover .submit-arrow-ring {
            transform: translateX(3px) rotate(15deg);
          }

          .privacy-micro-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 11.5px;
            color: #94a3b8;
            margin-top: 14px;
          }

          .inline-shield {
            color: #10b981;
          }

          /* Success View */
          .submitted-pro-view {
            text-align: center;
            padding: 40px 32px;
          }

          .success-icon-badge-pro {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background: #ecfdf5;
            border: 2px solid #a7f3d0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
          }

          .check-success-svg {
            color: #10b981;
          }

          .success-title-pro {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
          }

          .success-sub-pro {
            font-size: 13.5px;
            color: #64748b;
            line-height: 1.6;
            max-width: 480px;
            margin: 0 auto 20px;
          }

          .summary-ticket-box {
            background: #fefce8;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px 20px;
            max-width: 460px;
            margin: 0 auto 24px;
            display: flex;
            justify-content: space-around;
            text-align: center;
          }

          .ticket-row {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .ticket-lbl {
            font-size: 10.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #94a3b8;
          }

          .ticket-val {
            font-size: 13.5px;
            font-weight: 800;
            color: #0f172a;
          }

          .whatsapp-quick-connect-pro {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 1px solid #bbf7d0;
            padding: 20px 22px;
            border-radius: 20px;
            margin-bottom: 20px;
            text-align: center;
          }

          .wa-title-pro {
            font-size: 14px;
            font-weight: 800;
            color: #166534;
            margin-bottom: 2px;
          }

          .wa-sub-pro {
            font-size: 12px;
            color: #15803d;
            margin-bottom: 12px;
          }

          .wa-number-selector-pills {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 14px;
            flex-wrap: wrap;
          }

          .wa-number-pill {
            background: #ffffff;
            border: 1px solid #86efac;
            padding: 6px 12px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .wa-number-pill:hover {
            border-color: #16a34a;
            transform: translateY(-1px);
          }

          .wa-number-pill.active {
            background: #15803d;
            border-color: #15803d;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25);
          }

          .wa-pill-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
          }

          .wa-number-pill.active .wa-pill-dot {
            background: #fef08a;
          }

          .wa-pill-num {
            font-size: 12px;
            font-weight: 700;
          }

          .wa-pill-tag {
            font-size: 10px;
            opacity: 0.8;
          }

          .btn-whatsapp-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #16a34a;
            color: #ffffff;
            text-decoration: none;
            padding: 11px 24px;
            border-radius: 9999px;
            font-size: 13.5px;
            font-weight: 700;
            box-shadow: 0 6px 18px rgba(22, 163, 74, 0.3);
            transition: all 0.2s ease;
          }

          .btn-whatsapp-action:hover {
            background: #15803d;
            transform: translateY(-2px);
          }

          .btn-return-pro {
            background: #ffffff;
            color: #0f172a;
            border: 1px solid #e2e8f0;
            padding: 10px 24px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-return-pro:hover {
            background: #fefce8;
            border-color: #cbd5e1;
          }

          @media (max-width: 600px) {
            .modal-inner-padding { padding: 26px 20px 24px; }
            .pro-form-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 18px; }
            .modal-title-pro { font-size: 22px; }
            .trust-pills-row { gap: 6px; }
            .trust-pill-item { font-size: 10px; padding: 3px 8px; }
            .pro-submit-btn { height: 46px; font-size: 13.5px; }
            .summary-ticket-box { flex-direction: column; gap: 10px; padding: 14px; }
            .btn-whatsapp-action { width: 100%; font-size: 12.5px; padding: 10px 14px; }
          }
        `}</style>
      </div>
    </div>
  );
}
