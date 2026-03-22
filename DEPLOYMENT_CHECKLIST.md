# InkScout Deployment Checklist

## 1) Supabase (Auth)
- [ ] Create Supabase project.
- [ ] Enable Email/Password auth.
- [ ] Enable Google provider in Auth -> Providers.
- [ ] Set site URL and redirect URL(s):
  - `https://inkscout.app`
  - `https://inkscout.app/app`
  - `http://localhost:5173/app` (dev)
- [ ] Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` for frontend env.

## 2) Stripe (Billing)
- [ ] Create products/prices for:
  - [ ] Basic Monthly / Annual
  - [ ] Standard Monthly / Annual
  - [ ] Pro Monthly / Annual
- [ ] Copy all 6 price IDs.
- [ ] Configure Stripe webhook endpoint:
  - URL: `https://<your-railway-backend>/billing/webhook`
  - Events:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
- [ ] Copy webhook signing secret (`whsec_...`).

## 3) Railway (Backend)
- [ ] Deploy backend service.
- [ ] Add environment variables from:
  - [`.env.example`](C:/Users/Allison/Github/InkScout/backend-ref/commsbuddy/.env.example)
- [ ] If using TweetAPI instead of direct Twitter API, set:
  - `TWEETAPI_API_KEY`
  - Optional `TWEETAPI_BASE_URL` (default is `https://api.tweetapi.com/tw-v2`)
- [ ] Verify backend health endpoint:
  - `GET /health` returns status ok.
- [ ] Verify billing readiness:
  - `GET /billing/entitlements` returns `billing_ready: true` for authenticated user.

## 4) Vercel (Frontend)
- [ ] Deploy frontend service.
- [ ] Add environment variables from:
  - [frontend/.env.example](C:/Users/Allison/Github/InkScout/frontend/.env.example)
- [ ] Ensure `VITE_API_URL` points to Railway backend.
- [ ] Ensure `VITE_ENABLE_BILLING=true`.
- [ ] Set `VITE_MOOTSKEEPER_URL` (default `https://mootskeeper.com`).
- [ ] Verify routing rewrite works (`vercel.json` present):
  - `/` loads marketing site.
  - `/app` loads React app route.

## 5) Domain and DNS
- [ ] Point `inkscout.app` to Vercel project.
- [ ] Enable HTTPS certificate in Vercel.
- [ ] Add redirect `www.inkscout.app` -> `inkscout.app` (or preferred canonical).
- [ ] Update Supabase allowed redirect URLs if domain changed.

## 6) Post-Deploy Smoke Tests
- [ ] Signup via email/password.
- [ ] Login via Google OAuth.
- [ ] Unauthenticated `/app` redirects to `/login`.
- [ ] Free account can use manual search and Bluesky.
- [ ] Free account cannot use Twitter search.
- [ ] Upgrade from pricing page starts Stripe checkout.
- [ ] After successful checkout, entitlements update and paid features unlock.
- [ ] MootsKeeper button appears only on Standard/Pro.
- [ ] Annual pricing displays discounted values.

## 7) Security Checks
- [ ] Do not expose `PLAN_SECRET` or Stripe secret keys to frontend.
- [ ] Ensure webhook endpoint validates Stripe signatures.
- [ ] Keep `/settings/plan` server-side only.
- [ ] Rotate secrets before production launch if shared during development.
