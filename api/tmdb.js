export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { path, page = '1', language = 'en-US' } = req.query || {};
    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    // Allowlist basic endpoints
    const allow = ['/movie/top_rated'];
    if (!allow.includes(path)) {
      return res.status(403).json({ error: 'Endpoint not allowed' });
    }
    const token = process.env.TMDB_BEARER;
    if (!token) {
      return res.status(500).json({ error: 'Server missing TMDB_BEARER' });
    }
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    url.searchParams.set('language', language);
    url.searchParams.set('page', String(page));
    const upstream = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', details: String(err) });
  }
}
