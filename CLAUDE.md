@AGENTS.md

# chrisknapp.dev — Developer Context

Personal website and private dashboard system for Chris Knapp and Natalie Knapp. Two distinct areas: a public portfolio and two password-protected dashboard suites.

---

## Stack

- **Next.js 16.2.4** — App Router (not Pages Router). React 19.
- **Supabase** — all persistent data. Accessed via `@supabase/supabase-js`.
- **Recharts** — all charting (AreaChart, ComposedChart, Bar, Line, etc.)
- **Tailwind is installed but NOT used.** All styling is inline styles + CSS variables. Never add Tailwind classes.
- **Deploy:** push to `main` on GitHub → Vercel auto-deploys. No manual deploy step.

---

## File Structure

```
src/
  app/
    page.js                        — Public homepage (particle animation, typewriter, stat counters)
    layout.js                      — Root layout (Inter font, globals.css)
    resume/page.js                 — Resume page
    login/chris/page.js            — Chris login → /chris/finances
    login/natalie/page.js          — Natalie login → /natalie/goals
    chris/
      page.js                      — Redirects to /chris/finances
      layout.js                    — ChrisSidebar wrapper
      finances/page.js             — Net worth charts + retirement projection tool
      body-dashboard/page.js       — Health dashboard (2×2: body comp, activity, sleep, nutrition)
      care-log/page.js             — Daily care log (body, marriage, social) → ChrisGoalsLog
      care-dashboard/page.js       — PLACEHOLDER ("coming soon")
      learning/page.js             — PLACEHOLDER ("coming soon")
      food/page.js                 — Food log tool → FoodTracker
    natalie/
      page.js                      — Redirects to /natalie/goals
      layout.js                    — NatalieSidebar wrapper
      goals/page.js                — PLACEHOLDER ("coming soon")
      goal-tracker/page.js         — Daily goal checklist → GoalsLog
      food/chris/page.js           — Chris food log in Natalie's area → FoodTracker (beige)
      food/natalie/page.js         — Natalie food log → FoodTracker (beige)
    api/
      auth/chris/route.js          — POST: password check → sets chris_auth cookie
      auth/natalie/route.js        — POST: password check → sets natalie_auth cookie
      auth/logout/route.js         — POST: clears auth cookie
      food/log/route.js            — GET/POST/DELETE: food_log table
      goals/log/route.js           — GET/POST: goal_tracker_chris / goal_tracker_natalie
      care-log/route.js            — GET/POST: care_log_chris (+ daysSince tracking)
      care-log/seed/route.js       — POST: seeds missing care log items for today
      health/route.js              — GET: aggregates body_stats, workouts, sleep, activity, food_log
  components/
    ChrisDashboard.js              — Page wrapper (sticky header + content). Exports DashCard too.
    ChrisSidebar.js                — Fixed 232px sidebar for Chris area
    NatalieSidebar.js              — Fixed 232px sidebar for Natalie area
    ChrisGoalsLog.js               — Care log: body care, marriage care (1–10 scales), social, drinks, notes
    GoalsLog.js                    — Shared daily goal checklist for Chris + Natalie
    FoodTracker.js                 — Meal logger + daily log viewer with macro totals
    HealthDashboard.js             — 4-panel health dashboard (body comp, activity, sleep, nutrition table)
  lib/
    supabase.js                    — Supabase client using NEXT_PUBLIC env vars
scripts/
  backup-supabase.mjs              — Backup all tables → C:\KnappFiles\chrisknapp-dev-data-to-import\backups\
  restore-supabase.mjs             — Restore from a backup timestamp
  backup-db.js                     — Export tables to CSV → C:\KnappFiles\chrisknapp-dev-data-backup\
  sync-meals.js                    — Sync meal-ingredient-lookup.csv → Supabase
  migrate.js                       — One-time data migration tool
```

---

## Theme System

Two themes, controlled by CSS variables in `globals.css`:

**Dark theme (Chris area)**
```
--c-dark: #0F172A           background
--c-dark-sidebar: #0B1424   sidebar
--c-dark-card: #1E293B      cards
--c-dark-border: rgba(255,255,255,0.06)
--c-blue: #3B82F6           accent
--c-blue-dark: #2563EB
--c-blue-dim: rgba(59,130,246,0.1)
```

**Beige theme (Natalie area)**
```
--c-beige: #F8F3EB          background
--c-beige-sidebar: #EDE5D8  sidebar
--c-beige-border: rgba(0,0,0,0.07)
--c-sky: #38BDF8            accent
--c-sky-dim: rgba(56,189,248,0.12)
```

Components that support both themes accept a `theme="dark"` or `theme="beige"` prop and resolve their own color tokens accordingly (see `FoodTracker.js` and `GoalsLog.js`).

---

## Supabase Tables

| Table | Key columns | Notes |
|---|---|---|
| `food_log` | user_name, log_date, logged_at, meal, meal_version, ingredient, serving_metric, serving_size, actual_amount, user_percent, calories, fat, carbs, protein, is_cheat | Per-ingredient rows |
| `meal_ingredient_lookup` | meal, meal_version, ingredient, serving_metric, serving_size, expected_amount, user_percent, serving_* | Meal recipe library |
| `health_body_stats` | date, weight_lbs, body_fat_pct, lean_body_mass_lbs, bmi | From Apple Health / Starfit |
| `health_workouts` | date, type, duration_min | From Apple Health |
| `health_sleep_daily` | date, deep_min, rem_min, core_min, total_sleep_min | From Apple Health |
| `health_activity_daily` | date, steps | From Apple Health |
| `care_log_chris` | log_date, item_name, checked, value, note, logged_at | Chris's daily care log |
| `goal_tracker_chris` | log_date, goal_name, checked, value, logged_at | Chris's simple goal checklist |
| `goal_tracker_natalie` | log_date, goal_name, category, checked, value, logged_at | Natalie's grouped goal checklist |
| `net_worth_snapshots` | period_date, net_investments, net_cash, home_equity | Monthly net worth data |

---

## Auth

- Cookie-based. `chris_auth=true` and `natalie_auth=true` (httpOnly, 30-day expiry).
- Passwords stored in env: `CHRIS_PASSWORD`, `NATALIE_PASSWORD`.
- Login pages at `/login/chris` and `/login/natalie`.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL        — Supabase project URL (client-safe)
NEXT_PUBLIC_SUPABASE_ANON_KEY   — Supabase anon key (client-safe)
CHRIS_PASSWORD                  — Chris dashboard password
NATALIE_PASSWORD                — Natalie dashboard password
```

---

## Hardcoded Business Logic

These values are in component files — if they need to change, edit the source:

**Nutrition goals** (`FoodTracker.js` → `USER_GOALS`, `HealthDashboard.js` → `NUTRITION_TARGETS`):
- Chris: 2100 cal max, 160g protein min, 210g carbs max, 70g fat max
- Natalie: 1500 cal min, 100g protein min (no carbs/fat goals)

**Chris goals** (`GoalsLog.js` → `GOALS.chris`): Stretch, Posture

**Natalie goals** (`GoalsLog.js` → `GOALS.natalie`): 7 categories — Mental Wellness, Body Sculpting, Active Movement, Skill Mastery, Education, Beauty, Marriage

**Chris care log items** (`ChrisGoalsLog.js`): Face AM/PM, Brush Teeth (counter ×3), Floss, Posture, Stretch, Facial Treatment (weekly); Marriage scales (1–10) + checks; Social (Dad, Mom, Friend); Drinks (0–7+)

---

## Coding Conventions

- **No TypeScript** — plain JavaScript throughout
- **No Tailwind** — inline styles only, reference CSS vars for theme colors
- **`'use client'`** on every interactive component
- Sidebar is 232px wide, fixed. Content areas use `marginLeft: 232`.
- Sticky page headers use `position: sticky, top: 0, zIndex: 10`.
- API routes use `NextResponse.json()`. All Supabase calls are server-side in API routes, except `FoodTracker` which reads `meal_ingredient_lookup` client-side via the public anon key.
- Date format throughout: `YYYY-MM-DD` string.

---

## Pages In Progress (Placeholders)

These routes exist and render "coming soon" text — not yet built:
- `/chris/care-dashboard` — meant to be charts/trends from the care log
- `/chris/learning` — leadership and learning progress tracker
- `/natalie/goals` — Natalie's goals dashboard with charts
- `/chris/gym` — nav item exists in ChrisSidebar, no page yet

---

## Data Import Pipeline

Raw data lives at `C:\KnappFiles\chrisknapp-dev-data-to-import\`:
- Apple Health: drop `export.xml` → run `python scripts/import_apple_health.py`
- Meals: edit `data-drop/meal_ingredient_lookup/meal-ingredient-lookup.csv` → run `node scripts/sync-meals.js`

**Always backup Supabase before any write:**
```
node C:\KnappFiles\chrisknapp-dev\scripts\backup-supabase.mjs
```
