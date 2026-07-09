# RentNest API Documentation

**Base URL:** `http://localhost:8000`

---

## Journey Flow

**Tenant Journey:**
```
Register → Browse Properties → Submit Request → Wait for Approval → Pay via Stripe → Review
```

**Landlord Journey:**
```
Register → Create Property → View Requests → Approve/Reject → Mark as Completed
```

**Status Flow:**
```
Rental: PENDING → APPROVED → (payment) → ACTIVE → COMPLETED
Payment: PENDING → COMPLETED
Property: AVAILABLE → (payment) → UNAVAILABLE → (completed) → AVAILABLE
```

**Note:** Landlord can mark rental status ACTIVE → COMPLETED

---

## 1. Authentication

**1.1** POST `/auth/register`
```json
{ "name": "John", "email": "john@example.com", "password": "123456", "role": "TENANT" }
```

**1.2** POST `/auth/login`
```json
{ "email": "john@example.com", "password": "123456" }
```
**Response:** Sets `accessToken` and `refreshToken` in httpOnly cookies

**1.3** POST `/auth/refresh-token`
**Note:** Reads `refreshToken` from cookies automatically

---

## 2. Users

**2.1** GET `/users`

**2.2** GET `/users/me`

**2.3** PATCH `/users/:id`
```json
{ "name": "Updated Name" }
```

**2.4** DELETE `/users/:id`

**2.5** PATCH `/users/:id/moderate`
```json
{ "status": "BANNED" }
```

---

## 3. Properties

**3.1** GET `/properties`

**3.2** GET `/properties/:id`

**3.3** POST `/properties`
```json
{ "title": "Apartment", "description": "Nice place", "price": 1500, "address": "123 Main St", "amenities": ["WiFi"], "categoryId": "uuid" }
```

**3.4** PATCH `/properties/:id`
```json
{ "price": 1600 }
```

**3.5** DELETE `/properties/:id`

---

## 4. Categories

**4.1** GET `/categories`

**4.2** GET `/categories/:id`

**4.3** POST `/categories`
```json
{ "name": "Apartment" }
```

**4.4** PATCH `/categories/:id`
```json
{ "name": "Studio" }
```

**4.5** DELETE `/categories/:id`

---

## 5. Rental Requests

**5.1** POST `/rentals`
```json
{ "propertyId": "uuid" }
```

**5.2** GET `/rentals`

**5.3** GET `/rentals/:id`

**5.4** PATCH `/rentals/:id/status`
```json
{ "status": "APPROVED" }
```

**5.5** PATCH `/rentals/:id/cancel`

---

## 6. Payments

**Complete Flow:**
```
Tenant(request) → Landlord(approve) → Tenant(create payment) → Stripe(redirect) → 
Tenant(pay) → Webhook(auto: ACTIVE) → Landlord(mark COMPLETED) → Property(AVAILABLE)
```

**6.1** POST `/payments/create-intent`
```json
{ "rentalRequestId": "uuid" }
```

**6.2** POST `/payments/webhook`

**6.3** GET `/payments`

**6.4** GET `/payments/:id`

---

## 7. Reviews

**7.1** GET `/reviews`

**7.2** GET `/reviews/:id`

**7.3** POST `/reviews`
```json
{ "propertyId": "uuid", "rating": 5, "comment": "Great place" }
```

**7.4** PATCH `/reviews/:id`
```json
{ "rating": 4 }
```

**7.5** DELETE `/reviews/:id`

---

## 8. Admin

**8.1** GET `/admin/dashboard`

**8.2** GET `/admin/properties`

**8.3** GET `/admin/rental-requests`

**8.4** DELETE `/admin/properties/:id`

**8.5** DELETE `/admin/reviews/:id`

---

## 9. Landlord

**9.1** GET `/landlord/stats`

**9.2** GET `/landlord/properties`

**9.3** GET `/landlord/rental-requests`

**9.4** GET `/landlord/reviews`

**9.5** GET `/landlord/tenants/:tenantId/history`

---

## Auth
Tokens are automatically sent via **httpOnly cookies** after login. 

Alternatively, use header:
```
Authorization: Bearer <token>
```
