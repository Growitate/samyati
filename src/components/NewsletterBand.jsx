import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { FooterCloudEffect } from './CloudEffect';

export default function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="newsletter-band" id="newsletter">
      {/* Dark Overlay Gradient */}
      <div className="newsletter-overlay" />

      {/* Volumetric Cloud Effect Above Footer */}
      <FooterCloudEffect />

      <div className="container newsletter-content">
        <h2 className="newsletter-heading">
          Get Travel Ideas<br />
          <span className="accent-serif">Delivered</span> Monthly
        </h2>

        {!subscribed ? (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="compound-email-pill">
              <div className="email-input-group">
                <Mail size={18} className="email-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-input"
                />
              </div>

              <button type="submit" className="subscribe-btn">
                <span>Subscribe Now!</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <div className="check-chip">
              <Check size={20} />
            </div>
            <span>You're subscribed! Check your inbox for our latest itineraries.</span>
          </div>
        )}

        <p className="newsletter-microcopy">
          Join 12,000+ travelers · No spam, unsubscribe anytime
        </p>
      </div>

      <style>{`
        .newsletter-band {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85');
          background-size: cover;
          background-position: center;
          padding: 120px 0 100px;
          text-align: center;
          overflow: hidden;
        }

        .newsletter-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 20, 16, 0.75) 0%, rgba(15, 20, 16, 0.85) 100%);
          z-index: 1;
        }

        .cloud-transition-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 5;
          line-height: 0;
        }

        .cloud-svg-top {
          width: 100%;
          height: 60px;
        }

        .newsletter-content {
          position: relative;
          z-index: 10;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .newsletter-heading {
          font-size: clamp(34px, 5vw, 54px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 32px;
        }

        .newsletter-form {
          width: 100%;
          margin-bottom: 16px;
        }

        .compound-email-pill {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: var(--radius-pill);
          padding: 6px 8px 6px 20px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        .email-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .email-icon {
          color: #9ca3af;
        }

        .email-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 15px;
          font-family: var(--font-sans);
          color: var(--text-dark);
          background: transparent;
        }

        .subscribe-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--text-dark);
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: var(--radius-pill);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .subscribe-btn:hover {
          background: #2a2d28;
          transform: translateY(-1px);
        }

        .success-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .check-chip {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .newsletter-microcopy {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 640px) {
          .compound-email-pill {
            flex-direction: column;
            gap: 12px;
            padding: 12px;
            border-radius: 20px;
          }
          .subscribe-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
