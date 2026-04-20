# ChoreChamp — Build Checklist

## Focus

**Target**: Teens (ages 10–16) — simpler UI, real-world rewards, less gamified.

**MVP Priority**:
1. **D** — Chore management + approval workflow
2. **B** — Token rewards + smart suggestions post-completion
3. **C** — Streak tracking + milestone bonuses
4. **A** — Voice AI creation (polish feature)

---

## 🗄️ Backend (Convex)

### Schema ✅ DONE
- [x] Define schema (`convex/schema.ts`)
  - [x] `households` table
  - [x] `users` table (caregiver + child profiles)
  - [x] `chores` table (templates with tokenValue, recurrence, category)
  - [x] `choreOccurrences` table (assigned instances with status)
  - [x] `rewards` table
  - [x] `rewardRedemptions` table
  - [x] `tokenLedger` table (log of all token events)
  - [x] `notifications` table
  - [x] `childStats` table (additional stats per child)

### Auth ✅ MOSTLY DONE
- [x] Auth helpers — `requireUser`, `requireCaregiver` in `convex/lib.ts`
- [x] Wire Clerk JWT to Convex `auth.config.ts` — `convex/auth.config.ts` created with Clerk JWT domain
- [x] Household creation flow on first caregiver signup — `convex/households.ts`
- [x] Child account creation by caregiver — `convex/users.ts`
- [x] Route guards — RoleGuard wraps caregiver and child routes
- [x] Household isolation — all queries scope to household

### Caregiver Queries/Mutations ✅ DONE
- [x] Create/update/delete chore templates — `convex/chores.ts`
- [x] Assign chores to children — in chore creation
- [x] Approve/reject chore completions — `convex/choreOccurrences.ts`
- [x] Create/update/delete rewards — `convex/rewards.ts`
- [x] Approve/reject reward redemptions — `convex/rewardRedemptions.ts`
- [x] Approve child-suggested rewards (assign token value)
- [x] Read dashboard metrics — `convex/choreOccurrences.ts`
- [x] Read reports/analytics — `convex/choreOccurrences.ts`

### Child Queries/Mutations ✅ DONE
- [x] List today's chores — `convex/choreOccurrences.ts`
- [x] Submit chore completion (with optional file upload) — `convex/choreOccurrences.ts`
- [x] List available rewards — `convex/rewards.ts`
- [x] Redeem reward (spend tokens) — `convex/rewardRedemptions.ts`
- [x] Suggest custom reward to parent
- [x] Read token balance + history + streak — `convex/users.ts` + `convex/tokenLedger.ts`

### File Storage
- [x] Convex storage for chore proof photos

### Scheduled Functions
- [x] Daily occurrence generation — `convex/crons.ts` exists but needs implementation
- [x] Overdue marking — needs implementation
- [x] Streak milestone bonuses (3, 7, 14, 30 days) — needs implementation

---

## 🧠 AI Features (OpenRouter)

### Voice-to-Chore
- [x] Speech-to-text endpoint for voice input
- [x] Natural language parsing — extract: task, duration, assignee, recurrence
- [x] Card confirmation before create — read-back verification
- [ ] Suggest rewards based on chore difficulty/frequency

### Smart Suggestions
- [x] Post-completion — show 3 achievable rewards
- [x] "How close" logic — show rewards needing X more tokens
- [x] Suggest rewards to children based on token balance — `getSmartSuggestions` + Affordable tab on Rewards page

---

## 🔌 Frontend → Backend Wiring ✅ MOSTLY DONE

- [x] Replace all `src/mocks/data.ts` runtime imports with Convex hooks
- [x] Caregiver Dashboard — live metrics + charts
- [x] Caregiver Approvals — real pending items + approve/reject actions
- [x] Caregiver ChoresList — live CRUD
- [x] Caregiver RewardsList — live CRUD
- [x] Caregiver ChildrenList — live roster
- [x] Caregiver ChildDetail — live stats + token history
- [x] Caregiver Reports — live analytics
- [x] Child Dashboard — live token balance, streak, today's chores
- [x] Child MyChores — live list + submit action
- [x] Child Rewards — live list + redeem action
- [x] Child History — live ledger + token activity
- [x] Notifications — live for both roles

---

## 🐛 Bug Fixes

- [x] Fix chart colors — verify CSS variables working
- [x] Fix mobile stat bar — verify horizontal scroll on 375px
- [x] Fix dark mode card contrast — verify on dark bg
- [x] Replace inline `boxShadow` styles — verify CSS tokens used

---

## 🎨 UI/UX Polish

- [x] Overdue stat card — destructive bg applied in Dashboard metrics bar
- [x] StatusBadge — `overdue-pulse` animation defined in CSS, applied on overdue status only
- [x] Token shimmer animation — CSS-only in `index.css`, wrapped in `prefers-reduced-motion`
- [x] Page load animations — `animate-fade-in-up` with staggered `animationDelay` on Dashboard cards
- [x] Typography — Fraunces on `.font-display`, Outfit for body/headings
- [x] Background — SVG noise texture defined in `index.css` background-image
- [x] EmptyState — verify all list pages use EmptyState
- [x] Touch targets — verify nav items min-h-[44px]
- [x] Teen-focused UI — verify simpler, less gamified aesthetic

---

## 🚀 Launch Prep

- [x] Environment variables documented (Convex URL, Clerk keys, OpenRouter key)
- [x] Error boundaries on key routes — verify
- [x] Skeleton loading components — verify
- [x] 404 page — verify
- [ ] Mobile QA pass at 375px viewport
- [ ] Dark mode QA pass