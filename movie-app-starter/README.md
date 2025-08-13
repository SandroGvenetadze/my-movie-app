
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
