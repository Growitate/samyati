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
import AdminPanelModal from './components/AdminPanelModal';
import { PrivacyModal, TermsModal } from './components/LegalModals';

export default function App() {
  // Current view: 'home' | 'about' | 'contact' | 'desh' | 'videsh'
  const [currentView, setCurrentView] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerInitialDest, setOfferInitialDest] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Hash router sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#desh') {
        setCurrentView('desh');
      } else if (hash === '#videsh') {
        setCurrentView('videsh');
      } else if (hash === '#about') {
        setCurrentView('about');
      } else if (hash === '#contact') {
        setCurrentView('contact');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSelectedDestination(null);
    setSelectedPackage(null);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo(0, 0);
  };

  const handleOpenOfferModal = (destName = '') => {
    setOfferInitialDest(destName);
    setIsOfferModalOpen(true);
  };

  // 1. Dedicated Package Detail Page View (Highest Priority when package selected)
  if (selectedPackage) {
    return (
      <div className="travelio-app samyati-app">
        <Navbar
          onOpenOfferModal={handleOpenOfferModal}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        <PackageDetailPage
          packageData={selectedPackage}
          onBack={() => setSelectedPackage(null)}
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

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
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
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        {selectedDestination ? (
          <DestinationDetailPage
            destination={selectedDestination}
            onBack={() => setSelectedDestination(null)}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
            onOpenOfferModal={handleOpenOfferModal}
          />
        ) : (
          <DeshPage
            onBack={() => handleNavigate('home')}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
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

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
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
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        {selectedDestination ? (
          <DestinationDetailPage
            destination={selectedDestination}
            onBack={() => setSelectedDestination(null)}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
            onOpenOfferModal={handleOpenOfferModal}
          />
        ) : (
          <VideshPage
            onBack={() => handleNavigate('home')}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
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

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
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
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
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

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
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
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
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

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
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
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {selectedDestination ? (
        <DestinationDetailPage
          destination={selectedDestination}
          onBack={() => setSelectedDestination(null)}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          onOpenOfferModal={handleOpenOfferModal}
        />
      ) : (
        <>
          <HeroSection
            onOpenOfferModal={handleOpenOfferModal}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
          />

          <TourCategories
            onSelectCategory={(view) => handleNavigate(view)}
            onNavigate={(view) => handleNavigate(view)}
          />

          <PromiseSection />

          <FeaturedTours
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
            onOpenOfferModal={handleOpenOfferModal}
          />

          <ThemeEscapes
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
            onOpenOfferModal={handleOpenOfferModal}
          />

          <LocationMarquee />

          <TopDestinations
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          />

          <ProcessSection />

          <StatsSection />

          <FounderStorySection />

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

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
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
