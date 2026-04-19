# ChoreChamp — Project Brief

## What It Is

Family chore management app with AI-powered voice creation. Caregivers assign chores to children (hands-free via voice); children complete them and earn tokens; tokens redeem for rewards. Includes smart reward suggestions that show what's achievable now vs. what's close.

## Users

| Role | Needs |
|------|-------|
| **Caregiver** (parent) | Assign chores via voice, approve completions, manage rewards, track child performance |
| **Child** (ages 10–16) | See today's tasks, submit completions, spend tokens on rewards, track streaks |

## Target Audience

**Primary**: Teens (12+) — simpler UI, real-world rewards (money, screen time, experiences), less cartoonish gamification.

## Problem Statement

- Parents stop nagging — voice input creates chores without typing
- Kids get motivated — token system with streak rewards + smart suggestions
- Families track everything in one place — chores → tokens → rewards

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, shadcn/ui, OKLCH color tokens |
| Routing | React Router v7 |
| Backend | Convex (real-time BaaS) |
| Auth | Clerk |
| AI | OpenRouter (voice parsing + reward suggestions) |
| Speech-to-Text | OpenRouter (affordable options) |
| Deployment | Vercel from GitHub |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Fonts | Outfit (UI), Fraunces (display) |

## Core Features

### Voice Creation (AI)
- Parent gives hands-free command: "Create a chore to pack out the dishwasher in 1 hour for John"
- App parses: task, duration, assignee, recurrence ("every weekday afternoon")
- Suggests rewards based on chore difficulty/frequency
- Card confirmation before create — reads it back for verification
- Kids excluded from voice flow — parent-only

### Token System
- Children earn tokens for completing tasks
- Bonus tokens for streaks (3, 7, 14, 30 day milestones)
- Token balances persist and accumulate

### Smart Reward Suggestions
- After chore completion, shows 3 achievable rewards
- Shows "how close" rewards if tokens are insufficient (e.g., "25 more tokens needed")
- Kids can suggest custom rewards — parent assigns token value
- Parents create reward pool; children choose from it

### Caregiver
- Dashboard: metrics (due today, overdue, pending approvals), charts (weekly completion, monthly tokens)
- Chore CRUD (templates with recurrence, token value, category)
- Reward CRUD
- Approval workflow (approve/reject child submissions with optional photo proof)
- Child roster + individual profiles
- Reports & analytics
- Notifications
- Voice input for hands-free chore creation

### Child
- Dashboard: token balance, streak, today's chores, available rewards
- Chore list with status filtering
- Chore submission (mark done, optional photo upload)
- Reward shop (browse + redeem)
- Completion history
- Notifications

## Design System

- **Colors:** OKLCH — primary teal `oklch(0.56 0.13 175)`, accent orange `oklch(0.73 0.17 66)`, token gold `oklch(0.80 0.18 82)`
- **Dark bg:** `oklch(0.175 0.018 248)` (blue-indigo tint)
- **Animations:** `tw-animate-css` only — no new libraries. All wrapped in `prefers-reduced-motion`.
- **Touch targets:** 44px minimum height
- **Teen-focused UI:** Simpler, less gamified, utilitarian aesthetic for 12+

## Pricing

- **Free tier**: Core features (basic chores, rewards, streaks)
- **Premium** (future): Voice AI, unlimited history, co-parent access, photo verification

## MVP Priority

1. **D** — Chore management + approval workflow
2. **B** ��� Token rewards + smart suggestions post-completion
3. **C** — Streak tracking + milestone bonuses
4. **A** — Voice AI creation (polish feature)

## Key Files

```
src/
  App.tsx              — route config
  pages/caregiver/     — 13 caregiver pages
  pages/child/         — 8 child pages
  components/          — shared UI (ChoreCard, RewardCard, TokenBalanceWidget, etc.)
  mocks/data.ts        — all mock data (replace with Convex)
  lib/                 — utilities (voice parsing, reward logic)
convex/                — backend (to be built)
```

## Legal

- **COPPA compliant**: No data collection from children under 13 without parental consent
- Parental consent via Clerk
- Data minimization (only what's necessary)

## Current State

**Frontend: mostly complete.** All pages built with mock data. Dark mode, animations, responsive layouts done.

**Backend: not started.** Convex directory exists but empty — no schema, queries, or mutations. Everything runs off `src/mocks/data.ts`.

## Known Bugs

1. Chart colors broken — `fill="hsl(var(--primary))"` can't parse OKLCH values
2. Mobile stat bar layout — 5 items in `grid-cols-2` wraps badly on 375px
3. Dark mode card contrast low — cards `oklch(0.22)` on bg `oklch(0.175)` too close
4. Inline `boxShadow` styles not using CSS variable tokens