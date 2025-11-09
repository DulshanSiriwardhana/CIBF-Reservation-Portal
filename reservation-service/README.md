# 🏨 Reservation Service

The **Reservation Service** handles the creation, confirmation, and cancellation of reservations.  
It also publishes reservation events to RabbitMQ, which are consumed by the Notification Service.

---

## ⚙️ Technologies Used

- **Spring Boot 3**
- **MongoDB**
- **RabbitMQ**
- **Jackson Databind**
- **Lombok**

---

## 🧩 RabbitMQ Configuration

| Name | Value |
|------|--------|
| **Exchange** | `reservation.exchange` |
| **Queue** | `reservation.email.queue` |
| **Routing Keys** | `reservation.created`, `reservation.confirmed`, `reservation.cancelled` |

Every reservation event triggers a message sent to the above exchange.

---

## 📡 REST API Endpoints

### 1. **Create Reservation**
`POST /api/reservations`

#### Request Body
```json
{
  "userId": "USR001",
  "email": "user@example.com",
  "amount": 4500.0,
  "stallId": "STALL_12"
}
```

#### Response
```json
{
  "reservationId": "673b5e2f2c8bfa001e49a2a3",
  "reserveDate": "2025-11-09T12:45:32",
  "status": "PENDING",
  "userId": "USR001",
  "email": "user@example.com",
  "amount": 4500.0,
  "stallId": "STALL_12"
}
```

✅ Automatically publishes event → `reservation.created`

---

### 2. **Confirm Reservation**
`PUT /api/reservations/{id}/confirm`

#### Example Response
```json
{
  "reservationId": "673b5e2f2c8bfa001e49a2a3",
  "status": "CONFIRMED",
  "reserveConfirmDate": "2025-11-09T13:10:22",
  "email": "user@example.com"
}
```

✅ Publishes event → `reservation.confirmed`

---

### 3. **Cancel Reservation**
`PUT /api/reservations/{id}/cancel`

#### Example Response
```json
{
  "reservationId": "673b5e2f2c8bfa001e49a2a3",
  "status": "CANCELLED"
}
```

✅ Publishes event → `reservation.cancelled`

---

### 4. **Get All Reservations**
`GET /api/reservations`

Returns a list of all reservations.

---

### 5. **Get Reservation by ID**
`GET /api/reservations/{id}`

Returns a single reservation by its ID.

---

## 🗃️ MongoDB Schema (Reservation)

**Collection:** `reservations`

| Field | Type | Description |
|--------|------|-------------|
| `reservationId` | String | Unique reservation identifier |
| `reserveDate` | LocalDateTime | Date when reservation was created |
| `status` | String | PENDING / CONFIRMED / CANCELLED |
| `userId` | String | Associated user ID |
| `email` | String | Customer email address |
| `amount` | double | Reservation amount |
| `stallId` | String | Stall or booth identifier |
| `reserveConfirmDate` | LocalDateTime | Date of confirmation |

Example Document:
```json
{
  "_id": "673b5e2f2c8bfa001e49a2a3",
  "reserveDate": "2025-11-09T12:45:32",
  "status": "PENDING",
  "userId": "USR001",
  "email": "user@example.com",
  "amount": 4500.0,
  "stallId": "STALL_12"
}
```

---

## 📤 RabbitMQ Message Payload

Each reservation action sends a message to RabbitMQ.

### Example Published Message
```json
{
  "event": "RESERVATION_CONFIRMED",
  "reservationId": "673b5e2f2c8bfa001e49a2a3",
  "email": "user@example.com",
  "status": "CONFIRMED",
  "amount": 4500.0,
  "stallId": "STALL_12",
  "reserveDate": "2025-11-09T12:45:32",
  "reserveConfirmDate": "2025-11-09T13:10:22"
}
```

This message is consumed by the **Notification Service** to send the appropriate email.

---

## 🧠 Flow Overview

1. User creates or updates a reservation via REST API.  
2. Reservation Service saves it in MongoDB.  
3. It publishes an event to RabbitMQ.  
4. Notification Service consumes it and sends an email with QR code.

---

## 🧰 Run Locally

```bash
# Start RabbitMQ and MongoDB first
mvn spring-boot:run
```

---

© 2025 Reservation Service – Reservation & Messaging Module
