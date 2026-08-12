import React, { useState } from 'react';
import { ArrowUpRight, Menu, X, Plane } from 'lucide-react';

export default function Navbar({ onOpenOfferModal, onOpenAdminModal, onNavigate, currentView = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      if (currentView !== 'home' && onNavigate) {
        onNavigate('home');
      }
      setTimeout(() => {
        const el = document.getElementById('story') || document.getElementById('process');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (target === 'contact') {
      if (onOpenOfferModal) onOpenOfferModal();
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar-content">
          {/* Left: Brand Logo */}
          <div className="nav-zone-left">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
              className="nav-logo"
            >
              <span className="logo-text">Samyati</span>
              <div className="logo-accent-plane">
                <Plane size={14} className="plane-icon" />
              </div>
              <span className="logo-subtag">THE WORLD</span>
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
              <button 
                onClick={() => handleNav('about')} 
                className="nav-link-btn"
              >
                About
              </button>
              <button 
                onClick={() => handleNav('contact')} 
                className="nav-link-btn"
              >
                Contact
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

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <div>
                  <span className="logo-text">Samyati</span>
                  <p className="drawer-subtag">THE WORLD</p>
                </div>
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
                  <button onClick={() => handleNav('desh')} className={`mobile-nav-link ${currentView === 'desh' ? 'active' : ''}`}>
                    Desh (Domestic Tours)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('videsh')} className={`mobile-nav-link ${currentView === 'videsh' ? 'active' : ''}`}>
                    Videsh (International Tours)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('about')} className="mobile-nav-link">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('contact')} className="mobile-nav-link">
                    Contact & Planning
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
      </div>

      <style>{`
        .navbar-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding-top: 20px;
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
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          text-decoration: none;
          color: #ffffff;
        }

        .nav-logo .logo-text {
          font-family: var(--font-serif-italic);
          font-size: 34px;
          font-weight: 700;
          line-height: 1;
        }

        .logo-accent-plane {
          position: absolute;
          top: -2px;
          right: -12px;
          color: #f97316;
          transform: rotate(25deg);
        }

        .logo-subtag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #fbe09b;
          margin-top: 1px;
        }

        /* Center Navigation Pill Bar */
        .nav-center-links {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 5px 8px;
          border-radius: 9999px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
        }

        .nav-link-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.18);
        }

        .nav-link-btn.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.28);
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
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-menu-drawer {
          width: 300px;
          max-width: 85vw;
          height: 100%;
          background: #ffffff;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 24px rgba(0,0,0,0.2);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
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
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          color: var(--text-dark);
        }

        .mobile-menu-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .mobile-nav-link {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: var(--text-dark);
          font-size: 16px;
          font-weight: 600;
          padding: 8px 0;
          cursor: pointer;
          transition: color 0.2s;
        }

        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: #f43f5e;
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
          .hidden-mobile { display: none; }
          .show-mobile-only { display: inline-flex; }
          .hidden-sm { display: none; }
        }
      `}</style>
    </header>
  );
}

