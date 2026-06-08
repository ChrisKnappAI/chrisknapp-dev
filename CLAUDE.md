@AGENTS.md

# chrisknapp.dev — Developer Context

Personal website for Chris Knapp with two distinct purposes:

1. **Public portfolio** — showcase Chris's data/analytics/AI work to employers and recruiters. Currently a landing page with a particle animation hero, stat counters, and resume link. Full portfolio case studies are actively being built (as of May 2026).

2. **Private dashboards** — password-protected self-improvement tools for Chris and Natalie. Health, finances, food tracking, goal logging, care log, and more — all pulling live data from Supabase.

**Deploy pipeline:** Push to `main` on GitHub → Vercel auto-builds and deploys → app pulls data from Supabase at runtime.

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
    resume/page.js                 — Resume page (particle bg, hero, Progressive timeline, skills, education)
    login/chris/page.js            — Chris login → /chris/finances
    login/natalie/page.js          — Natalie login → /natalie/goals
    spanish/
      layout.js                    — Standalone PWA layout (NO sidebar). Auth guard: chris_auth cookie.
                                     Sets viewport-fit=cover, 100dvh, overflow hidden for mobile full-screen.
      page.js                      — Renders <SpanishLearning />
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
      spanish/
        cards/route.js             — GET: card queue. Params: mode (review/learn/today/week), pos (filter by POS)
        review/route.js            — POST: submit rating { id, rating }. 1=Miss, 4=Correct, 99=I know this
        stats/route.js             — GET: counts for all modes + flagged. Param: pos
        tts/route.js               — POST: Google Cloud TTS proxy { text, lang }
        focus-drop/route.js        — POST: drop card from focus list { id }
        flag/route.js              — POST: toggle is_flagged on a card { id }
  components/
    SpanishLearning.js             — Full Spanish vocab app (3,672 words, SM-2, TTS, swipe, 4 modes)
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
  backup-db.js                     — Export all Supabase tables to timestamped CSV folder. RUN BEFORE EVERY WRITE.
  load-from-source.js              — Full Spanish vocab reload: reads source JSON, runs conjugation engine,
                                     wipes and reloads all 3,672 rows in spanish_vocab
  add-noun-articles.js             — One-time: prepended el/la to all nouns (already run, do not re-run)
  sync-meals.js                    — Sync meal-ingredient-lookup.csv → Supabase
  migrate.js                       — One-time data migration tool
public/
  spanish-manifest.json            — PWA manifest for "Knapp en Español"
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
| `spanish_vocab` | id (uuid), spanish, english, part_of_speech, cefr_level, base_difficulty, conjugations (jsonb), ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at, last_incorrect_at, times_correct, times_incorrect, is_introduced, is_learned, weekly_miss_dismissed_at, is_flagged, flagged_at, flag_note | 3,672 rows. Full schema in Personal EA/projects/spanish-learning/notes.md |
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
SUPABASE_SERVICE_KEY            — Service role key (server-only, used in API routes)
CHRIS_PASSWORD                  — Chris dashboard password
NATALIE_PASSWORD                — Natalie dashboard password
GOOGLE_TTS_API_KEY              — Google Cloud Text-to-Speech (used by Spanish app)
ANTHROPIC_API_KEY               — Claude API (used by Santiago / Penny chatbot)
```

---

## Spanish Vocab App (Knapp en Español)

Full documentation: `C:\KnappFiles\Personal EA\projects\spanish-learning\notes.md`

**Quick summary:**
- Live at chrisknapp.dev/spanish — standalone PWA, no site chrome
- 3,672 words (A2/B1/B2), SM-2 spaced repetition
- Card flow: English shown → tap reveals Spanish → swipe left=Miss / right=Correct
- 4 modes: Review (due cards), Learn (new words), Today Focus, 7-Day Focus
- Focus modes are rapid-fire study of missed words; swipe advances, Drop button removes from list
- POS filter dropdown (All / Nouns / Verbs / Adjectives / Adverbs / Phrases)
- Flag button (🚩) on every card — flags `is_flagged=true` in DB for later review
- Verb cards show irregularity badge + expandable full conjugation table (no vosotros)
- Google Cloud TTS auto-plays English on load, Spanish on reveal

**To review flagged words:** query `SELECT * FROM spanish_vocab WHERE is_flagged = true`

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
node C:\KnappFiles\chrisknapp-dev\scripts\backup-db.js
```
Backups land in `C:\KnappFiles\chrisknapp-dev-data-backup\<YYYY-MM-DD_HH-MM-SS>\` — one CSV per table.
