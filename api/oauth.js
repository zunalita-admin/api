export default async function handler(req, res) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing OAuth code" });
  }

  try {
    // Change code to access token
    const tokenResponse = await fetch(
      `https://github.com/login/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id,
          client_secret,
          code
        })
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({ error: "Failed to get token", details: tokenData });
    }

    // Return to front-end
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ token: tokenData.access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
}
