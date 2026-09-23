import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TourCategories from './components/TourCategories';
import PromiseSection from './components/PromiseSection';
import FeaturedTours from './components/FeaturedTours';
import ThemeEscapes from './components/ThemeEscapes';
import LocationMarquee from './components/LocationMarquee';
import TopDestinations from './components/TopDestinations';
import ProcessSection from './components/ProcessSection';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FounderStorySection from './components/FounderStorySection';
import WorldCTA from './components/WorldCTA';
import NewsletterBand from './components/NewsletterBand';
import Footer from './components/Footer';

import DeshPage from './components/DeshPage';
import VideshPage from './components/VideshPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import DestinationDetailPage from './components/DestinationDetailPage';
import PackageDetailPage from './components/PackageDetailPage';

import OfferModal from './components/OfferModal';
import { PrivacyModal, TermsModal } from './components/LegalModals';
import ScrollToTopButton from './components/ScrollToTopButton';
import { initSmoothScroll, scrollTo } from './smoothScroll';
import { initScrollReveal } from './utils/scrollReveal';

import { PackageProvider, usePackages } from './context/PackageContext';
import SuperAdminPortal from './components/SuperAdmin/SuperAdminPortal';
import { isSecretAdminUrl, ADMIN_SECRET_SLUG } from './config/adminConfig';

function MainApp() {
  const { packages: PACKAGES } = usePackages();

  // Current view: 'home' | 'about' | 'contact' | 'desh' | 'videsh' | 'super-admin'
  const [currentView, setCurrentView] = useState(() => {
    return isSecretAdminUrl() ? 'super-admin' : 'home';
  });
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerInitialDest, setOfferInitialDest] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Initialize Lenis smooth scroll & section reveal animations on mount
  useEffect(() => {
    const cleanupLenis = initSmoothScroll();
    const cleanupReveal = initScrollReveal();
    return () => {
      cleanupLenis();
      cleanupReveal();
    };
  }, []);

  // Hash & pathname router sync
  useEffect(() => {
    const handleLocationChange = () => {
      if (isSecretAdminUrl()) {
        setCurrentView('super-admin');
        return;
      }

      const rawHash = window.location.hash || '';
      const hash = rawHash.toLowerCase();

      // Check if hash points directly to a package (#package/:id, #package-:id, #pkg-:id)
      if (hash.startsWith('#package/') || hash.startsWith('#package-') || hash.startsWith('#pkg-') || hash.startsWith('#package?')) {
        const pkgId = rawHash.replace(/^#(?:package[\/-]|pkg[\/-]|package\?id=)/i, '').trim();
        const found = (PACKAGES || []).find(p => 
          p.id.toLowerCase() === pkgId.toLowerCase() ||
          p.id.toLowerCase() === decodeURIComponent(pkgId).toLowerCase() ||
          (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === pkgId.toLowerCase())
        );
        if (found) {
          setSelectedPackage(found);
          scrollTo(0, { immediate: true });
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          return;
        }
      }

      if (hash === '#desh') {
        setCurrentView('desh');
        setSelectedPackage(null);
      } else if (hash === '#videsh') {
        setCurrentView('videsh');
        setSelectedPackage(null);
      } else if (hash === '#about') {
        setCurrentView('about');
        setSelectedPackage(null);
      } else if (hash === '#contact') {
        setCurrentView('contact');
        setSelectedPackage(null);
      } else {
        setCurrentView('home');
        if (!hash.startsWith('#package') && !hash.startsWith('#pkg')) {
          setSelectedPackage(null);
        }
      }
      scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [PACKAGES]);

  const handleSelectPackage = (pkg) => {
    if (!pkg) return;
    setSelectedPackage(pkg);
    if (pkg.id) {
      window.location.hash = `#package/${pkg.id}`;
    }
    scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSelectedDestination(null);
    setSelectedPackage(null);
    if (view === 'super-admin') {
      window.location.hash = `#${ADMIN_SECRET_SLUG}`;
    } else {
      window.location.hash = view === 'home' ? '' : view;
      if (window.location.pathname.includes(ADMIN_SECRET_SLUG)) {
        window.history.pushState(null, '', '/');
      }
    }
    scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleOpenOfferModal = (destName = '') => {
    setOfferInitialDest(destName);
    setIsOfferModalOpen(true);
  };

  // 0. Hidden Super Admin Portal View (Accessible ONLY via secret slug URL)
  if (currentView === 'super-admin') {
    return (
      <SuperAdminPortal
        onNavigateToSite={() => handleNavigate('home')}
      />
    );
  }

  // 1. Dedicated Package Detail Page View (Highest Priority when package selected)
  if (selectedPackage) {
    return (
      <div className="travelio-app samyati-app">
        <Navbar
          onOpenOfferModal={handleOpenOfferModal}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        <PackageDetailPage
          packageData={selectedPackage}
          onBack={() => {
            setSelectedPackage(null);
            if (window.location.hash.startsWith('#package') || window.location.hash.startsWith('#pkg')) {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
          onOpenOfferModal={handleOpenOfferModal}
        />

        <NewsletterBand />

        <Footer
          onOpenOfferModal={handleOpenOfferModal}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Interactive Modals */}
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          initialDestination={offerInitialDest}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    );
  }

  // 2. Dedicated Desh Page View
  if (currentView === 'desh') {
    return (
      <div className="travelio-app samyati-app">
        <Navbar
          onOpenOfferModal={handleOpenOfferModal}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        {selectedDestination ? (
          <DestinationDetailPage
            destination={selectedDestination}
            onBack={() => setSelectedDestination(null)}
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />
        ) : (
          <DeshPage
            onBack={() => handleNavigate('home')}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />
        )}

        <NewsletterBand />

        <Footer
          onOpenOfferModal={handleOpenOfferModal}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Interactive Modals */}
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          initialDestination={offerInitialDest}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    );
  }

  // 3. Dedicated Videsh Page View
  if (currentView === 'videsh') {
    return (
      <div className="travelio-app samyati-app">
        <Navbar
          onOpenOfferModal={handleOpenOfferModal}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        {selectedDestination ? (
          <DestinationDetailPage
            destination={selectedDestination}
            onBack={() => setSelectedDestination(null)}
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />
        ) : (
          <VideshPage
            onBack={() => handleNavigate('home')}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />
        )}

        <NewsletterBand />

        <Footer
          onOpenOfferModal={handleOpenOfferModal}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Interactive Modals */}
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          initialDestination={offerInitialDest}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    );
  }

  // 4. Dedicated About Page View
  if (currentView === 'about') {
    return (
      <div className="travelio-app samyati-app">
        <Navbar
          onOpenOfferModal={handleOpenOfferModal}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        <AboutPage
          onBack={() => handleNavigate('home')}
          onOpenOfferModal={handleOpenOfferModal}
        />

        <NewsletterBand />

        <Footer
          onOpenOfferModal={handleOpenOfferModal}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
        />

        {/* Interactive Modals */}
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          initialDestination={offerInitialDest}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    );
  }

  // 5. Dedicated Contact Us Page View
  if (currentView === 'contact') {
    return (
      <div className="travelio-app samyati-app">
        <Navbar
          onOpenOfferModal={handleOpenOfferModal}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        <ContactPage
          onBack={() => handleNavigate('home')}
          onOpenOfferModal={handleOpenOfferModal}
        />

        <NewsletterBand />

        <Footer
          onOpenOfferModal={handleOpenOfferModal}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Interactive Modals */}
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          initialDestination={offerInitialDest}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    );
  }

  // 6. Main Landing Page View
  return (
    <div className="travelio-app samyati-app">
      <Navbar
        onOpenOfferModal={handleOpenOfferModal}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {selectedDestination ? (
        <DestinationDetailPage
          destination={selectedDestination}
          onBack={() => setSelectedDestination(null)}
          onSelectPackage={handleSelectPackage}
          onOpenOfferModal={handleOpenOfferModal}
        />
      ) : (
        <>
          <HeroSection
            onOpenOfferModal={handleOpenOfferModal}
            onSelectDestination={(dest) => {
              setSelectedDestination(dest);
              scrollTo(0, { immediate: true });
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onSelectPackage={handleSelectPackage}
          />

          <TourCategories
            onSelectCategory={(view) => handleNavigate(view)}
            onNavigate={(view) => handleNavigate(view)}
          />

          <PromiseSection
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />

          <FeaturedTours
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />

          <ThemeEscapes
            onSelectPackage={handleSelectPackage}
            onOpenOfferModal={handleOpenOfferModal}
          />

          <LocationMarquee />

          <TopDestinations
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectPackage={handleSelectPackage}
          />

          <ProcessSection />

          <StatsSection />

          <TestimonialsSection />

          <FounderStorySection onNavigate={handleNavigate} />

          <WorldCTA
            onOpenOfferModal={handleOpenOfferModal}
          />
        </>
      )}

      <NewsletterBand />

      <Footer
        onOpenOfferModal={handleOpenOfferModal}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Interactive Modals */}
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        initialDestination={offerInitialDest}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PackageProvider>
      <MainApp />
      <ScrollToTopButton />
    </PackageProvider>
  );
}
