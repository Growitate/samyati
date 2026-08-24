import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  Sliders, 
  ArrowRight, 
  Plane, 
  Compass, 
  Mountain, 
  Sun, 
  Landmark, 
  Heart, 
  Send,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { PACKAGES } from '../data/travelData';

export default function PromiseSection({ onSelectPackage, onOpenOfferModal }) {
  const [realm, setRealm] = useState('Domestic');
  const [vibe, setVibe] = useState('Mountains & Snow');
  const [customInput, setCustomInput] = useState('');

  const [chatLog, setChatLog] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm Samyati AI, your personal travel advisor. Tell me what type of trip you are planning today or select your options below!"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const handleConsultAI = (selectedRealm = realm, selectedVibe = vibe, userText = null) => {
    const promptText = userText 
      ? userText 
      : `Looking for a ${selectedVibe} trip in ${selectedRealm === 'Any' ? 'Any destination' : selectedRealm}.`;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: promptText };
    setChatLog((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setRecommendations(null);

    setTimeout(() => {
      let filtered = PACKAGES.filter((p) => {
        if (selectedRealm !== 'Any' && p.category !== selectedRealm) return false;
        return true;
      });

      if (filtered.length < 2) filtered = PACKAGES;

      const top2 = filtered.slice(0, 2).map((pkg, idx) => ({
        ...pkg,
        matchScore: idx === 0 ? '98% Match' : '94% Match',
        aiReason: idx === 0 
          ? `Highest match for your ${selectedVibe.toLowerCase()} preference.`
          : `Top recommended for ${selectedRealm} travellers.`
      }));

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Here are the top recommended packages matching your request for ${selectedVibe}:`
      };

      setChatLog((prev) => [...prev, aiReply]);
      setRecommendations(top2);
      setIsTyping(false);
    }, 700);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleConsultAI(realm, vibe, customInput);
      setCustomInput('');
    } else {
      handleConsultAI(realm, vibe);
    }
  };

  return (
    <section className="promise-ai-section" id="ai-consultant">
      <div className="container relative-z">
        {/* EXECUTIVE 2-COLUMN SPLIT DASHBOARD LAYOUT */}
        <div className="promise-split-dashboard">
          
          {/* LEFT COLUMN: Header, 4 Pillar Cards & Human Support CTA */}
          <div className="promise-left-col">
            <div className="eyebrow-pill-gold mb-3">
              <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
              <span>HOW SAMYATI WORKS</span>
            </div>

            <h2 className="promise-h2-title">
              Smart Travel Concierge <br className="hidden-desktop-br" />
              <span className="accent-serif">— Built Around You</span>
            </h2>

            <p className="promise-header-sub">
              Use our Smart AI Assistant to match destinations by <strong>Realm</strong> & <strong>Vibe</strong>, 
              or explore our 4 brand promises for a 100% personalized, transparent, and stress-free journey.
            </p>

            {/* 4 Feature Pillar Cards Grid (2x2 Grid) */}
            <div className="promise-pillars-grid">
              <div className="pillar-card">
                <div className="pillar-icon bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Sliders size={20} />
                </div>
                <div className="pillar-text">
                  <h4 className="pillar-title">100% Tailored</h4>
                  <p className="pillar-desc">Customized to your exact budget & pacing</p>
                </div>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <ShieldCheck size={20} />
                </div>
                <div className="pillar-text">
                  <h4 className="pillar-title">Zero Hidden Costs</h4>
                  <p className="pillar-desc">Transparent itemized GST tax invoices</p>
                </div>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon bg-sky-500/10 text-sky-600 border-sky-500/20">
                  <UserCheck size={20} />
                </div>
                <div className="pillar-text">
                  <h4 className="pillar-title">24/7 Human Concierge</h4>
                  <p className="pillar-desc">Dedicated on-tour support on WhatsApp</p>
                </div>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon bg-purple-500/10 text-purple-600 border-purple-500/20">
                  <Bot size={20} />
                </div>
                <div className="pillar-text">
                  <h4 className="pillar-title">Instant AI Match</h4>
                  <p className="pillar-desc">Smart day-by-day itinerary suggestions</p>
                </div>
              </div>
            </div>

            {/* Human Concierge Direct Contact Strip */}
            <div className="human-concierge-strip">
              <div className="concierge-meta">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Prefer human assistance over AI?</span>
              </div>
              <button 
                onClick={() => onOpenOfferModal ? onOpenOfferModal('Human Concierge Consultation') : (window.location.hash = '#contact')} 
                className="btn-direct-concierge"
              >
                <span>Talk to Human Specialist</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Chatbot Dashboard Card */}
          <div className="promise-right-col">
            <div className="ai-main-card chatbot-card-window">
              
              {/* Chatbot Window Header */}
              <div className="chatbot-header-bar">
                <div className="bot-avatar-group">
                  <div className="bot-icon-circle">
                    <Bot size={20} className="bot-head-icon" />
                  </div>
                  <div className="bot-meta">
                    <h3 className="bot-name">Samyati Travel Advisor</h3>
                    <span className="bot-status">
                      <span className="online-dot" /> Instant Itinerary Assistant
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Feed Messages Area */}
              <div className="chatbot-feed">
                {chatLog.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="chat-avatar-mini">
                        <Bot size={14} />
                      </div>
                    )}

                    <div className="chat-msg-content">
                      <p className="msg-text">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="chat-bubble-row bubble-ai">
                    <div className="chat-avatar-mini">
                      <Bot size={14} />
                    </div>
                    <div className="chat-msg-content typing-indicator">
                      <span>Samyati AI is crafting your recommendations</span>
                      <span className="dot-pulse">...</span>
                    </div>
                  </div>
                )}

                {/* Interactive Prompt Chip Controls */}
                

                {/* AI Recommendation Output Cards */}
                {recommendations && (
                  <div className="chat-results-area">
                    <div className="results-header-tag">
                      <CheckCircle2 size={15} className="text-amber-600" />
                      <span>Top Matched Packages</span>
                    </div>

                    <div className="results-grid">
                      {recommendations.map((pkg) => (
                        <div key={pkg.id} className="result-card" onClick={() => onSelectPackage && onSelectPackage(pkg)}>
                          <img src={pkg.image} alt={pkg.title} className="res-img" />
                          <div className="res-details">
                            <span className="res-match-pill">{pkg.matchScore}</span>
                            <h4 className="res-title">{pkg.title}</h4>
                            <p className="res-reason">{pkg.aiReason}</p>
                            <div className="res-footer">
                              <strong className="res-price">{pkg.price}</strong>
                              <span className="res-link">View Package →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chatbot Bottom Interactive Input Bar */}
              <form onSubmit={handleFormSubmit} className="chatbot-input-bar">
                <div className="chat-input-wrapper">
                  <MessageSquare size={16} className="chat-input-icon" />
                  <input
                    type="text"
                    placeholder="Ask Samyati AI (e.g. Recommend a 5-day snow trip in Kashmir...)"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="chat-text-input"
                  />
                </div>

                <button type="submit" className="chat-send-btn" disabled={isTyping}>
                  <span>Send</span>
                  <Send size={14} />
                </button>
              </form>

              {/* AI Card Footer Note */}
              <div className="ai-card-footer-caption">
                <Bot size={14} className="footer-bot-icon" />
                <span>Smart AI recommendations. <strong className="highlight-text">Real human-crafted experiences.</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .promise-ai-section {
          position: relative;
          background-color: #fefce8;
          padding: 85px 0 95px;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          font-family: var(--font-sans);
          overflow: hidden;
        }

        .relative-z {
          position: relative;
          z-index: 10;
        }

        /* Executive 2-Column Split Dashboard */
        .promise-split-dashboard {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 44px;
          align-items: center;
          max-width: 1240px;
          margin: 0 auto;
        }

        .promise-left-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .eyebrow-pill-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fffbe6;
          border: 1px solid #fef08a;
          color: #b45309;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 6px 16px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .promise-h2-title {
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          margin-top: 12px;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .accent-serif {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif !important;
          font-style: italic !important;
          font-weight: 600 !important;
          color: #d97706 !important;
        }

        .promise-header-sub {
          font-size: 15.5px;
          color: #475569;
          line-height: 1.65;
          margin-bottom: 32px;
        }

        /* 4 Pillars Cards Grid (2x2) */
        .promise-pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
          margin-bottom: 28px;
        }

        .pillar-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: all 0.25s ease;
        }

        .pillar-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
          border-color: #cbd5e1;
        }

        .pillar-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid;
        }

        .pillar-text {
          display: flex;
          flex-direction: column;
        }

        .pillar-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 3px;
        }

        .pillar-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Human Concierge Direct Contact Strip */
        .human-concierge-strip {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }

        .concierge-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .btn-direct-concierge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0f172a;
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .btn-direct-concierge:hover {
          background: #1e293b;
          transform: translateX(2px);
        }

        /* RIGHT COLUMN: AI CHATBOT CARD */
        .promise-right-col {
          width: 100%;
        }

        .chatbot-card-window {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.07);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .chatbot-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #fefce8;
          border-bottom: 1px solid #e2e8f0;
        }

        .bot-avatar-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bot-meta {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .bot-name {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
        }

        .bot-status {
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .online-dot {
          width: 7px;
          height: 7px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
        }

        .chatbot-feed {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #ffffff;
        }

        .chat-bubble-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .chat-avatar-mini {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .chat-msg-content {
          background: #fefce8;
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 13.5px;
          color: #1e293b;
          line-height: 1.5;
          max-width: 90%;
        }

        .bubble-user .chat-msg-content {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          margin-left: auto;
        }

        .typing-indicator {
          font-size: 12.5px;
          color: #64748b;
          font-style: italic;
        }

        /* Controls Area */
        .chatbot-prompt-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fefce8;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .prompt-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .prompt-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .prompt-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chip-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .chip-btn.chip-active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          font-weight: 700;
        }

        .chip-btn.chip-active-vibe {
          background: #ea580c;
          color: #ffffff;
          border-color: #ea580c;
          font-weight: 700;
        }

        /* Results Area */
        .chat-results-area {
          margin-top: 10px;
        }

        .results-header-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #d97706;
          margin-bottom: 10px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .result-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .res-img {
          width: 100%;
          height: 90px;
          object-fit: cover;
        }

        .res-details {
          padding: 10px;
        }

        .res-match-pill {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          background: #ecfdf5;
          color: #059669;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .res-title {
          font-size: 12.5px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2px;
          line-height: 1.3;
        }

        .res-reason {
          font-size: 10.5px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .res-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
          padding-top: 6px;
        }

        .res-price {
          font-size: 12px;
          color: #d97706;
        }

        .res-link {
          font-size: 10.5px;
          font-weight: 700;
          color: #0284c7;
        }

        /* Input Form Bar */
        .chatbot-input-bar {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          background: #fefce8;
          border-top: 1px solid #e2e8f0;
        }

        .chat-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          padding: 0 14px;
        }

        .chat-input-icon {
          color: #94a3b8;
        }

        .chat-text-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 13px;
          padding: 10px 0;
          font-family: inherit;
          background: transparent;
        }

        .chat-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .chat-send-btn:hover {
          background: #1e293b;
        }

        .ai-card-footer-caption {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          font-size: 11px;
          color: #64748b;
        }

        .highlight-text {
          color: #0f172a;
        }

        /* RESPONSIVE MEDIA QUERIES */
        .hidden-desktop-br { display: none; }

        @media (max-width: 1024px) {
          .promise-split-dashboard {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }

        @media (max-width: 768px) {
          .hidden-desktop-br { display: block; }
          .promise-h2-title {
            font-size: clamp(25px, 6.8vw, 32px) !important;
            line-height: 1.25 !important;
            margin-bottom: 14px !important;
          }
          .eyebrow-pill-gold {
            font-size: 10.5px !important;
            padding: 4px 12px !important;
            display: inline-flex !important;
          }
          .promise-header-sub {
            font-size: 13.5px !important;
            line-height: 1.6 !important;
            margin-bottom: 22px !important;
          }
          .pillar-card {
            padding: 14px 16px !important;
            border-radius: 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }

        @media (max-width: 600px) {
          .promise-pillars-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .human-concierge-strip {
            flex-direction: column;
            text-align: center;
          }
          .btn-direct-concierge {
            width: 100%;
            justify-content: center;
          }
          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
