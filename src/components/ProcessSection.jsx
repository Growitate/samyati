import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Sparkles, Map, Compass, CalendarCheck } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Consultation & Discovery',
    description: 'We listen to your travel aspirations, preferred pace, style, and culinary desires.',
    badgeImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
    tagline: '100% Private Expeditions'
  },
  {
    step: '02',
    title: 'Tailored Route Design',
    description: 'Our local specialists handpick boutique lodges, private transfers, and unique insider access.',
    badgeImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Curated Route Planning'
  },
  {
    step: '03',
    title: 'Refine & Confirm',
    description: 'Crafted to perfection. Accommodation, guides, transfers, experiences all arranged seamlessly.',
    badgeImage: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Seamless Confirmations'
  },
  {
    step: '04',
    title: 'Seamless Expedition',
    description: '24/7 dedicated concierge assistance on the ground for an effortless journey.',
    badgeImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
    tagline: '24/7 Concierge Support'
  }
];

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);

  // Reset activeStep to 0 (Step 01) whenever section scrolls into viewport
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveStep(0);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionEl);

    return () => {
      observer.unobserve(sectionEl);
    };
  }, []);

  // Auto Slideshow Loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = PROCESS_STEPS[activeStep];

  return (
    <section 
      ref={sectionRef}
      className="process-section" 
      id="process"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="process-split-container">
        {/* Left Photo Half with Smooth Fade Transition */}
        <div className="process-left-photo">
          {PROCESS_STEPS.map((step, idx) => (
            <img 
              key={step.step}
              src={step.heroImage} 
              alt={step.title} 
              className={`split-img ${idx === activeStep ? 'active-slide' : ''}`}
            />
          ))}
          <div className="photo-badge">
            <CheckCircle2 size={16} className="badge-icon" />
            <span>{current.tagline}</span>
          </div>

          {/* Auto Slideshow Progress Bar */}
          <div className="slideshow-progress-bar">
            <div 
              key={activeStep} 
              className={`progress-fill ${!isPaused ? 'animating' : ''}`} 
            />
          </div>
        </div>

        {/* Right Solid Near-Black Panel */}
        <div className="process-right-panel">
          <div className="panel-inner-content">
            <h2 className="process-heading">
              How We<br />
              <span className="accent-serif">Plan</span> Your<br />
              Journey
            </h2>

            {/* Step Indicator Row */}
            <div className="step-indicator-row">
              {PROCESS_STEPS.map((item, idx) => {
                const isActive = idx === activeStep;
                const isCompleted = idx < activeStep;
                return (
                  <React.Fragment key={item.step}>
                    <button
                      className={`step-chip ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      onClick={() => setActiveStep(idx)}
                      aria-label={`Select step ${item.step}`}
                    >
                      {item.step}
                    </button>
                    {idx < PROCESS_STEPS.length - 1 && (
                      <div className={`step-connector ${idx <= activeStep ? 'completed' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Central Rotating Starburst Badge */}
            <div className="starburst-hero-wrapper">
              <div className="starburst-frame shape-starburst-pink">
                <div className="badge-circle-photo">
                  <img 
                    key={current.badgeImage}
                    src={current.badgeImage} 
                    alt={current.title} 
                    className="badge-img fade-in-img" 
                  />
                </div>
              </div>
            </div>

            {/* Active Step Meta */}
            <div key={activeStep} className="active-step-info fade-in-text">
              <h3 className="step-info-title">{current.title}</h3>
              <p className="step-info-desc">{current.description}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .process-section {
          background-color: #161616;
          color: #ffffff;
          overflow: hidden;
          position: relative;
        }

        .process-split-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 640px;
        }

        .process-left-photo {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 480px;
          overflow: hidden;
        }

        .split-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.04);
          transition: opacity 0.8s ease, transform 1.2s ease;
        }

        .split-img.active-slide {
          opacity: 1;
          transform: scale(1);
        }

        .photo-badge {
          position: absolute;
          bottom: 30px;
          left: 30px;
          background: rgba(15, 20, 16, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 18px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          z-index: 5;
        }

        .badge-icon {
          color: #34d399;
        }

        .slideshow-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.2);
          z-index: 10;
        }

        .progress-fill {
          height: 100%;
          background: #ffffff;
          width: 0%;
        }

        .progress-fill.animating {
          animation: progressTimer 3.8s linear forwards;
        }

        @keyframes progressTimer {
          from { width: 0%; }
          to { width: 100%; }
        }

        .process-right-panel {
          background-color: #161616;
          padding: 70px 60px;
          display: flex;
          align-items: center;
        }

        .panel-inner-content {
          max-width: 480px;
          width: 100%;
        }

        .process-heading {
          font-size: clamp(34px, 4.5vw, 54px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 32px;
        }

        .accent-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
        }

        /* Step Indicator Row */
        .step-indicator-row {
          display: flex;
          align-items: center;
          margin-bottom: 36px;
        }

        .step-chip {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .step-chip.active {
          background: #ffffff;
          color: #161616;
          border-color: #ffffff;
          transform: scale(1.15);
          box-shadow: 0 0 24px rgba(255,255,255,0.4);
        }

        .step-chip.completed {
          border-color: rgba(255,255,255,0.7);
          color: rgba(255,255,255,0.9);
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.2);
          margin: 0 8px;
          transition: background 0.4s ease;
        }

        .step-connector.completed {
          background: #ffffff;
        }

        /* Starburst Badge Frame */
        .starburst-hero-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .starburst-frame {
          width: 170px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: radial-gradient(circle, #fbcfe8 0%, #f472b6 100%);
          clip-path: polygon(
            50% 0%, 63% 12%, 81% 6%, 85% 23%, 100% 31%, 95% 48%, 
            100% 66%, 86% 75%, 83% 93%, 65% 90%, 50% 100%, 
            35% 90%, 17% 93%, 14% 75%, 0% 66%, 5% 48%, 
            0% 31%, 15% 23%, 19% 6%, 37% 12%
          );
          box-shadow: 0 0 35px rgba(244, 114, 182, 0.4);
          transition: transform 0.5s ease;
        }

        .starburst-frame:hover {
          transform: rotate(12deg) scale(1.05);
        }

        .badge-circle-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #ffffff;
        }

        .badge-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fade-in-img {
          animation: fadeIn 0.6s ease;
        }

        .active-step-info {
          text-align: center;
        }

        .fade-in-text {
          animation: fadeInUp 0.5s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-info-title {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .step-info-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .process-split-container {
            grid-template-columns: 1fr;
          }
          .process-right-panel {
            padding: 50px 24px;
          }
        }
      `}</style>
    </section>
  );
}

