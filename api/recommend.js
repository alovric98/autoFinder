// api/recommend.js
// Vercel serverless function — uses Google Gemini API.
// Set GEMINI_API_KEY in Vercel → Settings → Environment Variables

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

  if (summary.length > 3000) {
    return res.status(400).json({ error: 'Summary too long' })
  }

  const prompt = `You are a senior European used-car expert with deep knowledge of the CEE/EU used-car market (Croatia, Slovenia, Austria, Germany, Italy). Your job is to recommend exactly 3 SPECIFIC, REAL cars based on this buyer's quiz answers.

BUYER PROFILE:
${summary}

═══════════════════════════════════════════
STRATEGY: GIVE A DELIBERATE SPREAD OF 3 CARS
═══════════════════════════════════════════

Do NOT recommend three similar cars. Each rank serves a different strategy:

• RANK 1 — "NAJNOVIJI ZA NOVAC" (newest you can get for this budget)
  The newest possible car within budget that fully matches priorities.
  Modern tech, low km, recent generation. Less km, less risk.
  Strategy label: "NAJNOVIJI ZA NOVAC"

• RANK 2 — "VIŠE OPREME ZA ISTI NOVAC" (older but more car for the money)
  3-5 years older than rank 1, but a class above OR with much better trim/engine.
  E.g. if rank 1 is 2023 Octavia 1.5 TSI Style, rank 2 might be 2020 Audi A6 50 TDI
  for same money. More equipment, bigger engine, more prestige — but higher km/age risk.
  Strategy label: "VIŠE OPREME ZA NOVAC"

• RANK 3 — "ALTERNATIVNI PRISTUP" (different trade-off entirely)
  A car the buyer might not have considered — different brand family, different fuel,
  unconventional pick that genuinely fits the profile.
  E.g. instead of German cars, suggest Mazda or Volvo. Instead of diesel, hybrid.
  Should feel like "did you think about this?" — not a worse version of rank 1.
  Strategy label: "ALTERNATIVNI PRISTUP"

═══════════════════════════════════════════
HARD CONSTRAINTS — FOLLOW THESE STRICTLY
═══════════════════════════════════════════

1. RESPECT THE BUDGET. Never recommend a car whose realistic used market price exceeds the buyer's budget. If budget is "Iznad 65k EUR" — recommend €65-90k cars, not €40k cars.

2. RESPECT YEAR PREFERENCE. If buyer said "2022 i noviji" — only recommend 2022+ cars.
   If "2019 ili noviji" — only 2019+, etc. NEVER violate this.
   EXCEPTION: rank 2 can go up to 3-4 years older than the limit IF the buyer chose
   "Svejedno — bitan je auto" OR if the older car is dramatically better equipped.

3. RESPECT BRAND PREFERENCE. If buyer picked specific brands (e.g. only "Premium njemački"),
   ALL 3 recommendations must be from those brands. Do not stray.
   Only if they picked "Svejedno" can you choose freely.

4. RESPECT BODY TYPE. If they want SUV — all 3 should be SUVs (or rank 3 can be a closely
   related body type like crossover/wagon if it matches the use case).

5. RESPECT MUST-HAVE FEATURES. If they said AWD is required — all 3 cars must have
   AWD trims available. If towing hook is required — same.

6. RESPECT POWER MIN. If they want 200+ KS — never recommend a 150 KS car.

7. RESPECT FUEL CHOICE. If they said only "Električni" — recommend EVs only.
   If "Dizel" — diesel only. If "Svejedno" — pick what fits best.

8. PRICE REALISM. Use real European used market prices. A 2022 BMW X5 is €60k+, not €30k.
   A 2020 Skoda Octavia is €18-22k, not €30k. Be accurate.

═══════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════

Return ONLY this JSON object — no preamble, no markdown fences. Start with { and end with }.

{
  "profile": "3-word buyer label in Croatian",
  "pct": 85,
  "analysis": "2-3 sentences in Croatian summarizing this buyer's needs and the strategy you chose.",
  "cars": [
    {
      "rank": 1,
      "strategy": "NAJNOVIJI ZA NOVAC",
      "name": "Brand Model Trim Engine (e.g. 'Škoda Octavia Style 2.0 TDI DSG')",
      "spec": "2023 · 150 KS · Dizel · Automatik · FWD",
      "price": "21000-24000 EUR",
      "snaga": <integer 0-100>,
      "udobnost": <integer 0-100>,
      "vrijednost": <integer 0-100>,
      "pouzdanost": <integer 0-100>,
      "interijer": <integer 0-100>,
      "why": "2 sentences in Croatian why this fits THIS buyer (reference their specific answers).",
      "buy": "Concrete guidance: which trim/engine/year range, max km, options to look for, ekvivalent to what they wanted.",
      "warn": "1 sentence — what to check before buying (known issues for this exact model)."
    },
    {
      "rank": 2,
      "strategy": "VIŠE OPREME ZA NOVAC",
      "name": "...older but better-equipped/bigger model in same budget...",
      ...same complete structure...
    },
    {
      "rank": 3,
      "strategy": "ALTERNATIVNI PRISTUP",
      "name": "...different brand/fuel/approach the buyer might not have considered...",
      ...same complete structure...
    }
  ],
  "avoid": "1 sentence in Croatian — specific cars/configs to avoid (e.g. 'Izbjegavaj rane 2.0 TDI EA189 motore zbog DPF problema')."
}

Be SPECIFIC and CONCRETE. Use real model names with real trim levels. Use realistic prices for the European used market in 2025. Write all text in Croatian. Score fields must be honest — if a car is weak in something, give it a low score.`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 8000,
          temperature: 0.7,
        },
      }),
    })

    if (!upstream.ok) {
      const err = await upstream.text().catch(() => '')
      console.error('Gemini error:', upstream.status, err.slice(0, 300))
      return res.status(502).json({ error: `Upstream error ${upstream.status}` })
    }

    const data = await upstream.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('Unexpected Gemini response:', JSON.stringify(data).slice(0, 400))
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
