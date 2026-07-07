# 🏠 RentNest API Documentation

**Base URL:** `http://localhost:5000/api/v1`

---

## 📋 Table of Contents
1. [Authentication Routes](#1-authentication-routes)
2. [User Routes](#2-user-routes)
3. [Property Routes](#3-property-routes)
4. [Category Routes](#4-category-routes)
5. [Rental Request Routes](#5-rental-request-routes)
6. [Review Routes](#6-review-routes)
7. [Admin Routes](#7-admin-routes)
8. [Landlord Routes](#8-landlord-routes)
9. [Quick Reference](#9-quick-reference)

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

## 6. Review Routes
**Base Path:** `/api/v1/reviews`

### 6.1 Get All Reviews
- **Method:** `GET`
- **Endpoint:** `/api/v1/reviews`
- **Access:** Public
- **Description:** Get all reviews with filtering
- **Query Parameters:** `searchTerm`, `propertyId`, `tenantId`, `minRating` (1-5), `maxRating` (1-5), `limit`, `page`, `sortBy`, `sortOrder`

### 6.2 Get Single Review
- **Method:** `GET`
- **Endpoint:** `/api/v1/reviews/:id`
- **Access:** Public
- **Description:** Get detailed review information

### 6.3 Create Review
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

### 6.4 Update Review
- **Method:** `PUT`
- **Endpoint:** `/api/v1/reviews/:id`
- **Access:** TENANT only (review owner)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Demo Data:** `{"rating": 4, "comment": "Updated review"}`

### 6.5 Delete Review
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/reviews/:id`
- **Access:** TENANT only (review owner)
- **Headers:** `Authorization: Bearer <accessToken>`

---

## 7. Admin Routes
**Base Path:** `/api/v1/admin`

### 7.1 Get Dashboard Statistics
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

### 7.2 Get All Properties (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/properties`
- **Access:** ADMIN only
- **Description:** View all properties in the system
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 7.3 Get All Rental Requests (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/rental-requests`
- **Access:** ADMIN only
- **Description:** View all rental requests in the system
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 7.4 Delete Property (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/admin/properties/:id`
- **Access:** ADMIN only
- **Description:** Delete any property (admin override)
- **Headers:** `Authorization: Bearer <accessToken>`

### 7.5 Delete Review (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/admin/reviews/:id`
- **Access:** ADMIN only
- **Description:** Delete any review (content moderation)
- **Headers:** `Authorization: Bearer <accessToken>`

---

## 8. Landlord Routes
**Base Path:** `/api/v1/landlord`

### 8.1 Get Landlord Statistics
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

### 8.2 Get My Properties
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/properties`
- **Access:** LANDLORD only
- **Description:** Get all properties owned by the landlord
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 8.3 Get My Rental Requests
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/rental-requests`
- **Access:** LANDLORD only
- **Description:** Get all rental requests for landlord's properties
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 8.4 Get My Reviews
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/reviews`
- **Access:** LANDLORD only
- **Description:** Get all reviews for landlord's properties
- **Headers:** `Authorization: Bearer <accessToken>`
- **Query Parameters:** `limit`, `page`, `sortBy`, `sortOrder`

### 8.5 Get Tenant History
- **Method:** `GET`
- **Endpoint:** `/api/v1/landlord/tenants/:tenantId/history`
- **Access:** LANDLORD only
- **Description:** View a specific tenant's rental and review history
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response includes:** tenant info, rental history, review history, statistics

---

## 9. Quick Reference

### 🔐 Authentication Header
All protected routes require JWT token:
```
Authorization: Bearer <accessToken>
```

---

### 📊 Status Enums

**User Status:**
- `ACTIVE` - User can access the system
- `BANNED` - User is banned from the platform

**User Role:**
- `TENANT` - Can browse and rent properties
- `LANDLORD` - Can list and manage properties
- `ADMIN` - Full system access and moderation

**Property Status:**
- `AVAILABLE` - Property is available for rent
- `UNAVAILABLE` - Property is not available

**Rental Request Status:**
- `PENDING` - Awaiting landlord decision
- `APPROVED` - Approved by landlord (ready for payment)
- `REJECTED` - Rejected by landlord
- `COMPLETED` - Rental completed successfully
- `CANCELLED` - Cancelled by tenant

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

1. **Register users** (POST `/api/v1/auth/register`) with roles: TENANT, LANDLORD, ADMIN
2. **Login** (POST `/api/v1/auth/login`) and save access token
3. **Create categories** as ADMIN (POST `/api/v1/categories`)
4. **Create properties** as LANDLORD (POST `/api/v1/properties`)
5. **Browse properties** as public user (GET `/api/v1/properties`) - no auth needed
6. **Submit rental request** as TENANT (POST `/api/v1/rentals`)
7. **Approve request** as LANDLORD (PATCH `/api/v1/rentals/:id/status`)
8. **Complete rental** as LANDLORD (PATCH `/api/v1/rentals/:id/status` with COMPLETED)
9. **Leave review** as TENANT (POST `/api/v1/reviews`)
10. **Check dashboards** as ADMIN (GET `/api/v1/admin/dashboard`) and LANDLORD (GET `/api/v1/landlord/stats`)

---

### ✅ Important Notes

- **Email Uniqueness:** Each user must have a unique email address
- **Property Availability:** Only AVAILABLE properties can receive rental requests
- **Review Restrictions:** Can only review properties with COMPLETED rentals
- **One Review Per Property:** Tenants can only leave one review per property
- **Request Cancellation:** Only PENDING requests can be cancelled by tenants
- **Landlord Authorization:** Landlords can only modify their own properties
- **Admin Override:** Admins can delete any property or review for moderation

---

### 🌍 Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/rentnest
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d
APP_URL=http://localhost:3000
```

---

## 🎯 Payment Feature (To Be Implemented)

For Stripe payment integration, you'll need:

1. Install: `npm install stripe`
2. Create `/src/modules/payments` module
3. Key endpoints:
   - `POST /api/v1/payments/create-intent` - Create payment after APPROVED rental
   - `POST /api/v1/payments/webhook` - Handle Stripe webhooks
   - `GET /api/v1/payments` - Get payment history
   - `GET /api/v1/payments/:id` - Get payment details

4. Environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

5. Payment flow:
   - Rental request APPROVED → Create payment intent → Tenant pays → Webhook confirms → Update rental to COMPLETED

---

**🏠 Happy Renting!**

**Documentation Version:** 1.0.0  
**Last Updated:** January 2026
