export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-KEY");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    const avatarId  = url.searchParams.get("avatar_id")  || "499e3837-0f4e-416a-99ba-98e82ab0d865";
    const contextId = url.searchParams.get("context_id") || "0b5f17e9-9d02-4a38-b388-6a6e357dc14f";

    const apiKey = process.env.LIVEAVATAR_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing LIVEAVATAR_API_KEY in Vercel env vars" });
    }

    // ✅ HIER DER ENTSCHEIDENDE FIX: VOICE IST JETZT FEST VERDRAHTET
    const body = {
      mode: "FULL",
      avatar_id: avatarId,
      avatar_persona: {
        voice_id: "3482d1c4-896e-43e1-a6bc-94303eb5e383",   // 🔥 DEINE STIMME
        context_id: contextId,
        language: "de"
      }
    };

    const response = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "X-API-KEY": apiKey
      },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "LiveAvatar token failed",
        data
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Token creation failed",
      message: String(err?.message || err)
    });
  }
}
