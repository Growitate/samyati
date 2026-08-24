import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare, Headset, Sparkles } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';

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

export default function FaqSection({ onOpenOfferModal }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section-wrapper" id="faq">
      <div className="container">
        {/* Section Header */}
        <div className="faq-header-box">
          <div className="eyebrow-pill mb-2">
            <HelpCircle size={13} className="text-sky-500" />
            <span>HELP & CLARIFICATIONS</span>
          </div>

          <h2 className="faq-section-title">
            Frequently Asked <span className="accent-serif">Questions</span>
          </h2>

          <p className="faq-section-sub">
            Everything you need to know about planning your bespoke holiday with Samyati The World.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-accordion-container">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-card-item ${isOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="faq-card-question"
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <div className="faq-icon-box">
                    {isOpen ? <ChevronUp size={18} className="text-amber-500" /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="faq-card-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="faq-bottom-banner">
          <div className="faq-bottom-left">
            <Headset size={22} className="text-amber-500 flex-shrink-0" />
            <div>
              <h4>Still have questions or need a custom plan?</h4>
              <p>Speak directly with our senior travel concierge on WhatsApp or request a call back.</p>
            </div>
          </div>

          <div className="faq-bottom-actions">
            <a
              href={`https://wa.me/91${BRAND_INFO.phone}?text=Hi!%20I%20have%20a%20few%20questions%20about%20planning%20a%20trip%20with%20Samyati.`}
              target="_blank"
              rel="noreferrer"
              className="btn-faq-whatsapp"
            >
              <MessageSquare size={15} />
              <span>Ask on WhatsApp</span>
            </a>

            {onOpenOfferModal && (
              <button onClick={() => onOpenOfferModal()} className="btn-faq-offer">
                <Sparkles size={15} />
                <span>Get Customized Quote</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .faq-section-wrapper {
          padding: 85px 0;
          background: linear-gradient(180deg, #ffffff 0%, #fefce8 100%);
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          font-family: var(--font-sans);
        }

        .faq-header-box {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 48px auto;
        }

        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          color: #0284c7;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 4px 14px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .faq-section-title {
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .accent-serif {
          font-family: var(--font-serif-italic);
          font-style: italic;
          font-weight: 600;
          color: #d97706;
        }

        .faq-section-sub {
          font-size: 15.5px;
          color: #64748b;
          line-height: 1.6;
        }

        .faq-accordion-container {
          max-width: 900px;
          margin: 0 auto 48px auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .faq-card-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          transition: all 0.25s ease;
        }

        .faq-card-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }

        .faq-card-item.active {
          border-color: #0f172a;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        .faq-card-question {
          width: 100%;
          padding: 20px 24px;
          background: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          text-align: left;
        }

        .faq-q-text {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
        }

        .faq-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fefce8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .faq-card-item.active .faq-icon-box {
          background: #fffbe6;
        }

        .faq-card-answer {
          padding: 0 24px 22px 24px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          animation: fadeIn 0.25s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .faq-card-answer p {
          font-size: 14.5px;
          color: #475569;
          line-height: 1.65;
          margin-top: 14px;
        }

        /* Bottom Help Banner */
        .faq-bottom-banner {
          max-width: 900px;
          margin: 0 auto;
          background: #0f172a;
          color: #ffffff;
          border-radius: 20px;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
        }

        .faq-bottom-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .faq-bottom-left h4 {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .faq-bottom-left p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .faq-bottom-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn-faq-whatsapp {
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
          transition: all 0.2s ease;
        }

        .btn-faq-whatsapp:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .btn-faq-offer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-faq-offer:hover {
          background: #ffffff;
          color: #0f172a;
        }

        @media (max-width: 850px) {
          .faq-bottom-banner {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }
          .faq-bottom-left {
            flex-direction: column;
            text-align: center;
          }
          .faq-bottom-actions {
            flex-direction: column;
            width: 100%;
          }
          .btn-faq-whatsapp, .btn-faq-offer {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
