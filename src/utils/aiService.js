// Client-side AI Service for Groq Travel Advisor
import { PACKAGES, DESTINATIONS } from '../data/travelData.js';
import { buildFullKnowledgeBase, buildDeepInquiryKnowledge } from '../data/knowledgeBase.js';

export const GROQ_MODELS = {
  PRIMARY: 'openai/gpt-oss-20b',
  FALLBACK_QWEN: 'qwen/qwen3.8-27b',
  FALLBACK_LARGE: 'openai/gpt-oss-120b'
};

const DEFAULT_GROQ_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';

/**
 * Send chat message to backend /api/chat (with direct Groq fallback if needed)
 */
export async function sendChatMessage({
  messages = [],
  prompt = '',
  destination = '',
  category = '',
  model = GROQ_MODELS.PRIMARY,
  onChunk = null,
  signal = null
}) {
  const formattedMessages = messages.length > 0 
    ? messages 
    : [{ role: 'user', content: prompt }];

  // 1. First attempt: call local backend /api/chat with real-time SSE streaming
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        prompt,
        destination,
        category,
        model,
        stream: true
      }),
      signal
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedText = '';
        let finalMetadata = null;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                if (onChunk) {
                  onChunk({
                    chunk: parsed.chunk,
                    text: stripThinkingProcess(accumulatedText)
                  });
                }
              }
              if (parsed.done) {
                finalMetadata = parsed;
              }
            } catch {
              // skip parse error on fragmented json
            }
          }
        }

        // Check any trailing line left in buffer
        if (buffer.trim().startsWith('data:')) {
          try {
            const parsed = JSON.parse(buffer.trim().replace(/^data:\s*/, ''));
            if (parsed.chunk) {
              accumulatedText += parsed.chunk;
              if (onChunk) {
                onChunk({
                  chunk: parsed.chunk,
                  text: stripThinkingProcess(accumulatedText)
                });
              }
            }
            if (parsed.done) {
              finalMetadata = parsed;
            }
          } catch {}
        }

        const finalReply = stripThinkingProcess(finalMetadata?.reply || accumulatedText);
        return {
          reply: finalReply,
          modelUsed: finalMetadata?.modelUsed || model,
          latencyMs: finalMetadata?.latencyMs || 0,
          matchedPackages: finalMetadata?.matchedPackages || []
        };
      } else {
        const data = await res.json();
        if (data.success) {
          const reply = stripThinkingProcess(data.reply || '');
          if (onChunk) {
            onChunk({ chunk: reply, text: reply });
          }
          return {
            reply,
            modelUsed: data.modelUsed || model,
            latencyMs: data.latencyMs || 0,
            matchedPackages: data.matchedPackages || []
          };
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.warn('[AI Service] Backend /api/chat error, attempting direct Groq client call:', err.message);
  }

  // Client-side greeting shortcut
  const userText = (prompt || formattedMessages[formattedMessages.length - 1]?.content || '').trim().toLowerCase();
  const cleanUserText = userText.replace(/[^a-z0-9\s]/gi, '').trim();
  const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'hola', 'good morning', 'good afternoon', 'good evening', 'hi there', 'hello there', 'hey there', 'who are you', 'how are you', 'help', 'help me', 'whats up', 'whatsup', 'yo', 'sup'];
  if (greetingWords.includes(cleanUserText) || (cleanUserText.split(/\s+/).length <= 2 && greetingWords.some(g => cleanUserText.startsWith(g)))) {
    const greeting = "Hello hello! 🎉 Welcome to Samyati! I'm your super excited and happy travel consultant here today! ✈️✨ Where are you dreaming of traveling next? Tell me what kind of fun, magical getaway you have in mind, and let's make it happen! 🌟";
    if (onChunk) {
      onChunk({ chunk: greeting, text: greeting });
    }
    return {
      reply: greeting,
      modelUsed: 'Samyati Senior Travel Advisor',
      latencyMs: 10,
      matchedPackages: []
    };
  }

  // 2. Direct client fallback if backend is unreachable
  try {
    const fullCatalogKB = buildFullKnowledgeBase(PACKAGES, DESTINATIONS);
    const systemPrompt = `You are an extremely EXCITED, PASSIONATE, and HAPPY-HAPPY Senior Travel Consultant at "Samyati The World" (samyati.com).
Speak naturally with bright energy, warmth, and joyful excitement! You genuinely love travel and your enthusiasm is contagious!
Celebrate the traveler's vacation ideas with cheer ("Oh, I am SO excited for this!", "You will fall in love with this route!").
Use cheerful travel emojis naturally throughout (🎉, ✨, ✈️, 🏔️, 🌴, 🌟, 🥳, 💛).
NEVER state that you are an AI, bot, or virtual program. You are a dedicated travel advisor thrilled to plan dream vacations!
Strictly ground all advice, pricing, and package names in our official Samyati knowledge base below.
Quote exact package names, exact durations, and starting prices.
Always embed the official image using markdown ![Package Title](image_url) when recommending a tour.

CRITICAL REQUIREMENT — DIRECT LINK TO LEARN MORE:
Whenever you suggest, recommend, or mention a package, you MUST ALWAYS provide a direct markdown link for the traveler to go to that package's page and learn more about it:
[👉 View Package Details & Itinerary: {Package Title}](#package/{package_id})
or
[✨ Learn More & Explore Full Itinerary →](#package/{package_id})
Place this link prominently so the traveler can click it to view the complete package page with all details.

DESTINATIONS NOT LISTED IN THE WEBSITE (CUSTOM DESTINATION EXPERT OPTION):
If the traveler asks for any destination, city, country, or region NOT listed in our catalog:
- DO NOT invent fake packages, fake prices, or fake itineraries for unlisted destinations.
- DO NOT suggest unrelated catalog packages.
- Simply, warmly, and cheerfully let them know this destination is not currently listed directly on the website catalog, but our specialized Destination Experts can handcraft a 100% custom-tailored itinerary and quote for them.
- Simply give the direct option to connect with the Destination Expert on WhatsApp:
[💬 Connect with Destination Expert on WhatsApp](https://wa.me/919589110765?text=Hi%20Samyati%20Team%2C%20I%20would%20like%20to%20plan%20a%20custom%20trip%20to%20{RequestedDestination})

Direct travelers to WhatsApp (+91-9589110765) for custom dates and hotel bookings.

=== OFFICIAL SAMYATI TRAVEL KNOWLEDGE BASE (ALL 75 PACKAGES) ===
${fullCatalogKB}
==============================================================`;

    if (!DEFAULT_GROQ_KEY) {
      console.warn('[AI Service] Direct client fallback bypassed: no VITE_GROQ_API_KEY configured.');
      return {
        reply: "Yay! 🎉 Our Destination Experts are super excited to help you plan your dream vacation! Please connect with us directly on WhatsApp at [💬 Connect with Destination Expert on WhatsApp](https://wa.me/919589110765?text=Hi%20Samyati%20Team%2C%20I%20would%20like%20to%20plan%20a%20custom%20trip) to get an instant customized quote! ✨",
        modelUsed: 'Samyati Travel Desk',
        latencyMs: 10,
        matchedPackages: []
      };
    }

    const isReasoningModel = model && model.startsWith('openai/gpt-oss-');
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEFAULT_GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages.map(m => ({
            role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
            content: m.text || m.content || ''
          }))
        ],
        temperature: 0.5,
        max_tokens: 850,
        ...(isReasoningModel ? { reasoning_format: 'hidden', reasoning_effort: 'low' } : {})
      })
    });

    if (groqRes.ok) {
      const gData = await groqRes.json();
      let content = gData.choices?.[0]?.message?.content || '';
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '');
      if (content.includes('<think>')) {
        content = content.replace(/<think>[\s\S]*$/gi, '');
      }
      content = content.trim();
      return {
        reply: content || 'I am ready to plan your trip! Tell me your destination and preferences.',
        modelUsed: 'Samyati Travel Advisor',
        latencyMs: 100,
        matchedPackages: []
      };
    }
  } catch (directErr) {
    console.error('[AI Service] Direct Groq call failed:', directErr);
  }

  return {
    reply: "I'd be glad to help you plan your journey! Explore our verified catalog packages or connect directly with our Destination Experts on WhatsApp ([💬 Connect with Destination Expert on WhatsApp](https://wa.me/919589110765?text=Hi%20Samyati%20Team%2C%20I%20would%20like%20to%20plan%20a%20custom%20trip)) for personalized assistance.",
    modelUsed: 'Samyati Travel Advisor',
    latencyMs: 0,
    matchedPackages: []
  };
}

/**
 * Strips all internal thinking tags, reasoning scratchpads, and chain-of-thought blocks
 */
export function stripThinkingProcess(text = '') {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove XML-style think blocks (both closed and unclosed)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
  if (cleaned.includes('<think>')) {
    cleaned = cleaned.replace(/<think>[\s\S]*$/gi, '');
  }

  // 2. Remove common reasoning intro blocks
  cleaned = cleaned.replace(/^(?:Here'?s\s+(?:a\s+)?thinking\s+process|Thinking\s+Process|Thought|Reasoning|Internal\s+Reasoning)[:\s][\s\S]*?(?=\n\n(?:[#A-Z*]|---|\b(?:Hi|Hello|Namaste|Welcome|I|Package|Here are)\b)|$)/i, '');

  // 3. Remove raw scratchpad patterns if model starts talking to itself
  cleaned = cleaned.replace(/^(?:We need to|The user (?:wants|asked|is asking|said)|Let's (?:analyze|list|think|pick|choose)|1\.\s+\*\*Analyze)[\s\S]*?(?=\n\n(?:[#A-Z*]|---|\b(?:Hi|Hello|Namaste|Welcome|I|Package|Here are)\b)|$)/i, '');

  return cleaned.trim();
}

/**
 * Format markdown string into rich HTML with image embeds, tables, paragraphs, headers and lists
 */
export function formatAiMarkdown(text = '') {
  if (!text) return '';
  
  // Clean thinking blocks if present
  let cleanText = stripThinkingProcess(text);

  // Split into lines
  const lines = cleanText.split('\n');
  const htmlParts = [];
  let inList = false;
  let inTable = false;
  let tableHeaderDone = false;

  for (let i = 0; i < lines.length; i++) {
    let trimmed = lines[i].trim();
    if (!trimmed) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      if (inTable) {
        htmlParts.push('</tbody></table></div>');
        inTable = false;
        tableHeaderDone = false;
      }
      continue;
    }

    // Horizontal Rule: ---
    if (/^---+$/.test(trimmed)) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      if (inTable) { htmlParts.push('</tbody></table></div>'); inTable = false; tableHeaderDone = false; }
      htmlParts.push('<hr class="ai-msg-hr" />');
      continue;
    }

    // Markdown Table handling: starts and ends with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }

      // Check if this is a separator line (|---|---|)
      if (/^\|(\s*:?-+:?\s*\|)+$/.test(trimmed)) {
        tableHeaderDone = true;
        continue;
      }

      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      
      const renderCellLinks = (cellText) => {
        return cellText
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\[(.*?)\]\((#[^\s)]+|\/[^\s)]+|https?:\/\/[^\s)]+)\)/g, (match, label, url) => {
            const isPackage = url.startsWith('#package') || url.startsWith('#pkg') || url.includes('/#package') || url.includes('#package');
            if (isPackage) {
              return `<a href="${url}" class="ai-msg-link ai-pkg-direct-link" data-package-link="true" title="Learn more about this package"><span class="ai-pkg-link-icon">📍</span><span class="ai-pkg-link-text">${label}</span><span class="ai-pkg-link-arrow">→</span></a>`;
            }
            const isWhatsApp = url.includes('wa.me') || url.includes('whatsapp.com');
            if (isWhatsApp) {
              return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ai-msg-link ai-wa-direct-link" title="Connect with Destination Expert on WhatsApp"><span class="ai-wa-link-icon">💬</span><span class="ai-wa-link-text">${label}</span><span class="ai-wa-link-arrow">→</span></a>`;
            }
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ai-msg-link">${label} ↗</a>`;
          });
      };

      if (!inTable) {
        inTable = true;
        tableHeaderDone = false;
        htmlParts.push('<div class="ai-table-wrap"><table class="ai-msg-table"><thead><tr>');
        cells.forEach(cell => {
          htmlParts.push(`<th>${renderCellLinks(cell)}</th>`);
        });
        htmlParts.push('</tr></thead><tbody>');
        continue;
      }

      if (inTable) {
        htmlParts.push('<tr>');
        cells.forEach(cell => {
          htmlParts.push(`<td>${renderCellLinks(cell)}</td>`);
        });
        htmlParts.push('</tr>');
        continue;
      }
    } else if (inTable) {
      htmlParts.push('</tbody></table></div>');
      inTable = false;
      tableHeaderDone = false;
    }

    // Full line markdown image: ![Alt Text](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
    if (imgMatch) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      const alt = imgMatch[1] || 'Package View';
      const url = imgMatch[2];
      htmlParts.push(`
        <div class="ai-msg-media-card">
          <img src="${url}" alt="${alt}" class="ai-msg-img" loading="lazy" />
          ${alt ? `<span class="ai-msg-img-caption">📍 ${alt}</span>` : ''}
        </div>
      `);
      continue;
    }

    // Partial image line being typed: starts with ![ but doesn't have closing ) yet
    if (/^!\[.*?\]\((?:https?:\/\/)?[^\s)]*$/.test(trimmed) && !trimmed.endsWith(')')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      const altMatch = trimmed.match(/^!\[(.*?)\]/);
      const alt = altMatch ? altMatch[1] : 'Loading destination view...';
      htmlParts.push(`
        <div class="ai-msg-media-card ai-msg-media-placeholder">
          <div class="ai-msg-img-skeleton">
            <span class="skeleton-pulse-text">📸 ${alt || 'Loading photo...'}</span>
          </div>
        </div>
      `);
      continue;
    }

    // Inline images: ![Alt](url)
    trimmed = trimmed.replace(/!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, (match, alt, url) => {
      return `<div class="ai-msg-media-card"><img src="${url}" alt="${alt || 'Package View'}" class="ai-msg-img" loading="lazy" />${alt ? `<span class="ai-msg-img-caption">📍 ${alt}</span>` : ''}</div>`;
    });

    // Links: [Text](url) - supports both external https, WhatsApp, and internal #package links
    trimmed = trimmed.replace(/\[(.*?)\]\((#[^\s)]+|\/[^\s)]+|https?:\/\/[^\s)]+)\)/g, (match, label, url) => {
      const isPackage = url.startsWith('#package') || url.startsWith('#pkg') || url.includes('/#package') || url.includes('#package');
      if (isPackage) {
        return `<a href="${url}" class="ai-msg-link ai-pkg-direct-link" data-package-link="true" title="Learn more about this package"><span class="ai-pkg-link-icon">📍</span><span class="ai-pkg-link-text">${label}</span><span class="ai-pkg-link-arrow">→</span></a>`;
      }
      const isWhatsApp = url.includes('wa.me') || url.includes('whatsapp.com');
      if (isWhatsApp) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ai-msg-link ai-wa-direct-link" title="Connect with Destination Expert on WhatsApp"><span class="ai-wa-link-icon">💬</span><span class="ai-wa-link-text">${label}</span><span class="ai-wa-link-arrow">→</span></a>`;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ai-msg-link">${label} ↗</a>`;
    });

    // Bold replacement
    trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    trimmed = trimmed.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Headers
    if (trimmed.startsWith('#### ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h5 class="ai-msg-h5">${trimmed.replace('#### ', '')}</h5>`);
    } else if (trimmed.startsWith('### ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h4 class="ai-msg-h4">${trimmed.replace('### ', '')}</h4>`);
    } else if (trimmed.startsWith('## ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h3 class="ai-msg-h3">${trimmed.replace('## ', '')}</h3>`);
    } else if (trimmed.startsWith('# ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h3 class="ai-msg-h3">${trimmed.replace('# ', '')}</h3>`);
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        htmlParts.push('<ul class="ai-msg-list">');
        inList = true;
      }
      const itemContent = trimmed.replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, '');
      htmlParts.push(`<li>${itemContent}</li>`);
    } else {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<p class="ai-msg-p">${trimmed}</p>`);
    }
  }

  if (inList) {
    htmlParts.push('</ul>');
  }
  if (inTable) {
    htmlParts.push('</tbody></table></div>');
  }

  return htmlParts.join('');
}
