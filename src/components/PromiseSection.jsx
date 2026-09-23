import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Bot, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  Sliders, 
  ArrowRight, 
  ArrowDown,
  Square,
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
import { sendChatMessage, formatAiMarkdown, stripThinkingProcess, GROQ_MODELS } from '../utils/aiService';

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
      text: "Hello hello! 🎉 Welcome to Samyati! I'm your super excited and happy travel consultant here today! ✈️✨ Where are you dreaming of heading, or what kind of magical getaway do you have in mind?"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const chatFeedRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isUserScrolledUpRef = useRef(false);

  // Typewriter Engine Refs for smooth human typing effect
  const typingTimerRef = useRef(null);
  const typewriterStateRef = useRef({
    activeMsgId: null,
    targetText: '',
    displayedText: '',
    isTyping: false,
    networkDone: false,
    metadata: null
  });

  // Stop / clear active typing timer
  const stopTypewriter = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    typewriterStateRef.current.isTyping = false;
  };

  // Finalize the message bubble once typing is complete
  const finalizeTypewriterMessage = () => {
    stopTypewriter();
    const st = typewriterStateRef.current;
    const msgId = st.activeMsgId;
    if (!msgId) return;

    const finalText = st.targetText || st.displayedText;
    const meta = st.metadata || {};

    setChatLog(prev => prev.map(m => 
      m.id === msgId ? {
        ...m,
        text: finalText,
        isStreaming: false,
        modelUsed: meta.modelUsed || m.modelUsed || 'Samyati Senior Travel Advisor',
        latencyMs: meta.latencyMs || m.latencyMs || 0,
        matchedPackages: meta.matchedPackages || []
      } : m
    ));

    if (meta.matchedPackages && meta.matchedPackages.length > 0) {
      setRecommendations(meta.matchedPackages);
    } else {
      setRecommendations(null);
    }

    setIsGenerating(false);
    setIsTyping(false);
    typewriterStateRef.current.activeMsgId = null;

    if (!isUserScrolledUpRef.current && chatFeedRef.current) {
      const feed = chatFeedRef.current;
      const activeBubble = feed.querySelector(`[data-msg-id="${msgId}"]`);
      if (activeBubble) {
        const bubbleBottom = activeBubble.offsetTop + activeBubble.offsetHeight;
        const visibleBottom = feed.scrollTop + feed.clientHeight;
        if (bubbleBottom > visibleBottom - 20) {
          feed.scrollTo({
            top: bubbleBottom - feed.clientHeight + 28,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Core recursive typewriter loop with human-like rhythm and dynamic catch-up
  const runTypewriterTick = () => {
    const st = typewriterStateRef.current;
    if (!st.isTyping || !st.activeMsgId) return;

    const currentLen = st.displayedText.length;
    const targetLen = st.targetText.length;

    if (currentLen < targetLen) {
      const backlog = targetLen - currentLen;

      // Dynamic pacing: human slow speed (~24-30ms) when close to target, progressive catch-up for large text
      let stepSize = 1;
      if (backlog > 200) {
        stepSize = Math.min(4, backlog);
      } else if (backlog > 90) {
        stepSize = Math.min(3, backlog);
      } else if (backlog > 40) {
        stepSize = Math.min(2, backlog);
      }

      const nextChunk = st.targetText.slice(currentLen, currentLen + stepSize);
      const nextText = st.displayedText + nextChunk;
      st.displayedText = nextText;

      const currentMsgId = st.activeMsgId;
      setChatLog(prev => prev.map(m => 
        m.id === currentMsgId ? { ...m, text: nextText, isStreaming: true } : m
      ));

      // ChatGPT behavior: keep the top of the response showing, and only scroll down as typing progresses below viewport
      if (!isUserScrolledUpRef.current && chatFeedRef.current) {
        const feed = chatFeedRef.current;
        const activeBubble = feed.querySelector(`[data-msg-id="${currentMsgId}"]`);
        if (activeBubble) {
          const bubbleBottom = activeBubble.offsetTop + activeBubble.offsetHeight;
          const visibleBottom = feed.scrollTop + feed.clientHeight;
          // Only scroll if the active typing content reaches near the bottom of the visible area
          if (bubbleBottom > visibleBottom - 20) {
            feed.scrollTop = bubbleBottom - feed.clientHeight + 28;
          }
        }
      }

      // Calculate organic human delay with punctuation pauses
      const lastChar = nextChunk[nextChunk.length - 1];
      const charAhead = st.targetText[nextText.length] || '';
      
      // Base natural human typing speed: 22-30ms with subtle organic variance
      let delay = 24 + Math.floor(Math.random() * 8 - 4);

      // Punctuation nuances (thinking and breath pauses):
      if (lastChar === '\n') {
        delay = 140 + Math.floor(Math.random() * 30);
      } else if (['.', '!', '?'].includes(lastChar) && (charAhead === ' ' || charAhead === '\n' || nextText.length === targetLen)) {
        delay = 150 + Math.floor(Math.random() * 40);
      } else if ([',', ';', ':', '—', '-'].includes(lastChar)) {
        delay = 65 + Math.floor(Math.random() * 25);
      }

      // Proportional speed-up if backlog is large to avoid prolonged lag
      if (backlog > 200) {
        delay = Math.min(delay, 10);
      } else if (backlog > 90) {
        delay = Math.min(delay, 16);
      } else if (backlog > 40) {
        delay = Math.min(delay, 22);
      }

      typingTimerRef.current = setTimeout(runTypewriterTick, delay);
    } else {
      // Caught up with current targetText
      if (st.networkDone) {
        // Stream completed and typewriter finished typing all characters
        finalizeTypewriterMessage();
      } else {
        // Waiting for more network chunks: pause tick until next chunk arrives
        typingTimerRef.current = null;
      }
    }
  };

  // Push new incoming text to typewriter target buffer
  const pushTypewriterText = (newTargetText) => {
    const st = typewriterStateRef.current;
    st.targetText = newTargetText;

    if (st.isTyping && !typingTimerRef.current) {
      runTypewriterTick();
    }
  };

  // Clean up any running stream fetch and typewriter timer on component unmount
  useEffect(() => {
    return () => {
      stopTypewriter();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleChatFeedClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (
      link.dataset.packageLink === 'true' ||
      href.startsWith('#package') ||
      href.startsWith('#pkg') ||
      href.includes('#package')
    ) {
      e.preventDefault();
      const hashPart = href.includes('#') ? href.split('#')[1] : href;
      const cleanId = hashPart.replace(/^(package[\/-]|pkg[\/-]|package\?id=)/i, '').trim();

      const matched = (PACKAGES || []).find(p => 
        p.id.toLowerCase() === cleanId.toLowerCase() ||
        p.id.toLowerCase() === decodeURIComponent(cleanId).toLowerCase() ||
        (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId.toLowerCase())
      );

      if (matched && onSelectPackage) {
        onSelectPackage(matched);
      } else if (onSelectPackage) {
        const text = link.textContent.trim().toLowerCase();
        const byTitle = (PACKAGES || []).find(p => p.title.toLowerCase().includes(text) || text.includes(p.title.toLowerCase()));
        if (byTitle) {
          onSelectPackage(byTitle);
        } else if (cleanId) {
          const byDest = (PACKAGES || []).find(p => (p.destinationId || '').toLowerCase() === cleanId.toLowerCase());
          if (byDest) onSelectPackage(byDest);
        }
      }
    }
  };

  const handleFeedScroll = (e) => {
    const feed = e.currentTarget;
    if (!feed) return;
    const distanceFromBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight;
    // If scrolled more than 60px up from bottom, pause auto-scroll and show button
    const isUp = distanceFromBottom > 60;
    setUserScrolledUp(isUp);
    isUserScrolledUpRef.current = isUp;
  };

  const scrollToBottom = () => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    setUserScrolledUp(false);
    isUserScrolledUpRef.current = false;
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopTypewriter();
    typewriterStateRef.current.isTyping = false;
    typewriterStateRef.current.networkDone = true;

    const currentMsgId = typewriterStateRef.current.activeMsgId;
    const currentText = typewriterStateRef.current.displayedText;

    setIsGenerating(false);
    setIsTyping(false);
    setChatLog(prev => prev.map(m => 
      m.id === currentMsgId || m.isStreaming ? { ...m, text: m.text || currentText, isStreaming: false } : m
    ));
  };

  const handleConsultAI = async (selectedRealm = realm, selectedVibe = vibe, userText = null) => {
    // Abort any active streaming query and stop active typewriter
    stopTypewriter();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const promptText = userText 
      ? userText 
      : `Looking for a ${selectedVibe} trip in ${selectedRealm === 'Any' ? 'Any destination' : selectedRealm}.`;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Reset scroll lock to bottom when sending new message
    isUserScrolledUpRef.current = false;
    setUserScrolledUp(false);

    // Add user message to UI
    const userMsg = { id: Date.now(), sender: 'user', text: promptText };
    const aiMsgId = Date.now() + 1;

    // Initialize streaming AI message bubble immediately
    const initialAiReply = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      isStreaming: true,
      modelUsed: 'Instant Concierge',
      matchedPackages: []
    };

    // Initialize typewriter state for this new response
    typewriterStateRef.current = {
      activeMsgId: aiMsgId,
      targetText: '',
      displayedText: '',
      isTyping: true,
      networkDone: false,
      metadata: null
    };

    const updatedLog = [...chatLog, userMsg];
    setChatLog([...updatedLog, initialAiReply]);
    setIsGenerating(true);
    setIsTyping(true);
    setRecommendations(null);

    // ChatGPT behavior: Smoothly align the top of this newly generated turn on top of the chat feed
    requestAnimationFrame(() => {
      if (chatFeedRef.current) {
        const userMsgEl = chatFeedRef.current.querySelector(`[data-msg-id="${userMsg.id}"]`);
        if (userMsgEl) {
          chatFeedRef.current.scrollTo({
            top: Math.max(0, userMsgEl.offsetTop - 12),
            behavior: 'smooth'
          });
        } else {
          chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
        }
      }
    });

    try {
      const response = await sendChatMessage({
        messages: updatedLog.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        prompt: promptText,
        category: userText ? '' : (selectedRealm === 'Any' ? '' : selectedRealm),
        model: activeModel,
        signal: controller.signal,
        onChunk: ({ text }) => {
          // Push progressive text to human typewriter buffer
          const cleaned = stripThinkingProcess(text);
          pushTypewriterText(cleaned);
        }
      });

      abortControllerRef.current = null;
      const finalReply = stripThinkingProcess(response.reply || typewriterStateRef.current.targetText);
      typewriterStateRef.current.targetText = finalReply;
      typewriterStateRef.current.metadata = {
        modelUsed: response.modelUsed || 'Samyati Senior Travel Advisor',
        latencyMs: response.latencyMs || 0,
        matchedPackages: response.matchedPackages || []
      };
      typewriterStateRef.current.networkDone = true;

      // If typewriter already caught up, finalize immediately; otherwise let the human loop finish typing
      if (typewriterStateRef.current.displayedText.length >= finalReply.length) {
        finalizeTypewriterMessage();
      } else if (typewriterStateRef.current.isTyping && !typingTimerRef.current) {
        runTypewriterTick();
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        // User stopped generation
        stopTypewriter();
        setIsGenerating(false);
        setIsTyping(false);
        setChatLog(prev => prev.map(m => 
          m.id === aiMsgId ? { ...m, isStreaming: false } : m
        ));
        return;
      }

      console.error('Chat error:', err);
      stopTypewriter();
      setIsGenerating(false);
      setIsTyping(false);
      abortControllerRef.current = null;

      const fallbackErr = "Oops, just a tiny connection delay on our journey! 🎒 But I'm still so excited to help—feel free to explore our featured tours below or message our happy travel specialists directly on WhatsApp (+91-9589110765)! ✨";
      setChatLog(prev => prev.map(m => 
        m.id === aiMsgId ? {
          ...m,
          text: m.text || fallbackErr,
          isStreaming: false
        } : m
      ));
    }
  };

  const handleResetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopTypewriter();
    typewriterStateRef.current = {
      activeMsgId: null,
      targetText: '',
      displayedText: '',
      isTyping: false,
      networkDone: false,
      metadata: null
    };
    setIsGenerating(false);
    setIsTyping(false);
    setUserScrolledUp(false);
    isUserScrolledUpRef.current = false;
    setChatLog([
      {
        id: Date.now(),
        sender: 'ai',
        text: "Fresh start, yay! 🥳 I am SO excited to help you plan your next dream adventure! Where in the world shall we head next? ✈️✨"
      }
    ]);
    setRecommendations(null);
    setCustomInput('');
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePresetClick = (queryText) => {
    setCustomInput(queryText);
    handleConsultAI(realm, vibe, queryText);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isGenerating) {
      handleStopGeneration();
    }
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
                onScroll={handleFeedScroll}
                onClick={handleChatFeedClick}
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
              >
                {chatLog.map((msg) => (
                  <div 
                    key={msg.id} 
                    data-msg-id={msg.id}
                    className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="chat-avatar-mini">
                        <Bot size={14} />
                      </div>
                    )}

                    <div className="chat-msg-content">
                      {msg.sender === 'ai' ? (
                        <div className="msg-text ai-markdown-body">
                          {msg.text ? (
                            <>
                              <div 
                                dangerouslySetInnerHTML={{ __html: formatAiMarkdown(msg.text) }} 
                              />
                              {msg.isStreaming && (
                                <span className="ai-typing-cursor" aria-hidden="true" />
                              )}
                            </>
                          ) : (
                            <div className="ai-starting-dots">
                              <span className="starting-dot" />
                              <span className="starting-dot" />
                              <span className="starting-dot" />
                            </div>
                          )}

                          {/* Suggested packages with direct link to learn more */}
                          {msg.matchedPackages && msg.matchedPackages.length > 0 && !msg.isStreaming && (
                            <div className="ai-msg-suggested-pkgs">
                              <div className="ai-suggested-header">
                                <Sparkles size={12} className="text-amber-600" />
                                <span>Suggested Package{msg.matchedPackages.length > 1 ? 's' : ''} — Tap to learn more:</span>
                              </div>
                              <div className="ai-suggested-cards">
                                {msg.matchedPackages.map((pkg) => (
                                  <div 
                                    key={pkg.id} 
                                    className="ai-suggested-card-mini"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onSelectPackage) onSelectPackage(pkg);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        if (onSelectPackage) onSelectPackage(pkg);
                                      }
                                    }}
                                  >
                                    <img src={pkg.image} alt={pkg.title} className="mini-pkg-img" loading="lazy" />
                                    <div className="mini-pkg-body">
                                      <div className="mini-pkg-top">
                                        <span className="mini-pkg-dest">{pkg.destinationName || pkg.destinationId}</span>
                                        <span className="mini-pkg-dur">{pkg.duration}</span>
                                      </div>
                                      <h5 className="mini-pkg-title">{pkg.title}</h5>
                                      <div className="mini-pkg-action">
                                        <span className="mini-pkg-price">{pkg.price}</span>
                                        <span className="mini-pkg-btn">View Package & Learn More →</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="msg-text">{msg.text}</p>
                      )}

                      {msg.latencyMs > 0 && !msg.isStreaming && (
                        <span className="msg-meta-latency">
                          ⚡ {msg.latencyMs}ms response time
                        </span>
                      )}
                    </div>
                  </div>
                ))}

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
                {recommendations && recommendations.length > 0 && (
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
                              <span className="res-link">Learn More & View Package →</span>
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
              </div>

              {/* Floating Scroll-to-Bottom button (ChatGPT-style) */}
              {userScrolledUp && (
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="chat-scroll-to-bottom-btn"
                  title="Scroll to bottom"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown size={15} />
                  {isGenerating && <span className="scroll-unread-dot" />}
                </button>
              )}

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

                {isGenerating ? (
                  <button 
                    type="button" 
                    onClick={handleStopGeneration} 
                    className="chat-stop-btn"
                    title="Stop generating"
                  >
                    <Square size={12} fill="currentColor" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button type="submit" className="chat-send-btn">
                    <span>Send</span>
                    <Send size={14} />
                  </button>
                )}
              </form>

              {/* Card Footer Note */}
              <div className="ai-card-footer-caption">
                <div className="caption-left-info">
                  <Bot size={13} className="footer-bot-icon" />
                  <span>Verified Travel Guidance • <strong className="highlight-text">Handcrafted Journeys & 24/7 Support</strong></span>
                </div>
                <div className="caption-right-credit">
                  <span>Built by <a href="https://growitate.com" target="_blank" rel="noopener noreferrer" className="bot-growitate-link">Growitate</a></span>
                </div>
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
          scroll-behavior: auto;
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

        .ai-typing-cursor {
          display: inline-block;
          width: 7px;
          height: 16px;
          background: #d97706;
          margin-left: 4px;
          vertical-align: -2px;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(217, 119, 6, 0.7);
          animation: cursorBlink 0.7s infinite ease-in-out;
        }

        @keyframes cursorBlink {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.15; transform: scaleY(0.6); }
        }

        .ai-msg-media-placeholder {
          background: #0f172a;
          border: 1px dashed rgba(217, 119, 6, 0.4);
          border-radius: 12px;
          overflow: hidden;
          margin: 10px 0;
        }

        .ai-msg-img-skeleton {
          width: 100%;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite linear;
        }

        .skeleton-pulse-text {
          font-size: 13px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.02em;
        }

        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
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

        /* Direct package link styling inside AI markdown */
        .ai-pkg-direct-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          color: #92400e !important;
          border: 1px solid #fcd34d;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none !important;
          margin: 6px 4px 6px 0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(245, 158, 11, 0.12);
          cursor: pointer;
        }

        .ai-pkg-direct-link:hover {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #78350f !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.22);
          border-color: #f59e0b;
        }

        .ai-pkg-direct-link .ai-pkg-link-arrow {
          transition: transform 0.2s ease;
          font-weight: 800;
        }

        .ai-pkg-direct-link:hover .ai-pkg-link-arrow {
          transform: translateX(3px);
        }

        /* Direct WhatsApp Destination Expert button styling inside AI markdown */
        .ai-wa-direct-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #ffffff !important;
          border: 1px solid #1ebe5d;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none !important;
          margin: 8px 4px 6px 0;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 10px rgba(37, 211, 102, 0.25);
          cursor: pointer;
        }

        .ai-wa-direct-link:hover {
          background: linear-gradient(135deg, #2ee06e 0%, #0d7065 100%);
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.38);
          border-color: #25D366;
        }

        .ai-wa-direct-link .ai-wa-link-arrow {
          transition: transform 0.2s ease;
          font-weight: 800;
        }

        .ai-wa-direct-link:hover .ai-wa-link-arrow {
          transform: translateX(4px);
        }

        /* In-message suggested package cards */
        .ai-msg-suggested-pkgs {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
        }

        .ai-suggested-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 10px;
        }

        .ai-suggested-cards {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ai-suggested-card-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 12px 8px 8px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          text-align: left;
        }

        .ai-suggested-card-mini:hover {
          border-color: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.14);
          background: #fffdf5;
        }

        .mini-pkg-img {
          width: 58px;
          height: 58px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .mini-pkg-body {
          flex: 1;
          min-width: 0;
        }

        .mini-pkg-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          margin-bottom: 2px;
        }

        .mini-pkg-dur {
          background: #fef3c7;
          color: #92400e;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 10.5px;
        }

        .mini-pkg-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mini-pkg-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .mini-pkg-price {
          font-weight: 800;
          color: #0f172a;
        }

        .mini-pkg-btn {
          font-weight: 700;
          color: #d97706;
          transition: color 0.15s ease;
        }

        .ai-suggested-card-mini:hover .mini-pkg-btn {
          color: #b45309;
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

        .chat-stop-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #0f172a;
          color: #ef4444;
          border: 1.5px solid #ef4444;
          padding: 13px 24px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.2);
        }

        .chat-stop-btn:hover {
          background: #ef4444;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(239, 68, 68, 0.35);
        }

        .chat-scroll-to-bottom-btn {
          position: absolute;
          bottom: 78px;
          right: 24px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          color: #0f172a;
          border: 1.5px solid #cbd5e1;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 25;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          animation: popIn 0.2s ease-out;
        }

        .chat-scroll-to-bottom-btn:hover {
          background: #f8fafc;
          transform: translateY(-2px);
          border-color: #94a3b8;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.28);
        }

        .scroll-unread-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #d97706;
          border: 2px solid #ffffff;
          border-radius: 50%;
        }

        .ai-starting-dots {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 4px;
        }

        .starting-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d97706;
          animation: dotBounce 1.2s infinite ease-in-out;
        }

        .starting-dot:nth-child(1) { animation-delay: 0s; }
        .starting-dot:nth-child(2) { animation-delay: 0.2s; }
        .starting-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }

        .ai-card-footer-caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 18px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          font-size: 11px;
          color: #64748b;
          flex-shrink: 0;
        }

        .caption-left-info {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .caption-right-credit {
          display: inline-flex;
          align-items: center;
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .bot-growitate-link {
          color: #475569;
          font-weight: 700;
          text-decoration: none;
          margin-left: 3px;
          padding: 1px 5px;
          background: rgba(100, 116, 139, 0.08);
          border: 1px solid rgba(100, 116, 139, 0.18);
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .bot-growitate-link:hover {
          color: #d97706;
          background: rgba(217, 119, 6, 0.1);
          border-color: rgba(217, 119, 6, 0.3);
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
          .ai-card-footer-caption {
            flex-direction: column;
            gap: 4px;
            padding: 8px 12px;
            text-align: center;
          }
          .caption-left-info {
            justify-content: center;
            font-size: 10.5px;
          }
          .caption-right-credit {
            font-size: 10px;
          }
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
