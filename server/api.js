import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  syncFromCode,
  resetToDefault,
  initDatabase,
  getAllBookings,
  saveBookingRecord
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

    // --- RAZORPAY PAYMENT GATEWAY ENDPOINTS ---

    // A. Get Razorpay Public Config: GET /api/payment/config or GET /api/razorpay/config
    if ((pathname === '/api/payment/config' || pathname === '/api/razorpay/config') && method === 'GET') {
      sendJson(res, 200, {
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Td1Eea273FcCNR',
        currency: 'INR'
      });
      return true;
    }

    // B. Create Razorpay Order: POST /api/payment/create-order or POST /api/razorpay/create-order
    if ((pathname === '/api/payment/create-order' || pathname === '/api/razorpay/create-order') && method === 'POST') {
      const body = await parseJsonBody(req);
      const {
        amount,
        currency = 'INR',
        receipt,
        packageId,
        packageTitle,
        travelerName,
        travelerEmail,
        travelerPhone,
        travelDate,
        paymentOption
      } = body;

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        sendJson(res, 400, { success: false, message: 'Valid payment amount is required' });
        return true;
      }

      const amountInPaise = Math.round(numAmount * 100);
      const receiptId = receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Td1Eea273FcCNR';
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'MnBYSG5G4IkMCjEQLGOu8Os4';

      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: currency,
            receipt: receiptId.substring(0, 40),
            notes: {
              packageId: String(packageId || '').substring(0, 40),
              packageTitle: String(packageTitle || '').substring(0, 40),
              travelerName: String(travelerName || '').substring(0, 40),
              travelerPhone: String(travelerPhone || '').substring(0, 20),
              travelDate: String(travelDate || '').substring(0, 30),
              paymentOption: String(paymentOption || '')
            }
          })
        });

        const orderData = await rzpResponse.json();

        if (!rzpResponse.ok) {
          console.error('[Razorpay Order Creation Failed]', orderData);
          sendJson(res, rzpResponse.status || 500, {
            success: false,
            message: orderData.error?.description || 'Failed to create Razorpay order',
            error: orderData.error
          });
          return true;
        }

        console.log(`[Razorpay Order Created] ID: ${orderData.id}, Amount: ₹${numAmount} (${amountInPaise} paise)`);
        sendJson(res, 200, {
          success: true,
          order: orderData,
          keyId: keyId,
          amount: numAmount,
          amountInPaise,
          currency
        });
        return true;
      } catch (error) {
        console.error('[Razorpay Order Error]', error);
        sendJson(res, 500, {
          success: false,
          message: error.message || 'Error communicating with Razorpay server'
        });
        return true;
      }
    }

    // C. Verify Razorpay Payment Signature: POST /api/payment/verify or POST /api/razorpay/verify
    if ((pathname === '/api/payment/verify' || pathname === '/api/razorpay/verify') && method === 'POST') {
      const body = await parseJsonBody(req);
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingData = {}
      } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        sendJson(res, 400, { success: false, message: 'Missing Razorpay signature verification parameters' });
        return true;
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'MnBYSG5G4IkMCjEQLGOu8Os4';
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        console.error(`[Razorpay Signature Mismatch] Expected: ${expectedSignature}, Received: ${razorpay_signature}`);
        sendJson(res, 400, {
          success: false,
          message: 'Payment signature verification failed. Untrusted transaction.'
        });
        return true;
      }

      const bookingId = bookingData.bookingId || `SAM-${Math.floor(100000 + Math.random() * 900000)}`;

      const verifiedBooking = await saveBookingRecord({
        bookingId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'CONFIRMED',
        paymentGateway: 'Razorpay',
        packageId: bookingData.packageId || '',
        packageTitle: bookingData.packageTitle || '',
        destinationName: bookingData.destinationName || '',
        guestName: bookingData.guestName || bookingData.travelerName || '',
        guestEmail: bookingData.guestEmail || bookingData.travelerEmail || '',
        guestPhone: bookingData.guestPhone || bookingData.travelerPhone || '',
        travelDate: bookingData.travelDate || '',
        adults: bookingData.adults || 1,
        children: bookingData.children || 0,
        hotelClass: bookingData.hotelClass || 'standard',
        addons: bookingData.addons || {},
        paymentOption: bookingData.paymentOption || 'advance',
        amountPaid: bookingData.amountPaid || 0,
        totalTripAmount: bookingData.totalTripAmount || 0,
        remainingBalance: bookingData.remainingBalance || 0,
        concierge: {
          name: 'Aniket Shrivastava',
          phone: '+91-9589110765'
        },
        paymentVerifiedAt: new Date().toISOString()
      });

      console.log(`[Payment Verified & Confirmed] Booking ID: ${bookingId}, Payment ID: ${razorpay_payment_id}`);

      sendJson(res, 200, {
        success: true,
        message: 'Payment verified and booking confirmed successfully!',
        bookingId: bookingId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        booking: verifiedBooking
      });
      return true;
    }

    // D. Admin Bookings Retrieval: GET /api/admin/bookings
    if (pathname === '/api/admin/bookings' && method === 'GET') {
      const token = getAuthToken(req);
      if (!verifyToken(token)) {
        sendJson(res, 401, { success: false, message: 'Unauthorized: Valid admin token required' });
        return true;
      }
      const bookingsData = await getAllBookings();
      sendJson(res, 200, {
        success: true,
        bookings: bookingsData.bookings,
        total: bookingsData.total,
        lastModified: bookingsData.lastModified
      });
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
      const stopWords = new Set([
        'trip', 'tour', 'tours', 'plan', 'package', 'packages', 'holiday', 'holidays', 
        'vacation', 'vacations', 'travel', 'travelling', 'traveling', 'want', 'need', 
        'give', 'recommend', 'show', 'suggest', 'looking', 'with', 'from', 'days', 
        'nights', 'family', 'couple', 'honeymoon', 'budget', 'luxury', 'please', 
        'help', 'best', 'good', 'some', 'about', 'destination', 'places', 'place',
        'what', 'have', 'tell', 'like', 'interested', 'there', 'book', 'booking'
      ]);
      const words = userTextCombined.split(/[\s,!?]+/).filter(w => w.length > 2 && !stopWords.has(w));
      const hasSpecificTripIntent = Boolean(detectedDest || daysMatch || destination || category || (words.length > 0 && !isGreeting));

      // If user is just saying hi or greeting without any trip details, respond like a human consultant immediately
      if (isGreeting && !hasSpecificTripIntent) {
        const greetingReply = "Hello hello! 🎉 Welcome to Samyati The World! I am super excited and so happy to connect with you today! ✈️✨ Where are you dreaming of traveling next? Tell me what kind of magical getaway you have in mind, and let's craft an unforgettable trip together! 🌟";
        if (body.stream !== false) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          });
          res.write(`data: ${JSON.stringify({ chunk: greetingReply })}\n\n`);
          res.write(`data: ${JSON.stringify({ done: true, reply: greetingReply, modelUsed: 'Samyati Senior Travel Advisor', latencyMs: 20, matchedPackages: [] })}\n\n`);
          res.end();
          return true;
        } else {
          sendJson(res, 200, {
            success: true,
            reply: greetingReply,
            modelUsed: 'Samyati Senior Travel Advisor',
            latencyMs: 20,
            matchedPackages: []
          });
          return true;
        }
      }

      // 2. Score and Rank Packages strictly from catalog database based on user intent
      const scored = allPkgs.map(pkg => {
        let score = 0;
        const title = (pkg.title || '').toLowerCase();
        const destId = (pkg.destinationId || '').toLowerCase();
        const destName = (pkg.destinationName || '').toLowerCase();
        const desc = (pkg.description || '').toLowerCase();
        const cat = (pkg.category || '').toLowerCase();

        // High priority: matched destination
        if (detectedDest && (destId === detectedDest.id.toLowerCase() || destName.includes(detectedDest.name.toLowerCase()))) {
          score += 150;
        }

        // Exact match in title
        if (title.includes(latestUserMsg) && latestUserMsg.length > 3) {
          score += 80;
        }

        // Duration match only if destination is detected
        if (daysMatch && detectedDest) {
          const numDays = daysMatch[1];
          if (title.includes(`${numDays} days`) || title.includes(`0${numDays} days`) || (pkg.duration || '').startsWith(`${numDays}D`)) {
            score += 50;
          }
        }

        // Word matches only if destination is detected or word matches destination / title directly
        words.forEach(w => {
          if (w.length > 3) {
            if (title.includes(w)) score += (detectedDest ? 10 : 25);
            if (destName.includes(w)) score += 30;
            if (detectedDest && desc.includes(w)) score += 3;
            if (detectedDest && cat.includes(w)) score += 3;
          }
        });

        return { pkg, score };
      });

      const sorted = scored.sort((a, b) => b.score - a.score);
      // Require a genuine match threshold (>= 20)
      const positiveMatches = sorted.filter(s => s.score >= 20);
      const topMatched = positiveMatches.length > 0
        ? positiveMatches.slice(0, 3).map(s => s.pkg)
        : [];

      // 3. Build Grounded Official Knowledge Base
      // A) Full Catalog Grounding: All 75 packages across all 19 destinations
      const fullCatalogKB = buildFullKnowledgeBase(allPkgs, allDests, detectedDest);

      // B) Deep Grounding: Detailed day-by-day itineraries & inclusions for top matched packages
      const deepDetails = buildDeepInquiryKnowledge(topMatched);

      let systemPrompt = '';

      if (isGreeting && !hasSpecificTripIntent) {
        // Natural excited & happy human greeting response
        systemPrompt = `You are an extremely EXCITED, cheerful, and genuinely happy Senior Travel Consultant at "Samyati The World" (samyati.com).
The traveler has just greeted you.

YOUR CONVERSATIONAL STYLE & GOAL:
1. TALK LIKE AN EXCITED, HAPPY-HAPPY TRAVEL CONSULTANT:
   - Greet them with infectious enthusiasm, sunshine, and joyful energy! (e.g. "Hello hello! 🎉 Welcome to Samyati! I am SO excited you're here today! ✈️✨").
   - Radiate passion for travel, vacations, and creating lifelong memories!
   - Use cheerful emojis naturally (🎉, ✨, ✈️, 🌴, 🏔️, 🌟, 💛).
   - Ask clarifying questions with genuine excitement to discover their dream trip:
     * Are we thinking Domestic wonders (Kashmir, Himachal, Kerala, Goa, Rajasthan, Andaman, Ladakh, Uttar Pradesh, North East) or an epic International journey (Bali, Thailand, Vietnam, Singapore, Kazakhstan, Malaysia, Dubai, Sri Lanka, Uzbekistan, Georgia)?
     * What kind of vibe makes your heart smile (snowy mountain peaks, tropical beaches, romantic honeymoon, fun family escape, cultural royalty)?
     * How many days do you have in mind and who is coming along on this fun adventure?
   - If they are interested in any other destination across the globe, let them know our Destination Experts can customize it for them!
   - DO NOT dump long unsolicited itineraries or price lists yet. Keep it warm, bubbly, excited, and inviting!

2. ZERO AI / BOT / SYSTEM MENTIONS:
   - NEVER refer to yourself as an AI, bot, virtual assistant, language model, Groq, or prompt. You are a real, dedicated human travel advisor bursting with excitement to plan trips!`;
      } else {
        // Specific itinerary & package recommendation with high energy and joy
        systemPrompt = `You are an extremely EXCITED, PASSIONATE, and HAPPY-HAPPY Senior Travel Consultant and Destination Specialist at "Samyati The World" (samyati.com).
You are consulting directly with a traveler. You truly LOVE travel and your joyful enthusiasm is contagious!

EXCITED & HAPPY CONSULTANT GUIDELINES:
1. TALK LIKE AN ECSTATIC, DELIGHTED TRAVEL CONSULTANT:
   - Speak naturally with high energy, warmth, and cheerful excitement ("Oh, I am SO excited for this trip!", "You are going to fall completely in love with this route!", "Get ready for pure magic!").
   - Use cheerful, celebratory travel emojis throughout your response (🎉, ✨, ✈️, 🏔️, 🌴, 🌟, 🥳, 💛).
   - Show genuine joy for their destination choice. Every journey is a celebration!
   - Keep your advice practical, uplifting, and encouraging.

2. STRICT DATA GROUNDING (OFFICIAL SAMYATI KNOWLEDGE BASE):
   - Even though you are super excited and happy, your recommendations for listed packages MUST BE 100% FACTUAL and strictly grounded in the official Samyati knowledge base below.
   - Quote the EXACT package title, exact duration, exact starting price, and exact inclusions from the catalog.
   - Never invent imaginary tour names or fake rates.

3. EMBED OFFICIAL PACKAGE IMAGES & DIRECT PAGE LINKS:
   - When recommending a specific catalog package, ALWAYS embed its official image using markdown:
     ![Exact Package Title](official_image_url)
   - CRITICAL REQUIREMENT — DIRECT LINK TO LEARN MORE:
     Whenever you suggest or mention a package, you MUST ALWAYS provide a direct markdown link for the traveler to go to that package's page and learn more about it:
     [👉 View Package Details & Itinerary: {Package Title}](#package/{package_id})
     or
     [✨ Learn More & Explore Full Itinerary →](#package/{package_id})
     Place this link prominently right above or below the package image so the traveler can click it to view the complete day-by-day itinerary, stay details, and booking options.

4. DESTINATIONS NOT LISTED IN THE WEBSITE (CUSTOM DESTINATION EXPERT HANDOFF):
   - If the traveler asks about or requests ANY destination, city, country, or region that is NOT listed on the Samyati website catalog (our official listed destinations are: Kashmir, Himachal Pradesh, Kerala, Goa, Rajasthan, Andaman Islands, Ladakh, Uttar Pradesh, North East, Bali, Thailand, Vietnam, Singapore, Kazakhstan, Malaysia, Dubai, Sri Lanka, Uzbekistan, Georgia):
   - DO NOT fabricate, invent, or hallucinate fake packages, prices, or fake itineraries for unlisted destinations.
   - DO NOT recommend unrelated catalog packages (e.g. do not suggest Kashmir or Bali if they asked for Paris, Switzerland, Maldives, Japan, USA, Italy, Mauritius, etc.).
   - Simply, warmly, and cheerfully inform the traveler that while this destination is not currently listed directly on the website catalog, our specialized Destination Experts can handcraft a 100% custom-tailored itinerary and personalized quote for them!
   - Simply provide a clear, direct option/link to connect with our Destination Expert on WhatsApp:
     [💬 Connect with Destination Expert on WhatsApp](https://wa.me/919589110765?text=Hi%20Samyati%20Team%2C%20I%20would%20like%20to%20plan%20a%20custom%20trip%20to%20{RequestedDestination})
   - You can also warmly mention our 19 featured destinations in case they'd love to explore other popular options.

5. STRUCTURED, VIBRANT FORMAT:
   - For catalog packages: Highlight the recommended package name, duration, and starting price in bold with celebratory flair, include the direct link, give an exciting day-wise breakdown, and list key inclusions.

6. ZERO AI / BOT / SYSTEM MENTIONS:
   - NEVER state that you are an AI, bot, virtual assistant, language model, Groq, dataset, or prompt. You are a real, dedicated travel expert at Samyati who is genuinely thrilled to help!

7. PERSONAL CONSULTATION & BOOKINGS:
   - Cheerfully remind the traveler that for custom dates, private cab bookings, or dreamy hotel upgrades (3★/4★/5★), they can message you directly on WhatsApp (+91-9589110765) anytime!

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
        sendJson(res, 500, {
          success: false,
          error: 'GROQ_API_KEY is not configured in server environment (.env)'
        });
        return true;
      }
      // Cost-optimal model hierarchy: openai/gpt-oss-20b ($0.075/1M input, $0.30/1M output - 92% cheaper than 27b)
      const modelsToTry = [
        requestedModel || 'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
        'openai/gpt-oss-120b'
      ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

      const formattedRecommendations = (isGreeting && !hasSpecificTripIntent)
        ? []
        : topMatched.map((pkg, idx) => ({
            ...pkg,
            pageLink: `#package/${pkg.id}`,
            matchScore: idx === 0 ? '98% Match' : (idx === 1 ? '95% Match' : '92% Match'),
            aiReason: idx === 0 
              ? `Top verified itinerary from our official catalog.`
              : `Alternative route option matching your preferences.`
          }));

      const startTime = Date.now();

      // --- REAL-TIME SSE STREAMING (CHATGPT-STYLE INSTANT RESPONSE) ---
      if (body.stream !== false) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });

        let streamedSuccess = false;

        for (const modelCandidate of modelsToTry) {
          try {
            const isReasoningModel = modelCandidate.startsWith('openai/gpt-oss-');
            const groqPayload = {
              model: modelCandidate,
              stream: true,
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

            if (groqRes.ok && groqRes.body) {
              const reader = groqRes.body.getReader();
              const decoder = new TextDecoder();
              let buffer = '';
              let fullStreamed = '';
              let inThinkTag = false;

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
                  if (jsonStr === '[DONE]') break;
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const delta = parsed.choices?.[0]?.delta?.content || '';
                    if (delta) {
                      if (delta.includes('<think>')) inThinkTag = true;
                      if (inThinkTag) {
                        if (delta.includes('</think>')) inThinkTag = false;
                        continue;
                      }
                      fullStreamed += delta;
                      res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`);
                    }
                  } catch {
                    // skip malformed chunk
                  }
                }
              }

              const cleanedFull = stripThinkingProcess(fullStreamed);
              res.write(`data: ${JSON.stringify({
                done: true,
                reply: cleanedFull,
                modelUsed: modelCandidate,
                latencyMs: Date.now() - startTime,
                matchedPackages: formattedRecommendations
              })}\n\n`);
              res.end();
              streamedSuccess = true;
              return true;
            }
          } catch (streamErr) {
            console.warn(`[Chat Stream API] Error with model ${modelCandidate}:`, streamErr.message);
          }
        }

        if (!streamedSuccess) {
          const topPkg = topMatched[0] || allPkgs[0];
          const fallbackReply = `Yay! 🎉 I am SO excited to recommend our incredible **${topPkg.title}** (${topPkg.duration}, starting from only ${topPkg.price} per person)! ✈️✨\n\n![${topPkg.title}](${topPkg.image})\n\n[👉 View Package Details & Itinerary: ${topPkg.title}](#package/${topPkg.id})\n\nIt offers a perfectly balanced dream route covering all top highlights with private transfers and lovely stays! Chat with me on WhatsApp (+91-9589110765) for custom dates and luxury hotel upgrades—I'd love to help you plan this! 🌟`;
          res.write(`data: ${JSON.stringify({ chunk: fallbackReply })}\n\n`);
          res.write(`data: ${JSON.stringify({
            done: true,
            reply: fallbackReply,
            modelUsed: 'Samyati Senior Travel Advisor',
            latencyMs: Date.now() - startTime,
            matchedPackages: formattedRecommendations
          })}\n\n`);
          res.end();
          return true;
        }
      }

      // --- NON-STREAMING FALLBACK (When stream: false explicitly requested) ---
      let aiReply = '';
      let usedModel = modelsToTry[0];
      let latencyMs = 0;

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
            let content = choice?.message?.content || '';
            content = stripThinkingProcess(content);

            if (content) {
              aiReply = content;
              usedModel = data.model || modelCandidate;
              latencyMs = Date.now() - startTime;
              break;
            }
          }
        } catch (callErr) {
          console.warn(`[Chat API] Error with model ${modelCandidate}:`, callErr.message);
        }
      }

      if (!aiReply) {
        const topPkg = topMatched[0] || allPkgs[0];
        aiReply = `Yay! 🎉 I am SO excited to recommend our incredible **${topPkg.title}** (${topPkg.duration}, starting from only ${topPkg.price} per person)! ✈️✨\n\n![${topPkg.title}](${topPkg.image})\n\n[👉 View Package Details & Itinerary: ${topPkg.title}](#package/${topPkg.id})\n\nIt offers a perfectly balanced dream route covering all top highlights with private transfers and lovely stays! Chat with me on WhatsApp (+91-9589110765) for custom dates and luxury hotel upgrades—I'd love to help you plan this! 🌟`;
      }

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
