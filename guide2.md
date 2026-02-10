# Admin & Finance Account Creation Guide

## Recommendation
Admin and Finance accounts should **not** be created through the public signup UI.
Use the `/login-admin` page (admin-only) and the Admin Dashboard modal, or the script to control access.

---

## Option A: Admin UI (Recommended for ongoing use)
Admins can create more admin/finance accounts from the admin-only UI.

### 1) Bootstrap admin credentials
Set these in `.env.local`:
- `BOOTSTRAP_ADMIN_EMAIL=spacecontactme0@gmail.com`
- `BOOTSTRAP_ADMIN_PASSWORD=admin1@4567`

### 2) Log in as bootstrap admin
Go to `/login-admin` and use the bootstrap credentials.
This account bypasses OTP.

### 3) Create accounts in the UI
Open the Admin Dashboard and use the **Create Admin/Finance** modal.
New users can log in and change their password from the Profile page.

---

## Option B: Script (Recommended for initial bootstrap or recovery)
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

## Option C: Manual DB Insert
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

---

## Prevent Secrets From Being Pushed to GitHub
`.env.local` already matches `.env*` in `.gitignore`, so it should not be committed.

If it was already committed in the past, untrack it once:
```bash
git rm --cached .env.local
git commit -m "Stop tracking .env.local"
```

If you want to keep a safe template, only commit `.env.example` (no secrets).
