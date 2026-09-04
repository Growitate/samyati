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
import { usePackages } from '../context/PackageContext';

export default function PromiseSection({ onSelectPackage, onOpenOfferModal }) {
  const { packages: PACKAGES } = usePackages();
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

  const handlePresetClick = (queryText) => {
    setCustomInput(queryText);
    handleConsultAI(realm, vibe, queryText);
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
          
          {/* LEFT COLUMN: Header, Description & Topic Tags from Img 1 */}
          <div className="promise-left-col">
            <div className="eyebrow-pill-gold mb-3">
              <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
              <span>MEET YOUR AI TRAVEL COMPANION</span>
            </div>

            <h2 className="promise-h2-title">
              From “where next?” <br />
              to a real plan.
            </h2>

            <p className="promise-header-sub">
              Ask naturally, just as you would message a travel expert. You get destination guidance, a suggested itinerary and direct links to relevant Samyati packages.
            </p>

            {/* Topic Filter Pills */}
            <div className="ai-topic-pills-wrap">
              {[
                'Best travel time',
                'Ideal duration',
                'Photo locations',
                'Attractions',
                'Weather',
                'Local tips',
                'Day-wise itinerary'
              ].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handlePresetClick(topic)}
                  className="ai-topic-pill"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: AI Chatbot Dashboard Card */}
          <div className="promise-right-col">
            <div className="ai-main-card chatbot-card-window">
              
              {/* Chatbot Window Header */}
              <div className="chatbot-header-bar">
                <div className="bot-avatar-group">
                  <div className="bot-icon-circle">
                    <Bot size={22} className="bot-head-icon" />
                  </div>
                  <div className="bot-meta">
                    <div className="bot-title-flex">
                      <h3 className="bot-name">Samyati Travel Advisor</h3>
                      <span className="ai-usp-pill">✨ MAIN WEBSITE USP</span>
                    </div>
                    <span className="bot-status">
                      <span className="online-dot" /> Live 24/7 Instant Itinerary Assistant
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

                {/* Interactive 1-Tap Quick Action Chips */}
                <div className="ai-quick-chips-bar">
                  <span className="quick-chips-label">⚡ 1-Tap Quick Try:</span>
                  <div className="quick-chips-list">
                    <button type="button" onClick={() => handlePresetClick('Recommend a 5-day snow trip in Kashmir')} className="ai-chip-pill">
                      🏔️ Kashmir Snow Trip
                    </button>
                    <button type="button" onClick={() => handlePresetClick('Bali 6-day romantic getaway')} className="ai-chip-pill">
                      🏝️ Bali Getaway
                    </button>
                    <button type="button" onClick={() => handlePresetClick('Rajasthan fort and desert safari')} className="ai-chip-pill">
                      🏰 Rajasthan Forts
                    </button>
                    <button type="button" onClick={() => handlePresetClick('Himachal 5-day mountain escape')} className="ai-chip-pill">
                      ⛰️ Himachal Escapes
                    </button>
                  </div>
                </div>
                

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

        .promise-h2-title .accent-serif,
        .accent-serif {
          font-family: var(--font-serif-italic), 'Cormorant Garamond', Georgia, serif !important;
          font-style: italic !important;
          font-weight: 700 !important;
          font-size: 1.18em !important;
          color: #d97706 !important;
          vertical-align: baseline;
          letter-spacing: -0.01em;
          display: inline-block;
        }

        .promise-header-sub {
          font-size: 15.5px;
          color: #475569;
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .ai-topic-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
          max-width: 540px;
        }

        .ai-topic-pill {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          font-family: var(--font-sans);
        }

        .ai-topic-pill:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.15);
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

        /* RIGHT COLUMN: HIGH-VISIBILITY AI CHATBOT CARD (MAIN WEBSITE USP) */
        .promise-right-col {
          width: 100%;
        }

        .chatbot-card-window {
          position: relative;
          background: #ffffff;
          border-radius: 26px;
          box-shadow: 
            0 25px 65px -10px rgba(15, 23, 42, 0.22), 
            0 0 0 2.5px #d97706, 
            0 0 35px rgba(217, 119, 6, 0.28);
          border: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chatbot-card-window:hover {
          box-shadow: 
            0 30px 75px -10px rgba(15, 23, 42, 0.28), 
            0 0 0 2.5px #f59e0b, 
            0 0 45px rgba(245, 158, 11, 0.38);
        }

        .chatbot-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bot-avatar-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .bot-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .bot-meta {
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 2px;
        }

        .bot-title-flex {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .bot-name {
          font-size: 16.5px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .ai-usp-pill {
          background: #d97706;
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(217, 119, 6, 0.4);
        }

        .bot-status {
          font-size: 12px;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
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

        /* Quick 1-Tap Action Chips */
        .ai-quick-chips-bar {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #fefce8;
          border: 1px solid #fef08a;
          padding: 12px 14px;
          border-radius: 16px;
        }

        .quick-chips-label {
          font-size: 11px;
          font-weight: 800;
          color: #b45309;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .quick-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .ai-chip-pill {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          font-size: 11.5px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .ai-chip-pill:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: translateY(-1px);
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
          gap: 10px;
          padding: 14px 18px;
          background: #fefce8;
          border-top: 1px solid #e2e8f0;
        }

        .chat-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 2px solid #cbd5e1;
          border-radius: 9999px;
          padding: 0 16px;
          transition: all 0.25s ease;
        }

        .chat-input-wrapper:focus-within {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.25);
        }

        .chat-input-icon {
          color: #d97706;
        }

        .chat-text-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
          padding: 11px 0;
          font-family: inherit;
          background: transparent;
        }

        .chat-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border: none;
          padding: 11px 22px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
        }

        .chat-send-btn:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.35);
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
