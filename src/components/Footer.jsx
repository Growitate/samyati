import React from 'react';
import { Plane, ArrowUpRight, PhoneCall, Mail, MapPin } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const FLAGS = [
  { code: '🇮🇳', name: 'India' },
  { code: '🇮🇩', name: 'Bali' },
  { code: '🇦🇪', name: 'Dubai' },
  { code: '🇨🇭', name: 'Switzerland' },
  { code: '🇹🇭', name: 'Thailand' },
  { code: '🇲🇻', name: 'Maldives' }
];

export default function Footer({ onOpenOfferModal, onOpenPrivacy, onOpenTerms }) {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Column */}
          <div className="footer-col col-brand">
            <a href="#" className="footer-logo">
              <span className="logo-text">Samyati</span>
              <div className="logo-accent-plane">
                <Plane size={14} />
              </div>
              <span className="logo-subtag">THE WORLD</span>
            </a>
            
            <p className="brand-desc">
              Samyati World Private Limited — Rediscover Yourself With Every Journey. Specialized in customized domestic & international travel experiences.
            </p>

            <div className="flag-grid">
              {FLAGS.map((f, i) => (
                <span key={i} className="flag-item" title={f.name}>{f.code}</span>
              ))}
            </div>

            <button onClick={() => onOpenOfferModal()} className="btn-outlined-sm">
              <span>Get Custom Offer</span>
              <ArrowUpRight size={12} />
            </button>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="col-heading accent-serif">Explore</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#categories">Domestic (7) & International (7)</a></li>
              <li><a href="#tours">Handcrafted Packages (~56)</a></li>
              <li><a href="#destinations">Top Destinations</a></li>
              <li><a href="#story">Our Founders Story</a></li>
              <li><a href="#process">How We Plan</a></li>
            </ul>
          </div>

          {/* Column 3: Legal Pages & Trust */}
          <div className="footer-col">
            <h4 className="col-heading accent-serif">Legal & Trust</h4>
            <ul className="footer-links">
              <li><button onClick={onOpenPrivacy} className="footer-btn-link">Privacy Policy</button></li>
              <li><button onClick={onOpenTerms} className="footer-btn-link">Terms & Conditions</button></li>
              <li><a href="#promise">100% Personal & Transparent</a></li>
              <li><a href="#stories">2,400+ Traveller Reviews</a></li>
              <li><a href="#newsletter">Dedicated Human Support</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h4 className="col-heading accent-serif">Get In Touch</h4>
            <div className="contact-info-block">
              <p className="contact-item">
                <MapPin size={14} className="text-amber-400 inline mr-1" />
                <strong>Samyati World Private Limited</strong><br />
                Online Travel Company (Founded 2025)
              </p>
              <p className="contact-item">
                <PhoneCall size={14} className="text-emerald-400 inline mr-1" />
                <strong>WhatsApp / Phone:</strong><br />
                <a href={`https://wa.me/91${BRAND_INFO.phone}`} target="_blank" rel="noreferrer" className="phone-link">+91 {BRAND_INFO.phone}</a>
              </p>
              <p className="contact-item">
                <Mail size={14} className="text-rose-400 inline mr-1" />
                <strong>Email Us:</strong><br />
                <a href={`mailto:${BRAND_INFO.email}`} className="email-link">{BRAND_INFO.email}</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-left">
            <span>© 2025 Samyati World Private Limited · All Rights Reserved</span>
          </div>

          <div className="bottom-right">
            <div className="social-pills">
              <a href={BRAND_INFO.instagram} target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram"><InstagramIcon /></a>
              <a href={BRAND_INFO.linkedin} target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn"><LinkedinIcon /></a>
            </div>

            <button onClick={() => onOpenOfferModal()} className="btn-pill-free">
              Get Your Offer
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: var(--bg-dark);
          color: #ffffff;
          padding: 90px 0 30px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 70px;
        }

        .col-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-logo {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          text-decoration: none;
          color: #ffffff;
          margin-bottom: 16px;
        }

        .footer-logo .logo-text {
          font-family: var(--font-serif-italic);
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
        }

        .footer-logo .logo-accent-plane {
          position: absolute;
          top: -2px;
          right: -12px;
          color: #f97316;
          transform: rotate(25deg);
        }

        .brand-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 20px;
          max-width: 290px;
        }

        .flag-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .flag-item {
          font-size: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outlined-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-outlined-sm:hover {
          background: rgba(255,255,255,0.15);
        }

        .col-heading {
          font-size: 22px;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a, .footer-btn-link {
          text-decoration: none;
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: color 0.2s;
        }

        .footer-links a:hover, .footer-btn-link:hover {
          color: #ffffff;
          font-weight: 600;
        }

        .contact-info-block {
          display: flex;
          flex-direction: column;
          gap: 14px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }

        .contact-item strong {
          color: #ffffff;
        }

        .email-link, .phone-link {
          color: #f43f5e;
          text-decoration: none;
        }

        /* Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }

        .bottom-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .social-pills {
          display: flex;
          gap: 8px;
        }

        .social-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.2s;
        }

        .social-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .btn-pill-free {
          background: #ffffff;
          color: var(--text-dark);
          border: none;
          padding: 6px 16px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-bottom-bar { flex-direction: column; gap: 16px; text-align: center; }
        }

        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
