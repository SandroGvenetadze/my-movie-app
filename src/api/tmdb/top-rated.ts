// api/tmdb/top-rated.ts
// Serverless proxy for TMDb Top Rated (page param). Hides your TMDB_API_KEY.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY is not set on the server.' });

  const page = Number(req.query.page ?? 1);
  const url = new URL('https://api.themoviedb.org/3/movie/top_rated');
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', String(page));
  url.searchParams.set('api_key', key); // v3 key via query

  try {
    const r = await fetch(url.toString());
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Upstream TMDb fetch failed', detail: String(e?.message ?? e) });
  }
}
