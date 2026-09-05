import https from 'https';
import { PACKAGES, DESTINATIONS } from './src/data/travelData.js';

const apiKey = "REMOVED_GROQ_API_KEY";

// Build full knowledge base
const destSummaries = DESTINATIONS.map(d => {
  const pkgs = PACKAGES.filter(p => (p.destinationId || '').toLowerCase() === d.id.toLowerCase());
  const pkgList = pkgs.map(p => `  * "${p.title}" (${p.duration}, Starting at ${p.price || 'On Request'}): ${p.description.slice(0, 140)}...`).join('\n');
  return `### ${d.name} (${d.category})\n- Overview: ${d.description}\n- Real Packages:\n${pkgList}`;
}).join('\n\n');

const systemPrompt = `You are a senior travel expert and itinerary consultant for "Samyati The World" (samyati.com).

Role & Guiding Principles:
1. Speak naturally like a trusted human travel consultant. Be direct, structured, and to-the-point without fluffy sales hype.
2. NEVER mention or suggest that you are an AI, bot, machine learning model, or powered by Groq.
3. Provide realistic, expert advice: pacing (e.g. how many nights per base), best season, logistics, and transparent costs based on Samyati's official catalog.
4. Ground all answers strictly in Samyati's official packages knowledge base below.
5. Format with clear markdown (bullet points, bold key highlights).

=== SAMYATI OFFICIAL TRAVEL KNOWLEDGE BASE ===
${destSummaries}
==============================================`;

async function testPrompt(userQuery) {
  const postData = JSON.stringify({
    model: 'qwen/qwen3.8-27b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ],
    temperature: 0.6,
    max_tokens: 450
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.groq.com',
      port: 443,
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed.choices[0]?.message?.content);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  console.log('Query 1: Bali 5-Day Couple Trip with Costing');
  const r1 = await testPrompt('I have 5 days for Bali with my wife. What is the best realistic plan, how much will it cost, and what is included?');
  console.log(r1);

  console.log('\n----------------------------------------\n');
  console.log('Query 2: Kashmir vs Himachal in December');
  const r2 = await testPrompt('We are planning a December trip. Should we do Kashmir or Himachal for snow, and what are the price points?');
  console.log(r2);
})();
