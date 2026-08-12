import { Settings, ArrowUpRight, Star, Ticket } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const REVIEWS = [
  {
    id: 1,
    name: 'Elena Vance',
    location: 'Zurich, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    quote: 'The alpine expedition surpassed all our dreams. Our guide Marco knew every hidden trail and local chalet!'
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    quote: 'From Kyoto tea houses to bullet trains, Travelio executed seamless luxury travel without a single hitch.'
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    location: 'Madrid, Spain',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    quote: 'Our honeymoon in Santorini was pure magic. Private catamaran cruises and cliffside dinners arranged with care.'
  },
  {
    id: 4,
    name: 'David Chen',
    location: 'Vancouver, Canada',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    quote: 'Trekking the Icelandic fjords with Travelio felt like stepping into an epic documentary. 10/10 recommendation.'
  },
  {
    id: 5,
    name: 'Aaliyah Khan',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    quote: 'The custom itinerary service allowed us to balance wild safari adventures with high-end relaxation.'
  },
  {
    id: 6,
    name: 'Lucas Dupont',
    location: 'Paris, France',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    quote: 'Small group size, master local guides, and authentic cultural immersion. This is true travel redefined.'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section" id="stories">
      <div className="container">
        {/* Header Block Split */}
        <div className="stories-header-split">
          {/* Left Column */}
          <div className="stories-left">
            <div className="eyebrow-pill mb-3">
              <Settings className="gear-icon" size={12} />
              <span>Traveller Stories</span>
              <Settings className="gear-icon" size={12} />
            </div>

            <h2 className="stories-h2">
              Stories That <span className="accent-serif">Come</span> Back<br />With Every Journey
            </h2>

            {/* Buttons Row */}
            <div className="cta-link-row">
              <a href="#" className="btn-pill btn-pill-dark">
                <span>See All Travellers Stories</span>
                <span className="btn-badge-icon">
                  <ArrowUpRight size={16} />
                </span>
              </a>

              <a href="#" className="insta-stories-link">
                <InstagramIcon />
                <span>Instagram Stories</span>
              </a>
            </div>

            {/* Social Proof Cluster */}
            <div className="social-proof-cluster">
              <div className="avatar-facepile">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Reviewer 1" className="face" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Reviewer 2" className="face" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Reviewer 3" className="face" />
              </div>

              <div className="rating-info">
                <div className="stars-row">
                  <span className="rating-num">4.9 / 5.0</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="star-gold" />
                  ))}
                </div>
                <span className="rating-sub">Based on 2,400+ reviews worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Fanned Stacked Card with Boarding Pass */}
          <div className="stories-right">
            <div className="fanned-card-wrapper">
              <div className="fanned-back back-2" />
              <div className="fanned-back back-1" />
              <div className="fanned-top-card">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" 
                  alt="Hiker on peak" 
                  className="fanned-img" 
                />
                
                {/* Boarding Pass Pinned Stub */}
                <div className="boarding-pass-stub">
                  <Ticket size={14} className="ticket-icon" />
                  <span className="stub-text">BOARDING PASS · SWISS ALPS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Masonry Grid with Soft Fade Mask */}
        <div className="masonry-wrapper">
          <div className="masonry-grid">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="testimonial-card">
                <div className="testi-header">
                  <img src={rev.avatar} alt={rev.name} className="testi-avatar" />
                  <div className="testi-user">
                    <h4 className="testi-name">{rev.name}</h4>
                    <span className="testi-loc">{rev.location}</span>
                  </div>
                </div>

                <div className="testi-divider" />

                <p className="testi-quote">"{rev.quote}"</p>
              </div>
            ))}
          </div>

          {/* Bottom Soft Opacity Fade Gradient */}
          <div className="masonry-fade-overlay" />
        </div>
      </div>

      <style>{`
        .testimonials-section {
          padding: 100px 0;
          background-color: #ffffff;
        }

        .stories-header-split {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 70px;
        }

        .mb-3 {
          margin-bottom: 12px;
        }

        .stories-h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.15;
          margin-bottom: 24px;
        }

        .cta-link-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .insta-stories-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ec4899;
          font-weight: 700;
          font-size: 14px;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        /* Social Proof Cluster */
        .social-proof-cluster {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar-facepile {
          display: flex;
        }

        .avatar-facepile .face {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffffff;
          margin-left: -8px;
        }

        .avatar-facepile .face:first-child {
          margin-left: 0;
        }

        .rating-info {
          display: flex;
          flex-direction: column;
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-num {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-dark);
          margin-right: 4px;
        }

        .star-gold {
          color: #f59e0b;
          fill: #f59e0b;
        }

        .rating-sub {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Fanned Stacked Card */
        .fanned-card-wrapper {
          position: relative;
          width: 280px;
          height: 340px;
          margin: 0 auto;
        }

        .fanned-back {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: #e5e7eb;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .back-2 {
          transform: rotate(-6deg) scale(0.95);
          background: var(--bg-pink);
        }

        .back-1 {
          transform: rotate(4deg) scale(0.98);
          background: var(--bg-light-blue);
        }

        .fanned-top-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }

        .fanned-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .boarding-pass-stub {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #ffffff;
          color: var(--text-dark);
          font-size: 10px;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: rotate(2deg);
        }

        /* Masonry Grid */
        .masonry-wrapper {
          position: relative;
        }

        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .testimonial-card {
          background-color: var(--bg-card);
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.03);
          transition: var(--transition-smooth);
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .testi-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testi-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .testi-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .testi-loc {
          font-size: 12px;
          color: var(--text-muted);
        }

        .testi-divider {
          height: 1px;
          background: #e5e5e0;
          margin: 14px 0;
        }

        .testi-quote {
          font-size: 13px;
          color: var(--text-dark);
          line-height: 1.5;
        }

        /* Soft Fade Overlay */
        .masonry-fade-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%);
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .stories-header-split {
            grid-template-columns: 1fr;
          }
          .masonry-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
