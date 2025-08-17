// [Purpose] Compose Express app: middleware, routes, and global error handler.
// [Why] Central place to assemble API with CORS, JSON, uploads, etc.
const express = require('express');
const cors = require('cors');
const path = require('path');
const { CORS_ORIGIN } = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/health', (_, res) => res.json({ ok: true }));

// Serve any static assets if needed later (e.g., uploaded files)
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api', routes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
