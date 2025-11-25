# CIBF Reservation Platform

Monorepo for the Colombo International Book Fair reservation ecosystem. It bundles Spring Boot microservices, an nginx API gateway, RabbitMQ/Mongo/Postgres infrastructure, and a React + Vite admin portal that operators use to supervise stalls, vendors, and QR-based access control.

## High-Level Architecture

```
┌────────────┐      ┌──────────────┐      ┌────────────────────┐
│ Admin Web  │ ---> │ nginx gateway│ ---> │ Spring Boot services│
└────────────┘      └──────────────┘      └────────────────────┘
                                            │ user-service (Postgres)
                                            │ stall-service (Postgres)
                                            │ reservation-service (Mongo + RabbitMQ)
                                            │ genre-service (Postgres)
                                            │ email-service (SMTP/RabbitMQ)
```

Supporting infrastructure is orchestrated via `docker-compose.yml`:

- **PostgreSQL** – relational storage for users/stalls/genres
- **MongoDB** – reservation documents
- **RabbitMQ** – async messaging (notifications, email dispatch)
- **nginx** – API gateway that handles CORS and routes `/api/*` to services

## Repository Layout

```
CIBF-Reservation-Portal/
├── admin-portal/              # React + Vite admin UI
├── api-gateway/               # nginx config for routing/CORS
├── docker-compose.yml         # orchestrates databases/services/gateway
├── services/
│   ├── user-service/
│   ├── stall-service/
│   ├── reservation-service/
│   ├── genre-service/
│   └── email-service/
└── README.md
```

Each Spring Boot service exposes REST endpoints documented in its own module. All services share JWT-based auth via the user-service and exchange messages through RabbitMQ for notification workflows.

## Admin Portal (UI)

The `admin-portal/` subdirectory contains a fully typed React 19 SPA using Vite, custom contexts, and a dark/glass UI kit. Major screens include:

- Authentication (login/signup) with hero messaging
- Dashboard metrics for vendors, stalls, reservations
- Stall & genre CRUD with modal editors
- Reservation management (search, filters, approval)
- Vendor directory with reservation aggregates
- QR scanner page (webcam/manual/upload verification)

Refer to [`admin-portal/README.md`](admin-portal/README.md) for detailed frontend docs.

## Running the Platform

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ / Yarn (for admin portal dev build)
- Java 17 / Maven (if building services outside Docker)

### 1. Bring up infrastructure + services

```
docker compose up --build
```

This starts PostgreSQL, MongoDB, RabbitMQ, nginx, and all Spring Boot services. The gateway listens on `http://localhost:8080` and forwards `/api/*` to the appropriate service (see `api-gateway/nginx.conf`).

### 2. Run the admin portal (optional separate terminal)

```
cd admin-portal
yarn install
yarn dev
```

The UI runs at `http://localhost:5173` and proxies API calls to `http://localhost:8080/api` (configure via `admin-portal/.env`).

### 3. Production build check

```
cd admin-portal
yarn build
```

This performs TypeScript checking and outputs static assets to `admin-portal/dist/` for deployment behind nginx or another static host.

## Common Environment Variables

- `VITE_API_BASE_URL` – admin portal base URL (`http://localhost:8080/api` by default)
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` – each service’s Postgres DSN
- `SPRING_DATA_MONGODB_URI` – reservation-service connection string
- `RABBITMQ_URI` – broker URL shared across services

(See individual service `application.yml` files for defaults.)

## Observability & Ops

- **LoaderContext** in the admin UI prevents flicker by counting concurrent requests
- **ToastContext** pushes errors/success messages globally
- **API service layer** normalizes REST responses (arrays, wrapped payloads, empty bodies)
- **nginx gateway** handles CORS, hides duplicate headers, and enforces a single origin (`http://localhost:5173` when running locally)
