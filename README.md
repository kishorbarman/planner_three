# Three

A daily planner built around one simple constraint: pick just three tasks each day.

Three is designed to cut through the noise of endless to-do lists. Every morning you commit to three things. Throughout the day you check them off. At the end, you reflect on how it went. That's it.

## How it works

The app follows a daily lifecycle with four modes:

- **AM** — Start your day by choosing your three tasks
- **Day** — Work through your tasks and check them off
- **PM** — Write a short reflection on your day
- **Done** — Review your completed tasks and reflection

Mode progression is data-driven (based on commit/finalize flags), not time-driven. You move through the flow at your own pace.

### The Haze

A freeform backlog for everything floating in your mind. Capture ideas here and pull from them when planning tomorrow's three.

### History

Browse past days to see what you committed to, what you completed, and what you reflected on.

### Profile & Data

View your profile, log out, or permanently erase all your data with a typed confirmation.

## Tech stack

- React Native (Expo SDK 54) + TypeScript
- Expo Router for file-based navigation
- Supabase for auth and database (PostgreSQL with RLS)
- Google Sign-In for authentication

## Project structure

```
app/              Expo Router routes
  (main)/         Authenticated screens (index, haze, history, profile)
  login.tsx       Google Sign-In screen
components/       Reusable UI (SolarBackground, GlassCard, TaskCard, etc.)
hooks/            Data hooks (useAuth, useDay, useHaze, useHistory, useSolarTheme)
lib/              Utilities (supabase client, date helpers, haptics)
constants/        Colors, config values
types/            TypeScript type definitions
supabase/
  migrations/     PostgreSQL schema and RLS policies
```

## Setup

1. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` followed by `002_delete_policies.sql`
2. Enable Google as an auth provider in the Supabase dashboard
3. Create Google Cloud OAuth credentials (Web Client ID + Android Client ID with your signing key's SHA-1)
4. Copy `.env.example` to `.env` and fill in your Supabase URL, anon key, and Google Web Client ID
5. Add your `google-services.json` to the project root
6. Install dependencies: `npm install`
7. Build and run: `npx expo run:android`

Google Sign-In requires a native module, so this app must be run as a development build or release build — it will not work in Expo Go.
