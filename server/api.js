import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  syncFromCode,
  resetToDefault,
  initDatabase
} from './db.js';
import { authenticateAdmin, verifyToken, checkRateLimit } from './auth.js';
import { buildFullKnowledgeBase, buildDeepInquiryKnowledge } from '../src/data/knowledgeBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.resolve(ROOT_DIR, 'public', 'uploads');

// Ensure environment variables are loaded
try {
  process.loadEnvFile();
} catch (e) {
  // .env may not exist if injected via environment
}
const DIST_UPLOADS_DIR = path.resolve(ROOT_DIR, 'dist', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (fs.existsSync(path.resolve(ROOT_DIR, 'dist')) && !fs.existsSync(DIST_UPLOADS_DIR)) {
    fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Helper to parse JSON body from incoming HTTP request
 */
async function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

/**
 * Extract auth token from request headers
 */
function getAuthToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.headers['x-admin-token'] || null;
}

/**
 * Strips all internal thinking tags, reasoning scratchpads, and chain-of-thought blocks
 */
export function stripThinkingProcess(text) {
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
 * Main API request handler
 */
export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();
  const clientIp = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'client';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    sendJson(res, 204, {});
    return true;
  }

  // Only handle /api/ routes
  if (!pathname.startsWith('/api/')) {
    return false;
  }

  try {
    // 1. Admin Login: POST /api/admin/login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { password } = body;

      if (!password) {
        sendJson(res, 400, { success: false, message: 'Password is required' });
        return true;
      }

      const result = authenticateAdmin(password, clientIp);
      if (result.success) {
        sendJson(res, 200, {
          success: true,
          token: result.token,
          message: 'Welcome to Samyati Super Admin'
        });
      } else {
        sendJson(res, result.rateLimited ? 429 : 401, result);
      }
      return true;
    }

    // 2. Admin Verify: GET /api/admin/verify
    if (pathname === '/api/admin/verify' && method === 'GET') {
      const token = getAuthToken(req);
      const isValid = verifyToken(token);
      if (isValid) {
        sendJson(res, 200, { valid: true, role: 'superadmin' });
      } else {
        sendJson(res, 401, { valid: false, message: 'Invalid or expired session token' });
      }
      return true;
    }

    // 3. Get All Packages: GET /api/packages
    if (pathname === '/api/packages' && method === 'GET') {
      const data = await getAllPackages();
      sendJson(res, 200, {
        success: true,
        packages: data.packages,
        destinations: data.destinations,
        total: data.total,
        lastModified: data.lastModified
      });
      return true;
    }

    // 4. Get Single Package: GET /api/packages/:id
    const singlePkgMatch = pathname.match(/^\/api\/packages\/([a-zA-Z0-9_-]+)$/);
    if (singlePkgMatch && method === 'GET') {
      const id = singlePkgMatch[1];
      const pkg = await getPackageById(id);
      if (pkg) {
        sendJson(res, 200, { success: true, package: pkg });
      } else {
        sendJson(res, 404, { success: false, message: 'Package not found' });
      }
      return true;
    }

    // --- SENIOR TRAVEL CONSULTANT & KNOWLEDGE BASE RETRIEVAL ENDPOINT: POST /api/chat ---
    if (pathname === '/api/chat' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { messages = [], prompt, destination, category, model: requestedModel } = body;

      const userMessages = Array.isArray(messages) && messages.length > 0 
        ? messages 
        : (prompt ? [{ role: 'user', content: prompt }] : []);

      if (userMessages.length === 0) {
        sendJson(res, 400, { success: false, message: 'No message prompt provided' });
        return true;
      }

      // Fetch active catalog for grounding AI knowledge
      const dbData = await getAllPackages().catch(() => ({ packages: [], destinations: [] }));
      const allPkgs = dbData.packages || [];
      const allDests = dbData.destinations || [];

      // Separate actual user messages from bot history
      const actualUserMessages = userMessages.filter(m => m.sender === 'user' || m.role === 'user');
      const lastUserObj = actualUserMessages[actualUserMessages.length - 1] || userMessages[userMessages.length - 1] || {};
      const latestUserMsg = (lastUserObj.content || lastUserObj.text || prompt || '').trim().toLowerCase();
      const userTextCombined = actualUserMessages.map(m => m.content || m.text || '').join(' ').toLowerCase();

      // Check if user's latest input is purely a greeting
      const cleanLatest = latestUserMsg.replace(/[^a-z0-9\s]/gi, '').trim();
      const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'hola', 'good morning', 'good afternoon', 'good evening', 'hi there', 'hello there', 'hey there', 'who are you', 'how are you', 'help', 'help me', 'whats up', 'whatsup', 'yo', 'sup'];
      const isGreeting = greetingWords.includes(cleanLatest) || (cleanLatest.split(/\s+/).length <= 2 && greetingWords.some(g => cleanLatest.startsWith(g)));

      // 1. Detect Destination & City from user messages
      let detectedDest = null;
      if (destination) {
        detectedDest = allDests.find(d => d.id.toLowerCase() === destination.toLowerCase() || d.name.toLowerCase() === destination.toLowerCase());
      }

      if (!detectedDest) {
        for (const dest of allDests) {
          if (userTextCombined.includes(dest.name.toLowerCase()) || userTextCombined.includes(dest.id.toLowerCase())) {
            detectedDest = dest;
            break;
          }
        }
      }

      const cityMap = {
        'srinagar': 'kashmir', 'gulmarg': 'kashmir', 'pahalgam': 'kashmir', 'sonamarg': 'kashmir', 'dal lake': 'kashmir',
        'manali': 'himachal', 'shimla': 'himachal', 'dharamshala': 'himachal', 'kasol': 'himachal', 'spiti': 'himachal', 'sissu': 'himachal', 'atal tunnel': 'himachal',
        'munnar': 'kerala', 'alleppey': 'kerala', 'kochi': 'kerala', 'thekkady': 'kerala', 'kovalam': 'kerala', 'wayanad': 'kerala',
        'calangute': 'goa', 'baga': 'goa', 'panaji': 'goa', 'dudhsagar': 'goa', 'anjuna': 'goa', 'candolim': 'goa',
        'jaipur': 'rajasthan', 'udaipur': 'rajasthan', 'jodhpur': 'rajasthan', 'jaisalmer': 'rajasthan', 'pushkar': 'rajasthan',
        'havelock': 'andaman', 'port blair': 'andaman', 'neil': 'andaman', 'radhanagar': 'andaman', 'elephant beach': 'andaman',
        'leh': 'ladakh', 'nubra': 'ladakh', 'pangong': 'ladakh', 'khardung la': 'ladakh', 'hanle': 'ladakh', 'zanskar': 'ladakh',
        'varanasi': 'uttar-pradesh', 'kashi': 'uttar-pradesh', 'ayodhya': 'uttar-pradesh', 'prayagraj': 'uttar-pradesh', 'ram mandir': 'uttar-pradesh', 'mathura': 'uttar-pradesh', 'vrindavan': 'uttar-pradesh',
        'shillong': 'northeast', 'cherrapunji': 'northeast', 'kaziranga': 'northeast', 'tawang': 'northeast', 'meghalaya': 'northeast', 'assam': 'northeast', 'dawki': 'northeast', 'gangtok': 'northeast', 'darjeeling': 'northeast', 'pelling': 'northeast',
        'ubud': 'bali', 'kuta': 'bali', 'seminyak': 'bali', 'nusa penida': 'bali', 'kintamani': 'bali', 'tanah lot': 'bali', 'gili': 'bali',
        'hanoi': 'vietnam', 'halong': 'vietnam', 'ha long': 'vietnam', 'da nang': 'vietnam', 'hoi an': 'vietnam', 'saigon': 'vietnam', 'bana hills': 'vietnam', 'ninh binh': 'vietnam',
        'sentosa': 'singapore', 'marina bay': 'singapore', 'universal studios': 'singapore',
        'almaty': 'kazakhstan', 'shymbulak': 'kazakhstan', 'charyn': 'kazakhstan', 'kok tobe': 'kazakhstan', 'medeu': 'kazakhstan', 'kolsai': 'kazakhstan',
        'kuala lumpur': 'malaysia', 'genting': 'malaysia', 'langkawi': 'malaysia', 'batu caves': 'malaysia', 'penang': 'malaysia',
        'burj khalifa': 'dubai', 'abu dhabi': 'dubai', 'desert safari': 'dubai', 'dubai marina': 'dubai',
        'bangkok': 'thailand', 'pattaya': 'thailand', 'phuket': 'thailand', 'krabi': 'thailand', 'phi phi': 'thailand', 'coral island': 'thailand',
        // Sri Lanka
        'sri lanka': 'srilanka', 'srilanka': 'srilanka', 'colombo': 'srilanka', 'kandy': 'srilanka', 'bentota': 'srilanka', 'nuwara eliya': 'srilanka', 'sigiriya': 'srilanka', 'galle': 'srilanka', 'madhu river': 'srilanka',
        // Uzbekistan
        'uzbekistan': 'uzbekistan', 'uzbek': 'uzbekistan', 'tashkent': 'uzbekistan', 'samarkand': 'uzbekistan', 'bukhara': 'uzbekistan', 'khiva': 'uzbekistan',
        // Georgia
        'georgia': 'georgia', 'tbilisi': 'georgia', 'kazbegi': 'georgia', 'gudauri': 'georgia', 'batumi': 'georgia', 'mtskheta': 'georgia'
      };

      if (!detectedDest) {
        for (const [city, destId] of Object.entries(cityMap)) {
          if (userTextCombined.includes(city)) {
            detectedDest = allDests.find(d => d.id === destId);
            if (detectedDest) break;
          }
        }
      }

      // Detect duration intent
      const daysMatch = userTextCombined.match(/(\d+)\s*(?:day|days|d)/i);
      const words = userTextCombined.split(/[\s,!?]+/).filter(w => w.length > 2);
      const hasSpecificTripIntent = Boolean(detectedDest || daysMatch || destination || category || (words.length > 3 && !isGreeting));

      // If user is just saying hi or greeting without any trip details, respond like a human consultant immediately
      if (isGreeting && !hasSpecificTripIntent) {
        sendJson(res, 200, {
          success: true,
          reply: "Hi! How can I help you today? I'm your dedicated travel consultant here at Samyati. Where are you planning to travel, or what kind of trip do you have in mind?",
          modelUsed: 'Samyati Senior Travel Advisor',
          latencyMs: 20,
          matchedPackages: []
        });
        return true;
      }

      // 2. Score and Rank Packages strictly from catalog database based on user intent
      const scored = allPkgs.map(pkg => {
        let score = 0;
        const title = (pkg.title || '').toLowerCase();
        const destId = (pkg.destinationId || '').toLowerCase();
        const destName = (pkg.destinationName || '').toLowerCase();
        const desc = (pkg.description || '').toLowerCase();
        const cat = (pkg.category || '').toLowerCase();

        if (detectedDest && (destId === detectedDest.id.toLowerCase() || destName.includes(detectedDest.name.toLowerCase()))) {
          score += 150;
        }

        if (title.includes(latestUserMsg)) score += 80;

        if (daysMatch) {
          const numDays = daysMatch[1];
          if (title.includes(`${numDays} days`) || title.includes(`0${numDays} days`) || (pkg.duration || '').startsWith(`${numDays}D`)) {
            score += 50;
          }
        }

        words.forEach(w => {
          if (title.includes(w)) score += 10;
          if (destName.includes(w)) score += 8;
          if (desc.includes(w)) score += 3;
          if (cat.includes(w)) score += 3;
        });

        return { pkg, score };
      });

      const sorted = scored.sort((a, b) => b.score - a.score);
      const topMatched = (sorted.filter(s => s.score > 0).length > 0 ? sorted.filter(s => s.score > 0) : sorted)
        .slice(0, 3)
        .map(s => s.pkg);

      // 3. Build Grounded Official Knowledge Base
      // A) Full Catalog Grounding: All 75 packages across all 19 destinations
      const fullCatalogKB = buildFullKnowledgeBase(allPkgs, allDests, detectedDest);

      // B) Deep Grounding: Detailed day-by-day itineraries & inclusions for top matched packages
      const deepDetails = buildDeepInquiryKnowledge(topMatched);

      let systemPrompt = '';

      if (isGreeting && !hasSpecificTripIntent) {
        // Natural human greeting response
        systemPrompt = `You are a Senior Human Travel Consultant at "Samyati The World" (samyati.com).
The traveler has just initiated a conversation with a greeting (like "Hi" or "Hello").

YOUR CONVERSATIONAL GOAL:
1. TALK LIKE A REAL HUMAN TRAVEL ADVISOR:
   - Greet them warmly and naturally (e.g. "Hello! Welcome to Samyati. I'm your dedicated travel consultant.").
   - Ask clarifying questions to understand what they have in mind:
     * Domestic (Kashmir, Himachal, Kerala, Goa, Rajasthan, Andaman, Ladakh, Uttar Pradesh, North East) or International (Bali, Thailand, Vietnam, Singapore, Kazakhstan, Malaysia, Dubai, Sri Lanka, Uzbekistan, Georgia)?
     * What vibe (snow & mountain peaks, tropical beaches, honeymoon luxury, family leisure, cultural heritage, spiritual)?
     * How many days do they have in mind and who is traveling?
   - DO NOT dump unsolicited package itineraries, pricing breakdowns, or photos yet. Keep it warm, consultative, and inviting.

2. ZERO AI / BOT / SYSTEM MENTIONS:
   - NEVER refer to yourself as an AI, bot, virtual assistant, language model, Groq, or prompt. You are a senior human travel advisor at Samyati.`;
      } else {
        // Specific itinerary & package recommendation
        systemPrompt = `You are a Senior Human Travel Consultant and Destination Specialist at "Samyati The World" (samyati.com).
You are consulting directly with a traveler. Your style is professional, sharp, factual, authoritative, and straight to the point.

STRICT CONSULTANT GUIDELINES:
1. TALK LIKE A REAL HUMAN TRAVEL EXPERT:
   - Speak naturally in first person ("I recommend...", "In this route...", "Our on-ground team arranges...").
   - Direct and concise: Avoid fluff, generic sales pitches, robotic greetings ("As an AI...", "I am happy to assist..."), or exaggerated hype.
   - Give realistic travel advice: Pacing, altitude/weather tips, recommended seasons, and practical tips.

2. STRICT DATA GROUNDING (OFFICIAL SAMYATI KNOWLEDGE BASE):
   - You have access to the complete official knowledge base containing ALL 75 packages across all destinations below.
   - You MUST use ONLY the exact package names, exact durations, exact prices, and inclusions provided in the Knowledge Base below.
   - Never invent imaginary packages or random prices. Quote the exact numbers from the catalog.

3. EMBED OFFICIAL PACKAGE IMAGES:
   - When recommending a specific package, ALWAYS embed its official image using markdown:
     ![Exact Package Title](official_image_url)

4. STRUCTURED FORMAT:
   - Highlight the recommended package name, duration, and starting price in bold.
   - Provide a clean day-wise breakdown and what makes this route optimal.
   - Include key inclusions and realistic consultant tips (weather, packing, permits).

5. ZERO AI / BOT / SYSTEM MENTIONS:
   - NEVER mention that you are an AI, bot, virtual assistant, language model, Groq, dataset, system prompt, or computer program. You are a senior human travel advisor at Samyati.

6. PERSONAL CONSULTATION & BOOKINGS:
   - For customized dates, hotel upgrades (3★/4★/5★), or private bookings, remind the traveler they can connect directly with you on WhatsApp (+91-9589110765).

=== OFFICIAL SAMYATI COMPLETE TRAVEL KNOWLEDGE BASE (ALL 75 PACKAGES) ===
${fullCatalogKB}
========================================================================

=== INQUIRY GROUND TRUTH & TOP MATCHED PACKAGE OPTIONS ===
${deepDetails}
=========================================================
${category ? `User preference category: ${category}` : ''}`;
      }

      const groqApiKey = process.env.GROQ_API_KEY || '';
      if (!groqApiKey) {
        console.error('[API /api/chat] Missing GROQ_API_KEY environment variable');
        sendJsonResponse(res, 500, {
          success: false,
          error: 'GROQ_API_KEY is not configured in server environment (.env)'
        });
        return true;
      }
      // Cost-optimal model hierarchy: openai/gpt-oss-20b ($0.075/1M input, $0.30/1M output - 92% cheaper than 27b)
      const modelsToTry = [
        requestedModel || 'openai/gpt-oss-20b',
        'qwen/qwen3.6-27b',
        'qwen/qwen3.8-27b'
      ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

      let aiReply = '';
      let usedModel = modelsToTry[0];
      let latencyMs = 0;

      const startTime = Date.now();

      for (const modelCandidate of modelsToTry) {
        try {
          const isReasoningModel = modelCandidate.startsWith('openai/gpt-oss-');
          const groqPayload = {
            model: modelCandidate,
            messages: [
              { role: 'system', content: systemPrompt },
              ...userMessages.map(m => ({
                role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
                content: m.text || m.content || ''
              }))
            ],
            temperature: 0.5,
            max_tokens: 850,
            ...(isReasoningModel ? { reasoning_format: 'hidden', reasoning_effort: 'low' } : {})
          };

          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(groqPayload)
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const choice = data.choices && data.choices[0];
            // Strictly take content — never leak internal reasoning field to traveler
            let content = choice?.message?.content || '';
            
            // Strip any thinking process or scratchpad traces
            content = stripThinkingProcess(content);

            if (content) {
              aiReply = content;
              usedModel = data.model || modelCandidate;
              latencyMs = Date.now() - startTime;
              break;
            }
          } else {
            const errBody = await groqRes.text();
            console.warn(`[Chat API] Model ${modelCandidate} failed:`, errBody);
          }
        } catch (callErr) {
          console.warn(`[Chat API] Error with model ${modelCandidate}:`, callErr.message);
        }
      }

      if (!aiReply) {
        // Fallback grounded response if offline
        const topPkg = topMatched[0] || allPkgs[0];
        aiReply = `I'd recommend checking our **${topPkg.title}** (${topPkg.duration}, starting from ${topPkg.price} per person).\n\n![${topPkg.title}](${topPkg.image})\n\nIt offers a perfectly balanced route covering all key highlights with private cab transfers and accommodation. Connect with me on WhatsApp (+91-9589110765) for custom dates and hotel upgrades!`;
      }

      const formattedRecommendations = (isGreeting && !hasSpecificTripIntent)
        ? []
        : topMatched.map((pkg, idx) => ({
            ...pkg,
            matchScore: idx === 0 ? '98% Match' : (idx === 1 ? '95% Match' : '92% Match'),
            aiReason: idx === 0 
              ? `Top verified itinerary from our official catalog.`
              : `Alternative route option matching your preferences.`
          }));

      sendJson(res, 200, {
        success: true,
        reply: aiReply,
        modelUsed: 'Samyati Senior Travel Advisor',
        latencyMs,
        matchedPackages: formattedRecommendations
      });
      return true;
    }

    // --- PROTECTED MUTATION ENDPOINTS (Requires Admin Token) ---
    const isProtected = 
      (pathname === '/api/upload' && (method === 'POST' || method === 'DELETE')) ||
      (pathname === '/api/packages' && method === 'POST') ||
      (singlePkgMatch && (method === 'PUT' || method === 'DELETE')) ||
      (pathname === '/api/packages/sync' && method === 'POST') ||
      (pathname === '/api/packages/reset' && method === 'POST');

    if (isProtected) {
      const token = getAuthToken(req);
      if (!verifyToken(token)) {
        sendJson(res, 401, { success: false, message: 'Unauthorized: Valid admin token required' });
        return true;
      }
    }

    // 4b. Upload Package Image: POST /api/upload
    if (pathname === '/api/upload' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { data, filename = 'package-image.jpg' } = body;

      if (!data) {
        sendJson(res, 400, { success: false, message: 'No image data provided' });
        return true;
      }

      ensureUploadsDir();

      // Extract base64 payload and MIME extension
      let base64Data = data;
      let ext = path.extname(filename).toLowerCase() || '.jpg';

      if (data.includes(';base64,')) {
        const matches = data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
        if (matches && matches[1]) {
          const mimeExt = matches[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
          if (!ext || ext === '.bin') ext = `.${mimeExt}`;
        }
        base64Data = data.split(';base64,')[1];
      }

      // Sanitize base name
      const rawBase = path.basename(filename, path.extname(filename))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .substring(0, 30);
      const safeName = `${rawBase || 'pkg'}-${Date.now()}${ext}`;
      const targetFilePath = path.resolve(UPLOADS_DIR, safeName);

      const buffer = Buffer.from(base64Data, 'base64');
      await fs.promises.writeFile(targetFilePath, buffer);

      // Also copy to dist/uploads if dist exists
      if (fs.existsSync(path.resolve(ROOT_DIR, 'dist'))) {
        const distFilePath = path.resolve(DIST_UPLOADS_DIR, safeName);
        await fs.promises.writeFile(distFilePath, buffer).catch(() => {});
      }

      const publicUrl = `/uploads/${safeName}`;
      console.log(`[Upload] Image saved: ${publicUrl} (${buffer.length} bytes)`);

      sendJson(res, 200, {
        success: true,
        url: publicUrl,
        filename: safeName,
        size: buffer.length
      });
      return true;
    }

    // 4c. Delete Uploaded Image: DELETE /api/upload
    if (pathname === '/api/upload' && method === 'DELETE') {
      const body = await parseJsonBody(req).catch(() => ({}));
      const filename = body.filename || url.searchParams.get('filename') || (body.url ? path.basename(body.url) : null);
      if (!filename) {
        sendJson(res, 400, { success: false, message: 'Filename or URL required to delete' });
        return true;
      }

      const safeName = path.basename(filename);
      const targetFilePath = path.resolve(UPLOADS_DIR, safeName);
      const distFilePath = path.resolve(DIST_UPLOADS_DIR, safeName);

      try {
        if (fs.existsSync(targetFilePath)) {
          await fs.promises.unlink(targetFilePath);
        }
        if (fs.existsSync(distFilePath)) {
          await fs.promises.unlink(distFilePath);
        }
        console.log(`[Upload] Image deleted: ${safeName}`);
        sendJson(res, 200, { success: true, message: `Image ${safeName} deleted successfully` });
      } catch (err) {
        sendJson(res, 500, { success: false, message: `Failed to delete file: ${err.message}` });
      }
      return true;
    }


    // 5. Create Package: POST /api/packages
    if (pathname === '/api/packages' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newPackage = await createPackage(body);
      sendJson(res, 201, {
        success: true,
        message: 'Package created successfully',
        package: newPackage
      });
      return true;
    }

    // 6. Update Package: PUT /api/packages/:id
    if (singlePkgMatch && method === 'PUT') {
      const id = singlePkgMatch[1];
      const body = await parseJsonBody(req);
      const updatedPackage = await updatePackage(id, body);
      sendJson(res, 200, {
        success: true,
        message: 'Package updated successfully',
        package: updatedPackage
      });
      return true;
    }

    // 7. Delete Package: DELETE /api/packages/:id
    if (singlePkgMatch && method === 'DELETE') {
      const id = singlePkgMatch[1];
      const result = await deletePackage(id);
      sendJson(res, 200, {
        success: true,
        message: 'Package deleted successfully',
        ...result
      });
      return true;
    }

    // 8. Auto-Sync with Code: POST /api/packages/sync
    if (pathname === '/api/packages/sync' && method === 'POST') {
      const result = await syncFromCode();
      sendJson(res, 200, {
        success: true,
        message: `Synchronized ${result.totalPackages} total packages from database and code.`,
        ...result
      });
      return true;
    }

    // 9. Reset to Code Defaults: POST /api/packages/reset
    if (pathname === '/api/packages/reset' && method === 'POST') {
      const result = await resetToDefault();
      sendJson(res, 200, {
        success: true,
        message: 'Database reset to default packages from code.',
        ...result
      });
      return true;
    }

    // Unmatched API endpoint
    sendJson(res, 404, { success: false, message: 'API endpoint not found' });
    return true;
  } catch (err) {
    console.error('[API Error]', err);
    sendJson(res, 500, {
      success: false,
      message: err.message || 'Internal server error'
    });
    return true;
  }
}
