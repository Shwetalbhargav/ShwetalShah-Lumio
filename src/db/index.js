// [Purpose] Initialize SQLite connection and ensure tables exist.
// [Why] Lightweight persistence without MongoDB; zero external services.
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'mangodesk.sqlite');
const db = new Database(dbPath);

// Create tables (idempotent)
db.exec(`
  CREATE TABLE IF NOT EXISTS summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transcript_text TEXT NOT NULL,
    prompt TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    summary_id INTEGER NOT NULL,
    recipients TEXT NOT NULL,    -- comma-separated emails
    sent_at TEXT NOT NULL,
    FOREIGN KEY(summary_id) REFERENCES summaries(id)
  );
`);

module.exports = db;
