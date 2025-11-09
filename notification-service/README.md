# 📩 Notification Service

The **Notification Service** is responsible for handling all email-related operations within the system.  
It listens to messages from RabbitMQ and sends notification emails (with optional attachments or QR codes).  
Additionally, it provides a REST endpoint to manually trigger emails.

---

## ⚙️ Technologies Used

- **Spring Boot 3**
- **Java Mail Sender**
- **MongoDB**
- **RabbitMQ**
- **Lombok**
- **Jakarta Mail**
- **Jackson Databind**

---

## 🚀 Features

- Send HTML emails with or without attachments.
- Auto-generate and attach QR codes.
- Store email logs in MongoDB.
- Consume reservation-related messages from RabbitMQ and send confirmation emails automatically.

---

## 📡 REST API Endpoints

### `POST /api/email/send`

Send an email manually via HTTP.

#### Request Parameters
| Parameter | Type | Required | Description |
|------------|------|-----------|--------------|
| `to` | String | ✅ | Recipient email address |
| `subject` | String | ✅ | Email subject |
| `message` | String | ✅ | HTML or plain-text message content |
| `attachment` | MultipartFile | ❌ | File attachment |
| `qrData` | String | ❌ | Name of QR code file stored in the QR folder |

#### Example (via Postman)
**POST** `http://localhost:5003/api/email/send`

Form-Data:
```
to: test@example.com
subject: Test Email
message: Hello, this is a test email.
attachment: (choose file)
qrData: qr_1731150100.png
```

#### Example Response
```json
"Email sent successfully!"
```

---

## 🧩 RabbitMQ Listener

The service listens to reservation events from RabbitMQ queues to send automated emails.

**Queue Name:** `reservation.email.queue`  
**Exchange:** `reservation.exchange`  
**Routing Keys:**
- `reservation.created`
- `reservation.confirmed`
- `reservation.cancelled`

### Example Message Consumed
```json
{
  "event": "RESERVATION_CONFIRMED",
  "reservationId": "64ef3fbb9a1f4a6cbf7dbe21",
  "email": "user@example.com",
  "status": "CONFIRMED",
  "amount": 4500.0,
  "stallId": "STALL_12",
  "reserveDate": "2025-11-09T12:45:32",
  "reserveConfirmDate": "2025-11-09T13:10:22"
}
```

---

## 💾 MongoDB Schema (EmailRecord)

**Collection:** `email_records`

| Field | Type | Description |
|--------|------|-------------|
| `id` | String | MongoDB document ID |
| `toEmail` | String | Recipient email |
| `subject` | String | Email subject |
| `message` | String | Email body content |
| `attachmentName` | String | File name of attachment |
| `qrData` | String | File name of attached QR code |
| `sentAt` | LocalDateTime | Timestamp when the email was sent |

Example Document:
```json
{
  "_id": "673b5e2f2c8bfa001e49a2a3",
  "toEmail": "user@example.com",
  "subject": "Reservation Confirmed",
  "message": "<html>...</html>",
  "attachmentName": "QRCode.png",
  "qrData": "qr_1731150100.png",
  "sentAt": "2025-11-09T13:12:15"
}
```

---

## 📂 Folder Configuration

| Property | Default Value | Description |
|-----------|----------------|-------------|
| `qrcode.folder` | `qrcodes` | Folder to store and read QR codes |
| `spring.mail.username` | `noreply@example.com` | Sender email address |

---

## 🧠 Flow Overview

1. **Reservation Service** publishes a message → RabbitMQ  
2. **Notification Service** consumes it  
3. Generates QR code if applicable  
4. Sends email to user  
5. Logs email data in MongoDB  

---

## 🧰 Run Locally

```bash
# Run MongoDB and RabbitMQ before starting the service
mvn spring-boot:run
```

---

## 🧾 Example Email Preview

- **Reservation Created** → "Reservation Created Successfully"
- **Reservation Confirmed** → "Reservation Confirmed" (with QR code)
- **Reservation Cancelled** → "Reservation Cancelled"

---

© 2025 Notification Service – Automated Email Handler
