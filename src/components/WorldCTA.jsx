import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Award,
  MessageSquare,
  ChevronDown,
  DollarSign,
  Compass
} from 'lucide-react';
import { BRAND_INFO, DESTINATIONS } from '../data/travelData';

export default function WorldCTA({ onOpenOfferModal }) {
  const [activeCategory, setActiveCategory] = useState('Domestic');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: 'Kashmir',
    travelMonth: 'Next Month',
    travellers: '2 Travellers (Couple)',
    budget: 'Standard (Flexible)'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const firstDest = DESTINATIONS.find(d => d.category === cat);
    if (firstDest) {
      setFormData(prev => ({ ...prev, destination: firstDest.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Samyati The World!\nI would like to get a personalized trip itinerary:\n\n• Traveler Name: ${formData.name}\n• Contact / WhatsApp: ${formData.phone}\n• Trip Type: ${activeCategory} Holidays\n• Preferred Destination: ${formData.destination}\n• Group Size: ${formData.travellers}\n• Travel Timeframe: ${formData.travelMonth}\n• Budget Range: ${formData.budget}\n\nPlease share the best custom plan and pricing!`
  );

  const whatsappUrl = `https://wa.me/91${BRAND_INFO.phone}?text=${whatsappMessage}`;

  return (
    <section className="world-cta-section" id="plan">
      <div className="container">
        <div className="world-cta-content">
          
          {/* Section Header */}
          <div className="cta-header">
            <div className="concierge-pill">
              <Sparkles size={14} className="sparkle-icon" />
              <span>SAMYATI TRAVEL CONCIERGE</span>
            </div>

            <h2 className="world-cta-heading">
              The Whole<br />
              W<span className="earth-o-symbol">🌍</span>rld is<br />
              <span className="accent-serif">Waiting</span> For You
            </h2>

            <p className="world-cta-subheading">
              Curate your dream escape with our luxury trip designers. Receive a bespoke day-by-day itinerary & transparent pricing in under 2 hours.
            </p>
          </div>

          {/* Luxury Inline Form Card */}
          <div className="world-form-card">
            
            {/* Top Accent Line */}
            <div className="card-top-accent" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="pro-trip-form">
                
                {/* Category Switcher Tabs */}
                <div className="category-tabs-wrapper">
                  <span className="tabs-label">Trip Type:</span>
                  <div className="category-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${activeCategory === 'Domestic' ? 'active' : ''}`}
                      onClick={() => handleCategoryChange('Domestic')}
                    >
                      <span>🇮🇳 Domestic Holidays</span>
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${activeCategory === 'International' ? 'active' : ''}`}
                      onClick={() => handleCategoryChange('International')}
                    >
                      <span>✈️ International Escapes</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="form-grid">
                  
                  {/* Full Name */}
                  <div className="form-field-group">
                    <label className="field-label">
                      <span>Full Name</span>
                      <span className="req">*</span>
                    </label>
                    <div className="input-field-box">
                      <User size={16} className="field-icon" />
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pro-input"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="form-field-group">
                    <label className="field-label">
                      <span>Phone / WhatsApp</span>
                      <span className="req">*</span>
                    </label>
                    <div className="input-field-box">
                      <Phone size={16} className="field-icon" />
                      <input 
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pro-input"
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="form-field-group">
                    <label className="field-label">
                      <span>Preferred Destination</span>
                    </label>
                    <div className="input-field-box">
                      <MapPin size={16} className="field-icon" />
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="pro-select"
                      >
                        {DESTINATIONS.filter(d => d.category === activeCategory).map(d => (
                          <option key={d.id} value={d.name}>{d.name} {d.flag}</option>
                        ))}
                        <option value="Other Destination">Other / Custom Destination</option>
                      </select>
                      <ChevronDown size={14} className="select-arrow-icon" />
                    </div>
                  </div>

                  {/* Travel Timeframe */}
                  <div className="form-field-group">
                    <label className="field-label">
                      <span>Travel Timeframe</span>
                    </label>
                    <div className="input-field-box">
                      <Calendar size={16} className="field-icon" />
                      <select
                        value={formData.travelMonth}
                        onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                        className="pro-select"
                      >
                        <option value="Next 15 Days">Next 15 Days (Immediate)</option>
                        <option value="Next Month">Next Month</option>
                        <option value="Within 3 Months">Within 3 Months</option>
                        <option value="Festive / Holiday Season">Festive / Holiday Season</option>
                        <option value="Flexible Dates">Flexible Dates</option>
                      </select>
                      <ChevronDown size={14} className="select-arrow-icon" />
                    </div>
                  </div>

                  {/* Group Size */}
                  <div className="form-field-group">
                    <label className="field-label">
                      <span>Group Size</span>
                    </label>
                    <div className="input-field-box">
                      <Users size={16} className="field-icon" />
                      <select
                        value={formData.travellers}
                        onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                        className="pro-select"
                      >
                        <option value="Solo Traveler">Solo Traveler</option>
                        <option value="2 Travellers (Couple)">2 Travellers (Couple)</option>
                        <option value="Family (3-5 People)">Family (3-5 People)</option>
                        <option value="Group (6+ People)">Group (6+ People)</option>
                      </select>
                      <ChevronDown size={14} className="select-arrow-icon" />
                    </div>
                  </div>

                  {/* Budget Preference */}
                  <div className="form-field-group">
                    <label className="field-label">
                      <span>Budget Preference</span>
                    </label>
                    <div className="input-field-box">
                      <Compass size={16} className="field-icon" />
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="pro-select"
                      >
                        <option value="Standard (Flexible)">Standard (Flexible)</option>
                        <option value="Comfort Deluxe">Comfort Deluxe</option>
                        <option value="Ultra Luxury">Ultra Luxury</option>
                      </select>
                      <ChevronDown size={14} className="select-arrow-icon" />
                    </div>
                  </div>

                </div>

                {/* Form Actions Row */}
                <div className="form-action-row">
                  <button type="submit" className="pro-submit-btn">
                    <span>Request Custom Itinerary</span>
                    <span className="btn-icon-circle">
                      <Send size={15} />
                    </span>
                  </button>

                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pro-whatsapp-btn"
                  >
                    <MessageSquare size={16} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Trust Badges Footer */}
                <div className="pro-trust-footer">
                  <div className="trust-badge">
                    <Clock size={13} className="trust-icon" />
                    <span>2-Hour Guaranteed Response</span>
                  </div>
                  <div className="trust-sep">•</div>
                  <div className="trust-badge">
                    <Award size={13} className="trust-icon" />
                    <span>100% Tailored Day-by-Day Plan</span>
                  </div>
                  <div className="trust-sep">•</div>
                  <div className="trust-badge">
                    <ShieldCheck size={13} className="trust-icon" />
                    <span>Verified Best Price Guarantee</span>
                  </div>
                </div>

              </form>
            ) : (
              <div className="form-success-card">
                <div className="success-badge-icon">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="success-heading">Trip Inquiry Received</h3>
                <p className="success-body">
                  Thank you <strong>{formData.name}</strong>! Our travel concierge has received your request for <strong>{formData.destination}</strong> ({formData.travellers}). We are crafting your personalized itinerary.
                </p>

                <div className="success-action-group">
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="pro-submit-btn whatsapp-theme"
                  >
                    <MessageSquare size={18} />
                    <span>Continue Instantly on WhatsApp</span>
                  </a>

                  <button 
                    onClick={() => setSubmitted(false)}
                    className="pro-reset-btn"
                  >
                    ← Submit Another Request
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        .world-cta-section {
          position: relative;
          padding: 60px 0 50px;
          background-color: #f8fafc;
          overflow: hidden;
        }

        .world-cta-content {
          position: relative;
          z-index: 10;
          max-width: 920px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-header {
          margin-bottom: 36px;
        }

        .concierge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #27272a;
          margin-bottom: 22px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          text-transform: uppercase;
        }

        .sparkle-icon {
          color: #d97706;
        }

        .world-cta-heading {
          font-size: clamp(38px, 6vw, 76px);
          font-weight: 800;
          color: #09090b;
          line-height: 1.06;
          letter-spacing: -0.035em;
          margin-bottom: 16px;
        }

        .earth-o-symbol {
          display: inline-block;
          font-size: 0.88em;
          line-height: 1;
          vertical-align: middle;
          margin: 0 0.01em;
          transform: translateY(-0.06em);
          filter: drop-shadow(0 4px 14px rgba(59, 130, 246, 0.35));
        }

        .accent-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          color: #0f766e;
        }

        .world-cta-subheading {
          font-size: clamp(14.5px, 1.7vw, 17px);
          color: #52525b;
          max-width: 660px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Form Card Container */
        .world-form-card {
          position: relative;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(228, 228, 231, 0.9);
          border-radius: 24px;
          padding: 36px 40px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.09), 0 10px 24px -8px rgba(0, 0, 0, 0.04);
          text-align: left;
          margin-top: 24px;
          overflow: hidden;
        }

        .card-top-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0d9488, #d97706, #0284c7);
        }

        /* Category Tabs */
        .category-tabs-wrapper {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f4f4f5;
        }

        .tabs-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .category-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f4f4f5;
          padding: 4px;
          border-radius: 9999px;
        }

        .tab-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          background: transparent;
          color: #52525b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .tab-btn.active {
          background: #ffffff;
          color: #09090b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* Form Fields Grid */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 26px;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #27272a;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .req {
          color: #e11d48;
        }

        .input-field-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #fdfdfd;
          border: 1.5px solid #e4e4e7;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .input-field-box:focus-within {
          background: #ffffff;
          border-color: #0f766e;
          box-shadow: 0 0 0 3.5px rgba(15, 118, 110, 0.12);
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: #a1a1aa;
          pointer-events: none;
          transition: color 0.2s;
        }

        .input-field-box:focus-within .field-icon {
          color: #0f766e;
        }

        .pro-input, .pro-select {
          width: 100%;
          height: 44px;
          padding: 0 14px 0 42px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #09090b;
          font-weight: 500;
        }

        .pro-select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          padding-right: 36px;
        }

        .select-arrow-icon {
          position: absolute;
          right: 14px;
          color: #71717a;
          pointer-events: none;
        }

        /* Action Row */
        .form-action-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
        }

        .pro-submit-btn {
          flex: 1;
          height: 50px;
          background: #09090b;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 24px -4px rgba(9, 9, 11, 0.25);
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .pro-submit-btn:hover {
          background: #27272a;
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -4px rgba(9, 9, 11, 0.35);
        }

        .btn-icon-circle {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pro-whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 50px;
          padding: 0 22px;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          color: #15803d;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .pro-whatsapp-btn:hover {
          background: #dcfce7;
          border-color: #86efac;
          transform: translateY(-1.5px);
        }

        .whatsapp-theme {
          background: #25d366 !important;
          color: #ffffff !important;
          box-shadow: 0 10px 24px -4px rgba(37, 211, 102, 0.35) !important;
        }

        .whatsapp-theme:hover {
          background: #20bd5a !important;
        }

        /* Trust Footer */
        .pro-trust-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding-top: 18px;
          border-top: 1px solid #f4f4f5;
          font-size: 12px;
          color: #71717a;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
        }

        .trust-icon {
          color: #0f766e;
        }

        .trust-sep {
          color: #d4d4d8;
        }

        /* Success Card */
        .form-success-card {
          text-align: center;
          padding: 16px 12px;
        }

        .success-badge-icon {
          width: 68px;
          height: 68px;
          background: #ecfdf5;
          color: #059669;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .success-heading {
          font-size: 22px;
          font-weight: 800;
          color: #09090b;
          margin-bottom: 8px;
        }

        .success-body {
          font-size: 14.5px;
          color: #52525b;
          max-width: 500px;
          margin: 0 auto 24px;
          line-height: 1.6;
        }

        .success-action-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          max-width: 340px;
          margin: 0 auto;
        }

        .pro-reset-btn {
          background: none;
          border: none;
          color: #71717a;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 14px;
          text-decoration: underline;
        }

        .pro-reset-btn:hover {
          color: #09090b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .world-cta-section {
            padding: 48px 0 60px;
          }

          .cta-header {
            margin-bottom: 20px;
          }

          .concierge-pill {
            font-size: 10.5px;
            padding: 4px 12px;
            margin-bottom: 12px;
          }

          .world-cta-heading {
            font-size: clamp(26px, 7vw, 36px);
            line-height: 1.15;
            margin-bottom: 12px;
          }

          .world-cta-subheading {
            font-size: 13.5px;
            line-height: 1.5;
          }

          .world-form-card {
            padding: 18px 16px;
            border-radius: 16px;
          }

          .category-tabs-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            margin-bottom: 16px;
            padding-bottom: 12px;
          }

          .tabs-label {
            font-size: 11px;
          }

          .category-tabs {
            width: 100%;
            padding: 3px;
          }

          .tab-btn {
            flex: 1;
            justify-content: center;
            padding: 7px 8px;
            font-size: 11.5px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 8px !important;
            margin-bottom: 14px !important;
          }

          .field-label {
            font-size: 11px !important;
            margin-bottom: 2px !important;
          }

          .input-field-box {
            border-radius: 8px !important;
            border-width: 1px !important;
          }

          .field-icon {
            left: 10px !important;
            width: 14px !important;
            height: 14px !important;
          }

          .pro-input, .pro-select {
            height: 36px !important;
            padding: 0 10px 0 32px !important;
            font-size: 12px !important;
          }

          .select-arrow-icon {
            right: 10px !important;
            width: 12px !important;
            height: 12px !important;
          }

          .form-action-row {
            flex-direction: column;
            gap: 10px;
          }

          .pro-submit-btn, .pro-whatsapp-btn {
            width: 100%;
            justify-content: center;
            padding: 10px 16px;
            font-size: 13px;
            border-radius: 9999px;
          }

          .pro-trust-footer {
            gap: 6px;
            font-size: 10.5px;
            margin-top: 14px;
          }

          .trust-sep {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
