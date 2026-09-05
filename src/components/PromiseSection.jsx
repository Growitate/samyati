import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  RotateCcw,
  Zap,
  PhoneCall
} from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { sendChatMessage, formatAiMarkdown, GROQ_MODELS } from '../utils/aiService';

export default function PromiseSection({ onSelectPackage, onOpenOfferModal }) {
  const { packages: PACKAGES } = usePackages();
  const [realm, setRealm] = useState('Domestic');
  const [vibe, setVibe] = useState('Mountains & Snow');
  const [customInput, setCustomInput] = useState('');
  const [activeModel, setActiveModel] = useState(GROQ_MODELS.PRIMARY);
  const [modelLabel, setModelLabel] = useState('Instant Concierge');

  const [chatLog, setChatLog] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! How can I help you today? I'm your travel expert and consultant here at Samyati. Where are you planning to travel, or what kind of trip do you have in mind?"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const chatFeedRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat feed on every message / recommendation (like WhatsApp)
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatLog, isTyping, recommendations]);

  const handleConsultAI = async (selectedRealm = realm, selectedVibe = vibe, userText = null) => {
    const promptText = userText 
      ? userText 
      : `Looking for a ${selectedVibe} trip in ${selectedRealm === 'Any' ? 'Any destination' : selectedRealm}.`;

    // Add user message to UI
    const userMsg = { id: Date.now(), sender: 'user', text: promptText };
    const updatedLog = [...chatLog, userMsg];
    setChatLog(updatedLog);
    setIsTyping(true);
    setRecommendations(null);

    try {
      const response = await sendChatMessage({
        messages: updatedLog.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        prompt: promptText,
        category: userText ? '' : (selectedRealm === 'Any' ? '' : selectedRealm),
        model: activeModel
      });

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        modelUsed: response.modelUsed,
        latencyMs: response.latencyMs
      };

      setChatLog(prev => [...prev, aiReply]);
      setModelLabel('Instant Concierge');

      // Only show package recommendations if the consultant provided matched packages for a trip query
      if (response.matchedPackages && response.matchedPackages.length > 0) {
        setRecommendations(response.matchedPackages);
      } else {
        setRecommendations(null);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatLog(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm having a brief connection delay. Please feel free to select from our featured packages or reach our travel experts directly on WhatsApp (+91-9589110765)!"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setChatLog([
      {
        id: Date.now(),
        sender: 'ai',
        text: "Conversation reset! How can I help you plan your next adventure today?"
      }
    ]);
    setRecommendations(null);
    setCustomInput('');
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
          
          {/* LEFT COLUMN: Header, Description & Topic Tags */}
          <div className="promise-left-col">
            <div className="eyebrow-pill-gold mb-3">
              <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
              <span>YOUR PERSONAL TRAVEL CONSULTANT</span>
            </div>

            <h2 className="promise-h2-title">
              From “Where <br />
              Next?” <br />
              To A Real Plan
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

          {/* RIGHT COLUMN: Chatbot Dashboard Card */}
          <div className="promise-right-col">
            <div className="ai-main-card chatbot-card-window" data-lenis-prevent="true">
              
              {/* Chatbot Window Header */}
              <div className="chatbot-header-bar">
                <div className="bot-avatar-group">
                  <div className="bot-icon-circle">
                    <Bot size={22} className="bot-head-icon" />
                  </div>
                  <div className="bot-meta">
                    <div className="bot-title-flex">
                      <h3 className="bot-name">Samyati Travel Advisor</h3>
                      <span className="ai-usp-pill">✨ Instant Concierge</span>
                    </div>
                    <span className="bot-status">
                      <span className="online-dot" /> Live 24/7 Dedicated Specialist
                    </span>
                  </div>
                </div>

                <div className="chatbot-header-actions">
                  <button 
                    type="button" 
                    onClick={handleResetChat} 
                    className="btn-reset-chat" 
                    title="Start fresh conversation"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Chat Feed Messages Area (Scrollable with Auto-Scroll and Lenis Prevention) */}
              <div 
                className="chatbot-feed" 
                ref={chatFeedRef}
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
              >
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
                      {msg.sender === 'ai' ? (
                        <div 
                          className="msg-text ai-markdown-body" 
                          dangerouslySetInnerHTML={{ __html: formatAiMarkdown(msg.text) }} 
                        />
                      ) : (
                        <p className="msg-text">{msg.text}</p>
                      )}

                      {msg.latencyMs > 0 && (
                        <span className="msg-meta-latency">
                          ⚡ {msg.latencyMs}ms response time
                        </span>
                      )}
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
                      <div className="typing-pulse-row">
                        <Sparkles size={13} className="text-amber-500 animate-spin" />
                        <span>Crafting your personalized itinerary...</span>
                      </div>
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
                    <button type="button" onClick={() => handlePresetClick('Kerala 5-day backwaters & tea hills')} className="ai-chip-pill">
                      🌴 Kerala Backwaters
                    </button>
                    <button type="button" onClick={() => handlePresetClick('Dubai 5-day luxury city & desert')} className="ai-chip-pill">
                      🏙️ Dubai Highlights
                    </button>
                  </div>
                </div>
                

                {/* Recommendation Output Cards */}
                {recommendations && (
                  <div className="chat-results-area">
                    <div className="results-header-tag">
                      <CheckCircle2 size={15} className="text-amber-600" />
                      <span>Top Recommended Samyati Packages</span>
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

                    {/* Direct WhatsApp Consultation Button with Chat Context */}
                    <div className="chat-wa-handshake">
                      <a 
                        href={`https://wa.me/919589110765?text=${encodeURIComponent('Hi Samyati Team, I just generated an itinerary on your website for: ' + (chatLog[chatLog.length - 2]?.text || 'a custom trip') + '. Can you help customize and book it?')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-chat-wa-handoff"
                      >
                        <PhoneCall size={14} />
                        <span>Send this Plan to WhatsApp Expert (+91-9589110765) →</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Bottom marker for WhatsApp-like auto scroll */}
                <div ref={messagesEndRef} />
              </div>

              {/* Chatbot Bottom Interactive Input Bar */}
              <form onSubmit={handleFormSubmit} className="chatbot-input-bar">
                <div className="chat-input-wrapper">
                  <MessageSquare size={16} className="chat-input-icon" />
                  <input
                    type="text"
                    placeholder="Ask Samyati Travel Advisor (e.g. Recommend a 5-day trip for 2 people with budget...)"
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

              {/* Card Footer Note */}
              <div className="ai-card-footer-caption">
                <Bot size={14} className="footer-bot-icon" />
                <span>Verified Travel Guidance • <strong className="highlight-text">Handcrafted Journeys & 24/7 Support</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .promise-ai-section {
          position: relative;
          background-color: #fefce8;
          padding: 40px 0 44px;
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
          grid-template-columns: 0.88fr 1.12fr;
          gap: 40px;
          align-items: center;
          max-width: 1300px;
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
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.14;
          margin-top: 14px;
          margin-bottom: 18px;
          letter-spacing: -0.025em;
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
          border-radius: 28px;
          box-shadow: 
            0 28px 75px -10px rgba(15, 23, 42, 0.24), 
            0 0 0 3px #d97706, 
            0 0 45px rgba(217, 119, 6, 0.32);
          border: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 560px;
          max-height: 560px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chatbot-card-window:hover {
          box-shadow: 
            0 34px 85px -10px rgba(15, 23, 42, 0.3), 
            0 0 0 3px #f59e0b, 
            0 0 55px rgba(245, 158, 11, 0.42);
        }

        .chatbot-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .bot-avatar-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .bot-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.45);
          border: 2px solid rgba(255, 255, 255, 0.35);
        }

        .bot-meta {
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 3px;
        }

        .bot-title-flex {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bot-name {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .ai-usp-pill {
          background: #d97706;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(217, 119, 6, 0.45);
        }

        .bot-status {
          font-size: 13px;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 7px;
          font-weight: 500;
        }

        .online-dot {
          width: 9px;
          height: 9px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 10px #10b981;
        }

        .chatbot-feed {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #f8fafc;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scroll-behavior: smooth;
        }

        .chatbot-feed::-webkit-scrollbar {
          width: 6px;
        }
        .chatbot-feed::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .chatbot-feed::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .chatbot-feed::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .chat-bubble-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .chat-avatar-mini {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .chatbot-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .groq-model-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          letter-spacing: 0.02em;
        }

        .groq-zap-icon {
          color: #f59e0b;
        }

        .btn-reset-chat {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #e2e8f0;
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset-chat:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .chat-msg-content {
          background: #fefce8;
          border: 1px solid #e2e8f0;
          padding: 15px 20px;
          border-radius: 16px;
          font-size: 15px;
          color: #1e293b;
          line-height: 1.55;
          max-width: 92%;
        }

        .bubble-user .chat-msg-content {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          margin-left: auto;
        }

        .typing-indicator {
          font-size: 13.5px;
          color: #64748b;
          font-style: italic;
        }

        .ai-markdown-body {
          font-size: 14.5px;
          line-height: 1.65;
          color: #1e293b;
        }

        .ai-markdown-body .ai-msg-h3 {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 14px 0 6px;
        }

        .ai-markdown-body .ai-msg-h4 {
          font-size: 14.5px;
          font-weight: 700;
          color: #b45309;
          margin: 12px 0 4px;
        }

        .ai-markdown-body .ai-msg-h5 {
          font-size: 13.5px;
          font-weight: 700;
          color: #334155;
          margin: 10px 0 4px;
        }

        .ai-markdown-body .ai-msg-p {
          margin: 0 0 10px;
        }

        .ai-markdown-body .ai-msg-list {
          margin: 6px 0 12px 18px;
          padding: 0;
          list-style-type: disc;
        }

        .ai-markdown-body .ai-msg-list li {
          margin-bottom: 5px;
        }

        .ai-msg-media-card {
          margin: 12px 0 14px 0;
          border-radius: 12px;
          overflow: hidden;
          background: #0f172a;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
          max-width: 100%;
        }

        .ai-msg-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .ai-msg-img:hover {
          transform: scale(1.02);
        }

        .ai-msg-img-caption {
          display: block;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
          background: rgba(15, 23, 42, 0.95);
          letter-spacing: 0.2px;
        }

        .ai-msg-link {
          color: #b45309;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }

        .ai-msg-link:hover {
          color: #92400e;
        }

        .ai-table-wrap {
          margin: 12px 0;
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .ai-msg-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          text-align: left;
        }

        .ai-msg-table th {
          background: #f8fafc;
          color: #0f172a;
          font-weight: 700;
          padding: 8px 12px;
          border-bottom: 2px solid #e2e8f0;
          white-space: nowrap;
        }

        .ai-msg-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: top;
        }

        .ai-msg-table tr:last-child td {
          border-bottom: none;
        }

        .ai-msg-table tr:hover {
          background: #fdfaf6;
        }

        .ai-msg-hr {
          border: none;
          height: 1px;
          background: #e2e8f0;
          margin: 14px 0;
        }

        .msg-meta-latency {
          display: block;
          margin-top: 6px;
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        .typing-pulse-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b45309;
          font-weight: 600;
        }

        .chat-wa-handshake {
          margin-top: 14px;
          text-align: center;
        }

        .btn-chat-wa-handoff {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
          width: 100%;
        }

        .btn-chat-wa-handoff:hover {
          background: linear-gradient(135deg, #166534 0%, #15803d 100%);
          transform: translateY(-1px);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(22, 163, 74, 0.45);
        }

        /* Quick 1-Tap Action Chips */
        .ai-quick-chips-bar {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #fefce8;
          border: 1px solid #fef08a;
          padding: 16px 18px;
          border-radius: 18px;
        }

        .quick-chips-label {
          font-size: 12px;
          font-weight: 800;
          color: #b45309;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .quick-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ai-chip-pill {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          font-size: 12.5px;
          font-weight: 700;
          padding: 7px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
          gap: 12px;
          padding: 14px 20px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .chat-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 2px solid #cbd5e1;
          border-radius: 9999px;
          padding: 0 20px;
          transition: all 0.25s ease;
        }

        .chat-input-wrapper:focus-within {
          border-color: #d97706;
          box-shadow: 0 0 0 3.5px rgba(217, 119, 6, 0.25);
        }

        .chat-input-icon {
          color: #d97706;
          width: 18px;
          height: 18px;
        }

        .chat-text-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 14.5px;
          font-weight: 600;
          color: #0f172a;
          padding: 13px 0;
          font-family: inherit;
          background: transparent;
        }

        .chat-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border: none;
          padding: 13px 26px;
          border-radius: 9999px;
          font-size: 14px;
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
          gap: 8px;
          padding: 10px 20px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          font-size: 11.5px;
          color: #64748b;
          flex-shrink: 0;
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
            font-size: clamp(26px, 7vw, 36px) !important;
            font-weight: 900 !important;
            line-height: 1.18 !important;
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
