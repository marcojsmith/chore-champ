# ChoreChamp — Build Checklist

## 🐛 Bug Fixes

- [x] Fix chart colors — already using `var(--color-primary)` / `var(--color-token-gold)`, not `hsl(var(...))`
- [x] Fix mobile stat bar — uses `flex overflow-x-auto snap-x` with horizontal scroll (intentional)
- [x] Fix dark mode card contrast — already `oklch(0.25)` in `.dark`
- [x] Replace inline `boxShadow` styles with CSS token utilities — `--shadow-token-gold` token added, TokenBalanceWidget updated

## 🎨 UI/UX Polish

- [x] Overdue stat card — destructive bg already applied (`bg-destructive/5`)
- [x] StatusBadge — `overdue-pulse` animation on overdue only (already implemented)
- [x] Token shimmer animation — CSS-only in `index.css`, wrapped in `prefers-reduced-motion`
- [x] Page load animations — `animate-fade-in-up` with stagger delays (done on dashboard pages)
- [x] Typography — Fraunces restricted to hero only; headings use Outfit (`var(--font-display)`)
- [x] Background — SVG noise texture via `body::before` in `index.css`
- [ ] EmptyState — audit all list pages use correct variant (`chores`, `rewards`, `done`, etc.)
- [x] Touch targets — nav items in CaregiverLayout + ChildLayout have `min-h-[44px]`

## 🗄️ Backend (Convex)

- [ ] Define schema (`convex/schema.ts`)
  - [ ] `households` table
  - [ ] `users` table (caregiver + child profiles)
  - [ ] `chores` table (templates)
  - [ ] `choreOccurrences` table (assigned instances with status)
  - [ ] `rewards` table
  - [ ] `rewardRedemptions` table
  - [ ] `tokenLedger` table (log of all token events)
  - [ ] `notifications` table
- [ ] Auth integration — wire Clerk JWT to Convex `auth.config.ts`
- [ ] Caregiver queries/mutations
  - [ ] Create/update/delete chore templates
  - [ ] Assign chores to children
  - [ ] Approve/reject chore completions
  - [ ] Create/update/delete rewards
  - [ ] Approve/reject reward redemptions
  - [ ] Read dashboard metrics
  - [ ] Read reports/analytics
- [ ] Child queries/mutations
  - [ ] List today's chores
  - [ ] Submit chore completion (with optional file upload)
  - [ ] List available rewards
  - [ ] Redeem reward (spend tokens)
  - [ ] Read token balance + history
- [ ] File storage — wire Convex storage for chore proof photos
- [ ] Scheduled functions — auto-generate chore occurrences on recurrence schedule

## 🔌 Frontend → Backend Wiring

- [ ] Replace all `src/mocks/data.ts` imports with Convex `useQuery`/`useMutation` hooks
- [ ] Caregiver Dashboard — live metrics + charts
- [ ] Caregiver Approvals — real pending items + approve/reject actions
- [ ] Caregiver ChoresList — live CRUD
- [ ] Caregiver RewardsList — live CRUD
- [ ] Caregiver ChildrenList — live roster
- [ ] Caregiver Reports — live analytics
- [ ] Child Dashboard — live token balance, streak, today's chores
- [ ] Child MyChores — live list + submit action
- [ ] Child Rewards — live list + redeem action
- [ ] Child History — live ledger
- [ ] Notifications — live for both roles
- [ ] Delete `src/mocks/data.ts` when all pages wired

## 🔐 Auth & Multi-Tenancy

- [ ] Household creation flow on first caregiver signup
- [ ] Child account creation by caregiver (invite or PIN-based)
- [ ] Route guards — caregivers can't access child routes and vice versa
- [ ] Household isolation — all queries scoped to household

## 🚀 Launch Prep

- [x] Update `README.md` — replaced Vite template boilerplate with project docs
- [ ] Environment variables documented (Convex URL, Clerk keys)
- [x] Error boundaries on key routes — `ErrorBoundary` wraps all 3 layout groups in `App.tsx`
- [x] Skeleton loading components — `src/components/shared/skeletons.tsx` (5 variants)
- [x] 404 page — `src/pages/NotFound.tsx` exists
- [ ] Mobile QA pass at 375px viewport
- [ ] Dark mode QA pass
