export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`GitHub responded: ${errText}`);
    }

    const data = await tokenRes.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    const access_token = data.access_token;

    res.status(200).json({ token: access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OAuth exchange failed" });
  }
}
