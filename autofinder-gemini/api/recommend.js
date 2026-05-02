// api/recommend.js
// Vercel serverless function using Google Gemini API (FREE tier available).
// Get your key at: aistudio.google.com → Get API Key
// Set it in: Vercel Dashboard → Project → Settings → Environment Variables
// Variable name: GEMINI_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  const { summary } = req.body ?? {}

  if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
    return res.status(400).json({ error: 'Missing summary field' })
  }

  if (summary.length > 2000) {
    return res.status(400).json({ error: 'Summary too long' })
  }

  const prompt = `You are a neutral European used car expert. Based on these buyer quiz answers, recommend exactly 3 different cars from the European used car market.

BUYER PROFILE:
${summary}

Return ONLY a JSON object — no explanation, no markdown fences, no preamble. Start with { and end with }.

REQUIRED structure (fill in ALL fields for ALL 3 cars completely — never leave fields blank or zeroed):
{
  "profile": "3-word buyer label in Croatian",
  "pct": 85,
  "analysis": "2-3 sentences in Croatian about this buyer's needs.",
  "cars": [
    {
      "rank": 1,
      "name": "Brand Model Engine (e.g. BMW 320d xDrive)",
      "spec": "Year range · KS · Fuel · Transmission",
      "price": "EUR price range",
      "snaga": <integer 0-100>,
      "udobnost": <integer 0-100>,
      "vrijednost": <integer 0-100>,
      "pouzdanost": <integer 0-100>,
      "interijer": <integer 0-100>,
      "why": "2 sentences in Croatian why this fits this specific buyer.",
      "buy": "Specific guidance in Croatian: which trim, engine code, year range, max km, options to look for.",
      "warn": "1 sentence in Croatian about what to check before buying."
    },
    { "rank": 2, ...same complete structure, different car... },
    { "rank": 3, ...same complete structure, different car... }
  ],
  "avoid": "1 sentence in Croatian about what cars/configs to avoid for this buyer."
}

Rank 1 must be the best fit. Ranks 2 and 3 should be valid alternatives covering different trade-offs (e.g. cheaper, more practical, different brand). All three cars must be fully described with real models.`

  // Gemini 2.0 Flash — free tier, no credit card needed
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 3000,
          temperature: 0.7,
        },
      }),
    })

    if (!upstream.ok) {
      const err = await upstream.text().catch(() => '')
      console.error('Gemini error:', upstream.status, err.slice(0, 200))
      return res.status(502).json({ error: `Upstream error ${upstream.status}` })
    }

    const data = await upstream.json()

    // Gemini response: data.candidates[0].content.parts[0].text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('Unexpected Gemini response:', JSON.stringify(data).slice(0, 300))
      return res.status(502).json({ error: 'Empty response from model' })
    }

    if (data?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      return res.status(502).json({ error: 'Response truncated — please retry' })
    }

    return res.status(200).json({ text })
  } catch (e) {
    console.error('Function error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
