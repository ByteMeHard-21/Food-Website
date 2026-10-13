# Run OriginBite locally

The cloned repository is named OriginEats; the adapted website is branded OriginBite. See [OriginEats.md](./OriginEats.md) for the complete product specification, all page/tab behaviour, internal formulas, and agent handoff.

## Start

Use a supported Node runtime for Vite 7, such as Node 20.19+ or 22.12+.

```powershell
cd "D:\Het Mehta\React Project\Food\OriginEats"
npm install
npm run dev
```

Open the Local URL Vite prints. The normal default is port 5173; another occupied port can cause Vite to choose the next port. For an explicit verification port:

```powershell
npm run dev -- --host 127.0.0.1 --port 5174
```

The dependencies are installed in this checkout. `.env` is a **file**, not a folder, and has already been created beside `package.json`. On a fresh clone, copy `.env.example` to `.env`; do not overwrite your existing credentials. Restart Vite after changing environment values. `.env.local` and mode-specific files may override root values.

## What works with blank credentials

- Homepage, local name-only profile, dashboard, and navigation.
- Mumbai locality/cuisine options and weighted analysis from bundled CSV files.
- Saved reports, maps, filters, charts, PDF/CSV analysis exports.
- Business Studio local planning templates and local supplementary fallbacks through the Vite API middleware.
- Receipt text entry/sample receipt and non-redeemable demo coupons.
- Dummy UPI/card checkout, including failure simulation and local Pro demo status.

Map tiles, fonts, and some food imagery load externally. No credentials does not mean every visual asset works offline. Scores and revenue scenarios are planning assumptions; some charts and inherited marketing content still use samples. Local reports are not cloud-backed or account-isolated.

## Environment variables

| Name | Value | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Your project's `https://...supabase.co` URL | Optional hosted auth and analysis |
| `VITE_SUPABASE_ANON_KEY` | Matching public legacy anon JWT | Existing Supabase client/function setup |
| `VITE_RAZORPAY_KEY_ID` | Your `rk_test_...` key ID | Optional hosted test checkout |
| `RAZORPAY_KEY_SECRET` | Secret paired with that **test** key ID | Server creates orders and verifies signatures |
| `GROQ_API_KEY` | Your Groq key | Optional AI plan/scenario generation |
| `GROQ_MODEL` | Optional model ID override | Defaults to the model named in `api/ai.js` |
| `COHERE_API_KEY` | Your Cohere key | Optional receipt-image extraction |
| `COHERE_MODEL` | Optional vision model ID override | Defaults to the model named in `api/ai.js` |

Leave optional services blank until configured. The owner will supply Razorpay test credentials. The key ID alone is not enough for hosted checkout: the matching server secret is also needed. Dummy checkout remains available without either value.

**Never prefix private provider or Razorpay secrets with `VITE_`.** Vite-prefixed values used by frontend code are browser-visible. `VITE_GROQ_API_KEY` and `VITE_COHERE_API_KEY` are obsolete names and are not read by the active AI integration. Supabase anon and Razorpay key ID are public identifiers; Supabase service-role and provider secrets must stay server-side.

Actual `.env` files are ignored by Git. `.env.example` contains empty examples only.

## Payment behaviour

All payment flows remain test-only, including production builds. Both browser and server reject live Razorpay key IDs. Monthly/yearly Pro checkout uses fixed test prices plus an illustrative tax calculation. Dummy UPI/card asks for no payment details and moves no money.

Hosted flow: browser → `/api/test-payment` order creation → Razorpay test checkout → server HMAC signature verification → local Pro demo state. This is not a recurring billing system or an authoritative paid entitlement store. Hosted checkout has not been verified with the owner's credentials.

## AI behaviour

The browser calls the same-origin `/api/ai`; Groq/Cohere keys are read only by the server. Business Studio falls back to local templates only when the API reports that Groq is unconfigured. A configured provider error is shown to the user. Cohere extraction requires a configured provider; manual/sample receipt text is the fallback.

The Vite plugin in `server/dev-api.js` mounts both API handlers during development and preview. Serve the app using the commands above, not a plain static file server, if you need these APIs. Model IDs and access must be checked with your provider account; a source-code default does not guarantee provider availability.

## Optional Supabase setup

Leave both Supabase frontend values blank to use local CSV analysis. When a client can initialise from configured values, selectors and submission use Supabase; remote failures do not silently fall back to local data.

Environment values alone cannot restore the original database. This clone contains an Edge Function and data files, but no complete migrations/seed SQL. For your own Supabase project:

1. Configure email/password authentication and local redirect URLs for your actual browser origin. Confirm signup emails when required.
2. Create and populate `public.localities` with `locality`, `avg_rating`, `total_reviews`, `total_demand_score`, `opportunity_score`.
3. Create and populate `public.cuisine_locality_stats` with `locality`, `category`, `restaurant_count`, `avg_rating`, `total_reviews`.
4. Keep one row per locality and one row per locality/category; the function uses `maybeSingle()`.
5. Apply suitable SELECT grants and read policies for frontend selectors. Do not expose a service-role key to fix permission errors.
6. Deploy `supabase/functions/analyze/index.ts` to your project with the Supabase CLI and keep function authentication configured appropriately.

The existing function configuration uses JWT verification; the documented legacy anon JWT matches this setup. Do not assume a different publishable-key format can replace it without checking the function authentication path.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are read inside the Edge Function runtime. Hosted Supabase provides these runtime variables; they are not frontend settings. `supabase/functions/.env` and its example document the separation. Root `.env` does not provision the function or its database.

The PRD documents remaining remote/local scoring discrepancies, including timeline enum handling and missing remote coordinates.

## Why the original clone showed a white screen

`index.html` loads `src/main.jsx`, which imports the app/routes. The original Supabase module called `createClient()` with undefined URL/key values during import. That threw before React rendered, so a React render-error boundary could not catch it.

The client now initialises conditionally; absent/invalid initial configuration produces a nullable client and allows local flows. Shared base styles and Leaflet styles are imported by the actual entry point. `src/index.jsx` is not that entry point. The active default Vite configuration is `vite.config.js`; the additional `vite.config.mjs` has different legacy settings and is not used by normal `npm run dev`.

## Verification

```powershell
npm test
npm run build
npm run preview
```

Check homepage → local profile → new analysis → results → dashboard history → exports. Test Business Studio tabs and exports, sample coupons, and dummy checkout success/failure. Local storage belongs to the exact browser origin; switching hostnames or ports starts a different local workspace.

Previous verification passed the production build and five Node core tests, and exercised local analysis/report persistence, analysis PDF download, and dummy payment failure/success in the browser. See the PRD acceptance checklist for remaining coverage. External auth, AI, receipt extraction, and hosted test checkout require the owner's configuration and have not been fully verified. A build passing does not prove those services work.

For hosting, the repository includes Vercel-style API handlers and SPA rewrites. No deployment is performed by these setup instructions. Before publicly exposing endpoints with paid-provider credentials, add authentication/authorisation, rate limits, usage controls, and stronger payload validation as documented in the PRD.
