# Gym Training Planner

A bilingual (Arabic/English) gym dashboard: users create an account, build their **own training schedule day‑by‑day** through an onboarding wizard (nothing pre-filled or invented), then track workouts, weight, body measurements, and progress. Backed by **PostgreSQL**, deployable on **Render**.

## Stack

- **Backend:** Node.js + Express, session auth (`express-session` + `connect-pg-simple`, `bcryptjs` for password hashing)
- **Database:** PostgreSQL (schema in `server/schema.sql`, auto-applied on boot by `server/migrate.js`)
- **Frontend:** Plain HTML/CSS/vanilla JS served as static files by Express, talking to the backend via `fetch`

## How the day-by-day schedule works

There is **no hardcoded exercise data** anywhere in the code. After signing up and filling a short profile (age, height, weight, goal, days/week), the user is walked through a wizard:

1. Name Day 1 (Arabic + English)
2. Add each exercise for that day one at a time (name, equipment, sets, reps, rest) — saved to Postgres immediately
3. Move to Day 2, repeat, until all days are entered
4. Finish → dashboard renders exactly what was entered

Users can revisit **Edit schedule** any time to rebuild/add to their program. Video links per exercise are added later from the workout screen (technique-video modal) since they aren't collected during onboarding.

## Project structure

```
gym-planner/
├── package.json
├── render.yaml            # Render Blueprint: web service + Postgres, one click deploy
├── .env.example
├── server/
│   ├── index.js           # Express app entrypoint
│   ├── db.js              # pg Pool (uses DATABASE_URL)
│   ├── migrate.js         # applies schema.sql on boot (idempotent)
│   ├── schema.sql         # full Postgres schema
│   ├── authMiddleware.js
│   └── routes/
│       ├── auth.js        # register / login / logout / me
│       ├── schedule.js    # profile + day-by-day wizard + exercise CRUD/toggle
│       └── tracking.js    # weight / measurements / calendar
└── public/                # static frontend
    ├── index.html
    ├── css/styles.css
    └── js/app.js
```

## Local development

Requires Node 18+ and a local Postgres (or any reachable Postgres instance).

```bash
npm install
cp .env.example .env         # then edit DATABASE_URL / SESSION_SECRET
npm run migrate              # creates all tables
npm start                    # http://localhost:3000
```

## Deploying to Render

### Option A — Blueprint (recommended, one click)

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, point it at your repo. Render reads `render.yaml` and provisions:
   - A **PostgreSQL** database (`gym-planner-db`)
   - A **Web Service** (`gym-training-planner`) wired to that database via `DATABASE_URL`, with a random `SESSION_SECRET` generated automatically
3. Click **Apply**. On first boot the app runs its own migration (`server/migrate.js`) against the new database, so there's no manual SQL step.

### Option B — Manual setup

1. **New → PostgreSQL** on Render, note the **Internal Database URL**.
2. **New → Web Service**, connect your repo:
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables: `DATABASE_URL` (from step 1), `SESSION_SECRET` (any long random string), `NODE_ENV=production`
3. Deploy. The app creates its tables automatically on startup.

## Data model

`users → profiles`, `users → training_days → exercises`, plus `exercise_status`, `weight_entries`, `measurements`, and `calendar_entries`, all scoped by `user_id` with `ON DELETE CASCADE`. See `server/schema.sql` for exact columns.

## Notes

- Sessions are stored in Postgres too (`connect-pg-simple` auto-creates a `session` table), so logins survive server restarts/redeploys.
- Passwords are hashed with bcrypt; never stored in plain text.
- The free Render Postgres tier expires after 90 days — fine for testing, upgrade for production use.
