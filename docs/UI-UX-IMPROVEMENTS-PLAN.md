# ChoreChamp UI/UX Improvements Plan

## Design Intent

**Users:**
- **Caregivers** — parents in morning-rush or evening-check mode, often on phone. Need overdue/approvals visible instantly.
- **Children** — ages 6–14. High visual motivation. Want tokens to feel precious. Need clear "what do I do today."

**Feel:** Household warmth + kid achievement. Gold star stickers, chore chart on the fridge, piggy bank filling up. Warm, slightly tactile, not cold-SaaS, not infantile.

Every item below must serve one of these two users and reinforce this feel.

---

## Priority 1: Mobile Stat Bar Fix (High Priority, Low Effort)

**Issue:** `grid-cols-5 divide-x` is unreadable on mobile.

**Problem with naive fix:** `grid-cols-2 md:grid-cols-5` leaves 5 items as 2+2+1 — orphaned last item on its own row, worse than original. `divide-x` also breaks on wrap (no vertical dividers between rows).

**Proposed solution:**
```css
/* Horizontal scroll — all 5 stay inline, swipeable */
flex overflow-x-auto snap-x
/* Each metric: min-w-[90px] shrink-0 */
```

Alternative if scroll is undesirable:
```css
/* 3+2 is more balanced than 2+2+1 */
grid-cols-3 sm:grid-cols-5
/* Replace divide-x with per-cell border-r, border-b on small screens */
```

**Files to update:**
- `src/pages/caregiver/Dashboard.tsx` — Lines 29-38

---

## Priority 2: Child Dashboard Audit (High Impact, Medium Effort)

**Currently underspecified.** The child dashboard is the highest-stakes screen — it's what motivates kids to do chores. Needs dedicated treatment:

| Element | Goal | Approach |
|---------|------|----------|
| Today's chore list | Clear, actionable | Prominent, sorted by status (due → pending → done) |
| Token balance | Feel precious | Large display, gold shimmer on balance number |
| Streak counter | Motivating | Visible, celebratory on milestone days |
| Empty state | Inviting | Illustration + playful copy, not bare text |

**Files to update:**
- `src/pages/child/Dashboard.tsx`
- `src/components/shared/TokenBalanceWidget.tsx`

---

## Priority 3: Fix Broken Chart Colors (Bug, Low Effort)

**Issue:** Bar chart uses `fill="hsl(var(--primary))"` but the token system is `oklch`. The `hsl()` wrapper cannot parse an `oklch` value — falls back to black or renders incorrectly.

**Fix:** Use the CSS variable directly or use the oklch value inline.

```tsx
// Wrong
fill="hsl(var(--primary))"

// Correct — let Recharts use the CSS var
fill="var(--color-primary)"
// or reference the computed value via a style token
```

**Files to update:**
- `src/pages/caregiver/Dashboard.tsx` — Lines 67, 68, 82

---

## Priority 4: EmptyState Component (High Emotional Impact, Low Effort)

Highest-value item in component polish. Empty states are where product personality shows most.

**Current:** Text-only, feels abandoned.

**Target:** Illustration (SVG, domain-appropriate — e.g., a star, a checkbox, a coin) + playful copy tailored to context.

Examples:
- No chores assigned: "Nothing on the list yet. Add a chore to get started!"
- No notifications: "All quiet. Enjoy the calm."
- Child view, no chores today: "You're all done! Go enjoy your day."

**Files to update/create:**
- `src/components/shared/EmptyState.tsx` — add illustration + copy variants

---

## Priority 5: Spacing & Touch Targets (Medium Impact, Low Effort)

| Location | Issue | Fix |
|----------|-------|-----|
| ChoreCard compact | `p-3` (12px) — touch target borderline on mobile | `p-3` → `p-4` |
| Child Dashboard sections | Cards feel stacked | `space-y-4` → `space-y-6` |
| MetricCard | Icon and text alignment inconsistent | Commit to centered layout (large display number = centered icon + text) |

**Files to update:**
- `src/components/shared/ChoreCard.tsx`
- `src/components/shared/MetricCard.tsx`
- `src/pages/child/Dashboard.tsx`

---

## Priority 6: Token Shimmer Animation (High Delight, Low Effort)

Gold should feel earned and precious. Subtle animated shimmer on token balance fits the domain metaphor.

**Implementation:** CSS-only keyframe shimmer on `TokenBalanceWidget` gold gradient. No library needed — `tw-animate-css` already imported.

**Constraint:** Wrap in `@media (prefers-reduced-motion: no-preference)`. Required — family app with children users.

**Files to update:**
- `src/components/shared/TokenBalanceWidget.tsx`
- `src/index.css` — add shimmer keyframe

---

## Priority 7: Dark Mode Card Contrast (Medium Impact, Low Effort)

**Issue:** Card `oklch(0.22 0.018 248)` on background `oklch(0.175 0.018 248)` — delta of 0.045 lightness is too subtle in dark mode.

**Fix:** Raise card to `oklch(0.25 0.018 248)`. Brings delta to 0.075 — still quiet but legible.

**Token gold in dark mode:** Current value `oklch(0.76 0.17 82)` — check contrast against card background with a contrast tool before adjusting. Do not reference `#E6B800` — that hex does not exist in this token system.

**File:** `src/index.css` — `.dark` block, `--card` value

---

## Priority 8: Page Load Animations (Medium Impact, Medium Effort)

**Rules before implementing:**
- ALL animations must be wrapped in `@media (prefers-reduced-motion: no-preference)`. Non-negotiable.
- Use `tw-animate-css` already in the project — do not add another animation library.
- Count-up animation on small integers (5, 3, 2) is gratuitous — animation completes before perception registers. Skip count-up unless values exceed ~50.

| Component | Animation | Valid? |
|-----------|-----------|--------|
| Cards | Fade-in with stagger | Yes |
| Charts | `isAnimationActive` (built-in Recharts) | Yes |
| Buttons | Scale + shadow on hover | Already exists via `.card-hover` — verify before adding |
| TokenBalanceWidget | Shimmer (see Priority 6) | Yes |
| Dashboard metrics count-up | Skip — integers too small | No |

**Files to update:**
- `src/index.css` — CSS keyframes
- Individual page components — stagger delays via `animation-delay`

---

## Priority 9: Stat Bar Information Hierarchy (Medium Impact, Low Effort)

**Issue:** All 5 metrics visually equal. "Overdue" is the actionable alert — it deserves higher visual weight.

**Proposed:** Give overdue metric `text-destructive` background tint (already `text-destructive` for color, add subtle `bg-destructive/5`) when value > 0. Draws caregiver eye to the item requiring action.

**File:** `src/pages/caregiver/Dashboard.tsx` — metric render logic

---

## Priority 10: Inline Shadow → Token Consolidation (Low Impact, Low Effort)

Three places use inline `style={{ boxShadow: '0 1px 3px...' }}` despite `--shadow-card` already being defined as a CSS custom property and `.card-base` utility class existing.

**Fix:** Replace all inline shadow styles with `className="card-base"`.

**Files:**
- `src/pages/caregiver/Dashboard.tsx` — Lines 29, 55, 93

---

## Priority 11: Typography Upgrade (Low-Medium Impact, Low Effort)

**Proposed:** Fraunces (display) + Outfit (body/UI)

**Critical constraint:** Fraunces is an editorial serif — correct for hero/landing, wrong for dashboard UI at small sizes.

**Deployment rules:**
| Context | Font | Rationale |
|---------|------|-----------|
| Landing page H1, empty state headlines | Fraunces | Storybook warmth at large scale |
| All in-app headings (H2–H4), labels, stats | Outfit | Geometric, legible at 12–16px |
| Body text | Outfit | Consistent with in-app headings |

Do NOT apply Fraunces to `h1–h6` globally. Scope it to `.font-display-hero` or landing-specific classes only. The current `font-display` applied to all headings in `index.css` must be split.

**Files to update:**
- `src/index.css` — Font imports, variable scoping
- `src/pages/public/Landing.tsx` — Apply `font-display-hero` to H1 only

---

## Priority 12: StatusBadge Pulse (Low Impact, Low Effort)

**Constraint:** Pulse ONLY on `overdue` status. Never on `due` — if 8 chores are "due today," 8 pulsing elements creates visual chaos.

**File:** `src/components/shared/StatusBadge.tsx`

---

## Priority 13: Background Enhancement (Low Impact, Medium Effort)

**Noise texture:** Valid — adds warmth, avoids sterile flat-gradient feel. Specific values required:
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.025; /* Very subtle — visible on squint test only */
  pointer-events: none;
  z-index: -1;
}
```

**Dark mode tint:** Already present. `oklch(0.175 0.018 248)` — hue 248 is blue-indigo. No changes needed here.

**Landing decorative blobs:** Three already exist. Do not add more without removing one — diminishing returns past three.

---

## Deferred / Removed

| Item | Reason |
|------|--------|
| Count-up animation on metrics | Integer values too small — gratuitous |
| Dark mode "blue-purple tint" | Already in token system at hue 248 |
| Adding motion/animation library | `tw-animate-css` already imported |

---

## Progress Tracking

- [ ] Priority 1: Mobile Stat Bar Fix
- [ ] Priority 2: Child Dashboard Audit
- [ ] Priority 3: Fix Broken Chart Colors (bug)
- [ ] Priority 4: EmptyState Component
- [ ] Priority 5: Spacing & Touch Targets
- [ ] Priority 6: Token Shimmer Animation
- [ ] Priority 7: Dark Mode Card Contrast
- [ ] Priority 8: Page Load Animations
- [ ] Priority 9: Stat Bar Information Hierarchy
- [ ] Priority 10: Inline Shadow → Token Consolidation
- [ ] Priority 11: Typography Upgrade
- [ ] Priority 12: StatusBadge Pulse (overdue only)
- [ ] Priority 13: Background Enhancement

---

## Implementation Rules

- ALL animations: `@media (prefers-reduced-motion: no-preference)` wrapper. Non-negotiable.
- No new animation libraries — use `tw-animate-css` already in project.
- No hex color values — all tokens use `oklch()`. Check `index.css` before referencing any color.
- Touch targets minimum 44px height on mobile.
- Test all changes at 375px viewport minimum.
- Run `bun run lint` after CSS changes.
