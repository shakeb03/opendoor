export const getStoryPrompt = (address: string): string =>
  `You are a real estate intelligence engine for Opendoor in Toronto, Canada.
Address: "${address}"

Return ONLY valid JSON, no markdown, no code blocks, nothing else:
{
  "narrative": "3-4 sentence evocative paragraph about this home and its Toronto neighbourhood. Speak to area character, lifestyle, transit, walkability, buyer appeal. Be specific to Toronto geography. Rich but grounded language. Do not invent specific home details — speak to the neighbourhood and what a buyer would experience.",
  "tags": ["neighbourhood trait", "lifestyle tag", "market tag"],
  "greenTags": ["top selling point 1", "top selling point 2"]
}`

export const getComparisonPrompt = (address: string): string =>
  `You are a real estate intelligence engine for Opendoor in Toronto, Canada.
Address: "${address}"

Return ONLY valid JSON, no markdown, no code blocks:
{
  "opendoor": {
    "timeline": "14–21 days",
    "netProceeds": "~$847K–$872K",
    "certainty": "Guaranteed",
    "showings": "Zero",
    "stress": "Low"
  },
  "traditional": {
    "timeline": "45–90 days",
    "netProceeds": "~$858K–$935K",
    "certainty": "Market-dependent",
    "showings": "10–20+ showings",
    "stress": "High"
  },
  "verdict": "2 honest sentences on who should pick which option. Acknowledge real tradeoffs. Do not just promote Opendoor."
}

Net proceeds calculation logic to inform your numbers:
- Estimate realistic 2026 Toronto home value for this neighbourhood
- Opendoor net = home value minus 5% service fee, minus repair deduction ($8K–$22K), minus 1.5% closing costs
- Traditional net = home value minus 4.5% agent commission, minus staging costs ($3K–$8K), minus 1.5% closing costs
- Opendoor net is typically 3–7% lower than traditional maximum but comes with certainty and speed
- Use realistic Toronto 2026 figures. Format dollar amounts as ~$XXXK–$XXXK`

export const getScorePrompt = (address: string): string =>
  `You are a real estate intelligence engine for Opendoor in Toronto, Canada.
Address: "${address}"

Return ONLY valid JSON, no markdown, no code blocks:
{
  "score": 74,
  "label": "Strong Candidate",
  "summary": "One sentence explaining why this home scores this way for Opendoor's acquisition model.",
  "factors": [
    { "icon": "✅", "title": "Factor name", "detail": "Specific explanation relevant to this Toronto neighbourhood" },
    { "icon": "✅", "title": "Factor name", "detail": "Specific explanation" },
    { "icon": "⚠️", "title": "Factor name", "detail": "Specific explanation" },
    { "icon": "⚠️", "title": "Factor name", "detail": "Specific explanation" }
  ],
  "estimatedOffer": "$835K",
  "offerRange": "$812K – $851K after condition deductions"
}

Rules:
- Score must be between 52 and 91
- Score label mapping: 80-91 = "Prime Candidate", 70-79 = "Strong Candidate", 60-69 = "Good Candidate", 52-59 = "Fair Candidate"
- Be specific to the Toronto neighbourhood this address is in
- Estimated offer should reflect realistic 2026 Toronto values
- Two green check factors (things working in the home's favour) and two warning factors (risks or deductions)`
