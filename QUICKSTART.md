# LearnHub LMS - Quick Start Guide

Get the complete Learning Management System up and running in 2 minutes.

## ⚡ Installation

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Visit http://localhost:3000
\`\`\`

**That's it!** The system is fully functional with mock data.

---

## 🔐 Login Credentials

Use these accounts to test different roles:

### Student Account
\`\`\`
Email: student@example.com
Password: Student@123
\`\`\`
**Test**: Browse courses → Add to cart → Checkout → Access dashboard

### Admin Account
\`\`\`
Email: admin@example.com
Password: Admin@123
\`\`\`
**Test**: Manage courses → View students → Check payments → Configure settings

### Instructor Account
\`\`\`
Email: instructor@example.com
Password: Instructor@123
\`\`\`
**Test**: Create courses → View enrollment stats → Download reports

### Finance Team
\`\`\`
Email: finance@example.com
Password: Finance@123
\`\`\`
**Test**: Monitor payments → Generate invoices → View financial reports

---

## 🎯 Complete User Journey (5 min test)

### 1. **New User Registration** (2 min)
- Click "Sign Up" on homepage
- Fill in name, email, password
- Verify password strength (min 8 chars, 1 uppercase, 1 number)
- Click "Create Account"

### 2. **Browse Courses** (1 min)
- Click "Courses" in navigation
- Search by keyword or filter by:
  - Category (Web Development, Design, etc.)
  - Level (Beginner, Intermediate, Advanced)
  - Price
  - Rating
- Click any course to see details

### 3. **Add to Cart & Checkout** (2 min)
- View course details with curriculum
- Click "Add to Cart"
- Go to cart (shopping icon) or click "Go to Checkout"
- Enter billing information
- Select payment method (mock Paystack)
- Click "Complete Purchase"
- See success confirmation

### 4. **Access Course** (Auto-enrolled)
- Go to `/dashboard`
- See "My Courses" section
- Click "Learn" on enrolled course
- Watch lesson video (simulated)
- Mark lesson as complete
- See progress updated

### 5. **Download Certificate** (After completion)
- Complete all lessons
- Go to `/dashboard/certificates`
- Download certificate (generates PDF)

---

## 👨‍💼 Admin Testing (3 min)

1. **Login as Admin**
   - Use admin credentials above
   - Redirects to `/admin` automatically

2. **View Dashboard**
   - See revenue trends
   - Student enrollment stats
   - Course performance

3. **Create New Course**
   - Go to "Courses" tab
   - Click "Create New Course"
   - Fill course details
   - Add curriculum modules
   - Set pricing
   - Publish course

4. **Manage Students**
   - Go to "Students" tab
   - View enrollment list
   - Check individual progress
   - Suspend/activate accounts

5. **Review Payments**
   - Go to "Payments" tab
   - Filter by status
   - Download invoices
   - View revenue reports

---

## 🧪 Test Different Scenarios

### Scenario 1: Complete Purchase as New User
\`\`\`
1. Homepage (/) → Register
2. Courses page (/courses) → Click a course
3. Course detail page → Add to cart
4. Cart page (/cart) → View items
5. Checkout (/checkout) → Enter details → Pay
6. Success page (/checkout/success) → See order
7. Dashboard (/dashboard) → See enrolled course
\`\`\`

### Scenario 2: Admin Creates Course
\`\`\`
1. Login with admin email
2. Auto-redirect to /admin
3. Click "Courses" → "Create New Course"
4. Fill: Title, Description, Price, Category
5. Add modules and lessons
6. Publish course
7. Course appears in /courses for students
\`\`\`

### Scenario 3: Student Completes Course
\`\`\`
1. Login as student
2. Go to /dashboard/courses
3. Click "Learn" on course
4. Go through lessons (click "Mark Complete")
5. See progress bar update
6. On 100% completion → Certificate ready
7. Go to /dashboard/certificates → Download
\`\`\`

---

## 📱 Features to Explore

### Public Pages
- **Home** (`/`) - Hero section, stats, featured courses
- **Courses** (`/courses`) - Searchable catalog with filters
- **About** (`/about`) - Company info and team
- **Contact** (`/contact`) - Contact form
- **FAQ** (`/faq`) - Common questions

### Student Areas
- **Dashboard** (`/dashboard`) - Overview and stats
- **My Courses** (`/dashboard/courses`) - Enrolled courses
- **Course Player** (`/dashboard/courses/[id]/learn`) - Video player and lessons
- **Certificates** (`/dashboard/certificates`) - Earned certificates
- **Payments** (`/dashboard/payments`) - Transaction history
- **Profile** (`/dashboard/profile`) - Personal settings
- **Cart** (`/cart`) - Shopping cart

### Admin Areas
- **Admin Home** (`/admin`) - Dashboard with analytics
- **Course Management** (`/admin/courses`) - CRUD operations
- **Student Management** (`/admin/students`) - Student list
- **Payment Tracking** (`/admin/payments`) - Transaction history
- **Settings** (`/admin/settings`) - Platform configuration

---

## 🎨 UI/UX Highlights

✅ **Professional Design**
- Deep blue color scheme for trust
- Smooth Framer Motion animations
- Responsive mobile-first layout
- Dark mode ready

✅ **User Experience**
- Quick-fill login buttons (for demo)
- Real-time cart updates
- Progress indicators
- Toast notifications
- Loading states
- Form validation

✅ **Performance**
- Server-side rendering (Next.js)
- Client components for interactivity
- Optimized images
- Code splitting

---

## 🔧 What's Under the Hood

### Technology Stack
- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Type Safety**: TypeScript
- **Validation**: Zod
- **Payments**: Mock Paystack

### Database
- **Current**: In-memory mock database (50+ courses, 10+ users)
- **To Upgrade**: MongoDB, PostgreSQL, or any SQL database

### API Routes
- All routes are fully functional
- Mock data persists in-memory
- Ready to connect to real database

---

## ⚠️ Important Notes

1. **Data Resets**: Refreshing the server will reset all mock data (this is expected behavior)
2. **No Real Charges**: All Paystack payments are simulated
3. **Mock Videos**: Video player is simulated (no real video playback yet)
4. **Mock Emails**: Email notifications are not sent
5. **All Features Work**: Every button, form, and flow is fully functional

---

## 🚀 Next Steps

### To Add Real Database
1. Set up MongoDB or PostgreSQL
2. Replace `lib/mock-db.ts` with real database queries
3. Update API routes to use real DB
4. Add environment variables for DB connection

### To Add Video Streaming
1. Upload courses to YouTube or AWS S3
2. Update course thumbnails and video URLs
3. Replace video player simulation with real playback

### To Go Live
1. Deploy to Vercel: `npm run build` → Push to GitHub → Deploy
2. Set up environment variables in Vercel
3. Configure real Paystack account
4. Set up email service (SendGrid)
5. Connect to production database

---

## 📞 Troubleshooting

### Pages Don't Load
- Check browser console for errors
- Ensure server is running: `npm run dev`
- Clear browser cache

### Buttons Don't Work
- Check network tab in Dev Tools
- Ensure JavaScript is enabled
- Try incognito mode

### Styles Look Wrong
- Clear browser cache
- Restart dev server
- Check CSS file is loaded

### Authentication Not Working
- Use exact email from credentials above
- Check spelling of password
- Clear cookies and try again

---

## 📊 Quick Stats

- **30+ Pages** - All fully functional
- **15+ API Endpoints** - Mock data ready
- **50+ Courses** - Pre-loaded and searchable
- **5 User Types** - Student, Admin, Instructor, Finance, Support
- **100% Responsive** - Works on desktop, tablet, mobile
- **Zero Configuration** - Run locally with `npm run dev`

---

## 🎓 Learning Value

This LMS demonstrates:
- Modern Next.js architecture
- Server and client component patterns
- API design and REST conventions
- Real-world app complexity
- Professional UI/UX implementation
- Role-based access control
- State management at scale
- Form handling and validation
- Payment flow integration

---

## 💡 Tips for Testing

1. **Use multiple browsers** - Test responsive design
2. **Test with different roles** - Try each login account
3. **Follow complete flows** - Register → Browse → Purchase → Learn
4. **Check mobile view** - Use browser dev tools (F12)
5. **Explore error states** - Try invalid inputs in forms

---

**Happy Learning! The system is ready to use.** 🎉

For detailed API documentation, see `docs/API.md`
For deployment guide, see `docs/DEPLOYMENT.md`
