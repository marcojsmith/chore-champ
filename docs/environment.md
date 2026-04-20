# Environment Variables

## Frontend (Vite — prefix `VITE_` to expose to browser)

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `VITE_CONVEX_URL` | Convex deployment URL | Auto-set by `npx convex dev` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Clerk Dashboard → API Keys |

## Backend (Convex Actions — set via CLI)

These variables are read by Convex server-side actions via `process.env`.
Set them with: `npx convex env set KEY=value`

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `OPENROUTER_API_KEY` | OpenRouter API key for voice AI | openrouter.ai → Keys |
| `OPENROUTER_MODEL` | Model ID to use (e.g. `google/gemini-2.0-flash-exp:free`) | openrouter.ai → Models |

## Local development (.env.local)

```
CONVEX_DEPLOYMENT=dev:your-deployment-name
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

> Note: `CLERK_SECRET_KEY` and `OPENROUTER_API_KEY` in `.env.local` are for local reference only.
> Convex actions cannot read `.env.local` — use `npx convex env set` for backend vars.