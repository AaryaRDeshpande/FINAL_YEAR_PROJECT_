# Backend (Express + MongoDB)

Env options (defaults in code):
- `PORT` (default 5000)
- `MONGODB_URI` (default mongodb://localhost:27017/legal_summarizer)
- `CLIENT_ORIGIN` (default http://localhost:5173)
- `UPLOAD_DIR` (default backend/uploads)

Routes:
- `POST /api/documents/upload` – multipart upload field `file`
- `POST /api/documents/:id/process` – extract, summarize, simplify, entities
- `GET /api/documents/:id` – get one
- `GET /api/documents` – list recent (limit 100)
