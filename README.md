# RentNest - Property Rental Platform

A REST API backend for property rental management connecting tenants with landlords.

**Live URL:** `https://rentnest-ten.vercel.app`

## Overview

RentNest handles the complete rental workflow: tenants browse properties and submit rental requests, landlords approve or reject them, tenants pay through Stripe, and the rental becomes active. After the rental ends, landlords mark it as completed and tenants can leave reviews.

The system has three user roles: tenants (rent properties), landlords (list properties), and admins (manage platform).

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with httpOnly cookies, bcrypt for passwords
- **Payment:** Stripe with webhook integration
- **Validation:** Zod schemas

## Setup

Clone and install:
```bash
git clone <repository-url>
cd N_L_Assignment-4
npm install
```

Create `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/rentnest
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
BCRYPT_SALT_ROUNDS=your_number
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
PORT=8000
APP_URL=
```

Setup database:
```bash
npx prisma generate
npx prisma migrate dev
```

Run:
```bash
npm run dev          # Development
npm run build        # Build
npm start           # Production
```

## Stripe Webhook

Development:
```bash
stripe listen --forward-to localhost:8000/payments/webhook
```

Production: Add webhook URL in Stripe Dashboard with events: `checkout.session.completed`, `checkout.session.expired`, `customer.subscription.updated`

## Documentation

See `DOCUMENTATION.md` for complete API reference.

---

**Author:** Khandoker Shamimul Haque
