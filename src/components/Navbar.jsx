import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Plane } from 'lucide-react';

export default function Navbar({ onOpenOfferModal, onOpenAdminModal, onNavigate, currentView = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    if (target === 'home') {
      if (onNavigate) onNavigate('home');
      else window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'desh') {
      if (onNavigate) onNavigate('desh');
      else window.location.hash = '#desh';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'videsh') {
      if (onNavigate) onNavigate('videsh');
      else window.location.hash = '#videsh';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'about') {
      if (onNavigate) onNavigate('about');
      else window.location.hash = '#about';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'contact') {
      if (onNavigate) onNavigate('contact');
      else window.location.hash = '#contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''} ${currentView !== 'home' ? 'solid-header' : ''}`}>
      <div className="container">
        <nav className="navbar-content">
          {/* Left: Brand Logo */}
          <div className="nav-zone-left">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNav('home'); }}
              className="nav-logo"
            >
              <img 
                src="/samyati-logo.png" 
                alt="Samyati The World" 
                className="brand-logo-img" 
              />
            </a>
          </div>

          {/* Center: Simple Navigation Links Pill (Desktop) */}
          <div className="nav-zone-center hidden-mobile">
            <div className="nav-center-links">
              <button
                onClick={() => handleNav('home')}
                className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNav('about')}
                className={`nav-link-btn ${currentView === 'about' ? 'active' : ''}`}
              >
                About
              </button>
              <button
                onClick={() => handleNav('contact')}
                className={`nav-link-btn ${currentView === 'contact' ? 'active' : ''}`}
              >
                Contact Us
              </button>
              <button
                onClick={() => handleNav('desh')}
                className={`nav-link-btn ${currentView === 'desh' ? 'active' : ''}`}
              >
                Desh
              </button>
              <button
                onClick={() => handleNav('videsh')}
                className={`nav-link-btn ${currentView === 'videsh' ? 'active' : ''}`}
              >
                Videsh
              </button>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="nav-zone-right">
            <button
              onClick={() => onOpenOfferModal()}
              className="btn-pill btn-pill-white nav-cta"
            >
              <span>Get Your Offer</span>
              <span className="btn-badge-icon">
                <ArrowUpRight size={16} />
              </span>
            </button>

            {/* Hamburger Toggle (Mobile Only) */}
            <button
              className="mobile-hamburger-btn show-mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer (Fixed Root Level) */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNav('home'); setMobileMenuOpen(false); }}
                className="nav-logo"
              >
                <img 
                  src="/samyati-logo.png" 
                  alt="Samyati The World" 
                  className="brand-logo-img-drawer" 
                />
              </a>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <ul className="mobile-menu-links">
              <li>
                <button onClick={() => handleNav('home')} className={`mobile-nav-link ${currentView === 'home' ? 'active' : ''}`}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className={`mobile-nav-link ${currentView === 'about' ? 'active' : ''}`}>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className={`mobile-nav-link ${currentView === 'contact' ? 'active' : ''}`}>
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('desh')} className={`mobile-nav-link ${currentView === 'desh' ? 'active' : ''}`}>
                  Desh (Domestic Tours)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('videsh')} className={`mobile-nav-link ${currentView === 'videsh' ? 'active' : ''}`}>
                  Videsh (International Tours)
                </button>
              </li>
            </ul>

            <div className="mobile-menu-footer">
              <button
                className="btn-pill btn-pill-dark w-full"
                onClick={() => { setMobileMenuOpen(false); onOpenOfferModal(); }}
              >
                <span>Get Your Offer</span>
                <span className="btn-badge-icon">
                  <ArrowUpRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding-top: 16px;
          padding-bottom: 14px;
          background: transparent;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-wrapper.scrolled,
        .navbar-wrapper.solid-header {
          padding-top: 10px;
          padding-bottom: 10px;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }

        .nav-zone-left {
          display: flex;
          align-items: center;
        }

        .nav-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }

        .brand-logo-img {
          height: 48px;
          width: auto;
          max-width: 180px;
          object-fit: contain;
          transition: transform 0.25s ease;
          display: block;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.18));
        }

        .brand-logo-img:hover {
          transform: scale(1.04);
        }

        .brand-logo-img-drawer {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        /* Luxury Light Glassmorphism Center Navigation Capsule */
        .nav-center-links {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          padding: 5px 6px;
          border-radius: 9999px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: #334155;
          font-size: 13.5px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
        }

        .nav-link-btn:hover {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.06);
        }

        .nav-link-btn.active {
          color: #ffffff;
          background: #0f172a;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
          font-weight: 700;
        }

        .nav-zone-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-link-btn {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .admin-link-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .nav-cta {
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .mobile-hamburger-btn {
          display: none;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 9999px;
          cursor: pointer;
        }

        /* Mobile Drawer */
        .mobile-menu-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(15, 23, 42, 0.78) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          z-index: 999999 !important;
          display: flex !important;
          justify-content: flex-end !important;
          animation: fadeInOverlay 0.25s ease forwards;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-menu-drawer {
          width: 320px !important;
          max-width: 85vw !important;
          height: 100vh !important;
          background: #ffffff !important;
          padding: 28px 24px !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.4) !important;
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative !important;
          z-index: 1000000 !important;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .mobile-menu-header .logo-text {
          font-family: var(--font-serif-italic);
          font-size: 28px;
          color: var(--text-dark);
        }

        .drawer-subtag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #ca8a04;
          margin-top: 2px;
        }

        .close-btn {
          background: #f8fafc;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          color: var(--text-dark);
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #e2e8f0;
        }

        .mobile-menu-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .mobile-nav-link {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: var(--text-dark);
          font-size: 15px;
          font-weight: 600;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: #18181b;
          background: #f8fafc;
          font-weight: 700;
        }

        .mobile-nav-link.active {
          border-left: 3px solid #f43f5e;
          background: #fff1f2;
          color: #e11d48;
        }

        .mobile-menu-footer {
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .w-full {
          width: 100%;
          justify-content: space-between;
        }

        .show-mobile-only { display: none; }

        @media (max-width: 900px) {
          .navbar-wrapper { padding-top: 12px; padding-bottom: 12px; }
          .hidden-mobile { display: none !important; }
          .show-mobile-only { display: inline-flex !important; }
          .hidden-sm { display: none !important; }
        }

        @media (max-width: 768px) {
          .nav-cta { display: none !important; }
        }

        @media (max-width: 480px) {
          .nav-logo .logo-text {
            font-size: 22px;
          }
          .logo-subtag {
            font-size: 8px;
          }
          .mobile-hamburger-btn {
            padding: 8px 12px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.12);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </header>
  );
}

