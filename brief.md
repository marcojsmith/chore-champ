# ChoreChamp — Project Brief

## What It Is

Family chore management app. Caregivers assign chores to children; children complete them and earn tokens; tokens redeem for rewards. Gamifies household responsibilities.

## Users

| Role | Needs |
|------|-------|
| **Caregiver** (parent) | Assign chores, approve completions, manage rewards, track child performance |
| **Child** (ages 6–14) | See today's tasks, submit completions, spend tokens on rewards, track streaks |

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, shadcn/ui, OKLCH color tokens |
| Routing | React Router v7 |
| Backend | Convex (real-time BaaS) |
| Auth | Clerk |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Fonts | Outfit (UI), Fraunces (display) |

## Current State

**Frontend: mostly complete.** All pages built with mock data. Dark mode, animations, responsive layouts done.

**Backend: not started.** Convex directory exists but empty — no schema, queries, or mutations. Everything runs off `src/mocks/data.ts`.

## Core Features

### Caregiver
- Dashboard: metrics (due today, overdue, pending approvals), charts (weekly completion, monthly tokens)
- Chore CRUD (templates with recurrence, token value, category)
- Reward CRUD
- Approval workflow (approve/reject child submissions with optional photo proof)
- Child roster + individual profiles
- Reports & analytics
- Notifications

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

## Key Files

```
src/
  App.tsx              — route config
  pages/caregiver/     — 13 caregiver pages
  pages/child/         — 8 child pages
  components/          — shared UI (ChoreCard, RewardCard, TokenBalanceWidget, etc.)
  mocks/data.ts        — all mock data (replace with Convex)
convex/                — backend (empty, to be built)
```

## Known Bugs

1. Chart colors broken — `fill="hsl(var(--primary))"` can't parse OKLCH values
2. Mobile stat bar layout — 5 items in `grid-cols-2` wraps badly on 375px
3. Dark mode card contrast low — cards `oklch(0.22)` on bg `oklch(0.175)` too close
4. Inline `boxShadow` styles not using CSS variable tokens
