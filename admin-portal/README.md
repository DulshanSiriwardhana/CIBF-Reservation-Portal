# CIBF Admin Portal

A modern control room for the Colombo International Book Fair. The portal helps administrators keep stalls, vendors, reservations, and QR verification in sync while presenting a cohesive, polished UI built with React 19 and Vite.

## Tech Stack

- **React 19 + TypeScript** – component-driven UI with type safety
- **Vite 7** – fast dev server and bundler
- **React Router** – client-side routing
- **Tailwind-style utility classes** (via `index.css`) – custom design system inspired by neon/charcoal palette
- **Custom contexts** – `AuthContext`, `LoaderContext`, `ToastContext` for auth, global loading, and notifications
- **API service wrapper** – centralized fetch helper that injects auth headers and normalizes responses

## Features

- **Authentication** – login/signup with JWT handling, dark glassmorphism cards, hero marketing section
- **Dashboard** – real-time stats for vendors, stalls, reservations; occupancy figures
- **Stall Management** – CRUD for stalls and genres with modal forms
- **Reservation Management** – search, filter, approve/reject reservations, refreshed light cards
- **Vendor Directory** – vendor summaries with reservation counts
- **QR Scanner** – webcam-based QR validation with manual input/upload fallback
- **Unified Layout** – fixed glass navbar, marketing hero, footer with contact/system status

## Getting Started

```bash
cd admin-portal
yarn install
```

### Development

```bash
yarn dev
```

This starts Vite on `http://localhost:5173`. The app expects backend APIs proxied through the nginx gateway at `http://localhost:8080/api` (set via `.env`).

### Linting & Build

```bash
yarn lint   # runs eslint
yarn build  # type-check + production build
```

### Environment Variables

Create `admin-portal/.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Project Structure

```
admin-portal/
├── src/
│   ├── components/
│   │   ├── auth/         # LoginCard, SignupCard
│   │   ├── navbar/       # NavBar, ProfilePopup, Footer
│   │   └── stallmanagement/
│   ├── context/          # AuthContext, LoaderContext, ToastContext
│   ├── pages/            # Dashboard, StallManagementPage, etc.
│   ├── services/api.ts   # API service layer
│   └── index.css         # Design tokens & utilities
└── README.md
```

## API Expectations

All requests hit the gateway (`/api`). Auth endpoints return JWTs stored in `localStorage`. Stalls, reservations, and genres use REST resources (GET/POST/PUT/DELETE). QR verification posts `{ code }` to `/reservations/verify-qr`.

## Notes

- Loader overlay is managed via reference counting to avoid flicker
- Toasts surface success/error messages globally
- Protected routes redirect to `/` when auth state is missing

Feel free to customize the theme via `src/index.css` design tokens.
