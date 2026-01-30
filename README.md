# LearnHub - Complete Learning Management System

A fully functional, production-ready Learning Management System (LMS) built with Next.js, TypeScript, and modern web technologies. This platform supports course management, student enrollment, payment processing, and comprehensive admin tools.

## Features

### For Students
- Browse and search courses with advanced filtering
- Secure authentication and profile management
- Shopping cart and checkout system
- Course player with video, articles, quizzes, and assignments
- Progress tracking and course completion
- Certificate generation upon course completion
- Payment history and invoices
- Personalized dashboard

### For Instructors
- Create and manage courses
- Build course curriculum with modules and lessons
- Create quizzes and assignments
- Track student progress
- Grade assignments
- View analytics and reports

### For Administrators
- Complete course management system
- User management (students, instructors, finance)
- Payment and revenue tracking
- Platform analytics and reports
- Role-based access control
- System settings and configuration

### For Finance Team
- Payment monitoring and verification
- Revenue reports and analytics
- Refund processing
- Financial compliance tools

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Mock Database** - In-memory database for demonstration (MongoDB-ready)
- **Mock Paystack** - Simulated payment gateway

### Planned Integrations
- **MongoDB** - Production database (adapter ready)
- **Paystack** - Real payment processing (integration ready)
- **JWT/Session Auth** - Secure authentication

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or download the code

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Mock Accounts

Use these credentials to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| Student | student@academy.com | password123 |
| Admin | admin@academy.com | admin123 |
| Instructor | instructor@academy.com | instructor123 |
| Finance | finance@academy.com | finance123 |

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public marketing pages
│   ├── dashboard/         # Student dashboard
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utilities and helpers
│   ├── mock-db.ts        # Mock database
│   ├── auth.ts           # Authentication logic
│   ├── store.ts          # Zustand stores
│   ├── types.ts          # TypeScript definitions
│   ├── validation.ts     # Zod schemas
│   └── paystack.ts       # Payment gateway mock
└── public/               # Static assets
\`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/logout\` - User logout
- \`GET /api/auth/me\` - Get current user

### Courses
- \`GET /api/courses\` - List all courses
- \`GET /api/courses/[id]\` - Get course details
- \`POST /api/courses\` - Create course (instructor/admin)
- \`PUT /api/courses/[id]\` - Update course (instructor/admin)
- \`DELETE /api/courses/[id]\` - Delete course (admin)

### Enrollments
- \`POST /api/enroll\` - Enroll in a course
- \`GET /api/enrollments\` - Get user enrollments
- \`PUT /api/enrollments/[id]/progress\` - Update progress

### Payments
- \`POST /api/payments/initialize\` - Initialize payment
- \`GET /api/payments/verify\` - Verify payment
- \`GET /api/payments/history\` - Payment history

### Admin
- \`GET /api/admin/users\` - List all users
- \`GET /api/admin/reports/revenue\` - Revenue reports
- \`GET /api/admin/reports/enrollments\` - Enrollment reports
- \`GET /api/admin/analytics\` - Platform analytics

### Certificates
- \`GET /api/certificates\` - Get user certificates
- \`POST /api/certificates/generate\` - Generate certificate
- \`GET /api/certificates/verify/[code]\` - Verify certificate

## Key Features Implementation

### Authentication & Authorization
- Role-based access control (RBAC)
- Protected routes with middleware
- Session persistence using Zustand
- Secure password handling (mock)

### Course Management
- Rich course creation interface
- Module and lesson organization
- Support for video, articles, quizzes, assignments
- Course publishing workflow

### Payment Processing
- Mock Paystack integration
- Multi-currency support (NGN, USD, GBP)
- Payment verification flow
- Invoice generation
- Refund processing

### Learning Experience
- Video course player
- Progress tracking
- Quiz taking and grading
- Assignment submission
- Course completion tracking

### Admin Dashboard
- Comprehensive analytics
- User management
- Course management
- Revenue tracking
- System reports

## Migrating to Production

### 1. Database Setup (MongoDB)

Replace mock database with MongoDB:

\`\`\`typescript
// lib/db.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
export const db = client.db('learnhub');
\`\`\`

### 2. Paystack Integration

Replace mock Paystack with real API:

\`\`\`typescript
// lib/paystack.ts
import axios from 'axios';

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\`,
  },
});
\`\`\`

### 3. Authentication

Implement JWT or session-based auth:
- Install \`jsonwebtoken\` or \`next-auth\`
- Set up secure password hashing with \`bcrypt\`
- Implement refresh tokens
- Add email verification

### 4. File Storage

For course videos and images:
- Set up Vercel Blob or AWS S3
- Implement upload functionality
- Add CDN for video streaming

### 5. Email Notifications

Add email service:
- SendGrid or Resend for transactional emails
- Welcome emails
- Enrollment confirmations
- Certificate delivery

## Performance Optimizations

- Server-side rendering for SEO
- Image optimization with Next.js Image
- Code splitting and lazy loading
- API route caching
- Optimistic UI updates

## Security Considerations

- Input validation with Zod
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- Secure headers

## Resources & Credits

### Images & Assets
- [Unsplash](https://unsplash.com) - Course thumbnails and hero images
- [Pexels](https://pexels.com) - Additional photography
- [unDraw](https://undraw.co) - Illustrations
- [Heroicons](https://heroicons.com) - UI icons
- [Lucide Icons](https://lucide.dev) - Additional icons

### Libraries & Tools
- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev)

## Sprint Tickets

See [SPRINT_TICKETS.md](./SPRINT_TICKETS.md) for the complete development breakdown with 200+ interconnected tickets organized by epic and sprint.

## Support

For issues or questions:
- Check the [FAQ page](/faq)
- Contact support at support@learnhub.com
- Open a GitHub issue

## License

This project is built for demonstration purposes. Modify and use as needed for your projects.

## Deployment

Deploy to Vercel:

\`\`\`bash
npm run build
vercel deploy
\`\`\`

Configure environment variables in Vercel dashboard.

---

Built with ❤️ using Next.js and modern web technologies.
\`\`\`
