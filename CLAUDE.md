# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server (Vite)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

There are no tests or linters configured.

**Deploy:** Push to `main` — Cloudflare Pages auto-deploys on push.

## Architecture

This is a single-page React app (Vite) deployed on **Cloudflare Pages**, with **Cloudflare Workers** handling the backend API and **Cloudflare D1** (SQLite) as the database.

### Frontend — `src/App.jsx`

The entire frontend lives in one file. It uses inline styles throughout (no CSS framework, no separate component files). Key sections:

- **`Nav`** — sticky top nav, responsive (hamburger menu on mobile via `useIsMobile()`)
- **`HomePage`** — shows a randomly selected family photo from `FAMILY_PHOTOS`
- **`PhotosPage`** — static list of Google Photos album links (`PHOTO_ALBUMS`)
- **`MessagesPage`** — fetches/posts to `/api/messages`; uses `/api/me` to get the current user
- **`LinksPage`** — static bookmarks (`LINK_CATEGORIES`)
- **`OverAndAbovePage`** — links to external tools (`TOOLS`)

Routing is hash-based (`window.location.hash`), no router library.

Design tokens are in the `C` object at the top of `App.jsx`. All pages share `styles.section`, `styles.card`, etc.

To add photos to the home page rotation: add the filename to `FAMILY_PHOTOS` and upload the file to `public/`.

### Backend — `functions/api/`

Cloudflare Pages Functions (Edge Workers). Two endpoints:

- **`GET /api/me`** — returns `{ email, name, isAdmin }` by decoding the Cloudflare Access JWT
- **`GET/POST/DELETE /api/messages`** — reads/writes to the D1 `messages` table

Authentication is via **Cloudflare Access** (Google OAuth). The JWT is read from the `Cf-Access-Jwt-Assertion` header (desktop) or `CF_Authorization` cookie (iOS Safari). `EMAIL_TO_NAME` maps known family emails to display names. Admin is `steve@jukes.nz` / `stevenjohnjukes@gmail.com`.

The D1 database binding is `env.DB`. The `messages` table has columns: `id`, `author`, `email`, `text`, `created_at`.

### Static tools in `public/`

- `cobies-maths.html` — self-contained maths quiz app
- `maths-grid.html` — self-contained maths grid practice tool

These are standalone HTML files with no build step — edit them directly.
