# 🏠 RentNest API Documentation

**Base URL:** `http://localhost:8000/api/v1`

---

## 🚀 Quick API Reference - All Routes

### Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login user |
| POST | `/api/v1/auth/refresh-token` | Public | Refresh access token |

### User Routes (`/api/v1/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | ADMIN | Get all users |
| GET | `/api/v1/users/me` | Authenticated | Get current user profile |
| PUT | `/api/v1/users/:id` | Authenticated | Update user profile |
| DELETE | `/api/v1/users/:id` | ADMIN | Delete user |
| PATCH | `/api/v1/users/:id/moderate` | ADMIN | Ban/Unban user |

### Property Routes (`/api/v1/properties`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/properties` | Public | Get all properties (with filters) |
| GET | `/api/v1/properties/:id` | Public | Get single property details |
| POST | `/api/v1/properties` | LANDLORD | Create new property listing |
| PUT | `/api/v1/properties/:id` | LANDLORD | Update property (owner only) |
| DELETE | `/api/v1/properties/:id` | LANDLORD | Delete property (owner only) |

### Category Routes (`/api/v1/categories`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/categories` | Public | Get all categories |
| GET | `/api/v1/categories/:id` | Public | Get single category with properties |
| POST | `/api/v1/categories` | ADMIN | Create new category |
| PUT | `/api/v1/categories/:id` | ADMIN | Update category |
| DELETE | `/api/v1/categories/:id` | ADMIN | Delete category |

### Rental Request Routes (`/api/v1/rentals`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/rentals` | TENANT | Submit rental request |
| GET | `/api/v1/rentals` | TENANT/LANDLORD/ADMIN | Get rental requests (filtered by role) |
| GET | `/api/v1/rentals/:id` | TENANT/LANDLORD/ADMIN | Get single rental request |
| PATCH | `/api/v1/rentals/:id/status` | LANDLORD | Approve/Reject/Complete request |
| PATCH | `/api/v1/rentals/:id/cancel` | TENANT | Cancel pending request |

### Review Routes (`/api/v1/reviews`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/reviews` | Public | Get all reviews (with filters) |
| GET | `/api/v1/reviews/:id` | Public | Get single review |
| POST | `/api/v1/reviews` | TENANT | Create review (after completed rental) |
| PUT | `/api/v1/reviews/:id` | TENANT | Update review (owner only) |
| DELETE | `/api/v1/reviews/:id` | TENANT | Delete review (owner only) |

### Admin Routes (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/admin/dashboard` | ADMIN | Get platform statistics |
| GET | `/api/v1/admin/properties` | ADMIN | View all properties |
| GET | `/api/v1/admin/rental-requests` | ADMIN | View all rental requests |
| DELETE | `/api/v1/admin/properties/:id` | ADMIN | Delete any property |
| DELETE | `/api/v1/admin/reviews/:id` | ADMIN | Delete any review |

### Landlord Routes (`/api/v1/landlord`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/landlord/stats` | LANDLORD | Get landlord statistics |
| GET | `/api/v1/landlord/properties` | LANDLORD | Get my properties |
| GET | `/api/v1/landlord/rental-requests` | LANDLORD | Get rental requests for my properties |
| GET | `/api/v1/landlord/reviews` | LANDLORD | Get reviews for my properties |
| GET | `/api/v1/landlord/tenants/:tenantId/history` | LANDLORD | Get tenant rental history |

---

## 📋 Table of Contents
1. [Authentication Routes](#1-authentication-routes)
2. [User Routes](#2-user-routes)
3. [Property Routes](#3-property-routes)
4. [Category Routes](#4-category-routes)
5. [Rental Request Routes](#5-rental-request-routes)
6. [Payment Routes](#6-payment-routes)
7. [Review Routes](#7-review-routes)
8. [Admin Routes](#8-admin-routes)
9. [Landlord Routes](#9-landlord-routes)
10. [Quick Reference](#10-quick-reference)

---

## 1. Authentication Routes
**Base Path:** `/api/v1/auth`

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/register`
- **Access:** Public
- **Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "TENANT"
}
```
**Notes:** role options: `TENANT`, `LANDLORD`, `ADMIN`

---

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/login`
- **Access:** Public
- **Description:** Login and receive JWT tokens

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

---

### 1.3 Get Current User
- **Method:** `GET`
- **Endpoint:** `/api/v1/auth/me`
- **Access:** Authenticated (All roles)
- **Description:** Get authenticated user profile
- **Headers:** `Authorization: Bearer <accessToken>`

---

## 2. User Routes
**Base Path:** `/api/v1/users`

### 2.1 Get All Users
- **Method:** `GET`
- **Endpoint:** `/api/v1/users`
- **Access:** ADMIN only
- **Description:** Get all users with filtering and pagination
- **Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
- `searchTerm` - Search in name/email
- `name` - Filter by name
- `email` - Filter by email
- `role` - TENANT | LANDLORD | ADMIN
- `status` - ACTIVE | BANNED
- `limit` - Items per page (default: 10)
- `page` - Page number (default: 1)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc | desc (default: desc)

**Example:** `/api/v1/users?searchTerm=john&role=TENANT&limit=20`

---

### 2.2 Get My Profile
- **Method:** `GET`
- **Endpoint:** `/api/v1/users/me`
- **Access:** Authenticated (All roles)
- **Description:** Get current user profile
- **Headers:** `Authorization: Bearer <accessToken>`

---

### 2.3 Update User
- **Method:** `PUT`
- **Endpoint:** `/api/v1/users/:id`
- **Access:** Authenticated (All roles)
- **Description:** Update user profile
- **Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "name": "John Updated",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Experienced renter looking for properties",
  "phone": "+1234567890"
}
```

---

### 2.4 Delete User
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/users/:id`
- **Access:** ADMIN only
- **Description:** Delete a user from the system
- **Headers:** `Authorization: Bearer <accessToken>`

---

### 2.5 Moderate User (Ban/Unban)
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/users/:id/moderate`
- **Access:** ADMIN only
- **Description:** Ban or unban a user
- **Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "status": "BANNED"
}
```
**Notes:** status options: `ACTIVE`, `BANNED`

---

## 3. Property Routes
**Base Path:** `/api/v1/properties`

### 3.1 Get All Properties (Public)
- **Method:** `GET`
- **Endpoint:** `/api/v1/properties`
- **Access:** Public
- **Description:** Browse all properties with advanced filtering
- **Query Parameters:** `searchTerm`, `title`, `address`, `categoryId`, `landlordId`, `status` (AVAILABLE/UNAVAILABLE), `minPrice`, `maxPrice`, `amenities` (JSON array), `limit`, `page`, `sortBy`, `sortOrder`
- **Demo Request:** `/api/v1/properties?address=New York&minPrice=1000&maxPrice=2000&amenities=["WiFi","Parking"]`

### 3.2 Get Single Property
- **Method:** `GET`
- **Endpoint:** `/api/v1/properties/:id`
- **Access:** Public
- **Description:** Get detailed property information

### 3.3 Create Property
- **Method:** `POST`
- **Endpoint:** `/api/v1/properties`
- **Access:** LANDLORD only
- **Description:** Create a new property listing
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:**
```json
{
  "title": "Luxury 2BR Apartment in Downtown",
  "description": "Beautiful apartment with modern amenities",
  "price": 1500,
  "address": "123 Main St, New York, NY 10001",
  "amenities": ["WiFi", "Parking", "Pool", "Gym", "AC"],
  "categoryId": "category-uuid"
}
```

### 3.4 Update Property
- **Method:** `PUT`
- **Endpoint:** `/api/v1/properties/:id`
- **Access:** LANDLORD only (property owner)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"title": "Updated Title", "price": 1600, "status": "UNAVAILABLE"}`

### 3.5 Delete Property
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/properties/:id`
- **Access:** LANDLORD only (property owner)
- **Headers:** `Authorization: Bearer <accessToken>`

---

## 4. Category Routes
**Base Path:** `/api/v1/categories`

### 4.1 Get All Categories
- **Method:** `GET`
- **Endpoint:** `/api/v1/categories`
- **Access:** Public
- **Description:** Get all property categories
- **Query Parameters:** `searchTerm`, `name`, `limit`, `page`, `sortBy`, `sortOrder`

### 4.2 Get Single Category
- **Method:** `GET`
- **Endpoint:** `/api/v1/categories/:id`
- **Access:** Public
- **Description:** Get category details with all properties

### 4.3 Create Category
- **Method:** `POST`
- **Endpoint:** `/api/v1/categories`
- **Access:** ADMIN only
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"name": "Apartment"}`
- **Example Categories:** Apartment, House, Studio, Villa, Condo, Townhouse

### 4.4 Update Category
- **Method:** `PUT`
- **Endpoint:** `/api/v1/categories/:id`
- **Access:** ADMIN only
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"name": "Luxury Apartment"}`

### 4.5 Delete Category
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/categories/:id`
- **Access:** ADMIN only
- **Headers:** `Authorization: Bearer <accessToken>`
- **Note:** Cannot delete if category has properties

---

## 5. Rental Request Routes
**Base Path:** `/api/v1/rentals`

### 5.1 Create Rental Request
- **Method:** `POST`
- **Endpoint:** `/api/v1/rentals`
- **Access:** TENANT only
- **Description:** Submit a rental request for a property
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"propertyId": "property-uuid"}`
- **Validations:** Property must be AVAILABLE, no duplicate PENDING/APPROVED requests

### 5.2 Get All Rental Requests
- **Method:** `GET`
- **Endpoint:** `/api/v1/rentals`
- **Access:** Authenticated (TENANT, LANDLORD, ADMIN)
- **Description:** Get rental requests (filtered by role: Tenants see theirs, Landlords see their properties, Admins see all)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `searchTerm`, `tenantId`, `propertyId`, `landlordId`, `status` (PENDING/APPROVED/REJECTED/COMPLETED/CANCELLED)

### 5.3 Get Single Rental Request
- **Method:** `GET`
- **Endpoint:** `/api/v1/rentals/:id`
- **Access:** Authenticated
- **Headers:** `Authorization: Bearer <accessToken>`

### 5.4 Update Request Status (Approve/Reject)
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/rentals/:id/status`
- **Access:** LANDLORD only (property owner)
- **Description:** Approve, reject, or complete a rental request
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"status": "APPROVED"}`
- **Status Options:** APPROVED, REJECTED, COMPLETED

### 5.5 Cancel Rental Request
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/rentals/:id/cancel`
- **Access:** TENANT only (request owner)
- **Description:** Cancel a pending rental request
- **Headers:** `Authorization: Bearer <accessToken>`
- **Note:** Only PENDING requests can be cancelled

---

## 6. Payment Routes
**Base Path:** `/api/v1/payments`

> **How it works:** RentNest uses **Stripe monthly recurring subscriptions** for rental payments. After a landlord approves a request, the tenant initiates a Stripe Checkout Session. On successful payment the rental becomes `ACTIVE`. Stripe automatically attempts renewal every month — if renewal succeeds the rental stays `ACTIVE`; if it fails or is cancelled the rental moves to `COMPLETED` (ended).

### Payment Status Flow

```
Tenant calls POST /payments/create
        │
        ▼
  Stripe Checkout opens (Payment: PENDING, Request: APPROVED)
        │
   tenant pays
        │
        ▼
  Webhook: checkout.session.completed
  → Payment: COMPLETED, Request: ACTIVE
  → currentPeriodEnd set (1 month from now)
        │
        ├─── Every month ────────────────────────────────────────────────┐
        │    Webhook: customer.subscription.updated (status: active)     │
        │    → currentPeriodEnd refreshed, stays ACTIVE                  │
        │◄───────────────────────────────────────────────────────────────┘
        │
        └─── Subscription cancelled / payment fails ──────────────────────▶
             Webhook: customer.subscription.deleted  (or updated w/ non-active)
             → Payment: FAILED, Request: COMPLETED
```

---

### 6.1 Create Payment Session
- **Method:** `POST`
- **Endpoint:** `/api/v1/payments/create`
- **Access:** TENANT only
- **Description:** Creates a Stripe Checkout Session in subscription mode for an approved rental request. Returns a `paymentUrl` — redirect the tenant to this URL to complete payment.
- **Headers:** `Authorization: Bearer <tenantAccessToken>`

**Request Body:**
```json
{
  "rentalRequestId": "rnr_uuid_here"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment session created successfully",
  "data": {
    "paymentUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

**Possible Errors:**
| Status | Message |
|--------|---------|
| `403` | You are not authorized to pay for this rental request |
| `400` | Payment can only be made for approved rental requests |
| `400` | An active subscription already exists for this rental request |

**What happens internally:**
1. Verifies the rental request belongs to the tenant and is `APPROVED`.
2. Creates (or reuses) a Stripe Customer for the tenant.
3. Creates a Stripe Checkout Session with `mode: "subscription"` using the `STRIPE_PRICE_ID` configured in the dashboard.
4. Upserts a `Payment` record in `PENDING` status with `stripeCustomerId` and `stripeSessionId` stored.

---

### 6.2 Stripe Webhook
- **Method:** `POST`
- **Endpoint:** `/api/v1/payments/webhook`
- **Access:** Public (Stripe only — verified via signature)
- **Description:** Stripe calls this automatically. You never call this manually from a client. The request body must be the **raw Buffer** — this is handled by the `express.raw()` middleware registered in `app.ts`.

**Headers sent by Stripe:**
```
stripe-signature: t=...,v1=...
```

**Events handled:**

| Stripe Event | What the server does |
|---|---|
| `checkout.session.completed` | Marks Payment `COMPLETED`, sets `stripeSubscriptionId` + `currentPeriodEnd`, moves Request to `ACTIVE` |
| `customer.subscription.updated` | If Stripe status is `active`/`trialing` → refreshes `currentPeriodEnd`, keeps Payment `COMPLETED` + Request `ACTIVE`. Otherwise → Payment `FAILED` + Request `COMPLETED` |
| `customer.subscription.deleted` | Marks Payment `FAILED`, moves Request to `COMPLETED` |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Webhook processed successfully",
  "data": null
}
```

---

### 6.3 Get All Payments
- **Method:** `GET`
- **Endpoint:** `/api/v1/payments`
- **Access:** TENANT (own payments only), ADMIN (all payments)
- **Description:** Returns a paginated list of payments. Tenants are automatically scoped to their own data.
- **Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |
| `limit` | number | Items per page (default: `10`) |
| `page` | number | Page number (default: `1`) |
| `sortBy` | string | Sort field (default: `createdAt`) |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

**Example:** `GET /api/v1/payments?status=COMPLETED&limit=5`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payments retrieved successfully",
  "data": [
    {
      "id": "pay_uuid",
      "rentalRequestId": "rnr_uuid",
      "stripeCustomerId": "cus_...",
      "stripeSubscriptionId": "sub_...",
      "stripeSessionId": "cs_test_...",
      "amount": "1500.00",
      "provider": "STRIPE",
      "method": "CARD",
      "status": "COMPLETED",
      "currentPeriodEnd": "2026-08-08T17:00:00.000Z",
      "paidAt": "2026-07-08T17:00:00.000Z",
      "createdAt": "2026-07-08T17:00:00.000Z",
      "updatedAt": "2026-07-08T17:00:00.000Z",
      "rentalRequest": {
        "id": "rnr_uuid",
        "status": "ACTIVE",
        "property": {
          "title": "Luxury 2BR Apartment in Downtown",
          "address": "123 Main St, New York, NY 10001",
          "price": "1500.00",
          "category": { "name": "Apartment" }
        },
        "tenant": {
          "id": "user_uuid",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

---

### 6.4 Get Single Payment
- **Method:** `GET`
- **Endpoint:** `/api/v1/payments/:id`
- **Access:** TENANT, ADMIN
- **Description:** Get full details of a single payment by its id.
- **Headers:** `Authorization: Bearer <accessToken>`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment retrieved successfully",
  "data": {
    "id": "pay_uuid",
    "rentalRequestId": "rnr_uuid",
    "stripeSubscriptionId": "sub_...",
    "amount": "1500.00",
    "status": "COMPLETED",
    "currentPeriodEnd": "2026-08-08T17:00:00.000Z",
    "paidAt": "2026-07-08T17:00:00.000Z"
  }
}
```

**Possible Errors:**
| Status | Message |
|--------|---------|
| `404` | No Payment found with this id |

---

## 7. Review Routes
**Base Path:** `/api/v1/reviews`

### 7.1 Get All Reviews
- **Method:** `GET`
- **Endpoint:** `/api/v1/reviews`
- **Access:** Public
- **Description:** Get all reviews with filtering
- **Query Parameters:** `searchTerm`, `propertyId`, `tenantId`, `minRating` (1-5), `maxRating` (1-5), `limit`, `page`, `sortBy`, `sortOrder`

### 7.2 Get Single Review
- **Method:** `GET`
- **Endpoint:** `/api/v1/reviews/:id`
- **Access:** Public
- **Description:** Get detailed review information

### 7.3 Create Review
- **Method:** `POST`
- **Endpoint:** `/api/v1/reviews`
- **Access:** TENANT only
- **Description:** Create a review for a property after completed rental
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:**
```json
{
  "propertyId": "property-uuid",
  "rating": 5,
  "comment": "Excellent property with great amenities!"
}
```
- **Validations:** Must have COMPLETED rental, rating 1-5, one review per property

### 7.4 Update Review
- **Method:** `PUT`
- **Endpoint:** `/api/v1/reviews/:id`
- **Access:** TENANT only (review owner)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"rating": 4, "comment": "Updated review"}`

### 7.5 Delete Review
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/reviews/:id`
- **Access:** TENANT only (review owner)
- **Headers:** `Authorization: Bearer <accessToken>`

---

## 8. Admin Routes
**Base Path:** `/api/v1/admin`

### 8.1 Get Dashboard Statistics
- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/dashboard`
- **Access:** ADMIN only
- **Description:** Get comprehensive platform statistics
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response Example:**
```json
{
  "totalUsers": 150,
  "totalTenants": 100,
  "totalLandlords": 45,
  "totalProperties": 75,
  "availableProperties": 50,
  "unavailableProperties": 25,
  "totalCategories": 6,
  "totalRentalRequests": 200,
  "pendingRequests": 25,
  "approvedRequests": 50,
  "rejectedRequests": 75,
  "completedRequests": 50,
  "totalReviews": 80,
  "averageRating": 4.5
}
```

### 8.2 Get All Properties (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/properties`
- **Access:** ADMIN only
- **Description:** View all properties in the system
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 8.3 Get All Rental Requests (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/rental-requests`
- **Access:** ADMIN only
- **Description:** View all rental requests in the system
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 8.4 Delete Property (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/admin/properties/:id`
- **Access:** ADMIN only
- **Description:** Delete any property (admin override)
- **Headers:** `Authorization: Bearer <accessToken>`

### 8.5 Delete Review (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/admin/reviews/:id`
- **Access:** ADMIN only
- **Description:** Delete any review (content moderation)
- **Headers:** `Authorization: Bearer <accessToken>`

---

## 9. Landlord Routes
**Base Path:** `/api/v1/landlord`

### 9.1 Get Landlord Statistics
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/stats`
- **Access:** LANDLORD only
- **Description:** Get landlord's business statistics
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response Example:**
```json
{
  "totalProperties": 10,
  "availableProperties": 6,
  "unavailableProperties": 4,
  "totalRentalRequests": 45,
  "pendingRequests": 5,
  "approvedRequests": 15,
  "rejectedRequests": 10,
  "completedRequests": 15,
  "totalReviews": 20,
  "averageRating": 4.7
}
```

### 9.2 Get My Properties
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/properties`
- **Access:** LANDLORD only
- **Description:** Get all properties owned by the landlord
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 9.3 Get My Rental Requests
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/rental-requests`
- **Access:** LANDLORD only
- **Description:** Get all rental requests for landlord's properties
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 9.4 Get My Reviews
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/reviews`
- **Access:** LANDLORD only
- **Description:** Get all reviews for landlord's properties
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 9.5 Get Tenant History
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/tenants/:tenantId/history`
- **Access:** LANDLORD only
- **Description:** View a specific tenant's rental and review history
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response includes:** tenant info, rental history, review history, statistics

---

## 10. Quick Reference

### 🔐 Authentication Header
All protected routes require JWT token:
```
Authorization: Bearer <accessToken>
```

---

### 📊 Status Enums

**User Status:**
- `BAN` - User is banned from the platform
- `UNBAN` - User can access the system

**User Role:**
- `TENANT` - Can browse and rent properties
- `LANDLORD` - Can list and manage properties
- `ADMIN` - Full system access and moderation

**Property Status:**
- `AVAILABLE` - Property is available for rent
- `UNAVAILABLE` - Property is not available

**Rental Request Status:**
- `PENDING` - Awaiting landlord decision
- `APPROVED` - Approved by landlord, ready for payment
- `REJECTED` - Rejected by landlord
- `ACTIVE` - Tenant has paid, currently renting
- `COMPLETED` - Rental ended (subscription cancelled or expired)
- `CANCELLED` - Cancelled by tenant before approval

**Payment Status:**
- `PENDING` - Checkout session created, tenant hasn't paid yet
- `COMPLETED` - Payment successful, subscription is active
- `FAILED` - Payment failed or subscription was cancelled
- `REFUNDED` - Payment was refunded

---

### ⚠️ Error Response Format

All errors follow this structure:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message description",
  "errorDetails": {}
}
```

**Common Error Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

---

### 📄 Pagination Response Format

All list endpoints return paginated data:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

### 🔍 Common Query Parameters

- `limit` - Number of items per page (default: 10)
- `page` - Page number (default: 1)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - Sort direction: `asc` or `desc` (default: desc)
- `searchTerm` - Global search across multiple fields

---

### 🧪 Testing Workflow

#### Full end-to-end flow (without payment):
1. **Register users** — `POST /api/v1/auth/register` with roles `TENANT`, `LANDLORD`, `ADMIN`
2. **Login** — `POST /api/v1/auth/login`, save `accessToken`
3. **Create categories** — as ADMIN: `POST /api/v1/categories` → `{"name": "Apartment"}`
4. **Create property** — as LANDLORD: `POST /api/v1/properties`
5. **Browse properties** — `GET /api/v1/properties` (public, no auth)
6. **Submit rental request** — as TENANT: `POST /api/v1/rentals` → `{"propertyId": "..."}`
7. **Approve request** — as LANDLORD: `PATCH /api/v1/rentals/:id/status` → `{"status": "APPROVED"}`
8. **Start payment** — see payment testing section below
9. **Leave review** — as TENANT: `POST /api/v1/reviews` (only after rental is COMPLETED)
10. **Check dashboards** — `GET /api/v1/admin/dashboard`, `GET /api/v1/landlord/stats`

---

#### 💳 Testing the Payment Flow (Step-by-step)

**Prerequisites:**
- Stripe CLI installed: https://stripe.com/docs/stripe-cli
- A recurring monthly Price created in your Stripe Dashboard (Products → Create product → set billing period to Monthly) — copy the `price_xxx` ID into `STRIPE_PRICE_ID` in `.env`
- Server running: `npm run dev`

---

**Step 1 — Start the Stripe webhook listener**

In a separate terminal:
```bash
npm run stripe:webhook
```
This forwards Stripe events to `http://localhost:8000/api/v1/payments/webhook`. The CLI will print the webhook signing secret — make sure it matches `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

**Step 2 — Create a payment session (as TENANT)**

```
POST /api/v1/payments/create
Authorization: Bearer <tenantAccessToken>
Content-Type: application/json

{
  "rentalRequestId": "<id of an APPROVED rental request>"
}
```

Expected response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment session created successfully",
  "data": {
    "paymentUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

Open the `paymentUrl` in your browser.

---

**Step 3 — Complete checkout with a Stripe test card**

On the Stripe Checkout page use one of these test cards:

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0341` | Card is declined |

- Expiry: any future date (e.g. `12/34`)
- CVC: any 3 digits (e.g. `123`)
- Name / address: anything

---

**Step 4 — Verify the webhook fired (success case)**

After completing checkout, the Stripe CLI terminal should show:
```
--> checkout.session.completed  [200]
```

Then check the rental request status:
```
GET /api/v1/rentals/<rentalRequestId>
Authorization: Bearer <tenantAccessToken>
```
Expected: `"status": "ACTIVE"`

Check the payment:
```
GET /api/v1/payments
Authorization: Bearer <tenantAccessToken>
```
Expected: `"status": "COMPLETED"`, `"currentPeriodEnd"` set to ~1 month from now.

---

**Step 5 — Test subscription cancellation (simulate rental ending)**

Cancel the subscription via the Stripe CLI (copy the `sub_...` id from the payment record):
```bash
stripe subscriptions cancel sub_xxxxxxxxxxxxx
```

The CLI should show:
```
--> customer.subscription.deleted  [200]
```

Check the rental request again — expected: `"status": "COMPLETED"`.
Check the payment — expected: `"status": "FAILED"`.

---

**Step 6 — Test monthly renewal (simulate next billing cycle)**

Trigger a renewal event manually via Stripe CLI:
```bash
stripe trigger customer.subscription.updated
```

The CLI should show:
```
--> customer.subscription.updated  [200]
```

The `currentPeriodEnd` on the payment record will be updated and the rental stays `ACTIVE`.

---

**Step 7 — Test error cases**

| Scenario | How to test | Expected error |
|---|---|---|
| Pay for a non-approved request | Use a `rentalRequestId` with status `PENDING` | `400 Payment can only be made for approved rental requests` |
| Pay for someone else's request | Use a different tenant's token | `403 You are not authorized to pay for this rental request` |
| Pay again for an already active rental | Call create session again on an `ACTIVE` request | `400 An active subscription already exists for this rental request` |
| No auth token | Omit the Authorization header | `401 No token provided` |

---

### ✅ Important Notes

- **Email Uniqueness:** Each user must have a unique email address
- **Property Availability:** Only AVAILABLE properties can receive rental requests
- **Review Restrictions:** Can only review properties with COMPLETED rentals
- **One Review Per Property:** Tenants can only leave one review per property
- **Request Cancellation:** Only PENDING requests can be cancelled by tenants
- **Landlord Authorization:** Landlords can only modify their own properties
- **Admin Override:** Admins can delete any property or review for moderation
- **Webhook raw body:** The `/api/v1/payments/webhook` route uses `express.raw()` — never send parsed JSON to it
- **Stripe Price ID:** Must be a **recurring** price (monthly), not a one-time price. Create it in the Stripe Dashboard under Products

---

### 🌍 Environment Variables

```env
PORT=8000
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/rentnest

BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRY=1d
JWT_REFRESH_TOKEN_EXPIRY=7d

# Stripe — get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
# Must be a monthly recurring Price ID from your Stripe Dashboard
STRIPE_PRICE_ID=price_...
```

---

**🏠 Happy Renting!**

**Documentation Version:** 2.0.0
**Last Updated:** July 2026
