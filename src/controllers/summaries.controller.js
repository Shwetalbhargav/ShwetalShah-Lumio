// [Purpose] Request handlers for summaries lifecycle (generate/edit/share).
// [Why] Controllers hold orchestration; models/services do the heavy lifting.
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { summarize } = require('../services/ai.service');
const model = require('../models/summaries.model');
const { generateSchema, updateSchema, shareSchema } = require('../utils/validators');
const { sendSummaryEmail } = require('../services/email.service');

// Configure disk storage for optional .txt uploads
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'text/plain') cb(null, true);
    else cb(new Error('Only .txt files are allowed'));
  },
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB
});

// POST /api/summaries/generate
async function generate(req, res, next) {
  try {
    // Accept text from body OR plain-text file
    let transcriptText = req.body.transcriptText || '';
    const prompt = req.body.prompt || '';

    if (req.file) {
      transcriptText = fs.readFileSync(req.file.path, 'utf8').toString();
    }

    const parsed = generateSchema.safeParse({ transcriptText, prompt });
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return res.status(400).json({ error: msg });
    }

    const summaryText = await summarize(transcriptText, prompt);
    const created = model.createSummary({ transcript_text: transcriptText, prompt, summary_text: summaryText });
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

// PUT /api/summaries/:id
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { summaryText } = req.body;

    const parsed = updateSchema.safeParse({ summaryText });
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return res.status(400).json({ error: msg });
    }

    const existing = model.findById(id);
    if (!existing) return res.status(404).json({ error: 'Summary not found' });

    const updated = model.updateSummary(id, summaryText);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

// POST /api/summaries/:id/share
async function share(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { recipients } = req.body;

    const parsed = shareSchema.safeParse({ recipients });
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return res.status(400).json({ error: msg });
    }

    const existing = model.findById(id);
    if (!existing) return res.status(404).json({ error: 'Summary not found' });

    await sendSummaryEmail({
      recipients,
      subject: `Summary #${id}`,
      summaryText: existing.summary_text
    });

    const record = model.createShare(id, recipients.join(','));
    res.status(201).json({ data: { shared: true, share: record } });
  } catch (err) {
    next(err);
  }
}

// GET /api/summaries
function list(req, res, next) {
  try {
    const rows = model.findAll();
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/summaries/:id
function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = model.findById(id);
    if (!row) return res.status(404).json({ error: 'Summary not found' });
    const shares = model.listShares(id);
    res.json({ data: row, shares });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/summaries/:id  (optional cleanup)
function removeOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = model.findById(id);
    if (!row) return res.status(404).json({ error: 'Summary not found' });
    model.remove(id);
    res.json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upload,
  generate,
  update,
  share,
  list,
  getOne,
  removeOne
};
