# Mangodesk Backend (Express + Groq + SQLite)

An API for uploading/accepting meeting transcripts, generating structured summaries with a custom prompt, editing them, and sharing via email — matching the Mangodesk brief. :contentReference[oaicite:1]{index=1}

## Quickstart
1. `npm i`
2. Copy `.env.example` to `.env`, fill values (Groq + SMTP).
3. `npm run dev` → http://localhost:4000

## Endpoints
- `POST /api/summaries/generate`  
  - **Body (JSON)**: `{ "transcriptText": "....", "prompt": "Summarize in bullet points..." }`  
  - **OR** multipart form with `transcriptFile` (plain .txt) and `prompt` (text).  
  - **Response**: `{ data: { id, transcript_text, prompt, summary_text, created_at, updated_at } }`

- `PUT /api/summaries/:id`  
  - **Body**: `{ "summaryText": "edited..." }`

- `POST /api/summaries/:id/share`  
  - **Body**: `{ "recipients": ["a@x.com","b@y.com"] }`

- `GET /api/summaries` — list
- `GET /api/summaries/:id` — single + share history
- `DELETE /api/summaries/:id` — optional

## Notes
- DB file at `data/mangodesk.sqlite` (auto).
- No MongoDB required.
- Swap models/service if you later choose another AI/email provider.
