export default async function handler(req, res) {
  // CORS, damit Webflow fetchen darf
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    // per URL steuerbar:
    // .../api/heygen-token?avatar_id=UUID&context_id=UUID
    const avatarId = url.searchParams.get("avatar_id") || "HIER_DEFAULT_AVATAR_UUID";
    const contextId = url.searchParams.get("context_id") || "HIER_DEFAULT_CONTEXT_UUID";

    const body = {
      mode: "FULL",
      avatar_id: avatarId,
      avatar_persona: {
        language: "de",
        context_id: contextId,
        // voice_id optional, falls du eine fix setzen willst:
        // voice_id: "HIER_VOICE_UUID",
      },
    };

    const response = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.LIVEAVATAR_API_KEY,
        "accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Token creation failed" });
  }
}
