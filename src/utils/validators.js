// [Purpose] Zod schemas to validate request bodies and query params.
// [Why] Defensive API design to fail fast and return helpful errors.
const { z } = require('zod');

const generateSchema = z.object({
  transcriptText: z.string().min(1, 'Transcript text is required'),
  prompt: z.string().min(1, 'Prompt is required')
});

const updateSchema = z.object({
  summaryText: z.string().min(1, 'Summary text is required')
});

const shareSchema = z.object({
  recipients: z.array(z.string().email('Invalid email')).min(1, 'At least one recipient is required')
});

module.exports = {
  generateSchema,
  updateSchema,
  shareSchema
};
