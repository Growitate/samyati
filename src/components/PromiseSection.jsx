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
      text: "Hello! I'm Samyati AI, your personal travel consultant. Tell me what type of trip you are planning today or select your options below!"
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
      {/* Background Curved Landscape Photos */}
      <div className="abstract-bg-container">
        {/* Left Curved Mountain Photo */}
        <div className="curved-photo-left">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85" 
            alt="Mountain Lake Landscape" 
            className="curved-img" 
          />
        </div>

        {/* Right Curved Beach Photo */}
        <div className="curved-photo-right">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85" 
            alt="Sunset Beach Landscape" 
            className="curved-img" 
          />
        </div>

        {/* Dashed Flight Line */}
        <svg className="dashed-flight-svg" viewBox="0 0 1200 400" fill="none">
          <path d="M 50 350 Q 250 380 400 320 Q 550 260 700 340 T 1150 200" stroke="#d97706" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
        </svg>
      </div>

      <div className="container relative-z">
        <div className="promise-grid-layout">

          {/* 1. TOP-LEFT: Yellow Scalloped Flower Badge */}
          <div className="scatter-shape-wrapper shape-pos-top-left">
            <svg className="shape-bg-svg" viewBox="0 0 200 200">
              <path 
                d="M100,10 C110,10 115,20 125,20 C135,20 145,15 153,22 C161,29 160,40 167,48 C174,56 185,60 188,70 C191,80 182,90 182,100 C182,110 191,120 188,130 C185,140 174,144 167,152 C160,160 161,171 153,178 C145,185 135,180 125,180 C115,180 110,190 100,190 C90,190 85,180 75,180 C65,180 55,185 47,178 C39,171 40,160 33,152 C26,144 15,140 12,130 C9,120 18,110 18,100 C18,90 9,80 12,70 C15,60 26,56 33,48 C40,40 39,29 47,22 C55,15 65,20 75,20 C85,20 90,10 100,10 Z" 
                fill="#fef08a" 
              />
            </svg>
            <div className="shape-inner-content">
              <div className="white-icon-circle">
                <Sliders size={20} className="icon-dark" />
              </div>
              <p className="shape-title">Genuinely<br />Personalized</p>
            </div>
          </div>

          {/* 2. TOP-RIGHT: Pink Starburst Badge */}
          <div className="scatter-shape-wrapper shape-pos-top-right">
            <svg className="shape-bg-svg" viewBox="0 0 200 200">
              <path 
                d="M100,0 L115,30 L145,10 L148,45 L180,35 L170,68 L200,85 L180,110 L200,135 L170,145 L178,178 L145,165 L140,198 L112,175 L95,200 L82,172 L52,190 L52,158 L20,168 L32,138 L0,130 L22,102 L0,78 L32,68 L18,38 L50,45 L52,12 L82,30 Z" 
                fill="#fce7f3" 
              />
            </svg>
            <div className="shape-inner-content">
              <div className="white-icon-circle">
                <ShieldCheck size={20} className="icon-dark" />
              </div>
              <p className="shape-title">Dedicated<br />Human Support</p>
            </div>
          </div>

          {/* 3. CENTER: Main AI Chatbot Card */}
          <div className="ai-main-card chatbot-card-window">
            
            {/* Chatbot Window Header */}
            <div className="chatbot-header-bar">
              <div className="bot-avatar-group">
                <div className="bot-icon-circle">
                  <Bot size={20} className="bot-head-icon" />
                </div>
                <div className="bot-meta">
                  <h3 className="bot-name">Samyati AI Consultant</h3>
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
              <div className="chatbot-prompt-controls">
                {/* REALM SECTION */}
                <div className="prompt-group">
                  <span className="prompt-label">
                    <Globe size={13} /> REALM:
                  </span>
                  <div className="prompt-chips-row">
                    <button
                      type="button"
                      className={`chip-btn ${realm === 'Domestic' ? 'chip-active' : ''}`}
                      onClick={() => { setRealm('Domestic'); handleConsultAI('Domestic', vibe); }}
                    >
                      <Compass size={14} />
                      <span>In Desh (Domestic)</span>
                    </button>

                    <button
                      type="button"
                      className={`chip-btn ${realm === 'International' ? 'chip-active' : ''}`}
                      onClick={() => { setRealm('International'); handleConsultAI('International', vibe); }}
                    >
                      <Plane size={14} />
                      <span>Videsh (International)</span>
                    </button>

                    <button
                      type="button"
                      className={`chip-btn ${realm === 'Any' ? 'chip-active' : ''}`}
                      onClick={() => { setRealm('Any'); handleConsultAI('Any', vibe); }}
                    >
                      <Globe size={14} />
                      <span>Any Realm</span>
                    </button>
                  </div>
                </div>

                {/* VIBE SECTION */}
                <div className="prompt-group">
                  <span className="prompt-label">
                    <Sparkles size={13} /> TRAVEL VIBE:
                  </span>
                  <div className="prompt-chips-row">
                    <button
                      type="button"
                      className={`chip-btn ${vibe === 'Mountains & Snow' ? 'chip-active-vibe' : ''}`}
                      onClick={() => { setVibe('Mountains & Snow'); handleConsultAI(realm, 'Mountains & Snow'); }}
                    >
                      <Mountain size={14} />
                      <span>Mountains & Snow</span>
                    </button>

                    <button
                      type="button"
                      className={`chip-btn ${vibe === 'Beaches & Islands' ? 'chip-active-vibe' : ''}`}
                      onClick={() => { setVibe('Beaches & Islands'); handleConsultAI(realm, 'Beaches & Islands'); }}
                    >
                      <Sun size={14} />
                      <span>Beaches & Islands</span>
                    </button>

                    <button
                      type="button"
                      className={`chip-btn ${vibe === 'Heritage & Royal' ? 'chip-active-vibe' : ''}`}
                      onClick={() => { setVibe('Heritage & Royal'); handleConsultAI(realm, 'Heritage & Royal'); }}
                    >
                      <Landmark size={14} />
                      <span>Heritage & Royal</span>
                    </button>

                    <button
                      type="button"
                      className={`chip-btn ${vibe === 'Honeymoon' ? 'chip-active-vibe' : ''}`}
                      onClick={() => { setVibe('Honeymoon'); handleConsultAI(realm, 'Honeymoon'); }}
                    >
                      <Heart size={14} />
                      <span>Honeymoon & Romantic</span>
                    </button>
                  </div>
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
                      <div key={pkg.id} className="result-card" onClick={() => onSelectPackage(pkg)}>
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

          {/* 4. BOTTOM-LEFT: Peach Scalloped Blob Badge */}
          <div className="scatter-shape-wrapper shape-pos-bottom-left">
            <svg className="shape-bg-svg" viewBox="0 0 200 200">
              <path 
                d="M50,10 C90,-10 150,-10 180,30 C210,70 210,130 175,165 C140,200 70,205 30,175 C-10,145 -5,75 50,10 Z" 
                fill="#ffedd5" 
              />
            </svg>
            <div className="shape-inner-content">
              <div className="white-icon-circle">
                <UserCheck size={20} className="icon-dark" />
              </div>
              <p className="shape-title">Transparent<br />& Stress-Free</p>
            </div>
          </div>

          {/* 5. BOTTOM-RIGHT: Light Blue Diamond Badge */}
          <div className="scatter-shape-wrapper shape-pos-bottom-right">
            <svg className="shape-bg-svg" viewBox="0 0 200 200">
              <path 
                d="M100,10 C110,10 170,70 180,80 C190,90 190,110 180,120 C170,130 110,185 100,190 C90,190 30,135 20,120 C10,105 10,90 20,80 C30,70 90,10 100,10 Z" 
                fill="#dbeafe" 
              />
            </svg>
            <div className="shape-inner-content">
              <div className="white-icon-circle">
                <Globe size={20} className="icon-dark" />
              </div>
              <p className="shape-title">14 Unique<br />Destinations</p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .promise-ai-section {
          position: relative;
          background-color: #ffffff;
          padding: 100px 0 120px;
          overflow: hidden;
        }

        .relative-z {
          position: relative;
          z-index: 10;
        }

        /* Background Photo Containers */
        .abstract-bg-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .curved-photo-left {
          position: absolute;
          top: 160px;
          left: -40px;
          width: 420px;
          height: 380px;
          border-radius: 0 160px 160px 0;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          opacity: 0.95;
        }

        .curved-photo-right {
          position: absolute;
          top: 200px;
          right: -40px;
          width: 420px;
          height: 360px;
          border-radius: 160px 0 0 160px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          opacity: 0.95;
        }

        .curved-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dashed-flight-svg {
          position: absolute;
          bottom: 40px;
          left: 5%;
          width: 90%;
          height: 200px;
        }

        /* Promise Grid Layout */
        .promise-grid-layout {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 2.4fr 1fr;
          grid-template-rows: auto auto;
          gap: 20px;
          align-items: center;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* Scatter Badges */
        .scatter-shape-wrapper {
          position: relative;
          width: 170px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 25;
          transition: transform 0.4s ease;
        }

        .scatter-shape-wrapper:hover {
          transform: translateY(-6px) scale(1.05);
        }

        .shape-bg-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06));
        }

        .shape-inner-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .white-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          margin-bottom: 8px;
        }

        .icon-dark { color: var(--text-dark); }

        .shape-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.3;
        }

        .shape-pos-top-left { grid-column: 1; grid-row: 1; justify-self: end; }
        .shape-pos-top-right { grid-column: 3; grid-row: 1; justify-self: start; }
        .shape-pos-bottom-left { grid-column: 1; grid-row: 2; justify-self: end; }
        .shape-pos-bottom-right { grid-column: 3; grid-row: 2; justify-self: start; }

        /* Main Center Chatbot Card */
        .chatbot-card-window {
          grid-column: 2;
          grid-row: 1 / span 2;
          position: relative;
          z-index: 20;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Chat Header Bar */
        .chatbot-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #fafaf9;
          border-bottom: 1px solid #f0f0ee;
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
          background: #18181b;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .bot-meta {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .bot-name {
          font-size: 15px;
          font-weight: 800;
          color: #18181b;
        }

        .bot-status {
          font-size: 12px;
          color: #71717a;
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

        .chat-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff7ed;
          border: 1px solid #ffedd5;
          color: #c2410c;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
        }

        /* Chatbot Feed */
        .chatbot-feed {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          background: #ffffff;
        }

        .chat-bubble-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .bubble-ai {
          justify-content: flex-start;
        }

        .bubble-user {
          justify-content: flex-end;
        }

        .chat-avatar-mini {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #27272a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .chat-msg-content {
          max-width: 82%;
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          text-align: left;
        }

        .bubble-ai .chat-msg-content {
          background: #f4f4f5;
          color: #18181b;
          border-top-left-radius: 4px;
        }

        .bubble-user .chat-msg-content {
          background: #18181b;
          color: #ffffff;
          border-top-right-radius: 4px;
        }

        .typing-indicator {
          font-size: 13px;
          color: #71717a;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dot-pulse {
          font-weight: 800;
          color: #ea580c;
        }

        /* Prompt Controls Area Inside Feed */
        .chatbot-prompt-controls {
          background: #fafaf9;
          border: 1px solid #f0f0ee;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 6px;
        }

        .prompt-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .prompt-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #52525b;
        }

        .prompt-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-btn {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          color: #27272a;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .chip-btn:hover {
          border-color: #18181b;
          background: #f4f4f5;
        }

        .chip-btn.chip-active {
          background: #18181b;
          color: #ffffff;
          border-color: #18181b;
        }

        .chip-btn.chip-active-vibe {
          background: #ea580c;
          color: #ffffff;
          border-color: #ea580c;
        }

        /* Chat Results Cards Area */
        .chat-results-area {
          margin-top: 10px;
          text-align: left;
        }

        .results-header-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #18181b;
          margin-bottom: 10px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .result-card {
          background: #fafaf9;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e4e4e7;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }

        .result-card:hover {
          transform: translateY(-2px);
          border-color: #ea580c;
        }

        .res-img { width: 100%; height: 90px; object-fit: cover; }
        .res-details { padding: 10px; position: relative; }
        .res-match-pill { position: absolute; top: -12px; right: 8px; background: #059669; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; }
        .res-title { font-size: 12px; font-weight: 800; color: #18181b; }
        .res-reason { font-size: 10px; color: #71717a; margin-top: 2px; }
        .res-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
        .res-price { font-size: 13px; color: #ea580c; }
        .res-link { font-size: 10px; font-weight: 700; color: #27272a; }

        /* Chatbot Input Bar */
        .chatbot-input-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          background: #fafaf9;
          border-top: 1px solid #f0f0ee;
        }

        .chat-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 9999px;
          padding: 8px 16px;
        }

        .chat-input-icon { color: #a1a1aa; }

        .chat-text-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 13px;
          color: #18181b;
          background: transparent;
        }

        .chat-send-btn {
          background: #18181b;
          color: #ffffff;
          border: none;
          padding: 9px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, transform 0.2s;
        }

        .chat-send-btn:hover {
          background: #27272a;
          transform: translateY(-1px);
        }

        .ai-card-footer-caption {
          padding: 12px 20px;
          font-size: 11px;
          color: #71717a;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #ffffff;
          border-top: 1px solid #f4f4f5;
        }

        .footer-bot-icon { color: #ea580c; }
        .highlight-text { color: #ea580c; }

        @media (max-width: 960px) {
          .promise-grid-layout { grid-template-columns: 1fr; grid-template-rows: auto; }
          .chatbot-card-window { grid-column: 1; grid-row: 1; }
          .scatter-shape-wrapper { display: none; }
          .curved-photo-left, .curved-photo-right { display: none; }
          .results-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

