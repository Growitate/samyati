import React from 'react';

const DESTINATIONS_MARQUEE = [
  { name: 'KASHMIR', flag: '🇮🇳' },
  { name: 'BALI', flag: '🇮🇩' },
  { name: 'DUBAI', flag: '🇦🇪' },
  { name: 'KERALA', flag: '🇮🇳' },
  { name: 'SWITZERLAND', flag: '🇨🇭' },
  { name: 'THAILAND', flag: '🇹🇭' },
  { name: 'LADAKH', flag: '🇮🇳' },
  { name: 'MALDIVES', flag: '🇲🇻' },
  { name: 'GOA', flag: '🇮🇳' },
  { name: 'VIETNAM', flag: '🇻🇳' },
  { name: 'RAJASTHAN', flag: '🇮🇳' },
  { name: 'SINGAPORE', flag: '🇸🇬' },
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
          padding: 28px 0;
          user-select: none;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 28px;
          white-space: nowrap;
        }

        .marquee-flag {
          font-size: 28px;
        }

        .marquee-name {
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #ffffff;
          font-family: var(--font-sans);
        }

        .marquee-separator {
          color: #f43f5e;
          font-size: 24px;
          margin-left: 12px;
        }
      `}</style>
    </div>
  );
}
