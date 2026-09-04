import React from 'react';

const DESTINATIONS_MARQUEE = [
  { name: 'KASHMIR', flag: '🇮🇳' },
  { name: 'BALI', flag: '🇮🇩' },
  { name: 'KERALA', flag: '🇮🇳' },
  { name: 'THAILAND', flag: '🇹🇭' },
  { name: 'LADAKH', flag: '🇮🇳' },
  { name: 'GOA', flag: '🇮🇳' },
  { name: 'VIETNAM', flag: '🇻🇳' },
  { name: 'RAJASTHAN', flag: '🇮🇳' },
  { name: 'SINGAPORE', flag: '🇸🇬' },
  { name: 'KAZAKHSTAN', flag: '🇰🇿' },
  { name: 'MALAYSIA', flag: '🇲🇾' },
  { name: 'DUBAI', flag: '🇦🇪' },
];

export default function LocationMarquee() {
  const marqueeList = [...DESTINATIONS_MARQUEE, ...DESTINATIONS_MARQUEE, ...DESTINATIONS_MARQUEE];

  return (
    <div className="scalloped-strip location-marquee-container">
      <div className="marquee-track">
        {marqueeList.map((item, idx) => (
          <div key={idx} className="marquee-item">
            <span className="marquee-flag">{item.flag}</span>
            <span className="marquee-name">{item.name}</span>
            <span className="marquee-separator">•</span>
          </div>
        ))}
      </div>

      <style>{`
        .location-marquee-container {
          background-color: var(--text-dark);
          color: #ffffff;
          padding: 24px 0;
          user-select: none;
          overflow: hidden;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 0 20px;
          white-space: nowrap;
        }

        .marquee-flag {
          font-size: 24px;
        }

        .marquee-name {
          font-size: clamp(20px, 3.5vw, 36px);
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #ffffff;
          font-family: var(--font-sans);
        }

        .marquee-separator {
          color: #f43f5e;
          font-size: 20px;
          margin-left: 8px;
        }

        @media (max-width: 600px) {
          .location-marquee-container { padding: 16px 0; }
          .marquee-item { gap: 10px; padding: 0 14px; }
          .marquee-flag { font-size: 20px; }
          .marquee-separator { font-size: 16px; margin-left: 6px; }
        }
      `}</style>
    </div>
  );
}
