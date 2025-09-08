// Revoking oauth user tokens for more security at Zunalita!
export default async function handler(req, res) {
  // Set CORS headers for the same origin as the other route
  res.setHeader("Access-Control-Allow-Origin", "https://zunalita.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Added Authorization header

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "missing token" });
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return res.status(500).json({ error: "server misconfigured" });
  }

  try {
    const tokenRevocationRes = await fetch(
      `https://api.github.com/applications/${client_id}/token`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
        },
        body: JSON.stringify({ access_token: token }),
      }
    );

    if (!tokenRevocationRes.ok) {
      const errText = await tokenRevocationRes.text();
      throw new Error(`gitHub responded with an error during token revocation: ${errText}`);
    }

    res.status(200).json({ message: "token revoked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "token revocation failed" });
  }
}
