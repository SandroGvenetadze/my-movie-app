// api/tmdb.js
// Secure TMDb proxy. Hides the v4 Bearer token on the server.
// Only allows a small set of TMDb endpoints; forwards a safe subset of query params.

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { path = "", language = "en-US", page = "1", query } = req.query;
    if (typeof path !== "string" || !path.startsWith("/")) {
      return res.status(400).json({ error: "Invalid path" });
    }

    // ---- Allowlist (regex-based) ----
    // /movie/top_rated
    // /movie/{id}
    // /movie/{id}/credits
    // /search/movie
    // /genre/movie/list
    const allowed = [
      /^\/movie\/top_rated$/,
      /^\/movie\/\d+$/,
      /^\/movie\/\d+\/credits$/,
      /^\/search\/movie$/,
      /^\/genre\/movie\/list$/,
    ];
    const allowedPath = allowed.some((rx) => rx.test(path));
    if (!allowedPath) {
      return res.status(403).json({ error: "Endpoint not allowed" });
    }

    const token = process.env.TMDB_BEARER;
    if (!token) {
      return res.status(500).json({ error: "Server missing TMDB_BEARER" });
    }

    // ---- Build upstream URL ----
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    // Pass through a safe set of query params
    if (language) url.searchParams.set("language", String(language));
    if (page) url.searchParams.set("page", String(page));
    if (typeof query === "string" && query.trim()) {
      url.searchParams.set("query", query.trim());
    }

    // ---- Fetch from TMDb ----
    const upstream = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Optional CDN caching for Vercel’s edge
    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate=604800"
    );

    // Stream JSON back to the client
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy error", details: String(err) });
  }
}
