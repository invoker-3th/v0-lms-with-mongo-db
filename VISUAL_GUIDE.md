# LearnHub LMS - Visual System Guide

## System Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     LearnHub LMS System                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐      ┌──────────────────────┐
│   PUBLIC PAGES       │      │   AUTHENTICATED      │
│  (Everyone)          │      │    USER PAGES        │
├──────────────────────┤      ├──────────────────────┤
│ • Home /             │      │ • Dashboard          │
│ • Courses /courses   │      │ • My Courses         │
│ • Course Detail      │      │ • Course Player      │
│ • About /about       │      │ • Certificates       │
│ • Contact /contact   │      │ • Payments           │
│ • FAQ /faq           │      │ • Profile            │
└──────────────────────┘      └──────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
    ┌──────────────┐          ┌──────────────────┐
    │ Auth Pages   │          │ Shopping Flow    │
    ├──────────────┤          ├──────────────────┤
    │ • Login      │          │ • Cart           │
    │ • Register   │          │ • Checkout       │
    │ • Forgot PW  │          │ • Payment        │
    └──────────────┘          │ • Success        │
                              └──────────────────┘
                                      │
                                      ▼
                              ┌──────────────────┐
                              │ ADMIN PAGES      │
                              ├──────────────────┤
                              │ • Dashboard      │
                              │ • Courses        │
                              │ • Students       │
                              │ • Payments       │
                              │ • Settings       │
                              └──────────────────┘
\`\`\`

---

## Complete User Journey

### Student Path

\`\`\`
┌─────────────┐
│   Home      │
│   Page      │
│     /       │
└──────┬──────┘
       │
       ▼
   ┌───────────────┐
   │   Register    │
   │  /auth/       │
   │  register     │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │   Browse      │
   │   Courses     │
   │  /courses     │
   └───────┬───────┘
           │
           ▼
   ┌──────────────────┐
   │  Course Detail   │
   │  /courses/[slug] │
   └───────┬──────────┘
           │
           ▼
   ┌───────────────────┐
   │ Add to Cart       │
   │ (Shopping Cart    │
   │  Updated)         │
   └───────┬───────────┘
           │
           ▼
   ┌───────────────────┐
   │   Checkout        │
   │   /checkout       │
   └───────┬───────────┘
           │
           ▼
   ┌───────────────────┐
   │  Pay (Mock)       │
   │  Verify Payment   │
   └───────┬───────────┘
           │
           ▼
   ┌───────────────────┐
   │   Success Page    │
   │  /checkout/       │
   │  success          │
   └───────┬───────────┘
           │
           ▼
   ┌──────────────────┐
   │ Access Course    │
   │ /dashboard/      │
   │ courses/[id]/    │
   │ learn            │
   └──────┬───────────┘
          │
          ▼
  ┌────────────────┐
  │ Complete       │
  │ Lessons &      │
  │ Get Certificate│
  └────────────────┘
\`\`\`

### Admin Path

\`\`\`
┌──────────────┐
│  Login as    │
│  Admin       │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  /admin          │
│  Dashboard       │
│  (Analytics)     │
└──────┬───────────┘
       │
       ├─────────────────────┬─────────────────────┐
       ▼                     ▼                     ▼
   ┌────────┐         ┌──────────┐         ┌──────────┐
   │ Manage │         │  Manage  │         │ Manage   │
   │ Courses│         │ Students │         │Payments  │
   └────────┘         └──────────┘         └──────────┘
       │                   │                     │
       ├─ Create          ├─ View List      ├─ See All
       ├─ Edit            ├─ View Progress  │  Transactions
       ├─ Publish         ├─ Suspend        ├─ Filter
       ├─ Delete          └─ Reset Password │  By Status
       └─ View Stats                        └─ Export
                              │
                              ▼
                         ┌──────────┐
                         │ Settings │
                         └──────────┘
\`\`\`

---

## Data Flow Architecture

\`\`\`
┌────────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
│  Pages → Components → State (Zustand) → UI                │
└────────────────────────────────────────────────────────────┘
                           ▲
                           │
                    API Calls (Fetch)
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                   API Routes                               │
│  /api/auth         /api/courses     /api/enrollments      │
│  /api/payments     /api/users       /api/admin            │
└────────────────────────────────────────────────────────────┘
                           ▲
                           │
                    Data Operations
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                  Mock Database                             │
│  lib/mock-db.ts                                            │
│  • Courses                                                 │
│  • Users                                                   │
│  • Enrollments                                             │
│  • Payments                                                │
│  • Certificates                                            │
│  • Progress Records                                        │
└────────────────────────────────────────────────────────────┘
\`\`\`

---

## State Management Flow

\`\`\`
┌─────────────────────────────────────────┐
│     Global State (Zustand Stores)       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ Auth Store   │  │ Cart Store   │   │
│  ├──────────────┤  ├──────────────┤   │
│  │ • user       │  │ • items      │   │
│  │ • token      │  │ • total      │   │
│  │ • isLogged   │  │ • add()      │   │
│  │ • login()    │  │ • remove()   │   │
│  │ • logout()   │  │ • clear()    │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Preferences Store                │  │
│  ├──────────────────────────────────┤  │
│  │ • currency                       │  │
│  │ • theme                          │  │
│  │ • language                       │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
         ▲              ▲              ▲
         │              │              │
    Pages & Components access state
\`\`\`

---

## Component Hierarchy

\`\`\`
RootLayout
├── Metadata
├── Fonts (Geist)
├── Global Styles
└── {children}
    │
    ├── PublicLayout (for /public/* routes)
    │   ├── AnimatedBackground
    │   ├── PublicHeader
    │   │   ├── Logo
    │   │   ├── Navigation
    │   │   ├── CartIcon
    │   │   └── Auth Controls
    │   ├── Main Content
    │   └── PublicFooter
    │
    ├── AuthLayout (for /auth/* routes)
    │   └── Auth Forms
    │
    ├── DashboardLayout (for /dashboard/* routes)
    │   ├── DashboardHeader
    │   ├── DashboardSidebar
    │   └── Dashboard Content
    │
    ├── AdminLayout (for /admin/* routes)
    │   ├── AdminHeader
    │   ├── AdminSidebar
    │   └── Admin Content
    │
    └── Cart/Checkout Layout
        └── Content
\`\`\`

---

## API Endpoint Map

\`\`\`
Authentication
├── POST /api/auth/login
├── POST /api/auth/register
├── GET /api/auth/me
└── POST /api/auth/logout

Courses
├── GET /api/courses
├── GET /api/courses/[id]
├── POST /api/courses
├── PUT /api/courses/[id]
└── DELETE /api/courses/[id]

Enrollments
├── GET /api/enrollments
├── POST /api/enrollments
├── GET /api/enrollments/[id]
└── PUT /api/enrollments/[id]/progress

Payments
├── POST /api/payments/initialize
└── GET /api/payments/verify

Admin
├── GET /api/admin/stats
├── GET /api/admin/students
└── GET /api/admin/analytics
\`\`\`

---

## Database Schema

\`\`\`
USERS
├── id (string)
├── name (string)
├── email (string)
├── password (hashed)
├── role (enum: student|admin|instructor|finance)
├── avatar (url)
├── createdAt (date)
└── updatedAt (date)

COURSES
├── id (string)
├── title (string)
├── slug (string)
├── description (string)
├── price (object: {USD, EUR, GBP, NGN})
├── category (string)
├── level (enum: beginner|intermediate|advanced)
├── instructor (object: {id, name, avatar})
├── thumbnail (url)
├── rating (number)
├── enrollmentCount (number)
├── modules (array)
│   └── lessons (array)
└── createdAt (date)

ENROLLMENTS
├── id (string)
├── userId (string)
├── courseId (string)
├── enrolledAt (date)
├── progress (number: 0-100)
├── completedLessons (array)
├── completedAt (date|null)
├── certificateIssued (boolean)
└── certificateId (string|null)

PAYMENTS
├── id (string)
├── userId (string)
├── courseId (string)
├── amount (number)
├── currency (string)
├── status (enum: pending|completed|failed)
├── transactionId (string)
├── paidAt (date)
└── invoiceUrl (url)

CERTIFICATES
├── id (string)
├── enrollmentId (string)
├── userId (string)
├── courseId (string)
├── issuedAt (date)
├── certificateUrl (url)
└── verificationCode (string)
\`\`\`

---

## Page Layout Map

\`\`\`
PUBLIC PAGES
├── Home /
│   ├── Hero Section
│   ├── Stats
│   ├── Features
│   └── Featured Courses
│
├── Courses /courses
│   ├── Search Bar
│   ├── Filters
│   └── Course Grid
│
├── Course Detail /courses/[slug]
│   ├── Header
│   ├── Video/Thumbnail
│   ├── Details Panel
│   ├── Curriculum
│   ├── Reviews
│   └── Related Courses
│
├── About /about
│   ├── Mission
│   ├── Team
│   └── Achievements
│
├── Contact /contact
│   ├── Form
│   ├── Info
│   └── Map
│
└── FAQ /faq
    ├── Search
    └── Accordion

STUDENT PAGES
├── Dashboard /dashboard
│   ├── Welcome
│   ├── Stats
│   └── Course List
│
├── My Courses /dashboard/courses
│   ├── Course Cards
│   ├── Progress Bars
│   └── Filters
│
├── Course Player /dashboard/courses/[id]/learn
│   ├── Video Player
│   ├── Curriculum Sidebar
│   └── Lesson Content
│
├── Certificates /dashboard/certificates
│   ├── Certificate List
│   └── Download Buttons
│
├── Payments /dashboard/payments
│   ├── Transaction List
│   ├── Filters
│   └── Invoice Downloads
│
└── Profile /dashboard/profile
    ├── Personal Info Tab
    ├── Security Tab
    └── Preferences Tab

ADMIN PAGES
├── Dashboard /admin
│   ├── Metrics
│   ├── Charts
│   └── Recent Activity
│
├── Courses /admin/courses
│   ├── Course Table
│   ├── Search & Filter
│   └── Action Buttons
│
├── Students /admin/students
│   ├── Student Table
│   ├── Search & Filter
│   └── Management Tools
│
├── Payments /admin/payments
│   ├── Transaction Table
│   ├── Filters
│   └── Reports
│
└── Settings /admin/settings
    ├── Platform Config
    ├── Email Settings
    ├── Payment Settings
    └── Feature Toggles
\`\`\`

---

## Feature Implementation Checklist

\`\`\`
✅ COMPLETED FEATURES
├── Authentication System
│   ├── ✅ Login/Register
│   ├── ✅ Password Reset
│   ├── ✅ Session Management
│   └── ✅ Role-Based Access
│
├── Course Management
│   ├── ✅ Browse Courses
│   ├── ✅ Search & Filter
│   ├── ✅ Course Details
│   ├── ✅ Curriculum View
│   └── ✅ Admin Course CRUD
│
├── Shopping & Payments
│   ├── ✅ Shopping Cart
│   ├── ✅ Checkout Form
│   ├── ✅ Mock Paystack
│   ├── ✅ Order Confirmation
│   └── ✅ Invoice Generation
│
├── Student Dashboard
│   ├── ✅ My Courses
│   ├── ✅ Course Player
│   ├── ✅ Progress Tracking
│   ├── ✅ Certificate Download
│   ├── ✅ Payment History
│   └── ✅ Profile Settings
│
├── Admin Dashboard
│   ├── ✅ Analytics
│   ├── ✅ Course Management
│   ├── ✅ Student Management
│   ├── ✅ Payment Tracking
│   └── ✅ Settings
│
└── General
    ├── ✅ Responsive Design
    ├── ✅ Form Validation
    ├── ✅ Error Handling
    ├── ✅ Loading States
    ├── ✅ Animations
    └── ✅ Documentation

⚠️ PARTIAL IMPLEMENTATION
├── Video Streaming (UI only, no real video)
├── Quizzes (Not implemented)
└── Discussion Forums (Not implemented)

❌ NOT IMPLEMENTED
├── Real Database
├── Real Payments
├── Email Notifications
└── Live Classes
\`\`\`

---

## Technology Stack Visualization

\`\`\`
┌─────────────────────────────────────────┐
│          Frontend Layer                 │
├─────────────────────────────────────────┤
│ • React 19.2 (Components)               │
│ • Next.js 16 (Framework)                │
│ • Tailwind CSS v4 (Styling)             │
│ • Framer Motion (Animations)            │
└─────────────────────────────────────────┘
                   ▲
                   │
┌─────────────────────────────────────────┐
│      State Management Layer              │
├─────────────────────────────────────────┤
│ • Zustand (Global State)                │
│ • React Hooks (Local State)             │
│ • Context API (Ready)                   │
└─────────────────────────────────────────┘
                   ▲
                   │
┌─────────────────────────────────────────┐
│         Backend Layer                   │
├─────────────────────────────────────────┤
│ • Next.js API Routes (Server)           │
│ • TypeScript (Type Safety)              │
│ • Zod (Validation)                      │
└─────────────────────────────────────────┘
                   ▲
                   │
┌─────────────────────────────────────────┐
│         Data Layer                      │
├─────────────────────────────────────────┤
│ • Mock Database (In-Memory)             │
│ • Ready for: MongoDB, PostgreSQL, etc. │
└─────────────────────────────────────────┘
\`\`\`

---

## Role-Based Access Control

\`\`\`
PUBLIC
├── View Home Page
├── View Course Catalog
├── View Course Details
└── Login/Register

STUDENT
├── Everything Public +
├── Access Dashboard
├── Enroll in Courses
├── Access Course Materials
├── Track Progress
├── Download Certificates
└── Manage Profile

INSTRUCTOR
├── Everything Student +
├── Create Courses
├── Manage Own Courses
├── View Student Progress
└── Access Analytics

ADMIN
├── Everything +
├── Manage All Courses
├── Manage All Students
├── View All Payments
├── Access Settings
└── View Full Analytics

FINANCE
├── View Payments
├── Generate Reports
└── Export Data
\`\`\`

---

## File Size & Count Summary

\`\`\`
Code Files
├── Pages: 30+
├── Components: 50+
├── API Routes: 15+
├── Library Files: 10+
├── Config Files: 5+
└── Total: 110+ files

Documentation
├── Main Guides: 6 files
├── Technical Docs: 3 files
├── Support Docs: 2 files
└── Total: 11 files

Configuration
├── TypeScript: 1 file
├── Tailwind: 1 file
├── Next.js: 1 file
├── Package Manager: 1 file
└── Total: 4 files

Assets
├── Course Images: 50+
├── Avatar Images: 10+
├── Icons: 50+ (Lucide)
└── Total: 110+ assets
\`\`\`

---

## Deployment Architecture

\`\`\`
┌─────────────────────────────────────────┐
│          Your Local Machine              │
│  npm install && npm run dev             │
└─────────────────────────────────────────┘
           ▲
           │ Push to GitHub
           │
┌─────────────────────────────────────────┐
│          GitHub Repository               │
│  Version Control & Backup               │
└─────────────────────────────────────────┘
           ▲
           │ Deploy
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐   ┌────────────┐
│ Vercel │   │   AWS/    │
│(Easy)  │   │ Others    │
└────────┘   └────────────┘
\`\`\`

---

## Performance Optimization Map

\`\`\`
Frontend Performance
├── Code Splitting (Next.js automatic)
├── Image Optimization (Next Image)
├── Font Optimization (Geist fonts)
├── CSS Minification (Tailwind)
├── JavaScript Tree-shaking
└── Lazy Loading Components

Backend Performance
├── Route Caching (Next.js)
├── API Response Optimization
├── Database Query Optimization (ready)
├── Compression (gzip)
└── CDN Ready (Vercel)

UX Performance
├── Loading States
├── Optimistic Updates (cart)
├── Progressive Enhancement
└── Fallback UI
\`\`\`

---

**This visual guide shows how everything connects together!** 🚀

Print this or reference it while exploring the codebase.
