import React from 'react';
import { Plane, ArrowUpRight, PhoneCall, Mail, MapPin, ShieldCheck, Clock, Award, Sparkles, Heart, ArrowUp, CheckCircle2 } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const TOP_DOMESTIC = [
  { name: 'Kashmir Valley & Gulmarg', dest: 'Kashmir' },
  { name: 'Kerala Backwaters & Munnar', dest: 'Kerala' },
  { name: 'Himachal & Manali Snow Trails', dest: 'Himachal Pradesh' },
  { name: 'Royal Rajasthan & Udaipur', dest: 'Rajasthan' },
  { name: 'Andaman Emerald Islands', dest: 'Andaman' },
  { name: 'Ladakh High Passes & Pangong', dest: 'Ladakh' },
  { name: 'Goa Coastal Stays & Yachting', dest: 'Goa' },
];

const TOP_INTERNATIONAL = [
  { name: 'Bali Ubud Villas & Nusa Penida', dest: 'Bali' },
  { name: 'Switzerland Swiss Alps & Lakes', dest: 'Switzerland' },
  { name: 'Dubai Futuristic Wonders & Safari', dest: 'Dubai' },
  { name: 'Thailand Phuket & Krabi Escapes', dest: 'Thailand' },
  { name: 'Maldives Overwater Luxury Villas', dest: 'Maldives' },
  { name: 'Vietnam Halong Bay & Da Nang', dest: 'Vietnam' },
  { name: 'Singapore Marina Bay & Sentosa', dest: 'Singapore' },
];

export default function Footer({ onOpenOfferModal, onOpenPrivacy, onOpenTerms }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrapper" id="contact">
      {/* Top Pre-Footer Trust Bar */}
      <div className="footer-trust-strip">
        <div className="container">
          <div className="trust-strip-grid">
            <div className="trust-strip-item">
              <div className="trust-icon-box">
                <Sparkles size={18} className="text-amber-400" />
              </div>
              <div className="trust-strip-text">
                <span className="trust-strip-title">100% Tailored Holidays</span>
                <span className="trust-strip-desc">Customized to your pacing and style</span>
              </div>
            </div>

            <div className="trust-strip-item">
              <div className="trust-icon-box">
                <Clock size={18} className="text-emerald-400" />
              </div>
              <div className="trust-strip-text">
                <span className="trust-strip-title">Rapid 2-Hour Response</span>
                <span className="trust-strip-desc">Instant WhatsApp & phone proposals</span>
              </div>
            </div>

            <div className="trust-strip-item">
              <div className="trust-icon-box">
                <ShieldCheck size={18} className="text-sky-400" />
              </div>
              <div className="trust-strip-text">
                <span className="trust-strip-title">Direct Best Price Promise</span>
                <span className="trust-strip-desc">Zero hidden charges or surprises</span>
              </div>
            </div>

            <div className="trust-strip-item">
              <div className="trust-icon-box">
                <Award size={18} className="text-rose-400" />
              </div>
              <div className="trust-strip-text">
                <span className="trust-strip-title">Dedicated Human Concierge</span>
                <span className="trust-strip-desc">24/7 on-tour emergency assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="container footer-main-content">
        <div className="footer-grid-pro">
          {/* Column 1: Brand & Philosophy */}
          <div className="footer-col-pro brand-col-pro">
            <a href="#" className="footer-logo-pro" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
              <span className="logo-text-pro">Samyati</span>
              <div className="logo-accent-plane-pro">
                <Plane size={15} />
              </div>
              <span className="logo-subtag-pro">THE WORLD</span>
            </a>
            
            <p className="brand-desc-pro">
              <strong>Samyati World Private Limited</strong> is a modern boutique travel company creating bespoke domestic & international experiences designed to help you rediscover yourself with every journey.
            </p>

            {/* Credibility & Accreditation Tags */}
            <div className="accreditation-row">
              <span className="accred-pill">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Govt. Registered Company</span>
              </span>
              <span className="accred-pill">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Verified Travel Specialists</span>
              </span>
            </div>

            <div className="cta-brand-action">
              <button 
                onClick={() => onOpenOfferModal()} 
                className="btn-pill-footer-cta"
                title="Request a customized vacation itinerary"
              >
                <span>Plan A Custom Trip</span>
                <span className="btn-badge-icon-pro">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </div>
          </div>

          {/* Column 2: Desh (Domestic India) */}
          <div className="footer-col-pro">
            <h4 className="footer-col-title">
              <span>Desh (India Escapes)</span>
            </h4>
            <ul className="footer-links-pro">
              {TOP_DOMESTIC.map((item, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onOpenOfferModal(item.dest)} 
                    className="footer-link-btn"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Videsh (International Holidays) */}
          <div className="footer-col-pro">
            <h4 className="footer-col-title">
              <span>Videsh (World Escapes)</span>
            </h4>
            <ul className="footer-links-pro">
              {TOP_INTERNATIONAL.map((item, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onOpenOfferModal(item.dest)} 
                    className="footer-link-btn"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Legal */}
          <div className="footer-col-pro">
            <h4 className="footer-col-title">
              <span>Experience & Trust</span>
            </h4>
            <ul className="footer-links-pro">
              <li><a href="#categories" className="footer-link-tag">Explore Desh & Videsh</a></li>
              <li><a href="#tours" className="footer-link-tag">Handcrafted Packages (~56)</a></li>
              <li><a href="#curated-escapes" className="footer-link-tag">Honeymoon & Family Themes</a></li>
              <li><a href="#story" className="footer-link-tag">Our Founders' Story</a></li>
              <li><a href="#process" className="footer-link-tag">Our 4-Step Trip Process</a></li>
              <li><button onClick={onOpenPrivacy} className="footer-link-btn">Privacy Policy</button></li>
              <li><button onClick={onOpenTerms} className="footer-link-btn">Terms & Booking Conditions</button></li>
            </ul>
          </div>

          {/* Column 5: Contact & Concierge Card */}
          <div className="footer-col-pro contact-col-pro">
            <h4 className="footer-col-title">
              <span>Get In Touch</span>
            </h4>
            
            <div className="contact-card-pro">
              <div className="contact-row-pro">
                <MapPin size={16} className="contact-icon-pro text-amber-400" />
                <div>
                  <span className="contact-label-pro">Registered Headquarters</span>
                  <p className="contact-value-pro">Samyati World Private Limited<br />Online Travel Concierge (Est. 2025)</p>
                </div>
              </div>

              <div className="contact-row-pro">
                <PhoneCall size={16} className="contact-icon-pro text-emerald-400" />
                <div>
                  <span className="contact-label-pro">Direct WhatsApp & Helpline</span>
                  <a 
                    href={`https://wa.me/91${BRAND_INFO.phone}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="contact-highlight-link"
                  >
                    +91 {BRAND_INFO.phone}
                  </a>
                  <span className="badge-available">24/7 Available</span>
                </div>
              </div>

              <div className="contact-row-pro">
                <Mail size={16} className="contact-icon-pro text-rose-400" />
                <div>
                  <span className="contact-label-pro">Email Inquiries</span>
                  <a href={`mailto:${BRAND_INFO.email}`} className="contact-email-link">
                    {BRAND_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Socials & Back to Top */}
        <div className="footer-bottom-pro">
          <div className="bottom-left-pro">
            <span className="copyright-text">
              © {new Date().getFullYear()} Samyati World Private Limited · All Rights Reserved.
            </span>
            <span className="crafted-text">
              Crafted with <Heart size={12} className="inline text-rose-500 fill-rose-500 mx-1" /> for unforgettable journeys.
            </span>
          </div>

          <div className="bottom-right-pro">
            <div className="social-links-group">
              <a 
                href={BRAND_INFO.instagram} 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn-pro" 
                aria-label="Instagram"
                title="Follow Samyati on Instagram"
              >
                <InstagramIcon />
              </a>
              <a 
                href={BRAND_INFO.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn-pro" 
                aria-label="LinkedIn"
                title="Connect on LinkedIn"
              >
                <LinkedinIcon />
              </a>
            </div>

            <button 
              onClick={scrollToTop} 
              className="btn-back-to-top"
              aria-label="Scroll back to top"
              title="Back to Top"
            >
              <span>Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #0c100d;
          color: #ffffff;
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-sans);
        }

        /* Top Trust Strip */
        .footer-trust-strip {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 28px 0;
        }

        .trust-strip-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .trust-strip-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .trust-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .trust-strip-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .trust-strip-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .trust-strip-desc {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.55);
        }

        /* Main Footer Grid */
        .footer-main-content {
          padding-top: 60px;
          padding-bottom: 30px;
        }

        .footer-grid-pro {
          display: grid;
          grid-template-columns: 1.4fr 1.1fr 1.1fr 1fr 1.3fr;
          gap: 36px;
          margin-bottom: 50px;
        }

        .footer-col-pro {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        /* Brand Col */
        .brand-col-pro {
          padding-right: 12px;
        }

        .footer-logo-pro {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          text-decoration: none;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .logo-text-pro {
          font-family: var(--font-serif-italic);
          font-size: 34px;
          font-weight: 700;
          line-height: 1;
          color: #ffffff;
        }

        .logo-accent-plane-pro {
          position: absolute;
          top: -2px;
          right: -14px;
          color: #f97316;
          transform: rotate(25deg);
        }

        .logo-subtag-pro {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.28em;
          color: #f97316;
          margin-top: 4px;
        }

        .brand-desc-pro {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .brand-desc-pro strong {
          color: rgba(255, 255, 255, 0.95);
        }

        .accreditation-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 22px;
        }

        .accred-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .btn-pill-footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #181f19;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px 8px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .btn-pill-footer-cta:hover {
          background: #ffffff;
          color: #0f1410;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
        }

        .btn-badge-icon-pro {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .btn-pill-footer-cta:hover .btn-badge-icon-pro {
          background: #0f1410;
          color: #ffffff;
          transform: translateX(2px);
        }

        /* Headings & Links */
        .footer-col-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 28px;
          height: 2px;
          background: #f59e0b;
          border-radius: 2px;
        }

        .footer-links-pro {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-link-btn, .footer-link-tag {
          background: none;
          border: none;
          padding: 0;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.65);
          font-size: 13px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-link-btn:hover, .footer-link-tag:hover {
          color: #ffffff;
          transform: translateX(3px);
          font-weight: 600;
        }

        /* Contact Card */
        .contact-card-pro {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-row-pro {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .contact-icon-pro {
          flex-shrink: 0;
          margin-top: 3px;
        }

        .contact-label-pro {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 2px;
        }

        .contact-value-pro {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.45;
        }

        .contact-highlight-link {
          font-size: 13.5px;
          font-weight: 800;
          color: #4ade80;
          text-decoration: none;
          display: inline-block;
          margin-right: 6px;
          transition: color 0.2s;
        }

        .contact-highlight-link:hover {
          color: #86efac;
          text-decoration: underline;
        }

        .badge-available {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          background: rgba(74, 222, 128, 0.15);
          color: #4ade80;
          padding: 2px 7px;
          border-radius: 9999px;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }

        .contact-email-link {
          font-size: 12.5px;
          color: #fda4af;
          text-decoration: none;
          transition: color 0.2s;
          word-break: break-all;
        }

        .contact-email-link:hover {
          color: #ffe4e6;
          text-decoration: underline;
        }

        /* Bottom Bar */
        .footer-bottom-pro {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }

        .bottom-left-pro {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .copyright-text {
          font-weight: 500;
        }

        .crafted-text {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .bottom-right-pro {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .social-links-group {
          display: flex;
          gap: 8px;
        }

        .social-btn-pro {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .social-btn-pro:hover {
          background: #ffffff;
          color: #0f1410;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .btn-back-to-top {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-back-to-top:hover {
          background: #ffffff;
          color: #0f1410;
          border-color: #ffffff;
        }

        @media (max-width: 1100px) {
          .trust-strip-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          .footer-grid-pro { grid-template-columns: 1fr 1fr; gap: 32px; }
        }

        @media (max-width: 680px) {
          .trust-strip-grid { grid-template-columns: 1fr; gap: 16px; }
          .footer-grid-pro { grid-template-columns: 1fr; gap: 28px; }
          .footer-bottom-pro { flex-direction: column; gap: 16px; text-align: center; }
          .bottom-left-pro { text-align: center; }
          .bottom-right-pro { justify-content: center; }
        }
      `}</style>
    </footer>
  );
}
