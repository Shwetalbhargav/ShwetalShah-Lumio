// server.js (root)
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// --- Resolve .env path relative to this file ---
const ENV_PATH = path.resolve(__dirname, '.env');

// --- Debug: show where we expect the file and whether it exists ---
console.log('[env] Looking for:', ENV_PATH);
console.log('[env] Exists?', fs.existsSync(ENV_PATH));

// --- Load .env explicitly from that path ---
dotenv.config({ path: ENV_PATH });

// --- Sanity checks (mask the key in logs) ---
const key = process.env.GROQ_API_KEY || '';
console.log('Groq Key loaded?', Boolean(key));
console.log('Groq Model:', process.env.GROQ_MODEL || '(none)');

if (!key) {
  console.error('❌ GROQ_API_KEY is missing. Ensure it is set in Render env vars.');
}

// --- Start server AFTER env is loaded ---
const { createServer } = require('http');
const app = require('./src/app');          // now points to src/app.js
const { PORT } = require('./src/config');  // now points to src/config/index.js

const server = createServer(app);
server.listen(PORT || 4000, () => {
  console.log(`✅ Mangodesk backend running on http://localhost:${PORT || 4000}`);
});
