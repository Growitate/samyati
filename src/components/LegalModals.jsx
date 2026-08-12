import React from 'react';
import { X, Shield, FileText } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="legal-header">
          <Shield size={24} className="text-emerald-500" />
          <h2>Privacy Policy — Samyati World Private Limited</h2>
        </div>

        <div className="legal-body">
          <p><strong>Effective Date:</strong> January 1, 2025</p>
          <p>At <strong>Samyati World Private Limited</strong> ("Samyati The World", "we", "us"), we value your privacy and are committed to protecting your personal information when you plan domestic and international trips with us.</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect personal details provided during consultation and offer requests, including full name, phone number, email address, travel preferences, destination choices, and budget specifications.</p>

          <h3>2. How We Use Your Data</h3>
          <p>Your information is strictly used to curate personalized itineraries, arrange hotel bookings, flight/train transfers, visas, and provide 24/7 dedicated human travel support throughout your journey.</p>

          <h3>3. Data Protection & Sharing</h3>
          <p>We do not sell, rent, or trade your personal data to third parties. Information is only shared with verified travel partners (hotels, airlines, local transport contractors) solely to complete your itinerary bookings.</p>

          <h3>4. Contact Us</h3>
          <p>For any privacy inquiries or data update requests, email us at <strong>{BRAND_INFO.email}</strong> or call <strong>+91 {BRAND_INFO.phone}</strong>.</p>
        </div>

        <div className="legal-footer">
          <button onClick={onClose} className="btn-pill btn-pill-dark">Close Policy</button>
        </div>
      </div>
      <style>{legalStyles}</style>
    </div>
  );
}

export function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="legal-header">
          <FileText size={24} className="text-amber-500" />
          <h2>Terms & Conditions — Samyati World Private Limited</h2>
        </div>

        <div className="legal-body">
          <p>Welcome to <strong>Samyati World Private Limited</strong>. By accessing our customized travel services, submitting offer requests, or booking tour packages, you agree to these Terms and Conditions.</p>

          <h3>1. Custom Trip Bookings & Payments</h3>
          <p>All itineraries are customized according to your individual preferences and budget. Bookings are confirmed upon receipt of the agreed advance payment. Remaining balances must be cleared prior to departure as per supplier policies.</p>

          <h3>2. Cancellations & Refunds</h3>
          <p>Cancellation policies depend on specific hotel, airline, and local contractor rules for domestic and international destinations. Samyati handles all cancellation requests with full transparency and human assistance.</p>

          <h3>3. Travel Documents & Visas</h3>
          <p>Travellers are responsible for maintaining valid passports (minimum 6 months validity for international destinations) and necessary visas. Samyati provides complete visa assistance and document guidance.</p>

          <h3>4. Contact & Support</h3>
          <p>For support during your trip, contact our concierge at <strong>sales@samyatitheworld.in</strong> or WhatsApp <strong>+91 {BRAND_INFO.phone}</strong>.</p>
        </div>

        <div className="legal-footer">
          <button onClick={onClose} className="btn-pill btn-pill-dark">Accept & Close</button>
        </div>
      </div>
      <style>{legalStyles}</style>
    </div>
  );
}

const legalStyles = `
  .legal-modal {
    max-width: 650px;
    padding: 32px;
  }
  .legal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .legal-header h2 {
    font-size: 20px;
    font-weight: 800;
    color: var(--text-dark);
  }
  .legal-body {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
    max-height: 60vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .legal-body h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-dark);
    margin-top: 8px;
  }
  .legal-footer {
    margin-top: 24px;
    text-align: right;
  }
`;
