import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TourCategories from './components/TourCategories';
import PromiseSection from './components/PromiseSection';
import FeaturedTours from './components/FeaturedTours';
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

import OfferModal from './components/OfferModal';
import PackageDetailsModal from './components/PackageDetailsModal';
import AdminPanelModal from './components/AdminPanelModal';
import { PrivacyModal, TermsModal } from './components/LegalModals';

export default function App() {
  // Current view: 'home' | 'desh' | 'videsh'
  const [currentView, setCurrentView] = useState('home');

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerInitialDest, setOfferInitialDest] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
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
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo(0, 0);
  };

  const handleOpenOfferModal = (destName = '') => {
    setOfferInitialDest(destName);
    setIsOfferModalOpen(true);
  };

  // Dedicated Desh Page View
  if (currentView === 'desh') {
    return (
      <div className="travelio-app samyati-app">
        <Navbar 
          onOpenOfferModal={handleOpenOfferModal} 
          onOpenAdminModal={() => setIsAdminModalOpen(true)} 
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        <DeshPage 
          onBack={() => handleNavigate('home')}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
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

        <PackageDetailsModal 
          packageData={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onOpenOfferModal={handleOpenOfferModal}
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

  // Dedicated Videsh Page View
  if (currentView === 'videsh') {
    return (
      <div className="travelio-app samyati-app">
        <Navbar 
          onOpenOfferModal={handleOpenOfferModal} 
          onOpenAdminModal={() => setIsAdminModalOpen(true)} 
          onNavigate={handleNavigate}
          currentView={currentView}
        />

        <VideshPage 
          onBack={() => handleNavigate('home')}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
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

        <PackageDetailsModal 
          packageData={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onOpenOfferModal={handleOpenOfferModal}
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

  // Main Homepage View
  return (
    <div className="travelio-app samyati-app">
      <Navbar 
        onOpenOfferModal={handleOpenOfferModal} 
        onOpenAdminModal={() => setIsAdminModalOpen(true)} 
        onNavigate={handleNavigate}
      />

      <main>
        <HeroSection 
          onOpenOfferModal={handleOpenOfferModal}
          onSelectDestination={(id) => handleOpenOfferModal(id)}
        />
        
        <TourCategories 
          onNavigate={handleNavigate}
          onOpenOfferModal={handleOpenOfferModal}
        />
        
        <PromiseSection 
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          onOpenOfferModal={handleOpenOfferModal}
        />

        <FeaturedTours 
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          onOpenOfferModal={handleOpenOfferModal}
          onNavigate={handleNavigate}
        />

        <LocationMarquee />

        <TopDestinations 
          onOpenOfferModal={handleOpenOfferModal}
        />

        <ProcessSection />

        <StatsSection />

        <FounderStorySection />

        <WorldCTA 
          onOpenOfferModal={handleOpenOfferModal}
        />

        <NewsletterBand />
      </main>

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

      <PackageDetailsModal 
        packageData={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onOpenOfferModal={handleOpenOfferModal}
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
