import React from 'react';
import { Compass, Heart, Target, Users, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2, Star, Clock, Award, MapPin, PhoneCall, Globe, Check } from 'lucide-react';
import { BRAND_INFO } from '../data/travelData';

export default function AboutPage({ onBack, onOpenOfferModal }) {
  return (
    <div className="about-page-wrapper">

      {/* 1. Ultra-Premium Dark Hero Header Banner */}
      <section className="about-hero-section">
        <div className="hero-bg-overlay" />
        <div className="hero-glow-orb glow-orb-1" />
        <div className="hero-glow-orb glow-orb-2" />

        <div className="container relative-z">
          <div className="about-hero-content">
            <div className="eyebrow-pill-gold mb-4">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>ABOUT SAMYATI THE WORLD</span>
            </div>

            <h1 className="about-hero-title">
              Crafting Meaningful Journeys, <br />
              <span className="hero-gold-italic">Driven by Purpose</span>
            </h1>

            <p className="about-hero-lead">
              We believe travel is not just about visiting new locations. It is an extraordinary path to
              connection, self-discovery, and creating stories that last a lifetime.
            </p>

            {/* Highlight Badges Row */}
            <div className="about-hero-badges-row">
              <div className="hero-badge-chip">
                <Sparkles size={15} className="text-amber-400" />
                <span>100% Customized Trips</span>
              </div>
              <div className="hero-badge-chip">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Zero Hidden Costs</span>
              </div>
              <div className="hero-badge-chip">
                <Users size={15} className="text-sky-400" />
                <span>24/7 Human Concierge</span>
              </div>
              <div className="hero-badge-chip">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                <span>4.9★ Rated by Guests</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Stats Ribbon */}
      <section className="about-stats-ribbon">
        <div className="container">
          <div className="stats-ribbon-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Tailored Itineraries</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Curated Destinations</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Guest Rating Score</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container relative-z main-content-padding">

        {/* 3. Narrative Story Section ("How Samyati Began") */}
        <div className="story-section-wrapper">
          <div className="story-grid">

            {/* Story Card Left */}
            <div className="about-narrative-card">
              <div className="narrative-top-bar" />

              <div className="narrative-header-group">
                <div className="eyebrow-pill-gold-sm mb-2">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>OUR STORY & PHILOSOPHY</span>
                </div>
                <h2 className="narrative-h2">How Samyati Began</h2>
                <p className="narrative-sub-header">From late-night college discussions to India’s premier custom travel house.</p>
              </div>

              {/* Stacked Milestone Step Cards */}
              <div className="story-milestones-stack">
                <div className="milestone-step-item">
                  <div className="step-tag-row">
                    <span className="step-num-chip">01</span>
                    <span className="step-title-chip">College Wanderlust</span>
                  </div>
                  <p className="step-body-p">
                    Samyati began long before it became an official travel house—born out of late-night hostel discussions between college friends <strong>Aniket Shrivastava</strong>, <strong>Shardul Vikram Singh</strong>, and <strong>Gourav Dixit</strong> exploring hidden trails across India.
                  </p>
                </div>

                <div className="milestone-step-item">
                  <div className="step-tag-row">
                    <span className="step-num-chip">02</span>
                    <span className="step-title-chip">Spotting the Flaw</span>
                  </div>
                  <p className="step-body-p">
                    Entering the travel industry, they noticed a frustrating flaw: conventional tour operators relied heavily on rigid, cookie-cutter packages that rushed travelers through overcrowded traps with zero personalization and hidden costs.
                  </p>
                </div>

                <div className="milestone-step-item">
                  <div className="step-tag-row">
                    <span className="step-num-chip">03</span>
                    <span className="step-title-chip">Revolutionizing Custom Travel</span>
                  </div>
                  <p className="step-body-p">
                    Reuniting with specialized domain mastery—<strong>Aniket</strong> in growth, <strong>Shardul</strong> in transparent logistics, and <strong>Gourav</strong> in luxury stay partnerships—they launched Samyati to deliver 100% customized holidays.
                  </p>
                </div>
              </div>

              {/* Luxury Quote Card */}
              <div className="narrative-dark-quote-box">
                <div className="quote-mark-icon">“</div>
                <p className="dark-quote-text">
                  It was created with a simple belief: <em>people don’t merely travel to see new places; they travel to feel deeply alive, create lifelong stories, and rediscover a part of themselves along the way.</em>
                </p>
              </div>

              <div className="narrative-footer-bar">
                <span className="footer-tagline">
                  Rediscover Yourself With Every Journey
                </span>
              </div>
            </div>

            {/* Story Side Visual Right */}
            <div className="story-visual-card">
              <div className="visual-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
                  alt="Breathtaking mountain peaks overlooking crystal-clear alpine waters at golden hour"
                  className="visual-img"
                />
                <div className="visual-gradient-overlay" />
              </div>
              <div className="visual-badge-overlay">
                <Award size={24} className="text-amber-400 mb-1" />
                <div className="visual-badge-title">Handcrafted Holidays</div>
                <div className="visual-badge-sub">Designed with Passion & Precision</div>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Enhanced Co-Founders Grid */}
        <div className="about-section-divider">
          <span className="divider-tag">THE MINDS BEHIND SAMYATI</span>
          <h2 className="divider-h2">Meet Our Co-Founders</h2>
          <p className="divider-sub">Complementary expertise, shared passion, and a commitment to unmatched travel experiences.</p>
        </div>

        <div className="enhanced-founders-grid">
          {/* Founder 1 */}
          <div className="founder-card-enhanced">
            <div className="founder-card-top">
              <div className="founder-avatar-chip">
                <Sparkles size={24} />
              </div>
              <span className="co-founder-badge">Co-Founder</span>
            </div>

            <h3 className="founder-name">Aniket Shrivastava</h3>
            <span className="founder-role">Marketing & Growth</span>

            <p className="founder-bio">
              Passionate about connecting travellers with hidden gems and building authentic brand narratives that inspire discovery.
            </p>

            <div className="founder-tags-row">
              <span className="founder-tag">Brand Vision</span>
              <span className="founder-tag">Growth Strategies</span>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="founder-card-enhanced">
            <div className="founder-card-top">
              <div className="founder-avatar-chip">
                <ShieldCheck size={24} />
              </div>
              <span className="co-founder-badge">Co-Founder</span>
            </div>

            <h3 className="founder-name">Shardul Vikram Singh</h3>
            <span className="founder-role">Operations & Finance</span>

            <p className="founder-bio">
              Ensures flawless execution, transparent itemized pricing, and smooth logistics across every itinerary from start to finish.
            </p>

            <div className="founder-tags-row">
              <span className="founder-tag">Seamless Logistics</span>
              <span className="founder-tag">Financial Clarity</span>
            </div>
          </div>

          {/* Founder 3 */}
          <div className="founder-card-enhanced">
            <div className="founder-card-top">
              <div className="founder-avatar-chip">
                <Award size={24} />
              </div>
              <span className="co-founder-badge">Co-Founder</span>
            </div>

            <h3 className="founder-name">Gourav Dixit</h3>
            <span className="founder-role">Sales & Contracting</span>

            <p className="founder-bio">
              Secures premium hotel partnerships and curated local guide experiences to deliver maximum value to every guest.
            </p>

            <div className="founder-tags-row">
              <span className="founder-tag">Partner Relations</span>
              <span className="founder-tag">Curated Value</span>
            </div>
          </div>
        </div>

        {/* 5. Enhanced Mission & Vision Cards */}
        <div className="about-section-divider">
          <span className="divider-tag">OUR GUIDING PRINCIPLES</span>
          <h2 className="divider-h2">Mission & Vision</h2>
          <p className="divider-sub">Empowering travellers with unforgettable, hassle-free travel experiences.</p>
        </div>

        <div className="enhanced-mv-grid">
          {/* Mission Card */}
          <div className="mv-card-enhanced mv-mission">
            <div className="mv-card-header">
              <div className="mv-icon-badge bg-rose-100 text-rose-600">
                <Heart size={26} />
              </div>
              <div>
                <span className="mv-tag text-rose-600">OUR MISSION</span>
                <h3 className="mv-title">Personal, Transparent & Meaningful</h3>
              </div>
            </div>

            <p className="mv-text">{BRAND_INFO.mission}</p>

            <ul className="mv-bullet-list">
              <li>
                <CheckCircle2 size={18} className="text-rose-500 flex-shrink-0" />
                <span>Tailored 100% to your budget and pacing</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="text-rose-500 flex-shrink-0" />
                <span>Zero hidden fees with clear GST tax invoices</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="text-rose-500 flex-shrink-0" />
                <span>Handpicked stays & verified local drivers</span>
              </li>
            </ul>
          </div>

          {/* Vision Card */}
          <div className="mv-card-enhanced mv-vision">
            <div className="mv-card-header">
              <div className="mv-icon-badge bg-amber-100 text-amber-600">
                <Target size={26} />
              </div>
              <div>
                <span className="mv-tag text-amber-600">OUR VISION</span>
                <h3 className="mv-title">India’s Most Trusted Custom Travel Brand</h3>
              </div>
            </div>

            <p className="mv-text">{BRAND_INFO.vision}</p>

            <ul className="mv-bullet-list">
              <li>
                <CheckCircle2 size={18} className="text-amber-500 flex-shrink-0" />
                <span>Building lifelong relationships with travellers</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="text-amber-500 flex-shrink-0" />
                <span>24/7 dedicated human concierge on tour</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="text-amber-500 flex-shrink-0" />
                <span>Excellence in bespoke holiday design</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 6. Why Choose Us Core Pillars Grid */}
        <div className="pillars-section-wrapper">
          <div className="about-section-divider">
            <span className="divider-tag">THE SAMYATI DIFFERENCE</span>
            <h2 className="divider-h2">Why Travellers Choose Us</h2>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box text-amber-500 bg-amber-50">
                <Sparkles size={24} />
              </div>
              <h4 className="pillar-title">100% Customized Trips</h4>
              <p className="pillar-desc">Every itinerary is crafted from scratch according to your dates, preferences, and pace.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box text-emerald-500 bg-emerald-50">
                <ShieldCheck size={24} />
              </div>
              <h4 className="pillar-title">Zero Hidden Costs</h4>
              <p className="pillar-desc">Transparent itemized pricing with GST invoicing so you know exactly what you pay for.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box text-sky-500 bg-sky-50">
                <Users size={24} />
              </div>
              <h4 className="pillar-title">24/7 Human Concierge</h4>
              <p className="pillar-desc">A dedicated trip manager available round the clock from arrival to return flight.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box text-purple-500 bg-purple-50">
                <Award size={24} />
              </div>
              <h4 className="pillar-title">Verified Stay & Drivers</h4>
              <p className="pillar-desc">Only handpicked top-rated boutique stays and verified professional chauffeurs.</p>
            </div>
          </div>
        </div>

        {/* 7. Enhanced Luxury CTA Banner */}
        <div className="enhanced-about-cta">
          <div className="cta-glow-bg" />
          <div className="cta-content">
            <div className="cta-eyebrow-chip">
              <Sparkles size={14} className="text-amber-400" />
              <span>START YOUR JOURNEY TODAY</span>
            </div>

            <h2 className="cta-title">
              Ready to Rediscover Yourself <br />
              <span className="gold-serif-accent">With Every Journey?</span>
            </h2>

            <p className="cta-sub">
              Let our founders & travel specialists craft your tailored itinerary within 2 hours.
            </p>

            <div className="cta-btn-group">
              <button
                onClick={() => onOpenOfferModal && onOpenOfferModal('About Page Quote')}
                className="btn-gold-action"
              >
                <span>Get Customized Quote</span>
                <ArrowUpRight size={16} />
              </button>
              <button onClick={onBack} className="btn-outline-white">
                Back to Home
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Styled JSX */}
      <style>{`
        .about-page-wrapper {
          position: relative;
          min-height: 100vh;
          background: #fefce8;
          color: #0f172a;
          font-family: var(--font-sans);
        }

        .relative-z {
          position: relative;
          z-index: 10;
        }

        .main-content-padding {
          padding-top: 60px;
          padding-bottom: 90px;
        }

        /* 1. Hero Banner */
        .about-hero-section {
          position: relative;
          background: #0f172a;
          background-image: 
            linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%),
            url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85');
          background-size: cover;
          background-position: center;
          padding: 150px 0 90px 0;
          color: #ffffff;
          text-align: center;
          overflow: hidden;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-glow-orb {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.25;
        }

        .glow-orb-1 {
          top: -100px;
          left: 10%;
          background: #d97706;
        }

        .glow-orb-2 {
          bottom: -100px;
          right: 10%;
          background: #f59e0b;
        }

        .about-hero-content {
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .eyebrow-pill-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(217, 119, 6, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.35);
          color: #fef08a;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 7px 20px;
          border-radius: 9999px;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .about-hero-title {
          font-size: clamp(34px, 5vw, 56px);
          font-weight: 800;
          line-height: 1.15;
          color: #ffffff;
          margin-top: 14px;
          margin-bottom: 20px;
          letter-spacing: -0.025em;
          text-align: center;
        }

        .hero-gold-italic {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-hero-lead {
          font-size: 17.5px;
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 34px;
          max-width: 740px;
          margin-left: auto;
          margin-right: auto;
        }

        .about-hero-badges-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 9px 20px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          color: #f1f5f9;
          transition: all 0.3s ease;
        }

        .hero-badge-chip:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(251, 191, 36, 0.4);
          transform: translateY(-2px);
        }

        /* 2. Stats Ribbon */
        .about-stats-ribbon {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          margin-top: 36px;
          position: relative;
          z-index: 20;
          border-radius: 16px;
          max-width: 1020px;
          margin-left: auto;
          margin-right: auto;
        }

        .stats-ribbon-grid {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 16px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .stat-divider {
          width: 1px;
          height: 36px;
          background: #e2e8f0;
        }

        /* 3. Story Section */
        .story-section-wrapper {
          margin-bottom: 90px;
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 36px;
          align-items: center;
        }

        .about-narrative-card {
          position: relative;
          background: #ffffff;
          border-radius: 28px;
          padding: 48px;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .narrative-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%);
        }

        .eyebrow-pill-gold-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fffbe6;
          border: 1px solid #fef08a;
          color: #b45309;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 4px 14px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .narrative-header-group {
          margin-bottom: 24px;
        }

        .narrative-h2 {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 6px;
          letter-spacing: -0.02em;
        }

        .narrative-sub-header {
          font-size: 14.5px;
          color: #64748b;
          margin-top: 4px;
        }

        /* Milestone Stack */
        .story-milestones-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .milestone-step-item {
          background: #fefce8;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px 20px;
          transition: all 0.25s ease;
        }

        .milestone-step-item:hover {
          background: #ffffff;
          border-color: #fcd34d;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
          transform: translateY(-2px);
        }

        .step-tag-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .step-num-chip {
          font-size: 10.5px;
          font-weight: 800;
          background: #0f172a;
          color: #fef08a;
          padding: 2px 8px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .step-title-chip {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .step-body-p {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
        }

        .narrative-dark-quote-box {
          position: relative;
          background: linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%);
          border-left: 4px solid #d97706;
          border-radius: 16px;
          padding: 20px 24px;
          margin: 20px 0;
          border: 1px solid #fef08a;
          border-left-width: 4px;
        }

        .dark-quote-text {
          font-size: 14.5px;
          color: #78350f;
          line-height: 1.6;
          position: relative;
          z-index: 2;
          font-weight: 500;
        }

        .narrative-footer-bar {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
        }

        .footer-tagline {
          font-size: 13px;
          font-weight: 800;
          color: #d97706;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .quote-mark-icon {
          position: absolute;
          top: -10px;
          right: 20px;
          font-size: 60px;
          font-family: var(--font-serif-italic), serif;
          color: rgba(217, 119, 6, 0.18);
          line-height: 1;
        }

        .quote-text-content {
          font-size: 16.5px;
          color: #78350f;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }

        .text-gold-brand {
          color: #b45309;
        }

        /* Story Side Visual */
        .story-visual-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          height: 100%;
          min-height: 440px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .visual-image-wrapper {
          position: absolute;
          inset: 0;
        }

        .visual-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .visual-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%);
        }

        .visual-badge-overlay {
          position: relative;
          z-index: 5;
          padding: 32px;
          color: #ffffff;
        }

        .visual-badge-title {
          font-size: 20px;
          font-weight: 800;
        }

        .visual-badge-sub {
          font-size: 13px;
          color: #cbd5e1;
          margin-top: 2px;
        }

        /* Section Dividers */
        .about-section-divider {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 46px auto;
        }

        .divider-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #d97706;
          text-transform: uppercase;
        }

        .divider-h2 {
          font-size: 34px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 4px;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .divider-sub {
          font-size: 15px;
          color: #64748b;
        }

        /* 4. Enhanced Founders Grid */
        .enhanced-founders-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto 90px auto;
        }

        .founder-card-enhanced {
          background: #ffffff;
          border-radius: 24px;
          padding: 34px 28px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .founder-card-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .founder-card-enhanced:hover::before {
          opacity: 1;
        }

        .founder-card-enhanced:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
          border-color: #fcd34d;
        }

        .founder-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .founder-avatar-chip {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%);
          color: #b45309;
          border: 1px solid #fef08a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.12);
        }

        .co-founder-badge {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #ffffff;
          padding: 4px 14px;
          border-radius: 9999px;
          box-shadow: 0 3px 10px rgba(217, 119, 6, 0.25);
        }

        .founder-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .founder-role {
          font-size: 13.5px;
          font-weight: 700;
          color: #d97706;
          margin-bottom: 14px;
        }

        .founder-bio {
          font-size: 14px;
          color: #64748b;
          line-height: 1.65;
          margin-bottom: 22px;
          flex: 1;
        }

        .founder-tags-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .founder-tag {
          font-size: 11.5px;
          font-weight: 700;
          background: #fffbe6;
          color: #92400e;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid #fef08a;
        }

        /* 5. Mission & Vision Grid */
        .enhanced-mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          max-width: 1020px;
          margin: 0 auto 90px auto;
        }

        .mv-card-enhanced {
          background: #ffffff;
          border-radius: 24px;
          padding: 40px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }

        .mv-card-enhanced:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.06);
          border-color: #cbd5e1;
        }

        .mv-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .mv-icon-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-rose-100 { background: #ffe4e6; }
        .bg-amber-100 { background: #fef3c7; }

        .mv-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 2px;
        }

        .mv-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .mv-text {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .mv-bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mv-bullet-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        /* 6. Why Choose Us Pillars */
        .pillars-section-wrapper {
          margin-bottom: 90px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pillar-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 22px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.06);
          border-color: #cbd5e1;
        }

        .pillar-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .bg-amber-50 { background: #fffbe6; }
        .bg-emerald-50 { background: #ecfdf5; }
        .bg-sky-50 { background: #f0f9ff; }
        .bg-purple-50 { background: #faf5ff; }

        .pillar-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .pillar-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.55;
        }

        /* 7. Enhanced Luxury CTA Banner */
        .enhanced-about-cta {
          position: relative;
          background: #0f172a;
          background-image: radial-gradient(circle at 50% 0%, rgba(217, 119, 6, 0.25) 0%, rgba(15, 23, 42, 1) 75%);
          border-radius: 32px;
          padding: 68px 40px;
          text-align: center;
          color: #ffffff;
          max-width: 1020px;
          margin: 0 auto;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
          border: 1px solid rgba(251, 191, 36, 0.2);
          overflow: hidden;
        }

        .cta-eyebrow-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(217, 119, 6, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #fef08a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 5px 16px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-title {
          font-size: clamp(28px, 4.2vw, 44px);
          font-weight: 800;
          line-height: 1.18;
          margin-bottom: 14px;
        }

        .gold-serif-accent {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          color: #f59e0b;
        }

        .cta-sub {
          font-size: 16.5px;
          color: #cbd5e1;
          margin-bottom: 32px;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-btn-group {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-gold-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 700;
          padding: 14px 30px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35);
        }

        .btn-gold-action:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(217, 119, 6, 0.5);
        }

        .btn-outline-white {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 14px 30px;
          border-radius: 9999px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }

        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 990px) {
          .story-grid { grid-template-columns: 1fr; gap: 20px; }
          .enhanced-founders-grid { grid-template-columns: 1fr; gap: 16px; }
          .enhanced-mv-grid { grid-template-columns: 1fr; gap: 16px; }
          .pillars-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .stat-divider { display: none; }
          .about-narrative-card { padding: 20px 16px !important; border-radius: 16px !important; }
          .founder-card-enhanced { padding: 18px 16px !important; border-radius: 16px !important; }
          .enhanced-mv-card { padding: 18px 16px !important; border-radius: 16px !important; }
          .pillar-card-pro { padding: 14px 12px !important; border-radius: 14px !important; }
          .enhanced-about-cta { padding: 28px 16px !important; border-radius: 18px !important; }
          .story-visual-card { min-height: 240px !important; height: 240px !important; border-radius: 16px !important; }
          .visual-image-wrapper { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; border-radius: 16px !important; }
          .visual-badge-overlay { padding: 20px 16px !important; }
          .visual-badge-title { font-size: 16px !important; }
          .visual-badge-sub { font-size: 12px !important; }
          .milestone-step-item { padding: 10px 12px !important; border-radius: 10px !important; }
          .narrative-dark-quote-box { padding: 12px 14px !important; border-radius: 10px !important; }
          .dark-quote-text { font-size: 13px !important; line-height: 1.5 !important; }
        }

        @media (max-width: 600px) {
          .main-content-padding { padding-top: 24px !important; padding-bottom: 40px !important; }
          .about-section-divider { margin-bottom: 24px !important; margin-top: 36px !important; }
          .divider-tag { font-size: 10px !important; letter-spacing: 0.1em !important; }
          .divider-h2 { font-size: 22px !important; margin-top: 2px !important; margin-bottom: 4px !important; }
          .divider-sub { font-size: 12.5px !important; margin-bottom: 16px !important; }
          .stats-ribbon-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px 8px !important; padding: 16px 10px !important; }
          .stat-number { font-size: 20px !important; }
          .stat-label { font-size: 10.5px !important; }
          .pillars-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .about-hero-section { padding: 125px 16px 45px 16px !important; }
          .about-hero-title { font-size: clamp(24px, 6.5vw, 30px) !important; line-height: 1.2 !important; margin-bottom: 12px !important; }
          .about-hero-lead { font-size: 13px !important; line-height: 1.5 !important; margin-bottom: 20px !important; }
          .about-hero-badges-row { gap: 6px 8px !important; }
          .hero-badge-chip { padding: 4px 10px !important; font-size: 11px !important; border-radius: 9999px !important; }
          .cta-title { font-size: clamp(21px, 5.8vw, 26px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
          .cta-sub { font-size: 12.5px !important; margin-bottom: 18px !important; }
          .btn-gold-action, .btn-outline-white { padding: 9px 18px !important; font-size: 12.5px !important; width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
}
