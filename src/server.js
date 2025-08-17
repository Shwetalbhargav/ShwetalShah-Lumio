// src/server.js (CommonJS)
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// --- Resolve .env path relative to this file ---
const ENV_PATH = path.resolve(__dirname, '..', '.env');

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
  console.error(
    '❌ GROQ_API_KEY is missing. Ensure .env is at the backend project root and NOT named .env.txt'
  );
}

// --- Start server AFTER env is loaded ---
const { createServer } = require('http');
const app = require('./app');
const { PORT } = require('./config');

const server = createServer(app);
server.listen(PORT || 4000, () => {
  console.log(`✅ Mangodesk backend running on http://localhost:${PORT || 4000}`);
});
