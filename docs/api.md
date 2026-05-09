# API Documentation: Cleani Platform

Standard Response Pattern:
```json
{
    "status": 200,
    "message": "...",
    "data": {},
    "errors": []
}
```

## Endpoints

### 1. Services Discovery
- **URL**: `/api/services`
- **Method**: `GET`
- **Description**: Returns all available cleaning services from the dynamic JSON store.

### 2. FAQ
- **URL**: `/api/faq`
- **Method**: `GET`
- **Description**: Returns frequently asked questions.

### 3. Create Booking
- **URL**: `/api/bookings`
- **Method**: `POST`
- **Payload**:
```json
{
    "serviceId": "res-basic",
    "details": { "type": "apartment", "rooms": 2 },
    "schedule": { "date": "2026-06-01", "time": "09:00" },
    "contact": { "name": "John Doe", "email": "john@example.com", "phone": "123456789" }
}
```

### 4. Authentication
- **URL**: `/api/login`
- **Method**: `POST`
- **Payload**: `{ "email": "...", "password": "..." }`

### 5. Dashboard Bookings
- **URL**: `/api/dashboard_bookings`
- **Method**: `GET`
- **Protection**: Requires Auth (Session)
