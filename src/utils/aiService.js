// Client-side AI Service for Groq Travel Advisor
import { PACKAGES, DESTINATIONS } from '../data/travelData';
import { buildFullKnowledgeBase, buildDeepInquiryKnowledge } from '../data/knowledgeBase';

export const GROQ_MODELS = {
  PRIMARY: 'qwen/qwen3.8-27b',
  FALLBACK_120B: 'openai/gpt-oss-120b',
  FALLBACK_20B: 'openai/gpt-oss-20b'
};

const DEFAULT_GROQ_KEY = 'REMOVED_GROQ_API_KEY';

/**
 * Send chat message to backend /api/chat (with direct Groq fallback if needed)
 */
export async function sendChatMessage({
  messages = [],
  prompt = '',
  destination = '',
  category = '',
  model = GROQ_MODELS.PRIMARY
}) {
  const formattedMessages = messages.length > 0 
    ? messages 
    : [{ role: 'user', content: prompt }];

  // 1. First attempt: call local backend /api/chat
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        prompt,
        destination,
        category,
        model
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          reply: data.reply,
          modelUsed: data.modelUsed || model,
          latencyMs: data.latencyMs,
          matchedPackages: data.matchedPackages || []
        };
      }
    }
  } catch (err) {
    console.warn('[AI Service] Backend /api/chat error, attempting direct Groq client call:', err.message);
  }

  // Client-side greeting shortcut
  const userText = (prompt || formattedMessages[formattedMessages.length - 1]?.content || '').trim().toLowerCase();
  const cleanUserText = userText.replace(/[^a-z0-9\s]/gi, '').trim();
  const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'hola', 'good morning', 'good afternoon', 'good evening', 'hi there', 'hello there', 'hey there', 'who are you', 'how are you', 'help', 'help me', 'whats up', 'whatsup', 'yo', 'sup'];
  if (greetingWords.includes(cleanUserText) || (cleanUserText.split(/\s+/).length <= 2 && greetingWords.some(g => cleanUserText.startsWith(g)))) {
    return {
      reply: "Hi! How can I help you today? I'm your travel expert and consultant here at Samyati. Where are you planning to travel, or what kind of trip do you have in mind?",
      modelUsed: 'Samyati Senior Travel Advisor',
      latencyMs: 10,
      matchedPackages: []
    };
  }

  // 2. Direct client fallback if backend is unreachable
  try {
    const fullCatalogKB = buildFullKnowledgeBase(PACKAGES, DESTINATIONS);
    const systemPrompt = `You are a Senior Human Travel Consultant at "Samyati The World" (samyati.com).
Speak naturally as a dedicated, experienced human travel advisor. Direct, sharp, practical, authoritative, and honest.
NEVER state that you are an AI, bot, or virtual program.
Strictly ground all advice, pricing, and package names in our official Samyati knowledge base below.
Quote exact package names, exact durations, and starting prices.
Always embed the official image using markdown ![Package Title](image_url) when recommending a tour.
Direct travelers to WhatsApp (+91-9589110765) for custom dates and hotel bookings.

=== OFFICIAL SAMYATI TRAVEL KNOWLEDGE BASE (ALL 75 PACKAGES) ===
${fullCatalogKB}
==============================================================`;

    const start = Date.now();
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
        max_tokens: 650
      })
    });

    if (groqRes.ok) {
      const gData = await groqRes.json();
      let content = gData.choices?.[0]?.message?.content || gData.choices?.[0]?.message?.reasoning || '';
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      return {
        reply: content || 'I am ready to plan your trip! Tell me your destination and preferences.',
        modelUsed: 'Samyati Travel Advisor',
        latencyMs: Date.now() - start,
        matchedPackages: []
      };
    }
  } catch (directErr) {
    console.error('[AI Service] Direct Groq call failed:', directErr);
  }

  return {
    reply: "I'd be glad to help you plan your journey! Explore our verified packages or connect directly with our travel specialists on WhatsApp (+91-9589110765) for personalized assistance.",
    modelUsed: 'Samyati Travel Advisor',
    latencyMs: 0,
    matchedPackages: []
  };
}

/**
 * Format markdown string into rich HTML with image embeds, tables, paragraphs, headers and lists
 */
export function formatAiMarkdown(text = '') {
  if (!text) return '';
  
  // Clean thinking blocks if present
  let cleanText = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

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
      
      if (!inTable) {
        inTable = true;
        tableHeaderDone = false;
        htmlParts.push('<div class="ai-table-wrap"><table class="ai-msg-table"><thead><tr>');
        cells.forEach(cell => {
          let formattedCell = cell
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="ai-msg-link">$1 ↗</a>');
          htmlParts.push(`<th>${formattedCell}</th>`);
        });
        htmlParts.push('</tr></thead><tbody>');
        continue;
      }

      if (inTable) {
        htmlParts.push('<tr>');
        cells.forEach(cell => {
          let formattedCell = cell
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="ai-msg-link">$1 ↗</a>');
          htmlParts.push(`<td>${formattedCell}</td>`);
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
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)$/);
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

    // Inline images: ![Alt](url)
    trimmed = trimmed.replace(/!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, (match, alt, url) => {
      return `<div class="ai-msg-media-card"><img src="${url}" alt="${alt || 'Package View'}" class="ai-msg-img" loading="lazy" />${alt ? `<span class="ai-msg-img-caption">📍 ${alt}</span>` : ''}</div>`;
    });

    // Links: [Text](url)
    trimmed = trimmed.replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="ai-msg-link">$1 ↗</a>');

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
