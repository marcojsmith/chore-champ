# ChoreChamp — Build Checklist

## Focus

**Target**: Teens (ages 10–16) — simpler UI, real-world rewards, less gamified.

**MVP Priority**:
1. **D** — Chore management + approval workflow
2. **B** — Token rewards + smart suggestions post-completion
3. **C** — Streak tracking + milestone bonuses
4. **A** — Voice AI creation (polish feature)

---

## 🐛 Bug Fixes

- [ ] Fix chart colors — already using `var(--color-primary)` / `var(--color-token-gold)`, not `hsl(var(...))`
- [ ] Fix mobile stat bar — uses `flex overflow-x-auto snap-x` with horizontal scroll (intentional)
- [ ] Fix dark mode card contrast — already `oklch(0.25)` in `.dark`
- [ ] Replace inline `boxShadow` styles with CSS token utilities — `--shadow-token-gold` token added, TokenBalanceWidget updated

---

## 🎨 UI/UX Polish

- [ ] Overdue stat card — destructive bg already applied (`bg-destructive/5`)
- [ ] StatusBadge — `overdue-pulse` animation on overdue only
- [ ] Token shimmer animation — CSS-only in `index.css`, wrapped in `prefers-reduced-motion`
- [ ] Page load animations — `animate-fade-in-up` with stagger delays
- [ ] Typography — Fraunces restricted to hero only; headings use Outfit
- [ ] Background — SVG noise texture via `body::before` in `index.css`
- [ ] EmptyState — all list pages use EmptyState with appropriate icons/variants
- [ ] Touch targets — nav items have `min-h-[44px]`
- [ ] Teen-focused UI — simpler, less gamified aesthetic

---

## 🗄️ Backend (Convex)

### Schema
- [ ] Define schema (`convex/schema.ts`)
  - [ ] `households` table
  - [ ] `users` table (caregiver + child profiles)
  - [ ] `chores` table (templates with tokenValue, recurrence, category)
  - [ ] `choreOccurrences` table (assigned instances with status)
  - [ ] `rewards` table
  - [ ] `rewardRedemptions` table
  - [ ] `tokenLedger` table (log of all token events)
  - [ ] `notifications` table

### Auth
- [ ] Wire Clerk JWT to Convex `auth.config.ts`
- [ ] Household creation flow on first caregiver signup
- [ ] Child account creation by caregiver
- [ ] Route guards — RoleGuard wraps caregiver and child routes
- [ ] Household isolation — all queries scoped to household

### Caregiver Queries/Mutations
- [ ] Create/update/delete chore templates
- [ ] Assign chores to children
- [ ] Approve/reject chore completions
- [ ] Create/update/delete rewards
- [ ] Approve/reject reward redemptions
- [ ] Approve child-suggested rewards (assign token value)
- [ ] Read dashboard metrics
- [ ] Read reports/analytics

### Child Queries/Mutations
- [ ] List today's chores
- [ ] Submit chore completion (with optional file upload)
- [ ] List available rewards
- [ ] Redeem reward (spend tokens)
- [ ] Suggest custom reward to parent
- [ ] Read token balance + history + streak

### File Storage
- [ ] Convex storage for chore proof photos

### Scheduled Functions
- [ ] Daily occurrence generation
- [ ] Overdue marking
- [ ] Streak milestone bonuses (3, 7, 14, 30 days)

---

## 🧠 AI Features (OpenRouter)

### Voice-to-Chore
- [ ] Speech-to-text endpoint for voice input
- [ ] Natural language parsing — extract: task, duration, assignee, recurrence
- [ ] Suggest rewards based on chore difficulty/frequency
- [ ] Card confirmation before create — read-back verification

### Smart Suggestions
- [ ] Post-completion — show 3 achievable rewards
- [ ] "How close" logic — show rewards needing X more tokens
- [ ] Suggest rewards to children based on token balance

---

## 🔌 Frontend → Backend Wiring

- [ ] Replace all `src/mocks/data.ts` runtime imports with Convex hooks
- [ ] Caregiver Dashboard — live metrics + charts
- [ ] Caregiver Approvals — real pending items + approve/reject actions
- [ ] Caregiver ChoresList — live CRUD
- [ ] Caregiver RewardsList — live CRUD
- [ ] Caregiver ChildrenList — live roster
- [ ] Caregiver ChildDetail — live stats + token history
- [ ] Caregiver Reports — live analytics
- [ ] Child Dashboard — live token balance, streak, today's chores
- [ ] Child MyChores — live list + submit action
- [ ] Child Rewards — live list + redeem action
- [ ] Child History — live ledger + token activity
- [ ] Notifications — live for both roles

---

## 🚀 Launch Prep

- [ ] Environment variables documented (Convex URL, Clerk keys, OpenRouter key)
- [ ] Error boundaries on key routes
- [ ] Skeleton loading components
- [ ] 404 page
- [ ] Mobile QA pass at 375px viewport
- [ ] Dark mode QA pass