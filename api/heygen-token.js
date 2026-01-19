export default async function handler(req, res) {
  // CORS (damit Webflow im Browser darauf zugreifen darf)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    // Optional: pro Seite anderer Avatar (z.B. ?avatar_id=...)
    const url = new URL(req.url, `https://${req.headers.host}`);
    const avatarId = url.searchParams.get("avatar_id"); // kannst du später nutzen

    const body = {
      mode: "FULL",
      // avatar_id MUSS gesetzt sein. Wenn du es noch nicht übergibst,
      // trag hier testweise eine feste ID ein:
      avatar_id: avatarId || "bb1f6ebc-b388-4a39-9e2b-8df618e0377c",
      avatar_persona: {
        language: "de",
        // optional:
        // voice_id: "<DEIN_VOICE_ID>",
        // context_id: "<DEIN_CONTEXT_ID>",
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
