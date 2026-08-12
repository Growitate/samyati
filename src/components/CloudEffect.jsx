import React from 'react';

// Volumetric Fluffy Cloud Effect for Hero Section Bottom
export function HeroCloudEffect() {
  return (
    <div className="cloud-effect-container hero-cloud-bottom">
      {/* Left Volumetric Cloud Bank */}
      <div className="cloud-puff cloud-puff-left" />
      
      {/* Center Mist Layer */}
      <div className="cloud-puff cloud-puff-center" />

      {/* Right Volumetric Cloud Bank */}
      <div className="cloud-puff cloud-puff-right" />

      {/* Organic Puffy SVG Cumulus Cloud Curve */}
      <svg 
        className="cloud-svg-mask" 
        viewBox="0 0 1440 220" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Soft Background Cloud Layer */}
        <path 
          d="M0,220 
             L0,140 
             C60,110 120,130 180,110 
             C240,90 310,60 380,85 
             C450,110 520,140 600,120 
             C680,100 740,65 820,80 
             C900,95 980,130 1060,105 
             C1140,80 1220,50 1300,75 
             C1370,100 1410,130 1440,120 
             L1440,220 Z" 
          fill="#ffffff" 
          fillOpacity="0.65"
        />

        {/* Foreground Solid Volumetric Cloud Layer */}
        <path 
          d="M0,220 
             L0,170 
             C40,145 90,125 150,140 
             C210,155 270,180 340,150 
             C410,120 470,75 540,95 
             C610,115 670,160 740,140 
             C810,120 880,70 950,90 
             C1020,110 1090,150 1160,130 
             C1230,110 1290,75 1350,95 
             C1400,115 1425,140 1440,150 
             L1440,220 Z" 
          fill="#ffffff" 
        />
      </svg>

      <style>{`
        .cloud-effect-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 200px;
          pointer-events: none;
          z-index: 6;
          overflow: hidden;
        }

        .cloud-svg-mask {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 180px;
        }

        /* Fluffy Radial Cloud Puffs simulating 3D fog billows */
        .cloud-puff {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0) 75%);
          filter: blur(12px);
          animation: floatMist 14s ease-in-out infinite alternate;
        }

        .cloud-puff-left {
          width: 480px;
          height: 240px;
          bottom: -40px;
          left: -80px;
          animation-delay: 0s;
        }

        .cloud-puff-center {
          width: 550px;
          height: 220px;
          bottom: -60px;
          left: 35%;
          transform: translateX(-50%);
          animation-delay: 3s;
          opacity: 0.9;
        }

        .cloud-puff-right {
          width: 520px;
          height: 260px;
          bottom: -50px;
          right: -90px;
          animation-delay: 6s;
        }

        @keyframes floatMist {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-16px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

// Volumetric Fluffy Cloud Effect Above Footer Section
export function FooterCloudEffect() {
  return (
    <div className="cloud-effect-container footer-cloud-top">
      {/* Fluffy Radial Cloud Puffs for Top of Newsletter / Above Footer */}
      <div className="cloud-puff footer-puff-left" />
      <div className="cloud-puff footer-puff-center" />
      <div className="cloud-puff footer-puff-right" />

      {/* Inverted Organic Cloud Mask for Top Edge */}
      <svg 
        className="cloud-svg-top-mask" 
        viewBox="0 0 1440 180" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0 
             L0,80 
             C50,110 110,85 170,105 
             C230,125 300,150 370,130 
             C440,110 500,75 570,95 
             C640,115 700,140 770,125 
             C840,110 910,75 980,95 
             C1050,115 1120,140 1190,120 
             C1260,100 1330,70 1400,90 
             C1425,100 1435,110 1440,115 
             L1440,0 Z" 
          fill="#ffffff" 
        />
      </svg>

      <style>{`
        .footer-cloud-top {
          top: 0;
          bottom: auto;
          height: 160px;
        }

        .cloud-svg-top-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 140px;
        }

        .footer-puff-left {
          width: 440px;
          height: 200px;
          top: -50px;
          left: -60px;
        }

        .footer-puff-center {
          width: 500px;
          height: 180px;
          top: -40px;
          left: 40%;
          transform: translateX(-50%);
        }

        .footer-puff-right {
          width: 460px;
          height: 220px;
          top: -50px;
          right: -70px;
        }
      `}</style>
    </div>
  );
}
