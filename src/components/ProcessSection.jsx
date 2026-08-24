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

  // Continuous Auto Slideshow Loop (pauses when hovered)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 3000);

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
              key={activeStep + (isPaused ? '-paused' : '')} 
              className={`progress-fill ${isPaused ? 'paused' : 'animating'}`} 
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
          min-height: 480px;
          max-height: 540px;
        }

        .process-left-photo {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 380px;
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
          transition: opacity 0.3s ease, transform 0.6s ease;
        }

        .split-img.active-slide {
          opacity: 1;
          transform: scale(1);
        }

        .photo-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(15, 20, 16, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 14px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
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
          height: 3px;
          background: rgba(255,255,255,0.2);
          z-index: 10;
        }

        .progress-fill {
          height: 100%;
          background: #ffffff;
          width: 0%;
        }

        .progress-fill.animating {
          animation: progressTimer 3s linear forwards;
        }

        .progress-fill.paused {
          width: 100%;
        }

        @keyframes progressTimer {
          from { width: 0%; }
          to { width: 100%; }
        }

        .process-right-panel {
          background-color: #161616;
          padding: 40px 48px;
          display: flex;
          align-items: center;
        }

        .panel-inner-content {
          max-width: 420px;
          width: 100%;
          margin: 0 auto;
        }

        .process-heading {
          font-size: clamp(24px, 3.2vw, 36px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 20px;
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
          margin-bottom: 22px;
        }

        .step-chip {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #ffffff;
          font-size: 12px;
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
          transform: scale(1.12);
          box-shadow: 0 0 18px rgba(255,255,255,0.35);
        }

        .step-chip.completed {
          border-color: rgba(255,255,255,0.7);
          color: rgba(255,255,255,0.9);
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.2);
          margin: 0 6px;
          transition: background 0.4s ease;
        }

        .step-connector.completed {
          background: #ffffff;
        }

        /* Starburst Badge Frame */
        .starburst-hero-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 18px;
        }

        .starburst-frame {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: radial-gradient(circle, #fbcfe8 0%, #f472b6 100%);
          clip-path: polygon(
            50% 0%, 63% 12%, 81% 6%, 85% 23%, 100% 31%, 95% 48%, 
            100% 66%, 86% 75%, 83% 93%, 65% 90%, 50% 100%, 
            35% 90%, 17% 93%, 14% 75%, 0% 66%, 5% 48%, 
            0% 31%, 15% 23%, 19% 6%, 37% 12%
          );
          box-shadow: 0 0 24px rgba(244, 114, 182, 0.35);
          transition: transform 0.5s ease;
        }

        .starburst-frame:hover {
          transform: rotate(12deg) scale(1.05);
        }

        .badge-circle-photo {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ffffff;
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
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .step-info-desc {
          font-size: 12.5px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .process-split-container {
            grid-template-columns: 1fr;
            min-height: auto;
            max-height: none;
          }
          .process-left-photo {
            min-height: 280px;
          }
          .process-right-panel {
            padding: 36px 20px;
          }
        }
      `}</style>
    </section>
  );
}

