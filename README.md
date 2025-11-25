# CIBF Reservation Platform

Monorepo for the Colombo International Book Fair reservation ecosystem. It bundles Spring Boot microservices, an nginx API gateway, RabbitMQ/Mongo/Postgres infrastructure, and two React + Vite portals:
- **Customer Portal** – Public-facing web application for vendors to browse stalls, make reservations, and manage bookings
- **Admin Portal** – Internal dashboard for operators to supervise stalls, vendors, and QR-based access control

## High-Level Architecture

```
┌──────────────────┐      ┌──────────────┐      ┌────────────────────┐
│ Customer Portal  │      │              │      │ Spring Boot services│
│ (React + Vite)   │ ---> │ nginx gateway│ ---> │ user-service (Postgres)
└──────────────────┘      │              │      │ stall-service (Postgres)
                          │              │      │ reservation-service (Mongo + RabbitMQ)
┌──────────────────┐      │              │      │ genre-service (Postgres)
│ Admin Portal     │ ---> │              │      │ email-service (SMTP/RabbitMQ)
│ (React + Vite)   │      └──────────────┘      │ notification-service (QR codes)
└──────────────────┘                            └────────────────────┘
```

Supporting infrastructure is orchestrated via `docker-compose.yml`:

- **PostgreSQL** – relational storage for users/stalls/genres
- **MongoDB** – reservation documents
- **RabbitMQ** – async messaging (notifications, email dispatch)
- **nginx** – API gateway that handles CORS and routes `/api/*` to services

## Repository Layout

```
CIBF-Reservation-Portal/
├── Customer-portal/           # React + Vite customer-facing UI
├── admin-portal/              # React + Vite admin UI
├── api-gateway/               # nginx config for routing/CORS
├── docker-compose.yml         # orchestrates databases/services/gateway
├── user-service/              # User authentication & management (Postgres)
├── stall-service/             # Stall CRUD & availability (Postgres)
├── reservation-service/       # Reservation workflow (MongoDB + RabbitMQ)
├── genre-service/             # Book genre management (Postgres)
├── email-service/             # Email notifications (SMTP/RabbitMQ)
├── notification-service/      # QR code generation & notifications
└── README.md
```

Each Spring Boot service exposes REST endpoints documented in its own module. All services share JWT-based auth via the user-service and exchange messages through RabbitMQ for notification workflows.

## Customer Portal (Public UI)

The `Customer-portal/` subdirectory contains a React SPA built with Vite, Tailwind CSS, and React Router. It provides a user-friendly interface for vendors to interact with the reservation system.

### Key Features:

- **Home Page** – Hero section with platform overview and feature highlights
- **Browse Stalls** – View available stalls with filtering by size, price, and status
- **Interactive Stall Map** – Visual map interface to explore stall locations and layouts
- **Reservation Management** – Create reservations for up to 3 stalls with detailed forms
- **My Reservations** – View all bookings with status tracking and QR code access
- **Genre Browsing** – Explore book genres and filter stalls by category
- **User Authentication** – Secure login/registration with profile management
- **QR Code Integration** – Access reservation QR codes for event entry

### Technology Stack:
- React 18+ with functional components and hooks
- Vite for fast development and optimized builds
- Tailwind CSS for responsive, modern styling
- React Router for client-side routing
- React Toastify for user notifications
- QR Code generation for reservation verification

## Admin Portal (Internal UI)

The `admin-portal/` subdirectory contains a fully typed React 19 SPA using Vite, TypeScript, custom contexts, and a modern light UI design with Spectral font. Major screens include:

- **Authentication** – Secure login/signup with hero messaging
- **Dashboard** – Real-time metrics for vendors, stalls, and reservations
- **Stall Management** – Full CRUD operations with modern modal editors
- **Genre Management** – Create and manage book genres
- **Reservation Management** – Search, filter, and approve/reject reservations
- **Vendor Directory** – View vendor profiles with reservation aggregates
- **QR Scanner** – Webcam/manual/upload verification for event access control

### Technology Stack:
- React 19 with TypeScript for type safety
- Vite for development and production builds
- Custom context providers (Auth, Toast, Loader, Confirm)
- Modern UI components with custom confirmation dialogs
- Spectral font family throughout the application

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

### 2. Run the customer portal (optional separate terminal)

```
cd Customer-portal
npm install
npm run dev
```

The customer portal runs at `http://localhost:5173` (or next available port) and connects to the API gateway at `http://localhost:8080/api`.

### 3. Run the admin portal (optional separate terminal)

```
cd admin-portal
yarn install
yarn dev
```

The admin portal runs at `http://localhost:5173` (or next available port if customer portal is running) and proxies API calls to `http://localhost:8080/api` (configure via `admin-portal/.env`).

**Note:** If running both portals simultaneously, they will use different ports (e.g., 5173 and 5174).

### 4. Production build

**Customer Portal:**
```
cd Customer-portal
npm run build
```
Outputs static assets to `Customer-portal/dist/` for deployment.

**Admin Portal:**
```
cd admin-portal
yarn build
```
Performs TypeScript checking and outputs static assets to `admin-portal/dist/` for deployment behind nginx or another static host.

## Common Environment Variables

### Frontend Portals:
- `VITE_API_BASE_URL` – API gateway base URL (`http://localhost:8080/api` by default)
  - Used by both Customer-portal and admin-portal

### Backend Services:
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` – each service's Postgres DSN
- `SPRING_DATA_MONGODB_URI` – reservation-service MongoDB connection string
- `RABBITMQ_URI` – broker URL shared across services
- `SPRING_RABBITMQ_HOST`, `SPRING_RABBITMQ_PORT`, `SPRING_RABBITMQ_USERNAME`, `SPRING_RABBITMQ_PASSWORD` – RabbitMQ configuration

(See individual service `application.yml` or `application.properties` files for defaults.)

## Observability & Ops

### Frontend Features:
- **Customer Portal:**
  - React Toastify for user notifications
  - Loading states for async operations
  - Responsive design with Tailwind CSS
  - QR code generation for reservations

- **Admin Portal:**
  - **LoaderContext** prevents flicker by counting concurrent requests
  - **ToastContext** pushes errors/success messages globally
  - **ConfirmContext** provides custom confirmation dialogs
  - Custom modal components with scroll locking
  - Modern UI with Spectral font family

### Backend & Infrastructure:
- **API service layer** normalizes REST responses (arrays, wrapped payloads, empty bodies)
- **nginx gateway** handles CORS, hides duplicate headers, and routes requests to appropriate services
- **RabbitMQ** enables async messaging for notifications and email dispatch
- **JWT-based authentication** shared across all services via user-service
- **QR code generation** via notification-service for reservation verification

## Portal Access

- **Customer Portal:** `http://localhost:5173` (or configured port)
  - Public access for vendors to browse and reserve stalls
  - Requires user registration/login for reservations

- **Admin Portal:** `http://localhost:5173` (or configured port)
  - Restricted access for platform operators
  - Requires admin authentication
  - Full system management capabilities
