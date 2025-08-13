
# Movie App Starter (React + Vite + TS + Tailwind)

Features:
- Top 100 list (placeholder RapidAPI client)
- Details page
- Favorites (localStorage)
- Mock auth with persistent session
- Protected route for /favorites
- Clean UI with Tailwind

## Setup

1) Install deps
```bash
npm i
```

2) Configure RapidAPI
- Copy `.env.example` to `.env` and set:
  - `VITE_RAPIDAPI_KEY`
  - `VITE_RAPIDAPI_HOST`
  - `VITE_RAPIDAPI_BASEURL`
- Update endpoints in `src/api/rapidapi.ts` (`/top-100`, `/title/:id`) according to the exact API you choose on RapidAPI.

3) Run
```bash
npm run dev
```

## Notes
- Replace mock auth in `src/context/AuthContext.tsx` with Firebase/Auth if needed.
- The list/detail mappers normalize various API shapes; adjust to match your API schema.



## Secure Setup (TMDb Proxy on Vercel)

1. Create **Environment Variable** on Vercel:
   - Key: `TMDB_BEARER`
   - Value: your TMDb v4 API Read Access Token (Bearer)

2. Deploy. The frontend calls `/api/tmdb?path=/movie/top_rated&page=1..5`.
   - The serverless function injects the bearer token on the server.
   - No API keys are exposed to the client or repo.

3. Local development:
   - Create `.env.local` (not committed) with:
     ```
     TMDB_BEARER=YOUR_TMDB_V4_TOKEN
     ```
   - Run `npm install` then `npm run dev`.

4. Safety:
   - `.gitignore` ignores `.env*`, `node_modules/`, `dist/`.
   - No secret files committed.

