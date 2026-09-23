import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Compass, ArrowRight, ShieldCheck, Sparkles, X, ChevronRight, MapPin } from 'lucide-react';
import { usePackages } from '../context/PackageContext';

export default function HeroSection({ onOpenOfferModal, onSelectDestination, onSelectPackage }) {
  const { packages: PACKAGES = [], destinations: DESTINATIONS = [] } = usePackages();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const cleanQ = searchQuery.trim().toLowerCase();

  // Matched Destinations
  const matchedDestinations = useMemo(() => {
    if (!cleanQ) return [];

    const cityMap = {
      'srinagar': 'kashmir', 'gulmarg': 'kashmir', 'pahalgam': 'kashmir', 'sonamarg': 'kashmir', 'dal lake': 'kashmir',
      'manali': 'himachal', 'shimla': 'himachal', 'dharamshala': 'himachal', 'kasol': 'himachal', 'spiti': 'himachal',
      'munnar': 'kerala', 'alleppey': 'kerala', 'kochi': 'kerala', 'thekkady': 'kerala', 'kovalam': 'kerala', 'wayanad': 'kerala',
      'calangute': 'goa', 'baga': 'goa', 'panaji': 'goa', 'dudhsagar': 'goa', 'anjuna': 'goa',
      'jaipur': 'rajasthan', 'udaipur': 'rajasthan', 'jodhpur': 'rajasthan', 'jaisalmer': 'rajasthan', 'pushkar': 'rajasthan',
      'havelock': 'andaman', 'port blair': 'andaman', 'neil': 'andaman', 'radhanagar': 'andaman',
      'leh': 'ladakh', 'nubra': 'ladakh', 'pangong': 'ladakh', 'khardung la': 'ladakh',
      'varanasi': 'uttar-pradesh', 'kashi': 'uttar-pradesh', 'ayodhya': 'uttar-pradesh', 'mathura': 'uttar-pradesh', 'vrindavan': 'uttar-pradesh',
      'shillong': 'northeast', 'cherrapunji': 'northeast', 'kaziranga': 'northeast', 'tawang': 'northeast', 'gangtok': 'northeast', 'darjeeling': 'northeast',
      'ubud': 'bali', 'kuta': 'bali', 'seminyak': 'bali', 'nusa penida': 'bali',
      'hanoi': 'vietnam', 'halong': 'vietnam', 'da nang': 'vietnam', 'hoi an': 'vietnam',
      'sentosa': 'singapore', 'marina bay': 'singapore',
      'almaty': 'kazakhstan', 'shymbulak': 'kazakhstan',
      'kuala lumpur': 'malaysia', 'genting': 'malaysia', 'langkawi': 'malaysia',
      'burj khalifa': 'dubai', 'abu dhabi': 'dubai',
      'bangkok': 'thailand', 'pattaya': 'thailand', 'phuket': 'thailand', 'krabi': 'thailand',
      'colombo': 'srilanka', 'kandy': 'srilanka', 'bentota': 'srilanka', 'sigiriya': 'srilanka', 'galle': 'srilanka',
      'tashkent': 'uzbekistan', 'samarkand': 'uzbekistan', 'bukhara': 'uzbekistan',
      'tbilisi': 'georgia', 'kazbegi': 'georgia', 'batumi': 'georgia'
    };

    const destIdFromCity = cityMap[cleanQ] || Object.entries(cityMap).find(([city]) => cleanQ.includes(city))?.[1];

    return (DESTINATIONS || []).filter(d => {
      const name = (d.name || '').toLowerCase();
      const id = (d.id || '').toLowerCase();
      const tagline = (d.tagline || '').toLowerCase();
      const desc = (d.description || '').toLowerCase();
      const cat = (d.category || '').toLowerCase();

      return (
        name.includes(cleanQ) ||
        id.includes(cleanQ) ||
        (destIdFromCity && id === destIdFromCity) ||
        tagline.includes(cleanQ) ||
        desc.includes(cleanQ) ||
        cat.includes(cleanQ)
      );
    }).slice(0, 4);
  }, [DESTINATIONS, cleanQ]);

  // Matched Packages
  const matchedPackages = useMemo(() => {
    if (!cleanQ) return [];
    return (PACKAGES || []).filter(p => {
      const title = (p.title || '').toLowerCase();
      const destName = (p.destinationName || '').toLowerCase();
      const destId = (p.destinationId || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const duration = (p.duration || '').toLowerCase();

      return (
        title.includes(cleanQ) ||
        destName.includes(cleanQ) ||
        destId.includes(cleanQ) ||
        desc.includes(cleanQ) ||
        cat.includes(cleanQ) ||
        duration.includes(cleanQ)
      );
    }).slice(0, 5);
  }, [PACKAGES, cleanQ]);

  const hasResults = matchedDestinations.length > 0 || matchedPackages.length > 0;

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleSelectDestItem = (dest) => {
    setIsDropdownOpen(false);
    setSearchQuery(dest.name);
    if (onSelectDestination) {
      onSelectDestination(dest);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleSelectPkgItem = (pkg) => {
    setIsDropdownOpen(false);
    setSearchQuery(pkg.title);
    if (onSelectPackage) {
      onSelectPackage(pkg);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!cleanQ) {
      if (onOpenOfferModal) onOpenOfferModal('Custom Trip');
      return;
    }

    // 1. If direct destination match
    if (matchedDestinations.length > 0) {
      handleSelectDestItem(matchedDestinations[0]);
      return;
    }

    // 2. If direct package match
    if (matchedPackages.length > 0) {
      handleSelectPkgItem(matchedPackages[0]);
      return;
    }

    // 3. Fallback to offer modal
    setIsDropdownOpen(false);
    if (onOpenOfferModal) {
      onOpenOfferModal(searchQuery.trim());
    }
  };

  return (
    <section className="hero-combined-section">
      {/* Translucent Soft Vignette Overlay */}
      <div className="hero-combined-overlay" />

      <div className="container hero-combined-container">
        <div className="hero-combined-split">
          {/* Left Column: Professionally Aligned Headline, Subhead, Search & Badges */}
          <div className="hero-combined-left">
            {/* Headline H1 with Staggered Word Reveal */}
            <h1 className="hero-combined-title">
              <span className="title-word-mask line-1">
                <span className="reveal-word word-1">Rediscover</span>{' '}
                <span className="reveal-word word-2">Yourself</span>
              </span>{' '}
              <span className="title-word-mask line-2">
                <span className="reveal-word word-3">With</span>{' '}
                <span className="reveal-word word-4">Every</span>{' '}
                <span className="reveal-word word-5 title-gold-italic">Journey</span>
              </span>
            </h1>

            {/* Subhead Paragraph */}
            <p className="hero-combined-subhead">
              Handcrafted domestic & international journeys with luxury stays, smooth transfers, and 24/7 dedicated support.
            </p>

            {/* Quick Search Bar Pill with Live Interactive Autocomplete */}
            <div className="hero-search-outer-container" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="hero-combined-search-form">
                <div className="hero-combined-search-pill">
                  <div className="search-input-wrapper">
                    <Compass size={18} className="search-icon-left" />
                    <input
                      type="text"
                      placeholder="Search e.g. Kashmir, Bali, Dubai, Kerala, Goa..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim().length > 0) {
                          setIsDropdownOpen(true);
                        }
                      }}
                      className="search-input-field"
                    />
                    {searchQuery.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setIsDropdownOpen(false);
                        }}
                        className="search-clear-btn"
                        title="Clear search"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <button type="submit" className="search-submit-btn-dark">
                    <span>Search</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>

              {/* Live Search Autocomplete Dropdown */}
              {isDropdownOpen && cleanQ.length > 0 && (
                <div className="hero-search-dropdown" data-lenis-prevent="true">
                  {hasResults ? (
                    <>
                      {/* Matching Destinations */}
                      {matchedDestinations.length > 0 && (
                        <div className="search-dropdown-section">
                          <div className="search-section-label">
                            <MapPin size={12} className="text-amber-600" />
                            <span>Destinations ({matchedDestinations.length})</span>
                          </div>
                          <div className="search-items-list">
                            {matchedDestinations.map(dest => (
                              <div
                                key={dest.id}
                                className="search-dropdown-item dest-item"
                                onClick={() => handleSelectDestItem(dest)}
                              >
                                <div className="item-icon-col">
                                  {dest.image ? (
                                    <img src={dest.image} alt={dest.name} className="dest-mini-thumb" />
                                  ) : (
                                    <span className="dest-flag-emoji">{dest.flag || '🌍'}</span>
                                  )}
                                </div>
                                <div className="item-info-col">
                                  <div className="item-title-row">
                                    <span className="item-name">{dest.name}</span>
                                    <span className="item-badge">{dest.category}</span>
                                  </div>
                                  <span className="item-subtext">{dest.tagline || dest.description}</span>
                                </div>
                                <ChevronRight size={15} className="item-arrow" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Tour Packages */}
                      {matchedPackages.length > 0 && (
                        <div className="search-dropdown-section">
                          <div className="search-section-label">
                            <Sparkles size={12} className="text-amber-600" />
                            <span>Tour Packages ({matchedPackages.length})</span>
                          </div>
                          <div className="search-items-list">
                            {matchedPackages.map(pkg => (
                              <div
                                key={pkg.id}
                                className="search-dropdown-item pkg-item"
                                onClick={() => handleSelectPkgItem(pkg)}
                              >
                                <img src={pkg.image} alt={pkg.title} className="pkg-mini-thumb" />
                                <div className="item-info-col">
                                  <span className="item-name">{pkg.title}</span>
                                  <div className="pkg-meta-row">
                                    <span className="pkg-dest-tag">{pkg.destinationName || pkg.destinationId}</span>
                                    <span className="pkg-dur-tag">{pkg.duration}</span>
                                  </div>
                                </div>
                                <div className="pkg-price-col">
                                  <span className="pkg-price-num">{pkg.price}</span>
                                  <span className="pkg-price-sub">per person</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Custom Offer Footer */}
                      <div 
                        className="search-dropdown-footer"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (onOpenOfferModal) onOpenOfferModal(searchQuery);
                        }}
                      >
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Looking for something else? Get a customized quote for <strong>"{searchQuery}"</strong> →</span>
                      </div>
                    </>
                  ) : (
                    <div className="search-dropdown-empty">
                      <p className="empty-title">No direct catalog match for "{searchQuery}"</p>
                      <p className="empty-sub">Our travel consultants can customize this exact trip for you!</p>
                      <button
                        type="button"
                        className="btn-custom-quote-search"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (onOpenOfferModal) onOpenOfferModal(searchQuery);
                        }}
                      >
                        <Sparkles size={14} />
                        <span>Get Custom Itinerary & Quote for "{searchQuery}" →</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trust Badges Bar */}
            <div className="hero-combined-trust-bar">
              <div className="trust-item">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>100% Customized Trips</span>
              </div>
              <div className="trust-item">
                <Sparkles size={14} className="text-amber-300" />
                <span>14 Handpicked Destinations</span>
              </div>
              <div className="trust-item">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Dedicated Human Support</span>
              </div>
            </div>
          </div>


        </div>
      </div>

      <style>{`
        .hero-combined-section {
          position: relative;
          min-height: 700px;
          background-image: url('/hero-bright-mountain.jpg');
          background-size: cover;
          background-position: center 55%;
          display: flex;
          align-items: center;
          padding-top: 75px;
          padding-bottom: 85px;
          overflow: visible;
          z-index: 40;
        }

        .hero-combined-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 35% 35%, rgba(254, 243, 199, 0.15) 0%, rgba(0, 0, 0, 0) 70%),
            linear-gradient(90deg, rgba(16, 24, 34, 0.42) 0%, rgba(16, 24, 34, 0.18) 55%, rgba(0, 0, 0, 0) 100%),
            linear-gradient(180deg, rgba(16, 24, 34, 0.08) 0%, rgba(0, 0, 0, 0) 45%, rgba(16, 24, 34, 0.15) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .hero-combined-container {
          position: relative;
          z-index: 20;
          width: 100%;
        }

        .hero-combined-split {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          min-height: 480px;
        }

        .hero-combined-left {
          max-width: 1000px;
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-ai-badge-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border: 1.5px solid #d97706;
          border-radius: 9999px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-decoration: none;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(217, 119, 6, 0.35);
          transition: all 0.3s ease;
        }

        .hero-ai-badge-link:hover {
          background: #d97706;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(217, 119, 6, 0.5);
        }

        .hero-combined-title {
          font-size: clamp(38px, 5.2vw, 70px);
          line-height: 1.35;
          letter-spacing: 0.035em;
          word-spacing: 0.08em;
          margin-bottom: 20px;
        }

        .title-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 4px;
        }

        .reveal-word {
          display: inline-block;
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 800;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
          opacity: 0;
          transform: translateY(115%);
          animation: wordSlideUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        .word-1 { animation-delay: 0.1s; }
        .word-2 { animation-delay: 0.22s; }
        .word-3 { animation-delay: 0.36s; }
        .word-4 { animation-delay: 0.48s; }
        .word-5 {
          animation: wordSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.6s;
        }

        @keyframes wordSlideUp {
          0% {
            opacity: 0;
            transform: translateY(115%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title-gold-italic,
        .title-teal-italic {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 1.28em;
          color: #fef08a;
          margin-left: 0.15em;
          display: inline-block;
          vertical-align: baseline;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
        }

        .hero-combined-subhead {
          color: rgba(255, 255, 255, 0.94);
          font-size: clamp(16px, 1.85vw, 20px);
          font-weight: 400;
          line-height: 1.9;
          letter-spacing: 0.04em;
          word-spacing: 0.04em;
          max-width: 900px;
          width: 100%;
          margin-top: 8px;
          margin-bottom: 24px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        /* Search Form Pill */
        .hero-search-outer-container {
          position: relative;
          width: 100%;
          max-width: 680px;
          margin-top: 14px;
          margin-bottom: 28px;
          z-index: 60;
        }

        .hero-combined-search-form {
          width: 100%;
        }

        .hero-combined-search-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 9999px;
          padding: 5px 6px 5px 18px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.25s ease;
        }

        .hero-combined-search-pill:focus-within {
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.35), 0 0 0 3px rgba(217, 119, 6, 0.4);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .search-icon-left {
          color: #9ca3af;
        }

        .search-input-field {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
          font-family: var(--font-sans);
          color: #141613;
          background: transparent;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          cursor: pointer;
          border-radius: 50%;
          margin-right: 4px;
          transition: color 0.15s ease;
        }

        .search-clear-btn:hover {
          color: #0f172a;
        }

        .search-submit-btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 22px;
          border-radius: 9999px;
          background-color: #141613;
          color: #ffffff;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .search-submit-btn-dark:hover {
          background-color: #272a25;
          transform: translateY(-1px);
        }

        /* Autocomplete Dropdown */
        .hero-search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 
            0 28px 65px -10px rgba(15, 23, 42, 0.4), 
            0 12px 24px -4px rgba(0, 0, 0, 0.15), 
            0 0 0 1px rgba(226, 232, 240, 0.9);
          max-height: 400px;
          overflow-y: auto;
          overscroll-behavior: contain;
          z-index: 1000;
          animation: dropdownSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropdownSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-search-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .hero-search-dropdown::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .search-dropdown-section {
          padding: 10px 14px 6px;
          border-bottom: 1px solid #f1f5f9;
        }

        .search-section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          margin-bottom: 6px;
          padding-left: 6px;
        }

        .search-items-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .search-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .search-dropdown-item:hover {
          background: #f8fafc;
          transform: translateX(2px);
        }

        .dest-mini-thumb {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .dest-flag-emoji {
          font-size: 24px;
          line-height: 1;
        }

        .item-info-col {
          flex: 1;
          min-width: 0;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 9999px;
          background: #eff6ff;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .item-subtext {
          display: block;
          font-size: 11.5px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-arrow {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .pkg-mini-thumb {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .pkg-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .pkg-dest-tag {
          font-weight: 600;
          color: #b45309;
        }

        .pkg-dur-tag {
          background: #f1f5f9;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .pkg-price-col {
          text-align: right;
          flex-shrink: 0;
        }

        .pkg-price-num {
          display: block;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .pkg-price-sub {
          font-size: 10px;
          color: #94a3b8;
        }

        .search-dropdown-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          background: #f8fafc;
          font-size: 12.5px;
          color: #334155;
          cursor: pointer;
          border-top: 1px solid #f1f5f9;
          border-radius: 0 0 20px 20px;
          transition: background 0.15s ease;
        }

        .search-dropdown-footer:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .search-dropdown-empty {
          padding: 24px 20px;
          text-align: center;
          border-radius: 20px;
        }

        .empty-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .empty-sub {
          font-size: 12.5px;
          color: #64748b;
          margin-bottom: 14px;
        }

        .btn-custom-quote-search {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 9px 18px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-custom-quote-search:hover {
          background: #d97706;
          transform: translateY(-1px);
        }

        /* Trust Bar */
        .hero-combined-trust-bar {
          display: flex;
          align-items: center;
          gap: 28px;
          color: rgba(255, 255, 255, 0.92);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Right Callout Feature */
        .hero-combined-right-callout {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-bottom: 45px;
        }

        .callout-eyebrow-gold {
          color: #f59e0b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        .callout-gold-bar-box {
          border-left: 2px solid #f59e0b;
          padding-left: 16px;
        }

        .callout-title-text {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 500;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        @media (max-width: 990px) {
          .hero-combined-split {
            flex-direction: column;
            align-items: flex-start;
            gap: 32px;
            min-height: auto;
            transform: none;
          }
          .hero-combined-right-callout {
            align-self: flex-start;
            padding-bottom: 0;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .hero-combined-section {
            min-height: 85vh;
            padding-top: 55px;
            padding-bottom: 130px;
            background-position: center 50%;
          }
          .hero-combined-left {
            transform: translateY(0px);
          }
          .hero-combined-title {
            font-size: clamp(32px, 8.2vw, 44px);
            margin-bottom: 22px;
            line-height: 1.25;
            letter-spacing: 0.01em;
          }
          .hero-combined-subhead {
            font-size: 14.5px;
            margin-bottom: 28px;
            line-height: 1.75;
            letter-spacing: 0.02em;
          }
          .hero-search-outer-container {
            max-width: 100%;
            margin-bottom: 24px;
          }
          .hero-combined-search-form {
            max-width: 100%;
            margin-bottom: 0;
          }
          .hero-search-dropdown {
            max-height: 300px;
          }
          .hero-combined-search-pill {
            flex-direction: row;
            padding: 4px 5px 4px 14px;
            border-radius: 9999px;
            gap: 6px;
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          .search-input-wrapper {
            width: auto;
            flex: 1;
            padding: 4px 0;
            gap: 8px;
          }
          .search-icon-left {
            width: 16px;
            height: 16px;
          }
          .search-input-field {
            font-size: 12.5px;
          }
          .search-submit-btn-dark {
            width: auto;
            padding: 9px 15px;
            border-radius: 9999px;
            font-size: 12.5px;
            font-weight: 800;
            background: #0f172a;
            white-space: nowrap;
          }
          .hero-combined-trust-bar {
            gap: 10px 16px;
            font-size: 12px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
}
