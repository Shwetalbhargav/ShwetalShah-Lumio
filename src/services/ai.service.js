// [Purpose] Wrap Groq text generation into a single function.
// [Why] Isolates vendor SDK usage and makes it easy to swap providers later.
const { GROQ_API_KEY, GROQ_MODEL } = require('../config');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: GROQ_API_KEY });

/**
 * Summarize a transcript according to a custom prompt.
 * @param {string} transcriptText - raw meeting/call notes.
 * @param {string} prompt - user instruction e.g., "bullet points for executives".
 * @returns {Promise<string>} summary text
 */
async function summarize(transcriptText, prompt) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  // Build a system+user style prompt for reliable structured output
  const systemPreamble = `
You are an expert meeting-notes summarizer. 
Follow the user's instruction precisely. Be concise, structured, and actionable. 
Prefer bullet points, headings, and action items where relevant.
If action items exist, include an "Action Items" section with assignees and due dates if present.
`;

  const userContent = `
<instruction>
${prompt}
</instruction>

<transcript>
${transcriptText}
</transcript>
`;

  // Call Groq chat completion (Llama 3 model suggested for summarization)
  const resp = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPreamble.trim() },
      { role: 'user', content: userContent.trim() }
    ],
    temperature: 0.2,
    max_tokens: 1024
  });

  const text = resp.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('No summary generated');
  return text;
}

module.exports = { summarize };
