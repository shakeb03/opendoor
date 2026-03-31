# Opendoor Toronto — Home Intelligence Demo
## Product Requirements Document for Claude Code

---

## Overview

Build a mobile-first Next.js web app called **Opendoor Toronto Home Intelligence**. A user types any Toronto address and receives three AI-generated reveals in parallel: their home's story, a comparison between selling via Opendoor vs. traditional listing, and a seller readiness score with estimated offer. This is a demo app built to showcase AI engineering capability at a hiring event.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + CSS Modules for custom styles not expressible in Tailwind
- **Fonts:** Google Fonts — `Cormorant Garamond` (serif display) + `DM Sans` (body). Load via `next/font/google`.
- **Deployment:** Vercel
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) via server-side API routes
- **Images:** Google Maps Street View Static API via server-side proxy route

---

## Environment Variables

```
ANTHROPIC_API_KEY=your_key_here
GOOGLE_MAPS_API_KEY=your_key_here
```

Both keys must **never** be exposed to the client. All API calls go through Next.js route handlers.

---

## Project Structure

```
opendoor-demo/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← main UI (client component)
│   ├── globals.css            ← CSS variables, base styles, custom classes
│   └── api/
│       ├── story/route.ts     ← POST: returns home narrative + tags
│       ├── comparison/route.ts ← POST: returns Opendoor vs traditional comparison
│       ├── score/route.ts     ← POST: returns readiness score + offer estimate
│       └── streetview/route.ts ← GET: proxies Google Street View image
├── components/
│   ├── TopBar.tsx
│   ├── Hero.tsx
│   ├── SearchBox.tsx
│   ├── StreetViewCard.tsx
│   ├── ProgressBar.tsx
│   ├── StoryCard.tsx
│   ├── ComparisonCard.tsx
│   └── ScoreCard.tsx
├── types/
│   └── index.ts               ← all shared TypeScript interfaces
├── lib/
│   └── prompts.ts             ← all AI prompts as exported constants
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Design System

Implement these as CSS variables in `globals.css`. Do not deviate from these values.

```css
:root {
  --green: #1a7a4a;
  --green-light: #25c076;
  --green-pale: rgba(26, 122, 74, 0.09);
  --green-border: rgba(26, 122, 74, 0.22);
  --bg: #f7f4ef;
  --ink: #0f1710;
  --ink-2: #2a3d31;
  --ink-3: #657a6d;
  --ink-4: #a4b8ac;
  --ink-5: #dce8e1;
  --white: #ffffff;
  --warm: #f0ebe0;
  --red: #be3030;
  --amber: #b07010;
  --card-shadow: 0 2px 20px rgba(0, 0, 0, 0.07);
}
```

**Typography:**
- Display / headings: `Cormorant Garamond` serif, weights 300/400/600/700, italic variants used for emphasis
- Body: `DM Sans`, weights 300/400/500/600

**Max width:** 430px, centered. This is a mobile-first app.

**Body:**
- Background: `var(--bg)`
- `overscroll-behavior: none`
- `-webkit-font-smoothing: antialiased`
- Subtle grain texture overlay using a fixed SVG noise filter (see reference HTML below)
- `-webkit-tap-highlight-color: transparent` on all interactive elements

---

## Page Structure & Components

### `app/layout.tsx`
- Load `Cormorant Garamond` (weights: 300, 400, 600, 700, italics) and `DM Sans` (weights: 300, 400, 500, 600) via `next/font/google`
- Set viewport meta: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`
- Set `apple-mobile-web-app-capable` and `apple-mobile-web-app-status-bar-style: black-translucent`
- Title: `Opendoor Toronto`

---

### `app/page.tsx` (Client Component)

This is the main orchestration component. It manages all state and fires the parallel API calls.

**State:**
```typescript
const [address, setAddress] = useState('')
const [isLoading, setIsLoading] = useState(false)
const [showResults, setShowResults] = useState(false)
const [submittedAddress, setSubmittedAddress] = useState('')
const [storyData, setStoryData] = useState<StoryData | null>(null)
const [storyDone, setStoryDone] = useState(false)
const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
const [comparisonDone, setComparisonDone] = useState(false)
const [scoreData, setScoreData] = useState<ScoreData | null>(null)
const [scoreDone, setScoreDone] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**On submit (`handleAnalyse`):**
1. Validate address is non-empty
2. Set `isLoading = true`, `showResults = true`, `submittedAddress = address`
3. Reset all data states to null, all done states to false
4. Stagger card appearance: card1 at 60ms, card2 at 160ms, card3 at 260ms using `setTimeout`
5. Smooth scroll to results section at 350ms
6. Fire `Promise.all([fetchStory(), fetchComparison(), fetchScore()])` — all three in parallel
7. Each fetch function calls its own `/api/` route, sets its own data state on resolve, sets its done state to true
8. On any error, set error message
9. Set `isLoading = false` when all settle

**Sample addresses (preloaded chips):**
- `120 Adelaide St W, Toronto`
- `55 Bloor St W, Toronto`
- `300 Front St W, Toronto`
- `19 Duncan St, Toronto`
- `1 Yonge St, Toronto`

---

### `components/TopBar.tsx`
- Sticky, `top: 0`, `z-index: 100`
- Background: `var(--bg)` with bottom border `1px solid var(--ink-5)`
- Padding: `54px 20px 20px` (extra top padding for iPhone notch)
- Left: Logo — Cormorant Garamond 700 22px, with a 9×9px green-light dot to the left
- Right: Badge — `"Toronto 2026"` pill, green text on green-pale background, green border, 10px uppercase letter-spaced

---

### `components/Hero.tsx`
- Padding: `32px 20px 28px`
- Eyebrow: `"AI Home Intelligence"` — 10px, 600 weight, 0.2em letter spacing, uppercase, green color, with an 18px green horizontal line before it (CSS `::before` pseudo or `<span>`)
- Title: Cormorant Garamond, 44px, weight 300, line-height 0.97, letter-spacing -0.03em. The word `"Understood."` is `<strong>` — weight 700, italic, green color
- Subtitle: 14px, weight 300, ink-3 color, line-height 1.6

---

### `components/SearchBox.tsx`

Props: `{ value, onChange, onSubmit, isLoading, sampleAddresses }`

**Search field:**
- Flex row with white background, 1.5px ink-5 border, 16px border-radius, card-shadow
- On focus-within: green border + green-pale box-shadow glow
- Left: location icon (⌖ or similar SVG), ink-4 color
- Center: text input, 15px DM Sans, no outline, transparent background, `padding: 16px 0`
- Right: square green button (44×44px, 12px border-radius, 5px margin inside the field). Shows `→` arrow normally, shows spinner when `isLoading`. Scale 0.93 on `:active`.

**Chips row:**
- `overflow-x: auto`, `-webkit-overflow-scrolling: touch`, `scrollbar-width: none`
- Horizontally scrollable, no wrapping
- Each chip: white background, ink-5 border, 20px border-radius, 7px/14px padding, 12px 500 weight, ink-3 text
- On `:active`: green-pale background, green-border, green text, scale 0.96

**Keyboard:** Submit on Enter key.

---

### `components/StreetViewCard.tsx`

Props: `{ address: string, submittedAddress: string }`

- Border-radius: 20px, card-shadow, ink-5 border
- Image area: 200px tall, full width
- Image src: `/api/streetview?address=${encodeURIComponent(address)}`
- While loading: show placeholder with 🏠 emoji (opacity 0.3) and animated "Loading street view" text with CSS dot animation (`::after` content cycling through `''`, `'.'`, `'..'`, `'...'`)
- On load: fade image in (opacity 0 → 1, 0.5s transition), hide placeholder
- On error: show placeholder with static "Street view unavailable" text
- Bottom meta row: left side shows street name (Cormorant 17px 600) + "Toronto, ON · Canada" (11px ink-4). Right side shows pulsing green dot + "AI Active" label (10px 600 uppercase green)

---

### `components/ProgressBar.tsx`

Props: `{ step1Done: boolean, step2Done: boolean, step3Done: boolean }`

- Three equal flex bars, 3px tall, ink-5 background, green fill
- Fill animates from 0% to 100% width (0.5s ease transition) when corresponding `stepNDone` becomes true

---

### `components/StoryCard.tsx`

Props: `{ data: StoryData | null, isDone: boolean, isVisible: boolean }`

Card shell (shared pattern for all three cards):
- White background, ink-5 border, 20px border-radius, card-shadow
- Opacity 0 + translateY(18px) when not visible, animates to opacity 1 + translateY(0) when `isVisible` becomes true (0.38s ease)
- Header: flex row — numbered circle (28px, dark background, white text) + title group + status indicator
- Status indicator: shows spinner + "Analysing" while loading, switches to "✓ Done" (green) when isDone

When `data` is null: show skeleton (shimmer animation):
- 5 bars of varying widths (100%, 100%, 74%, 100%, 48%), heights 17px for first then 12px, shimmer gradient animation

When `data` is populated:
- Italic Cormorant Garamond paragraph, 18px weight 400, line-height 1.68, ink-2 color
- Tag row below a 1px ink-5 divider: regular tags (warm bg, ink-5 border, ink-3 text) + green tags (green-pale bg, green-border, green text)

---

### `components/ComparisonCard.tsx`

Props: `{ data: ComparisonData | null, isDone: boolean, isVisible: boolean }`

Same card shell pattern.

When `data` is populated:
- Two-column grid (equal width, 10px gap)
- Opendoor column: green-pale background, green-border 1.5px, 14px border-radius
- Traditional column: warm background, ink-5 border 1.5px
- Each column has a label row (9px, 700, uppercase, letter-spaced) then 5 data rows
- Each row has a micro-label (9px, ink-4, uppercase) and a value (13px, 500)
- Value color classes: green for Opendoor positives, amber for Traditional timeline/certainty, red for Traditional showings/stress
- Below the grid: dark ink verdict box (border-radius 12px, padding 13px 15px) with white/0.72 text

---

### `components/ScoreCard.tsx`

Props: `{ data: ScoreData | null, isDone: boolean, isVisible: boolean }`

Same card shell pattern.

When `data` is populated:

**Score ring:**
- 84×84px SVG circle ring
- `r="35"`, `stroke-width="5"`, `stroke-dasharray="219.9"`
- Track circle: ink-5 stroke
- Fill circle: rotated -90deg, green stroke (amber if score 55-74, red if <55)
- Animate `stroke-dashoffset` from 219.9 to `219.9 - (score/100 * 219.9)` on mount (1.1s cubic-bezier(0.4,0,0.2,1))
- Score number centered: Cormorant 24px 700

**Score metadata:** label (Cormorant 20px 700) + summary (12px ink-3)

**Factors list:** 4 items, each with emoji icon + bold title (13px 600) + detail text (11px ink-3), on var(--bg) background, 12px border-radius

**Net estimate box:** dark ink background, 14px border-radius
- Left: "Estimated Offer" micro-label + large amount (Cormorant 28px 700 white) + range text (10px rgba white 0.3)
- Right: green CTA button "Get Offer →"

---

## API Routes

### `POST /api/story`

Request body: `{ address: string }`

System context built from `lib/prompts.ts`. Call Anthropic API with:

```
Model: claude-sonnet-4-20250514
Max tokens: 500
```

Prompt:
```
You are a real estate intelligence engine for Opendoor in Toronto, Canada.
Address: "{address}"

Return ONLY valid JSON, no markdown, no code blocks, nothing else:
{
  "narrative": "3-4 sentence evocative paragraph about this home and its Toronto neighbourhood. Speak to area character, lifestyle, transit, walkability, buyer appeal. Be specific to Toronto geography. Rich but grounded language. Do not invent specific home details — speak to the neighbourhood and what a buyer would experience.",
  "tags": ["neighbourhood trait", "lifestyle tag", "market tag"],
  "greenTags": ["top selling point 1", "top selling point 2"]
}
```

Return the parsed JSON directly. On error return `{ error: string }` with status 500.

---

### `POST /api/comparison`

Request body: `{ address: string }`

```
Model: claude-sonnet-4-20250514
Max tokens: 600
```

Prompt:
```
You are a real estate intelligence engine for Opendoor in Toronto, Canada.
Address: "{address}"

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
- Use realistic Toronto 2026 figures. Format dollar amounts as ~$XXXK–$XXXK
```

---

### `POST /api/score`

Request body: `{ address: string }`

```
Model: claude-sonnet-4-20250514
Max tokens: 500
```

Prompt:
```
You are a real estate intelligence engine for Opendoor in Toronto, Canada.
Address: "{address}"

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
- Two green check factors (things working in the home's favour) and two warning factors (risks or deductions)
```

---

### `GET /api/streetview`

Query param: `address`

Fetches from Google Street View Static API server-side and pipes the image response back to the client.

```typescript
const url = `https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}&return_error_code=true`
```

Fetch the image, check `Content-Type` starts with `image/`. If it's not an image (error response), return 404. Otherwise pipe the image bytes back with the correct `Content-Type` header and `Cache-Control: public, max-age=86400`.

---

## TypeScript Types (`types/index.ts`)

```typescript
export interface StoryData {
  narrative: string
  tags: string[]
  greenTags: string[]
}

export interface ComparisonSide {
  timeline: string
  netProceeds: string
  certainty: string
  showings: string
  stress: string
}

export interface ComparisonData {
  opendoor: ComparisonSide
  traditional: ComparisonSide
  verdict: string
}

export interface ScoreFactor {
  icon: string
  title: string
  detail: string
}

export interface ScoreData {
  score: number
  label: string
  summary: string
  factors: ScoreFactor[]
  estimatedOffer: string
  offerRange: string
}
```

---

## Animation Specifications

All animations should be CSS transitions or keyframes. No animation library needed.

**Card entrance:** `opacity: 0; transform: translateY(18px)` → `opacity: 1; transform: translateY(0)` — duration 0.38s, ease

**Skeleton shimmer:**
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
background: linear-gradient(90deg, var(--ink-5) 25%, var(--warm) 50%, var(--ink-5) 75%);
background-size: 200% 100%;
animation: shimmer 1.3s infinite;
```

**Score ring:** `stroke-dashoffset` transition, 1.1s, `cubic-bezier(0.4, 0, 0.2, 1)`, triggered 80ms after component mounts via `useEffect` + `setTimeout`

**Progress bar fill:** `width: 0% → 100%`, 0.5s ease, triggered when `isDone` prop becomes true

**Street view fade-in:** `opacity: 0 → 1`, 0.5s ease, on image load

**Pulsing dot:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.75); }
}
animation: pulse 2s infinite;
```

**Spinner:**
```css
@keyframes spin { to { transform: rotate(360deg); } }
animation: spin 0.6s linear infinite;
```

**Dot loading animation (street view placeholder):**
```css
@keyframes dots {
  0%   { content: ''; }
  33%  { content: '.'; }
  66%  { content: '..'; }
  100% { content: '...'; }
}
```

---

## Behaviour Rules

1. **Results appear instantly.** The moment the user taps Analyse, the results section becomes visible, cards slide in (staggered 60/160/260ms), and all three cards show skeletons. The user never stares at a blank screen.

2. **Parallel AI calls.** All three API routes are called simultaneously via `Promise.all`. Each card independently updates when its call resolves — do not wait for all three before rendering any.

3. **Auto-scroll.** At 350ms after submit, smooth-scroll the results section into view.

4. **Street view loads independently.** It does not block or delay the AI cards.

5. **Error handling.** If any individual API call fails, that card should show an error state (simple red text: "Unable to load — try again"). If all three fail, show the top-level error bar.

6. **Re-submission.** If the user submits a new address, fully reset all state and re-run.

7. **Input:** Submits on Enter key press. Button disabled and shows spinner while loading.

8. **No zoom on input focus on iOS.** Font size must be at least 16px on the input (already set to 15px — bump to 16px to prevent iOS zoom).

---

## Skeleton Rows

Each card shows these skeleton rows while loading:
- Row 1: full width, 17px tall
- Row 2: full width, 12px tall
- Row 3: 74% width, 12px tall
- Row 4: full width, 12px tall
- Row 5: 48% width, 12px tall

All with 9px bottom margin and 6px border-radius.

---

## Footer

Below all cards:
```
Built by Shakeb · Opendoor Toronto Demo
```
Centered, 11px, ink-4 color. "Shakeb" in green.

---

## `next.config.ts`

No special image domains needed since Street View is proxied through our own API route.

```typescript
const nextConfig = {
  // No external image domains required
}
export default nextConfig
```

---

## `tailwind.config.ts`

Extend theme with the CSS variables so Tailwind classes can reference them:

```typescript
theme: {
  extend: {
    fontFamily: {
      serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
    },
    colors: {
      green: {
        DEFAULT: '#1a7a4a',
        light: '#25c076',
      },
      ink: {
        DEFAULT: '#0f1710',
        2: '#2a3d31',
        3: '#657a6d',
        4: '#a4b8ac',
        5: '#dce8e1',
      },
      bg: '#f7f4ef',
      warm: '#f0ebe0',
    }
  }
}
```

---

## `.env.local` (template)

```
ANTHROPIC_API_KEY=
GOOGLE_MAPS_API_KEY=
```

---

## Deploy Checklist

1. `npx create-next-app@latest opendoor-demo --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
2. Install: `npm install @anthropic-ai/sdk`
3. Add `.env.local` with both keys
4. `vercel deploy` or push to GitHub and connect to Vercel
5. Add environment variables in Vercel dashboard

---

## Reference Design

The visual design is already built and approved as a standalone HTML file. The Next.js build must match it pixel-for-pixel on mobile. Key things that must match exactly:

- Grain texture overlay on body
- Sticky topbar with notch-safe top padding (54px)
- Hero title line-height 0.97 (tighter than normal)
- Search button is a square inside the input field (not outside it)
- Chips are horizontally scrollable, never wrap
- Cards have 20px border-radius and card-shadow
- Street view is 200px tall, full bleed within the card
- Score ring SVG: r=35, viewBox 0 0 84 84, stroke-dasharray=219.9
- Net estimate box is dark (var(--ink)) background with white text
- Max width 430px, centered

---

*End of PRD*
