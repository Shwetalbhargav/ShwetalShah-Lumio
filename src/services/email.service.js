// [Purpose] Thin wrapper over Nodemailer to send summaries.
// [Why] Centralizes email config and keeps controllers clean.
const nodemailer = require('nodemailer');
const {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM
} = require('../config');

function getTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP is not configured');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

/**
 * Send summary email to recipients.
 * @param {Object} params
 * @param {string[]} params.recipients
 * @param {string} params.subject
 * @param {string} params.summaryText
 */
async function sendSummaryEmail({ recipients, subject, summaryText }) {
  const transporter = getTransport();
  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: recipients.join(','),
    subject: subject || 'Meeting Summary',
    text: summaryText,
    html: `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap;">${escapeHtml(summaryText)}</pre>`
  });
  return info.messageId;
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

module.exports = { sendSummaryEmail };
