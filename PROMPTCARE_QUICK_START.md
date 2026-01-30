# PromptCare Academy - Quick Start Guide

## Welcome to PromptCare Academy!

A premium, fully-functional Learning Management System with stunning brand identity and multi-currency payment support.

---

## Getting Started (2 Minutes)

### 1. Start the Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. You Should See
- ✨ **PromptCare Academy logo** in the header
- 🎨 **Teal, Purple, and Gold** brand colors
- 💱 **Currency selector** (USD, NGN, GBP) in the top right
- 📚 **50+ pre-loaded courses** ready to browse
- 🛒 **Shopping cart** with multi-currency pricing

---

## Test Accounts

### For Students
```
Email: student@promptcare.com
Password: Student@123
```
✅ Can browse courses, add to cart, and checkout

### For Administrators
```
Email: admin@promptcare.com
Password: Admin@123
```
✅ Can manage courses, students, payments, and view analytics

### For Instructors
```
Email: instructor@promptcare.com
Password: Instructor@123
```
✅ Can create and manage courses

### For Finance Team
```
Email: finance@promptcare.com
Password: Finance@123
```
✅ Can view revenue, payments, and financial reports

---

## Key Features to Try

### 1. Multi-Currency Shopping 🌍
1. Click the **currency selector** (USD/NGN/GBP) in the header
2. **Browse courses** - prices update instantly
3. **Add to cart** - see prices in your chosen currency
4. **Checkout** - complete mock payment in your currency

### 2. Course Browsing 📚
1. Click **"Courses"** in the navigation
2. Filter by category (Development, Design, Business, etc.)
3. Search for specific courses
4. Click any course to see full details
5. **"Enroll Now"** button uses your selected currency

### 3. Student Dashboard 👨‍🎓
1. Login as `student@promptcare.com`
2. Access **"My Courses"** to see enrolled courses
3. **Start learning** - watch mock video lessons
4. Track **progress** on the main dashboard
5. View **certificates** when you complete courses

### 4. Admin Dashboard 🔧
1. Login as `admin@promptcare.com`
2. View **revenue charts** in your preferred currency
3. Manage **courses** (create, edit, publish, delete)
4. Monitor **student enrollment** and progress
5. Check **payment transactions**

### 5. Payment System 💳
1. Add courses to cart
2. Go to checkout
3. Enter billing information
4. Select payment method (mock payment)
5. Confirm payment (90% success rate for demo)
6. View success page with receipt in your currency

---

## Currency System Details

### Supported Currencies

| Currency | Symbol | Format | Best For |
|----------|--------|--------|----------|
| **Nigerian Naira** | ₦ | ₦ 25,000 | Nigeria & West Africa |
| **US Dollar** | $ | $ 99.99 | International |
| **British Pound** | £ | £ 75.99 | UK & Europe |

### Example Pricing (Web Development Course)
- **₦ 25,000** (Nigerian Naira)
- **$ 99.99** (US Dollar)
- **£ 75.99** (British Pound)

### How to Use
1. **Select Currency**: Click dropdown in header (top right)
2. **All Prices Update**: Automatically convert to your currency
3. **Your Selection Saved**: Returns to your choice next time
4. **Checkout in Currency**: Payment processed in your selected currency

---

## Brand Colors & Design

### Primary Colors
- **Teal (#10B981)** - Trust, growth, main actions
- **Purple (#8B5CF6)** - Creativity, learning, accents
- **Gold (#F59E0B)** - Excellence, premium, achievements

### Where You'll See Them
- ✅ "Enroll Now" buttons are **teal**
- ✅ Course category icons use **purple**
- ✅ Top-rated courses have **gold** badges
- ✅ Success messages show in **green**
- ✅ Error messages show in **red**

### Logo
- **Full Logo**: "PromptCare Academy" with icon
- **Icon**: Small square logo (favicon, mobile nav)

---

## Complete Feature List

### Public Pages
- ✅ **Home** - Hero section with featured courses
- ✅ **Courses Catalog** - Browse 50+ courses with filters
- ✅ **Course Details** - Full course info with curriculum
- ✅ **About Us** - Company mission and team
- ✅ **Contact Us** - Contact form with validation
- ✅ **FAQ** - Frequently asked questions
- ✅ **Shopping Cart** - Add/remove courses, review total
- ✅ **Checkout** - Billing info, payment method selection

### Authentication
- ✅ **Login** - Secure login with validation
- ✅ **Register** - Create new account
- ✅ **Forgot Password** - Password reset flow
- ✅ **Role-Based Access** - Different dashboards per role

### Student Features
- ✅ **Dashboard** - Overview, stats, quick actions
- ✅ **My Courses** - All enrolled courses
- ✅ **Course Player** - Video player, lessons, progress tracking
- ✅ **Certificates** - Download earned certificates
- ✅ **Payment History** - View past transactions
- ✅ **Profile** - Edit personal info and settings

### Admin Features
- ✅ **Analytics Dashboard** - Revenue, students, growth charts
- ✅ **Course Management** - Create, edit, publish courses
- ✅ **Student Management** - View all students, manage accounts
- ✅ **Payment Management** - View transactions, generate reports
- ✅ **Settings** - Configure platform settings

### Technical Features
- ✅ **Mock Database** - 50+ courses, multiple users, payment history
- ✅ **Real-Time Cart** - Add/remove items, calculate totals
- ✅ **Multi-Currency** - NGN, USD, GBP with conversion
- ✅ **Progress Tracking** - Course completion, lesson progress
- ✅ **Search & Filter** - Find courses by category, level, price
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Animations** - Smooth transitions and interactions

---

## File Structure Quick Reference

```
PromptCare Academy/
│
├── app/
│   ├── (public)/              # Public pages
│   │   ├── page.tsx          # Home
│   │   ├── courses/          # Course catalog
│   │   ├── about/            # About page
│   │   └── contact/          # Contact page
│   ├── (auth)/               # Auth pages
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration
│   │   └── forgot-password/  # Password reset
│   ├── dashboard/            # Student dashboard
│   ├── admin/                # Admin dashboard
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout page
│   ├── api/                  # API endpoints
│   ├── globals.css           # Brand colors (TEAL #10B981)
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── ui/
│   │   ├── logo.tsx          # PromptCare logo
│   │   ├── currency-selector.tsx  # Currency picker
│   │   └── ...other components
│   └── layout/
│       ├── public-header.tsx  # Header with branding
│       └── ...layouts
│
├── lib/
│   ├── paystack.ts           # Multi-currency payment
│   ├── store.ts              # State management (currency)
│   ├── types.ts              # TypeScript types
│   └── mock-db.ts            # Test data & users
│
├── public/
│   ├── logo-promptcare.png   # Main logo
│   ├── logo-icon.png         # Icon/favicon
│   └── ...course images
│
└── docs/
    ├── BRAND_GUIDELINES.md       # Full brand guidelines
    ├── BRAND_IMPLEMENTATION.md   # Implementation details
    └── API.md                    # API documentation
```

---

## Tips for Testing

### 1. Try Different Currencies
- Select **NGN** and notice how all prices change to Nigerian Naira
- Try **USD** to see dollar pricing
- Switch back to verify your selection is saved

### 2. Test the Admin Dashboard
- Login as `admin@promptcare.com`
- View the **analytics** with revenue charts
- Try creating a new course
- Monitor student enrollments

### 3. Complete a Purchase Flow
1. **Browse courses** as a student
2. **Add several courses** to cart
3. **Change currency** to see updated total
4. **Proceed to checkout**
5. **Complete mock payment** (90% success rate)
6. **View confirmation** in your currency

### 4. Explore Student Learning
1. Login as student
2. Go to **dashboard**
3. Click into an **enrolled course**
4. **Play the video lesson** (mock video player)
5. **Mark lesson complete**
6. Watch **progress update**

### 5. Check Responsive Design
- Open on **desktop** (full navigation)
- Resize to **tablet** (some responsiveness)
- Check on **mobile** (full mobile menu)
- Notice currency selector works on all sizes

---

## Production Notes

### When Deploying to Production:
1. ✅ Replace mock payment with real **Paystack API**
2. ✅ Set real **Paystack API keys** in environment
3. ✅ Replace mock database with **MongoDB** or **PostgreSQL**
4. ✅ Implement real **authentication** (Auth.js, Supabase, etc.)
5. ✅ Add **email notifications** (transactional emails)
6. ✅ Set up **SSL certificates** for security
7. ✅ Configure **production domain** and **CORS**
8. ✅ Add **logging and monitoring** (Sentry, LogRocket)
9. ✅ Set up **error tracking** and **analytics**
10. ✅ Implement **backup and recovery** system

### API Endpoints Ready:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/courses` - Get all courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/payments/initialize` - Start payment
- `POST /api/payments/verify` - Verify payment
- `POST /api/enroll` - Enroll in course
- `GET /api/enrollments` - Get user enrollments

---

## Troubleshooting

### UI Not Displaying?
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Restart dev server: Stop and `npm run dev`

### Currency Not Changing?
1. Check currency selector in header (top right)
2. Ensure you're on `/courses` or product page
3. Try refreshing the page
4. Check browser console for errors

### Login Failing?
1. Verify correct email: `student@promptcare.com`
2. Use password: `Student@123` (case-sensitive)
3. Check caps lock is off
4. Clear browser storage and try again

### Payment Not Working?
1. Ensure you're logged in
2. Add at least one course to cart
3. Proceed to checkout
4. Fill in all billing fields
5. Click "Process Payment"
6. Success rate is 90% (sometimes fails for demo purposes)

### Mobile Issues?
1. Check browser zoom is 100%
2. Try different browser
3. Clear cache and cookies
4. Update browser to latest version

---

## Next Steps

### To Customize:
1. Open `/BRAND_GUIDELINES.md` for design rules
2. Edit colors in `/app/globals.css`
3. Update logo in `/public/logo-promptcare.png`
4. Modify test accounts in `/lib/mock-db.ts`
5. Add more courses in mock database

### To Deploy:
1. Read `/docs/DEPLOYMENT.md` for production setup
2. Set up real database connection
3. Configure payment gateway (Paystack)
4. Set environment variables
5. Deploy to Vercel or your hosting

### To Extend:
1. Add more courses to mock database
2. Implement real user authentication
3. Add email notifications
4. Create instructor dashboard
5. Add video hosting integration
6. Implement quiz system

---

## Support Resources

- 📚 **Full Documentation**: `/docs/API.md`
- 🎨 **Brand Guidelines**: `/BRAND_GUIDELINES.md`
- 🔧 **Implementation Guide**: `/BRAND_IMPLEMENTATION.md`
- 📋 **Status Checklist**: `/VERIFICATION_CHECKLIST.md`
- 📖 **System Overview**: `/SYSTEM_OVERVIEW.md`

---

## Questions?

If anything isn't working:
1. Check the **browser console** for errors (F12)
2. Verify you're using the **correct test credentials**
3. Ensure **node_modules** is installed (`npm install`)
4. Try **restarting** the dev server
5. Check the **documentation files** in `/docs`

**Welcome to PromptCare Academy!** 🎓✨
