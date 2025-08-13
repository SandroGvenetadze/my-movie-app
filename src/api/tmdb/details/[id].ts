// api/tmdb/details/[id].ts
// Serverless proxy for TMDb movie details by id.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.TMDB_API_KEY;
  const { id } = req.query as { id?: string };

  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY is not set on the server.' });
  if (!id)  return res.status(400).json({ error: 'Missing movie id.' });

  const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('api_key', key);

  try {
    const r = await fetch(url.toString());
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Upstream TMDb fetch failed', detail: String(e?.message ?? e) });
  }
}
