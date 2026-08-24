import React, { useState, useEffect } from 'react';
import { ArrowLeft, PhoneCall, Mail, MapPin, MessageSquare, Clock, Send, ShieldCheck, Check, Sparkles, Star, Headset, Copy, ChevronDown, ChevronUp, UserCheck, Zap, Globe2 } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';
import FaqSection from './FaqSection';

const POPULAR_DESTINATIONS = [
  'Kashmir', 'Kerala', 'Bali', 'Dubai', 'Switzerland', 'Maldives', 'Himachal', 'Rajasthan'
];

const FAQS = [
  {
    q: "How fast will I receive my customized itinerary quote?",
    a: "Our senior travel specialists prepare day-by-day customized itineraries with accurate hotel and transport pricing within 30 minutes to 2 hours during business hours (9:30 AM – 8:30 PM IST)."
  },
  {
    q: "Is there any fee for requesting a custom trip plan?",
    a: "No, request proposals and custom itinerary creation are 100% free with zero obligation and zero hidden charges."
  },
  {
    q: "Can I modify hotels, dates, or activities after getting a quote?",
    a: "Absolutely! We offer unlimited itinerary revisions until every detail—from boutique resort choices to private vehicle pacing—matches your exact vision."
  },
  {
    q: "Do you provide on-tour assistance during our vacation?",
    a: "Yes! Every Samyati traveller gets a dedicated human concierge on WhatsApp and phone for 24/7 real-time support throughout your entire journey."
  },
  {
    q: "What payment modes are accepted?",
    a: "We accept all major Credit/Debit Cards, UPI, Net Banking, and Bank Transfers with official GST tax invoices for full security and compliance."
  }
];

export default function ContactPage({ onBack, onOpenOfferModal }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    destination: '',
    travelers: 'Couple (2 Adults)',
    travelDate: '',
    budget: '₹25,000 - ₹50,000',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectChip = (dest) => {
    setFormData(prev => ({ ...prev, destination: dest }));
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onOpenOfferModal(`Contact Form Inquiry: ${formData.fullName} (${formData.destination || 'General Destination'})`);
    }, 900);
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. LUXURY DARK HERO HEADER */}
      <section className="contact-hero-banner">
        <div className="ambient-blur-orb orb-1"></div>
        <div className="ambient-blur-orb orb-2"></div>

        <div className="container relative-z">
          {/* Top navigation row */}
          <div className="top-nav-bar-row">
           

            <div className="top-breadcrumbs">
          
            </div>
          </div>

          <div className="hero-center-content">
            <div className="eyebrow-pill">
              <Headset size={14} className="text-amber-400" />
              <span>DIRECT TRAVEL CONCIERGE & SUPPORT</span>
            </div>

            <h1 className="contact-hero-title">
              Get in Touch with Our <span className="gold-serif">Travel Specialists</span>
            </h1>

            <p className="contact-hero-subtitle">
              Whether you are planning a bespoke domestic getaway or an international luxury holiday, 
              our dedicated concierges are ready to craft your personalized day-by-day itinerary.
            </p>

            {/* Hero Quick Trust Chips */}
            <div className="hero-trust-chips-row">
              <div className="hero-trust-chip">
                <Zap size={14} className="text-amber-400" />
                <span>30-Min Rapid Quote</span>
              </div>
              <div className="hero-trust-chip">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>100% Tailored Holidays</span>
              </div>
              <div className="hero-trust-chip">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span>4.9★ Rated Agency</span>
              </div>
              <div className="hero-trust-chip">
                <UserCheck size={14} className="text-sky-400" />
                <span>24/7 Human Concierge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container contact-main-container">
        
        {/* DIRECT CONTACT CHANNELS (4 CARDS) */}
        <div className="contact-channels-grid">
          {/* Phone Card */}
          <div className="channel-card card-phone">
            <div className="channel-header">
              <div className="channel-icon-box bg-amber-500/10 text-amber-500 border-amber-500/20">
                <PhoneCall size={22} />
              </div>
              <span className="channel-badge badge-green">24/7 Helpline</span>
            </div>

            <h3 className="channel-title">Direct Phone Call</h3>
            <p className="channel-desc">Speak directly with our senior holiday concierges.</p>

            <div className="channel-value-row">
              <span className="channel-number">+91 {BRAND_INFO.phone}</span>
              <button 
                onClick={() => handleCopy(`+91${BRAND_INFO.phone}`, 'phone')} 
                className="btn-copy-chip"
                title="Copy phone number"
              >
                <Copy size={13} />
                <span>{copiedPhone ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <a href={`tel:+91${BRAND_INFO.phone}`} className="channel-action-btn btn-call">
              <PhoneCall size={15} />
              <span>Call +91 {BRAND_INFO.phone}</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="channel-card card-whatsapp">
            <div className="channel-header">
              <div className="channel-icon-box bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <MessageSquare size={22} />
              </div>
              <span className="channel-badge badge-emerald">Instant PDF Quotes</span>
            </div>

            <h3 className="channel-title">WhatsApp Support</h3>
            <p className="channel-desc">Get instant itinerary suggestions & PDF price quotes.</p>

            <div className="channel-value-row">
              <span className="channel-number">+91 {BRAND_INFO.phone}</span>
            </div>

            <a 
              href={`https://wa.me/91${BRAND_INFO.phone}?text=Hi%20Samyati%20Team!%20I%20would%20like%20to%20inquire%20about%20planning%20a%20customized%20vacation.`} 
              target="_blank" 
              rel="noreferrer" 
              className="channel-action-btn btn-whatsapp"
            >
              <MessageSquare size={15} />
              <span>Chat on WhatsApp &rarr;</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="channel-card card-email">
            <div className="channel-header">
              <div className="channel-icon-box bg-sky-500/10 text-sky-500 border-sky-500/20">
                <Mail size={22} />
              </div>
              <span className="channel-badge badge-sky">B2B & Custom</span>
            </div>

            <h3 className="channel-title">Email Inquiries</h3>
            <p className="channel-desc">Send us detailed specifications or custom corporate requests.</p>

            <div className="channel-value-row">
              <span className="channel-email">{BRAND_INFO.email}</span>
              <button 
                onClick={() => handleCopy(BRAND_INFO.email, 'email')} 
                className="btn-copy-chip"
                title="Copy email address"
              >
                <Copy size={13} />
                <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <a href={`mailto:${BRAND_INFO.email}`} className="channel-action-btn btn-email">
              <Mail size={15} />
              <span>Send Official Email</span>
            </a>
          </div>
        </div>

        {/* 3. FORM & SIDEBAR SECTION */}
        <div className="contact-form-section-grid">
          
          {/* LEFT: INQUIRY FORM CARD */}
          <div className="contact-form-card">
            <div className="form-card-header">
              <div>
                <span className="form-eyebrow">FREE ITINERARY & PRICE QUOTE</span>
                <h2 className="form-heading">Plan Your Bespoke Trip</h2>
              </div>
              <div className="response-time-pill">
                <Zap size={13} className="text-amber-500 fill-amber-500" />
                <span>Avg. Response: <strong>&lt; 30 Mins</strong></span>
              </div>
            </div>

            <p className="form-subheading">
              Tell us your travel ideas below. Our specialists will curate a personalized day-by-day itinerary with verified resort stays & private transport options.
            </p>

            {/* Quick Destination Select Chips */}
            <div className="quick-chips-wrapper">
              <span className="chips-label">Popular Destinations:</span>
              <div className="chips-flex">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleSelectChip(dest)}
                    className={`chip-btn ${formData.destination === dest ? 'active' : ''}`}
                  >
                    <span>{dest}</span>
                    {formData.destination === dest && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {submitted ? (
              <div className="form-success-alert">
                <div className="success-icon-ring">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <div className="success-text-box">
                  <h3>Thank you, {formData.fullName || 'Traveler'}!</h3>
                  <p>Your travel request for <strong>{formData.destination || 'your destination'}</strong> has been received by our senior concierge team. We are creating your customized itinerary now!</p>
                  
                  <div className="success-cta-row">
                    <a 
                      href={`https://wa.me/91${BRAND_INFO.phone}?text=Hi!%20I%20just%20submitted%20a%20travel%20request%20on%20your%20website%20for%20${encodeURIComponent(formData.destination || 'a custom trip')}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-success-whatsapp"
                    >
                      <MessageSquare size={16} />
                      <span>Speed Up via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone / WhatsApp Number <span className="req">*</span></label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="req">*</span></label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination">Target Destination</label>
                  <input
                    id="destination"
                    type="text"
                    placeholder="e.g. Kashmir, Bali, Switzerland..."
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="travelDate">Approximate Travel Date</label>
                  <input
                    id="travelDate"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="travelers">Number of Travelers</label>
                  <select
                    id="travelers"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                    className="form-input"
                  >
                    <option value="Solo Traveler">Solo Traveler (1 Person)</option>
                    <option value="Couple (2 Adults)">Couple (2 Adults)</option>
                    <option value="Family (3-4 People)">Family (3-4 People)</option>
                    <option value="Group (5+ People)">Group (5+ People)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Estimated Budget Per Person</label>
                  <div className="budget-radios-grid">
                    {['Under ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1 Lakh', '₹1 Lakh+'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: b })}
                        className={`budget-radio-btn ${formData.budget === b ? 'active' : ''}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Trip Preferences & Special Notes</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="e.g. Honeymoon trip, 5-star luxury resorts, candlelit dinner, private AC vehicle, flexible dates..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input textarea"
                  />
                </div>

                <button type="submit" className="btn-pro-submit-form full-width">
                  <span>REQUEST MY CUSTOM ITINERARY & PRICE QUOTE</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <FaqSection onOpenOfferModal={onOpenOfferModal} />

      </div>

      <style>{`
        .contact-page-wrapper {
          min-height: 100vh;
          background-color: #fef9c3;
          padding-bottom: 80px;
          font-family: var(--font-sans);
          color: #0f172a;
        }

        /* 1. LUXURY DARK HERO BANNER */
        .contact-hero-banner {
          position: relative;
          background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #172554 100%);
          padding-top: 135px;
          padding-bottom: 60px;
          overflow: hidden;
          color: #ffffff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ambient-blur-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.25;
        }
        .orb-1 {
          width: 350px;
          height: 350px;
          background: #f59e0b;
          top: -80px;
          left: 10%;
        }
        .orb-2 {
          width: 400px;
          height: 400px;
          background: #3b82f6;
          bottom: -100px;
          right: 5%;
        }

        .relative-z {
          position: relative;
          z-index: 10;
        }

        .top-nav-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .btn-top-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-top-back:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-3px);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .top-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }
        .crumb-sep {
          color: rgba(255, 255, 255, 0.3);
        }
        .top-breadcrumbs .active {
          color: #fbe09b;
          font-weight: 700;
        }

        .hero-center-content {
          text-align: center;
          max-width: 820px;
          margin: 0 auto;
        }

        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fef08a;
          padding: 5px 16px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .contact-hero-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 800;
          line-height: 1.18;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .gold-serif {
          font-family: var(--font-serif-italic);
          font-style: italic;
          font-weight: 600;
          background: linear-gradient(135deg, #fef08a 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-hero-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .hero-trust-chips-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-trust-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        /* 2. MAIN CONTAINER & CONTACT CHANNELS GRID */
        .contact-main-container {
          padding-top: 45px;
        }

        .contact-channels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 45px;
        }

        .channel-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .channel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .channel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .channel-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
        }

        .channel-badge {
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .badge-green { background: #ecfdf5; color: #059669; }
        .badge-emerald { background: #d1fae5; color: #047857; }
        .badge-sky { background: #e0f2fe; color: #0284c7; }
        .badge-purple { background: #f3e8ff; color: #7e22ce; }

        .channel-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .channel-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 16px;
          flex: 1;
        }

        .channel-subtext {
          font-size: 11.5px;
          color: #94a3b8;
          margin-top: 2px;
          margin-bottom: 14px;
        }

        .channel-value-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .channel-number, .channel-email {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          word-break: break-all;
        }

        .btn-copy-chip {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        .btn-copy-chip:hover {
          background: #0f172a;
          color: #ffffff;
        }

        .channel-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-call {
          background: #0f172a;
          color: #ffffff;
        }
        .btn-call:hover {
          background: #1e293b;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
        }

        .btn-whatsapp {
          background: #10b981;
          color: #ffffff;
        }
        .btn-whatsapp:hover {
          background: #059669;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        .btn-email {
          background: #0284c7;
          color: #ffffff;
        }
        .btn-email:hover {
          background: #0369a1;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
        }

        .hq-hours-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fffbe6;
          border: 1px solid #fef08a;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #854d0e;
        }

        /* 3. FORM & SIDEBAR SPLIT */
        .contact-form-section-grid {
          max-width: 900px;
          margin: 0 auto 60px auto;
        }

        .contact-form-card {
          position: relative;
          background: #ffffff;
          border-radius: 28px;
          padding: 44px 40px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .contact-form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%);
        }

        .form-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .form-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #d97706;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .form-heading {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .response-time-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fffbe6;
          border: 1px solid #fef08a;
          color: #92400e;
          font-size: 11.5px;
          padding: 6px 14px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(217, 119, 6, 0.08);
        }

        .form-subheading {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        /* Quick destination chips */
        .quick-chips-wrapper {
          margin-bottom: 28px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
        }

        .chips-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 10px;
          letter-spacing: 0.02em;
        }

        .chips-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .chip-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .chip-btn.active {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #ffffff;
          border-color: #d97706;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .form-group.full-width {
          grid-column: span 2;
        }

        .contact-form-grid label {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
        }
        .req { color: #e11d48; }

        .form-input {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 18px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.25s ease;
          background: #f8fafc;
          color: #0f172a;
        }
        .form-input:focus {
          background: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.12);
        }
        .form-input.textarea {
          resize: vertical;
          min-height: 110px;
        }

        /* Budget selector radios grid */
        .budget-radios-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .budget-radio-btn {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          color: #475569;
          font-size: 12.5px;
          font-weight: 600;
          padding: 11px 10px;
          border-radius: 12px;
          cursor: pointer;
          text-align: center;
          transition: all 0.25s ease;
        }
        .budget-radio-btn:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }
        .budget-radio-btn.active {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #ffffff;
          border-color: #d97706;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.22);
        }

        .btn-pro-submit-form {
          grid-column: span 2;
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 18px 32px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
          margin-top: 10px;
        }
        .btn-pro-submit-form:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.35);
          background: #1e293b;
        }

        /* Success Alert */
        .form-success-alert {
          display: flex;
          gap: 16px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 24px;
          border-radius: 18px;
        }

        .success-icon-ring {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #d1fae5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .success-text-box h3 {
          font-size: 18px;
          font-weight: 800;
          color: #065f46;
          margin-bottom: 6px;
        }
        .success-text-box p {
          font-size: 13.5px;
          color: #047857;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .btn-success-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 9999px;
          text-decoration: none;
        }

        /* SIDEBAR STYLING */
        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .sidebar-card-title {
          font-size: 16.5px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .sidebar-card-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 18px;
        }

        .founders-mini-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .founder-mini-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }

        .founder-avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #0f172a;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .founder-info {
          display: flex;
          flex-direction: column;
        }

        .founder-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .founder-role {
          font-size: 11px;
          color: #64748b;
        }

        .trust-bullets-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trust-bullets-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .bullet-icon-box {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .trust-bullets-list strong {
          font-size: 13px;
          color: #0f172a;
          display: block;
          margin-bottom: 2px;
        }
        .trust-bullets-list p {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        /* 4. FREQUENTLY ASKED QUESTIONS */
        .contact-faq-section {
          background: #ffffff;
          border-radius: 24px;
          padding: 40px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
        }

        .faq-section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 36px auto;
        }

        .faq-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #0284c7;
          text-transform: uppercase;
        }

        .faq-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 4px;
          margin-bottom: 8px;
        }

        .faq-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .faq-item.open {
          border-color: #0f172a;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .faq-question-btn {
          width: 100%;
          padding: 16px 20px;
          background: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          text-align: left;
          cursor: pointer;
        }

        .faq-answer-box {
          padding: 0 20px 18px 20px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }
        .faq-answer-box p {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
          margin-top: 12px;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 1100px) {
          .contact-channels-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .budget-radios-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 850px) {
          .contact-form-section-grid {
            grid-template-columns: 1fr;
          }
          .contact-form-card {
            padding: 24px;
          }
          .contact-faq-section {
            padding: 24px;
          }
        }

        @media (max-width: 580px) {
          .contact-channels-grid {
            grid-template-columns: 1fr;
            gap: 14px !important;
          }
          .channel-card {
            padding: 16px 16px !important;
            border-radius: 16px !important;
          }
          .channel-header {
            margin-bottom: 10px !important;
          }
          .channel-icon-box {
            width: 38px !important;
            height: 38px !important;
            border-radius: 10px !important;
          }
          .channel-icon-box svg {
            width: 18px !important;
            height: 18px !important;
          }
          .channel-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .channel-desc {
            font-size: 12.5px !important;
            line-height: 1.4 !important;
            margin-bottom: 12px !important;
          }
          .channel-value-row {
            padding: 6px 10px !important;
            margin-bottom: 10px !important;
            border-radius: 10px !important;
          }
          .channel-number, .channel-email {
            font-size: 12.5px !important;
          }
          .channel-action-btn {
            padding: 9px 14px !important;
            font-size: 12px !important;
            border-radius: 9999px !important;
          }
          .contact-form-card {
            padding: 18px 16px !important;
            border-radius: 16px !important;
          }
          .form-heading {
            font-size: 20px !important;
          }
          .form-subheading {
            font-size: 13px !important;
            margin-bottom: 16px !important;
          }
          .quick-chips-wrapper {
            padding: 10px 12px !important;
            border-radius: 12px !important;
            margin-bottom: 16px !important;
          }
          .chip-btn {
            padding: 4px 10px !important;
            font-size: 11px !important;
          }
          .contact-form-grid {
            grid-template-columns: 1fr;
            gap: 10px !important;
          }
          .form-group {
            gap: 3px !important;
          }
          .contact-form-grid label {
            font-size: 11px !important;
          }
          .form-input {
            padding: 8px 12px !important;
            font-size: 12px !important;
            border-radius: 8px !important;
            border-width: 1px !important;
          }
          .form-input.textarea {
            min-height: 65px !important;
            padding: 8px 12px !important;
          }
          .budget-radio-btn {
            padding: 7px 8px !important;
            font-size: 11.5px !important;
            border-radius: 8px !important;
          }
          .btn-pro-submit-form {
            padding: 10px 18px !important;
            font-size: 12.5px !important;
            margin-top: 6px !important;
          }
          .form-group.full-width, .btn-pro-submit-form.full-width {
            grid-column: span 1;
          }
          .budget-radios-grid {
            grid-template-columns: 1fr;
            gap: 6px !important;
          }
          .hero-trust-chips-row {
            flex-direction: column;
          }
          .form-card-header {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
