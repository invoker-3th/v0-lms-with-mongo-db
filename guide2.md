# Admin & Finance Account Creation Guide

## Recommendation
Admin and Finance accounts should **not** be created through the public signup UI.
Create them with a script or direct DB insert so you control access.

---

## Option A: Script (Recommended)
Use the included script `scripts/create-admin-finance.ts`.

### 1) Set environment
Ensure `.env.local` has:
- `MONGODB_URI`
- `MONGODB_DB` (optional, defaults to `learnhub`)

### 2) Create an Admin account
```bash
node scripts/create-admin-finance.ts --role admin --email admin@promptcareacademy.com --password "Admin@123" --name "Admin User"
```

### 3) Create a Finance account
```bash
node scripts/create-admin-finance.ts --role finance --email finance@promptcareacademy.com --password "Finance@123" --name "Finance User"
```

### 4) Log in
Use `/login` with the credentials.

---

## Option B: Manual DB Insert
Insert a document in `users` collection with:
- `email`, `name`, `role` (`admin` or `finance`)
- `password` (bcrypt hash)
- `emailVerified: true`
- `status: "active"`
- `enrolledCourses: []`
- `createdAt`, `updatedAt`

---

## Server-Side Enforcement
Public signup now rejects `admin` and `finance` roles with a 403.
