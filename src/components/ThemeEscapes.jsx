import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { usePackages } from '../context/PackageContext';

// Curated data collections matching reference images
const ESCAPE_SECTIONS = [
  {
    id: 'honeymoon',
    eyebrow: 'FOR TWO',
    title: 'Honeymoon escapes.',
    subtitle: 'Private stays, memorable landscapes and time that feels entirely your own.',
    linkText: 'View all honeymoon escapes →',
    items: [
      {
        id: 'bali-honeymoon',
        category: 'INTERNATIONAL',
        duration: '6 DAYS',
        title: 'Bali — Ubud · Nusa Penida · Seminyak',
        desc: 'Tropical stays, temples, private pool villas and slow island mornings.',
        price: '₹38,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        packageId: 'bali-1'
      },
      {
        id: 'kerala-honeymoon',
        category: 'INDIA',
        duration: '5 DAYS',
        title: 'Kerala — Munnar · Thekkady · Alleppey',
        desc: 'Tea hills, private drives, candlelit houseboats and unhurried backwaters.',
        price: '₹22,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        packageId: 'ker-1'
      },
      {
        id: 'kashmir-honeymoon',
        category: 'INDIA',
        duration: '6 DAYS',
        title: 'Kashmir — Srinagar · Gulmarg · Pahalgam',
        desc: 'Lake mornings, mountain meadows, cozy shikara rides and warm hospitality.',
        price: '₹28,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
        packageId: 'kash-1'
      },
      {
        id: 'thailand-honeymoon',
        category: 'INTERNATIONAL',
        duration: '6 DAYS',
        title: 'Thailand — Phuket · Krabi · Island escape',
        desc: 'Limestone coves, sunset catamaran sailing and relaxed beachside candle dinners.',
        price: '₹34,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
        packageId: 'thai-1'
      },
      {
        id: 'dubai-honeymoon',
        category: 'INTERNATIONAL',
        duration: '4-5 DAYS',
        title: 'Dubai — Marina Yacht · Desert Safari · Burj Khalifa',
        desc: 'Romantic Dubai Creek cruise, Burj Khalifa skyline views, luxury shopping and red dune desert dinner.',
        price: '₹11,500',
        priceLabel: 'Starting from',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        packageId: 'dubai-land-4d'
      },
      {
        id: 'rajasthan-honeymoon',
        category: 'INDIA',
        duration: '6-7 DAYS',
        title: 'Rajasthan — Udaipur · Jaipur Palace Romance',
        desc: 'Lake Pichola sunset boat cruise, heritage fort suites and royal dining.',
        price: '₹26,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
        packageId: 'raj-1'
      }
    ]
  },
  {
    id: 'family',
    eyebrow: 'FOR EVERYONE',
    title: 'Family escapes.',
    subtitle: 'Comfortable pacing, practical stays and meaningful days for every generation.',
    linkText: 'View all family escapes →',
    items: [
      {
        id: 'thailand-family',
        category: 'INTERNATIONAL',
        duration: '6 DAYS',
        title: 'Thailand — Phuket · Krabi · Island escape',
        desc: 'Limestone coves, lively evening markets, elephant sanctuaries and easy island days.',
        price: '₹34,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
        packageId: 'thai-1'
      },
      {
        id: 'kashmir-family',
        category: 'INDIA',
        duration: '6 DAYS',
        title: 'Kashmir — Srinagar · Gulmarg · Pahalgam',
        desc: 'Lake mornings, pony rides through mountain meadows and warm family hospitality.',
        price: '₹28,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
        packageId: 'kash-1'
      },
      {
        id: 'kerala-family',
        category: 'INDIA',
        duration: '5 DAYS',
        title: 'Kerala — Munnar · Thekkady · Alleppey',
        desc: 'Tea hills, spice plantations, private family houseboats and wildlife boat safari.',
        price: '₹22,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        packageId: 'ker-1'
      },
      {
        id: 'ladakh-family',
        category: 'INDIA',
        duration: '6-7 DAYS',
        title: 'Ladakh — Leh · Nubra Valley · Pangong Tso',
        desc: 'High mountain passes, peaceful monasteries, sand dunes and extraordinary blue lakes.',
        price: '₹32,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        packageId: 'lad-1'
      },
      {
        id: 'vietnam-family',
        category: 'INTERNATIONAL',
        duration: '6 DAYS',
        title: 'Vietnam — Hanoi · Halong Bay Cruise · Da Nang',
        desc: 'Emerald cruise waters, Ba Na Hills Golden Bridge, lantern streets, and ancient heritage.',
        price: '₹28,400',
        priceLabel: 'Starting from',
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        packageId: 'viet-hanoi-danang-6d'
      },
      {
        id: 'himachal-family',
        category: 'INDIA',
        duration: '6 DAYS',
        title: 'Himachal — Shimla · Manali · Solang Valley',
        desc: 'Snow adventure sports, pine forests, mall road strolls and crisp mountain air.',
        price: '₹21,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        packageId: 'him-1'
      }
    ]
  },
  {
    id: 'beaches',
    eyebrow: 'SUN AND SALT',
    title: 'Beach escapes.',
    subtitle: 'Long shorelines, island adventures and the kind of sunsets worth travelling for.',
    linkText: 'View all beach escapes →',
    items: [
      {
        id: 'bali-beach',
        category: 'INTERNATIONAL',
        duration: '6 DAYS',
        title: 'Bali — Ubud · Nusa Penida · Seminyak',
        desc: 'Tropical stays, cliff-view sunsets, golden beaches and slow island mornings.',
        price: '₹38,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        packageId: 'bali-1'
      },
      {
        id: 'kerala-beach',
        category: 'INDIA',
        duration: '5 DAYS',
        title: 'Kerala — Munnar · Thekkady · Alleppey',
        desc: 'Tea hills, private drives, sunset beach shacks and unhurried backwaters.',
        price: '₹22,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        packageId: 'ker-1'
      },
      {
        id: 'andaman-beach',
        category: 'INDIA',
        duration: '6 DAYS',
        title: 'Andaman — Port Blair · Havelock · Neil',
        desc: 'Clear emerald water, private ferry journeys, scuba coral reefs and peaceful beaches.',
        price: '₹29,999',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        packageId: 'and-1'
      },
      {
        id: 'thailand-beach',
        category: 'INTERNATIONAL',
        duration: '6 DAYS',
        title: 'Thailand — Phuket · Krabi · Island escape',
        desc: 'Limestone coves, speedboat hops, vibrant beach markets and easy island days.',
        price: '₹34,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
        packageId: 'thai-1'
      },
      {
        id: 'goa-beach',
        category: 'INDIA',
        duration: '4-5 DAYS',
        title: 'Goa — North & South Luxury Beach Retreat',
        desc: 'Sun-drenched golden sands, Portuguese heritage villas and private catamaran cruises.',
        price: '₹18,500',
        priceLabel: 'Price on Request',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        packageId: 'goa-1'
      },
      {
        id: 'thailand-beach',
        category: 'INTERNATIONAL',
        duration: '5 DAYS',
        title: 'Thailand — Phuket · Phi Phi Speedboat · Krabi',
        desc: 'Emerald Andaman seas, limestone lagoons, speedboat island hopping and sunset beach clubs.',
        price: '₹22,800',
        priceLabel: 'Starting from',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
        packageId: 'thai-phuket-krabi-5d'
      }
    ]
  }
];

function EscapeRow({ section, onSelectPackage, onOpenOfferModal }) {
  const { packages: PACKAGES } = usePackages();
  const rowScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (rowScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (dir) => {
    if (rowScrollRef.current) {
      const scrollDist = 310;
      rowScrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollDist : scrollDist,
        behavior: 'smooth'
      });
      setTimeout(updateScrollState, 350);
    }
  };

  const handleCardClick = (item) => {
    let pkg = PACKAGES.find((p) => p.id === item.packageId);
    if (!pkg) {
      // Fallback matching by destination
      const destKey = item.id.split('-')[0].toLowerCase();
      pkg = PACKAGES.find((p) => 
        p.destinationId.toLowerCase() === destKey || 
        p.destinationName.toLowerCase().includes(destKey)
      );
    }
    if (pkg && onSelectPackage) {
      onSelectPackage(pkg);
    } else if (onOpenOfferModal) {
      onOpenOfferModal(item.title);
    }
  };

  return (
    <div className="theme-escape-row-block">
      <div className="container">
        {/* Section Header */}
        <div className="escape-row-header">
          <div className="escape-header-left">
            <span className="escape-eyebrow">{section.eyebrow}</span>
            <h2 className="escape-main-title">{section.title}</h2>
            <p className="escape-sub-text">{section.subtitle}</p>
          </div>

          <div className="escape-header-right">
            <button 
              className="escape-view-all-link"
              onClick={() => onOpenOfferModal ? onOpenOfferModal(section.title.replace('.', '')) : null}
              title={`Inquire about all ${section.title.replace('.', '')} packages`}
            >
              <span>{section.linkText}</span>
            </button>
          </div>
        </div>

        {/* Carousel Cards Track with Left & Right Side Arrows */}
        <div className="escape-carousel-relative-wrapper">
          <button 
            className={`escape-side-btn side-btn-left ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            aria-label="Previous escapes"
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            className="escape-carousel-viewport" 
            ref={rowScrollRef}
            onScroll={updateScrollState}
          >
          <div className="escape-carousel-track">
            {section.items.map((item) => (
              <div 
                key={item.id} 
                className="escape-card-item"
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(item);
                  }
                }}
              >
                {/* Photo & Badge */}
                <div className="escape-card-photo-box">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="escape-card-img" 
                    loading="lazy" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="escape-duration-badge">
                    <Calendar size={11} className="badge-cal-icon" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="escape-card-body">
                  <span className="escape-region-tag">{item.category}</span>
                  <h3 className="escape-card-title">{item.title}</h3>
                  <p className="escape-card-desc">{item.desc}</p>

                  <div className="escape-card-footer">
                    <span className="per-person-label">PER PERSON</span>
                    <span className="price-on-request">{item.priceLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className={`escape-side-btn side-btn-right ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => handleScroll('right')}
          aria-label="Next escapes"
          disabled={!canScrollRight}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  </div>
);
}

export default function ThemeEscapes({ onSelectPackage, onOpenOfferModal }) {
  return (
    <section className="theme-escapes-wrapper-section" id="curated-escapes">
      {ESCAPE_SECTIONS.map((section) => (
        <EscapeRow 
          key={section.id} 
          section={section} 
          onSelectPackage={onSelectPackage}
          onOpenOfferModal={onOpenOfferModal}
        />
      ))}

      <style>{`
        .theme-escapes-wrapper-section {
          background-color: #fefce8;
          padding: 36px 0 42px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .theme-escape-row-block {
          position: relative;
        }

        .escape-carousel-relative-wrapper {
          position: relative;
        }

        .escape-side-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 25;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          color: #102a43;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .escape-side-btn.side-btn-left {
          left: -22px;
        }

        .escape-side-btn.side-btn-right {
          right: -22px;
        }

        .escape-side-btn:hover:not(.disabled) {
          background: #102a43;
          color: #ffffff;
          border-color: #102a43;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .escape-side-btn.disabled {
          opacity: 0.25;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 1024px) {
          .escape-side-btn.side-btn-left { left: 4px; }
          .escape-side-btn.side-btn-right { right: 4px; }
        }

        .escape-row-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 24px;
        }

        .escape-header-left {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .escape-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #71717a;
          margin-bottom: 6px;
        }

        .escape-main-title {
          font-family: var(--font-sans), 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: clamp(28px, 3.6vw, 42px);
          font-weight: 800;
          color: #18181b;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }

        .escape-sub-text {
          font-size: 14.5px;
          color: #52525b;
          max-width: 650px;
          line-height: 1.5;
        }

        .escape-header-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .escape-view-all-link {
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #18181b;
          cursor: pointer;
          padding: 4px 0;
          border-bottom: 1.5px solid rgba(24, 24, 27, 0.4);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .escape-view-all-link:hover {
          color: #d97706;
          border-bottom-color: #d97706;
        }

        .escape-mini-arrows {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mini-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #d9e2ec;
          color: #102a43;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mini-arrow-btn:hover:not(.disabled) {
          background: #102a43;
          color: #ffffff;
          border-color: #102a43;
        }

        .mini-arrow-btn.disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Carousel Scroll Viewport */
        .escape-carousel-viewport {
          width: 100%;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          padding: 4px 2px 20px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .escape-carousel-viewport::-webkit-scrollbar {
          display: none;
        }

        .escape-carousel-track {
          display: flex;
          gap: 20px;
          width: max-content;
        }

        /* Single Escape Card */
        .escape-card-item {
          flex: 0 0 280px;
          width: 280px;
          scroll-snap-align: start;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e4e7eb;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .escape-card-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(16, 42, 67, 0.1);
        }

        .escape-card-photo-box {
          position: relative;
          width: 100%;
          height: 185px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .escape-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .escape-card-item:hover .escape-card-img {
          transform: scale(1.06);
        }

        .escape-duration-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(16, 42, 67, 0.9);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .badge-cal-icon {
          opacity: 0.85;
        }

        .escape-card-body {
          padding: 18px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: left;
        }

        .escape-region-tag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9c4221;
          margin-bottom: 6px;
        }

        .escape-card-title {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 700;
          color: #102a43;
          line-height: 1.35;
          margin-bottom: 6px;
        }

        .escape-card-desc {
          font-size: 12px;
          color: #627d98;
          line-height: 1.45;
          margin-bottom: 18px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .escape-card-footer {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f0f4f8;
        }

        .per-person-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #829ab1;
          text-transform: uppercase;
        }

        .price-on-request {
          font-family: var(--font-serif-italic);
          font-size: 14.5px;
          color: #9c4221;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .theme-escapes-wrapper-section {
            padding: 45px 0 50px;
            gap: 40px;
          }
          .escape-row-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
          }
          .escape-main-title {
            font-size: clamp(26px, 6vw, 34px);
          }
          .escape-sub-text {
            font-size: 13px;
          }
          .escape-header-right {
            width: 100%;
            justify-content: space-between;
          }
          .escape-card-item {
            flex: 0 0 250px;
            width: 250px;
          }
          .escape-card-photo-box {
            height: 160px;
          }
          .escape-card-body {
            padding: 14px 12px;
          }
        }

        @media (max-width: 480px) {
          .escape-card-item {
            flex: 0 0 235px;
            width: 235px;
          }
          .escape-card-title {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
