// [Purpose] Encapsulate DB queries for summaries & shares.
// [Why] Keeps controllers thin and business logic reusable/testable.
const db = require('../db');

const insertSummary = db.prepare(`
  INSERT INTO summaries (transcript_text, prompt, summary_text, created_at, updated_at)
  VALUES (@transcript_text, @prompt, @summary_text, @created_at, @updated_at)
`);

const updateSummaryStmt = db.prepare(`
  UPDATE summaries SET summary_text=@summary_text, updated_at=@updated_at
  WHERE id=@id
`);

const selectOne = db.prepare(`SELECT * FROM summaries WHERE id=@id`);
const selectAll = db.prepare(`SELECT * FROM summaries ORDER BY created_at DESC`);
const deleteOne = db.prepare(`DELETE FROM summaries WHERE id=@id`);

const insertShare = db.prepare(`
  INSERT INTO shares (summary_id, recipients, sent_at)
  VALUES (@summary_id, @recipients, @sent_at)
`);

const selectSharesForSummary = db.prepare(`
  SELECT * FROM shares WHERE summary_id=@summary_id ORDER BY sent_at DESC
`);

module.exports = {
  createSummary({ transcript_text, prompt, summary_text }) {
    const now = new Date().toISOString();
    const info = insertSummary.run({ transcript_text, prompt, summary_text, created_at: now, updated_at: now });
    return this.findById(info.lastInsertRowid);
  },

  updateSummary(id, summary_text) {
    const now = new Date().toISOString();
    updateSummaryStmt.run({ id, summary_text, updated_at: now });
    return this.findById(id);
  },

  findById(id) {
    return selectOne.get({ id });
  },

  findAll() {
    return selectAll.all();
  },

  remove(id) {
    return deleteOne.run({ id });
  },

  createShare(summary_id, recipientsCsv) {
    const sent_at = new Date().toISOString();
    const info = insertShare.run({ summary_id, recipients: recipientsCsv, sent_at });
    return { id: info.lastInsertRowid, summary_id, recipients: recipientsCsv, sent_at };
  },

  listShares(summary_id) {
    return selectSharesForSummary.all({ summary_id });
  }
};
