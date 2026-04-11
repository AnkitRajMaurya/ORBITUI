# OrbitUI Backend (demo)

This folder contains a minimal Express backend used for demo purposes.

Endpoints:
- `GET /api/about` — returns JSON with site and author info
- `POST /api/contact` — accepts JSON contact payloads (demo; logs to console)

Quick start:

1. Install dependencies:

```bash
cd backend
npm install
```

2. Run the server:

```bash
npm start
# or for development with auto-reload (if you have nodemon):
npm run dev
```

The server listens on `http://localhost:3000` by default and serves the static
frontend from the project root alongside the API endpoints.

Note: This is a lightweight demo backend — do not use as-is for production. Add
validation, persistence, authentication, and rate-limiting as needed.
