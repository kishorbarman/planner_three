# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
npm install                          # Install dependencies (not npx expo install)
npx expo run:android                 # Build and run on Android (required — Expo Go won't work)
npx expo run:ios                     # Build and run on iOS
npx expo start --web                 # Start web dev server
npm run build:web                    # Export web build to dist/
npm run deploy:web                   # Build + deploy to Firebase Hosting
npx tsc --noEmit                     # Type-check without emitting
```

There are no tests or linter configured in this project.

## Architecture

### Daily Lifecycle (Core Concept)

The app enforces picking exactly 3 tasks per day. A day progresses through four modes: **AM → Day → PM → Done**. Mode transitions are **data-driven** based on `committed` and `finalized` flags on the `days` table — there is no time-based logic for mode progression.

Mode resolution in `useDay.ts`:
- `!committed` → `am` (pick your 3 tasks)
- `committed && !finalized && !reflecting` → `day` (work through tasks)
- `committed && !finalized && reflecting` → `pm` (write reflection)
- `finalized` → `done` (read-only review)

### Auth Flow

`useAuth.ts` exports both the `AuthContext` and `useAuthProvider()`. The root `_layout.tsx` calls `useAuthProvider()` and wraps everything in `AuthContext.Provider`. The `(main)/_layout.tsx` guard redirects to `/login` when unauthenticated.

Auth is platform-aware:
- **Native**: Google Sign-In via `@react-native-google-signin/google-signin` → Supabase `signInWithIdToken`
- **Web**: Supabase OAuth redirect flow

### Supabase Client (Platform Split)

- `lib/supabase.ts` — Native: uses `SQLiteStorage` adapter (expo-sqlite) for session persistence
- `lib/supabase.web.ts` — Web: uses `localStorage` for session persistence

Expo resolves the `.web.ts` variant automatically for web builds.

### Database Schema

Three tables with RLS (all scoped to `auth.uid() = user_id`):
- `days` — one row per user per date, has `committed`/`finalized` flags and `reflection` text
- `tasks` — exactly 3 per day (position 1-3), linked to `days` via `day_id`
- `haze_items` — freeform backlog items with `archived` flag

Migrations are in `supabase/migrations/` and must be run manually in the Supabase SQL editor.

### Visual Theme

`useSolarTheme` returns gradient colors based on time of day (morning/midday/evening/night). This is purely aesthetic — it does not affect mode logic. Gradient tuples are defined in `constants/colors.ts` and must be typed as `[string, string, string]` (not `string[]`) for `expo-linear-gradient`.

## Key Conventions

- No global state library — React Context for auth only, custom hooks (`useDay`, `useHaze`, `useHistory`) for data
- Optimistic updates with rollback on error (see `toggleTaskComplete`, `editTask` in `useDay.ts`)
- Env vars use `EXPO_PUBLIC_` prefix: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- Haze and History screens use modal presentation (`slide_from_bottom`)
- `MAX_TASKS = 3` is enforced in `constants/config.ts`
