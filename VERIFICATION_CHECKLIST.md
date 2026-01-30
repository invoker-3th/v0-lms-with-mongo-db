# LearnHub LMS - Verification Checklist

Use this checklist to verify your system is working correctly.

---

## 🔧 Installation Verification

- [ ] Node.js installed (`node --version` → 18.17+)
- [ ] npm installed (`npm --version` → 9.0+)
- [ ] Project extracted/cloned
- [ ] `npm install` completed without errors
- [ ] `.next` folder doesn't exist (fresh start)
- [ ] No red errors in terminal

---

## ▶️ Server Startup

\`\`\`bash
npm run dev
\`\`\`

Verify:
- [ ] Terminal shows: "▲ Next.js 16.x.x"
- [ ] Terminal shows: "✓ Ready in XXms"
- [ ] Terminal shows: "Local: http://localhost:3000"
- [ ] No errors in console output
- [ ] Server ready within 30 seconds

---

## 🌐 Homepage (`http://localhost:3000`)

**Visual Checks:**
- [ ] Page loads without blank white screen
- [ ] LearnHub logo visible in header
- [ ] Navigation menu visible (Home, Courses, About, Contact)
- [ ] Hero section with large heading
- [ ] Featured courses section with course cards
- [ ] Stats section (10,000+ students, etc.)
- [ ] Footer visible at bottom
- [ ] Animated background visible (subtle gradient orbs)

**Functional Checks:**
- [ ] Click "Courses" → Routes to `/courses`
- [ ] Click "About" → Routes to `/about`
- [ ] Click "Contact" → Routes to `/contact`
- [ ] Click logo → Routes back to `/`
- [ ] Click "Browse Courses" button → Routes to `/courses`
- [ ] Click "Start Free Trial" button → Routes to `/register`
- [ ] Click course card → Routes to course detail page

**Mobile Check** (F12 → Toggle Device Toolbar):
- [ ] Layout responsive on mobile
- [ ] Menu button appears on mobile (hamburger icon)
- [ ] Text readable on small screens
- [ ] Buttons clickable (not too small)

---

## 🏫 Courses Page (`/courses`)

**Visual Checks:**
- [ ] Page title "All Courses" visible
- [ ] Course grid visible with course cards
- [ ] Each card shows course thumbnail, title, price, rating
- [ ] Search bar visible
- [ ] Filter section visible (Category, Level, Price)
- [ ] Sort dropdown visible

**Functional Checks:**
- [ ] Type in search box → Results filter
- [ ] Click category filter → Results filter
- [ ] Click level filter → Results filter  
- [ ] Drag price slider → Results filter
- [ ] Click sort dropdown → Order changes
- [ ] Click a course card → Routes to detail page
- [ ] Pagination works (if more than 12 courses)

**Courses Visible:**
- [ ] Can see "Web Development" course
- [ ] Can see "UI/UX Design" course
- [ ] Can see "Digital Marketing" course
- [ ] Can see at least 10 courses

---

## 📖 Course Detail Page (`/courses/[slug]`)

**Visual Checks:**
- [ ] Course title prominent
- [ ] Course thumbnail/image visible
- [ ] Course description visible
- [ ] Price displayed
- [ ] "Add to Cart" button visible
- [ ] Instructor info visible with avatar
- [ ] Curriculum accordion visible (modules listed)
- [ ] Student reviews section visible
- [ ] Rating and student count visible

**Functional Checks:**
- [ ] Click curriculum module → Expands/collapses
- [ ] Click "Add to Cart" → Item added (success notification)
- [ ] Shopping cart icon updates with count
- [ ] Can scroll through entire page

---

## 🔐 Login Page (`/auth/login`)

**Visual Checks:**
- [ ] Page title "Sign In" visible
- [ ] Email input field
- [ ] Password input field
- [ ] "Sign In" button
- [ ] "Forgot Password" link
- [ ] "Create Account" link
- [ ] Demo buttons visible (for testing)

**Functional Checks:**
- [ ] Type email → Input accepts text
- [ ] Type password → Input hides text
- [ ] Click "Sign In" with empty fields → Error
- [ ] Click demo student button → Fields auto-fill
- [ ] Click "Sign In" → Routes to dashboard
- [ ] Click "Create Account" → Routes to register page
- [ ] Click "Forgot Password" → Routes to forgot password page

---

## 📝 Register Page (`/auth/register`)

**Visual Checks:**
- [ ] Page title "Create Account" visible
- [ ] Name input field
- [ ] Email input field
- [ ] Password input field
- [ ] Confirm password field
- [ ] Password strength indicator
- [ ] Terms checkbox
- [ ] "Create Account" button

**Functional Checks:**
- [ ] Type name → Input accepts
- [ ] Type email → Input accepts
- [ ] Type password → Shows strength (weak/medium/strong)
- [ ] Type confirm password → Matches password
- [ ] Empty fields → Shows error
- [ ] Weak password → Shows warning
- [ ] Valid data → Can submit
- [ ] After register → Auto-login and route to dashboard

---

## 🛒 Shopping Cart (`/cart`)

**Visual Checks:**
- [ ] Cart page loads
- [ ] Added courses visible in cart
- [ ] Each item shows: course name, price, instructor
- [ ] Remove button for each item
- [ ] Cart summary shows subtotal and total
- [ ] "Proceed to Checkout" button visible

**Functional Checks:**
- [ ] Click remove → Item removed from cart
- [ ] Total updates when item removed
- [ ] Click "Proceed to Checkout" → Routes to checkout
- [ ] Can add another course from homepage
- [ ] Cart persists (add from catalog, check in cart)

---

## 💳 Checkout Page (`/checkout`)

**Visual Checks:**
- [ ] Billing information form visible
- [ ] Form fields: Email, Name, Address, City, Zip, Country
- [ ] Order summary on right side
- [ ] Course list in summary
- [ ] Price breakdown (subtotal, tax, total)
- [ ] Payment method selection (mock options)
- [ ] "Complete Purchase" button

**Functional Checks:**
- [ ] Enter invalid email → Error message
- [ ] Enter missing fields → Can't submit
- [ ] Enter valid info → "Complete Purchase" clickable
- [ ] Click "Complete Purchase" → Routes to verification page
- [ ] Mock payment processes → Success page

---

## ✅ Payment Success Page (`/checkout/success`)

**Visual Checks:**
- [ ] Success message visible
- [ ] Order confirmation details
- [ ] Order ID and date
- [ ] Course access instructions
- [ ] "Go to Dashboard" button
- [ ] "Continue Shopping" button
- [ ] Invoice download option

**Functional Checks:**
- [ ] Click "Go to Dashboard" → Routes to `/dashboard`
- [ ] Click "Continue Shopping" → Routes to `/courses`
- [ ] Course should be in enrolled courses
- [ ] Enrollment created in database

---

## ❌ Payment Failed Page (`/checkout/failed`)

**Functional Checks:**
- [ ] Can trigger by canceling payment
- [ ] Error message displayed
- [ ] "Try Again" button routes back to checkout
- [ ] "Browse Courses" button works

---

## 📚 Student Dashboard (`/dashboard`)

**Visual Checks:**
- [ ] Welcome message with user name
- [ ] Dashboard stats visible:
  - [ ] Courses enrolled count
  - [ ] Completion percentage
  - [ ] Hours learned
  - [ ] Current streak
- [ ] "My Courses" section with enrolled courses
- [ ] Each course card shows progress bar
- [ ] Sidebar with navigation menu visible
- [ ] User avatar/dropdown in top right

**Functional Checks:**
- [ ] Click "My Courses" in sidebar → Routes to courses page
- [ ] Click course card → Can access course
- [ ] Click "Continue Learning" → Routes to course player
- [ ] Click "Profile" → Routes to profile page
- [ ] Click user avatar → Shows logout option

---

## 📖 My Courses Page (`/dashboard/courses`)

**Visual Checks:**
- [ ] List of enrolled courses
- [ ] Each course shows:
  - [ ] Thumbnail
  - [ ] Title
  - [ ] Progress bar
  - [ ] Completion percentage
  - [ ] "Learn" button
- [ ] Filter/sort options if any

**Functional Checks:**
- [ ] Click "Learn" button → Routes to course player
- [ ] All enrolled courses visible

---

## 🎥 Course Player (`/dashboard/courses/[id]/learn`)

**Visual Checks:**
- [ ] Video player visible (simulated)
- [ ] Course title and section name
- [ ] Curriculum sidebar on left/right
  - [ ] Module list
  - [ ] Lesson list under modules
  - [ ] Current lesson highlighted
  - [ ] Checkmarks for completed lessons
- [ ] Progress bar for course
- [ ] "Mark as Complete" button
- [ ] Previous/Next lesson buttons
- [ ] Resource list

**Functional Checks:**
- [ ] Click lesson in sidebar → Updates video area
- [ ] Click "Mark as Complete" → Lesson marked
- [ ] Progress bar updates
- [ ] Click next lesson → Advances to next
- [ ] Can navigate back to previous lesson
- [ ] Sidebar closes on mobile (responsive)

---

## 🏆 Certificates Page (`/dashboard/certificates`)

**Visual Checks:**
- [ ] Page shows earned certificates
- [ ] Certificate name and completion date
- [ ] Certificate preview/thumbnail
- [ ] Download button

**Functional Checks:**
- [ ] Click download → Certificate file generated
- [ ] After completing course, cert appears here

---

## 💰 Payments Page (`/dashboard/payments`)

**Visual Checks:**
- [ ] List of transactions
- [ ] Columns: Course, Amount, Date, Status
- [ ] Filter options by status
- [ ] Search by course name

**Functional Checks:**
- [ ] Filter by status works
- [ ] Search works
- [ ] Can see paid courses in list
- [ ] Invoice download button works

---

## 👤 Profile Page (`/dashboard/profile`)

**Visual Checks:**
- [ ] Tabs visible: Personal Info, Security, Preferences
- [ ] Personal Info tab shows:
  - [ ] Name field
  - [ ] Email (read-only)
  - [ ] Phone field
  - [ ] Bio field
- [ ] Security tab shows:
  - [ ] Current password
  - [ ] New password
  - [ ] Confirm password
- [ ] Preferences tab shows:
  - [ ] Currency selector
  - [ ] Email notifications toggle
  - [ ] Theme preference

**Functional Checks:**
- [ ] Can switch between tabs
- [ ] Can edit name
- [ ] Can change password
- [ ] Can change currency preference
- [ ] Changes save

---

## 👨‍💼 Admin Dashboard (`/admin`)

**Before Testing:** Logout and login with admin@example.com / Admin@123

**Visual Checks:**
- [ ] Admin dashboard homepage
- [ ] Key metrics displayed:
  - [ ] Total revenue
  - [ ] New students
  - [ ] Published courses
  - [ ] Average rating
- [ ] Charts visible (revenue, enrollments)
- [ ] Recent transactions list
- [ ] Sidebar navigation with admin sections

**Functional Checks:**
- [ ] Click "Courses" → Routes to course management
- [ ] Click "Students" → Routes to student list
- [ ] Click "Payments" → Routes to payment history
- [ ] Click "Settings" → Routes to settings page

---

## 🎓 Admin Course Management (`/admin/courses`)

**Visual Checks:**
- [ ] Table of all courses
- [ ] Columns: Title, Instructor, Students, Rating, Status
- [ ] "Create New Course" button
- [ ] Search and filter options
- [ ] Action buttons (Edit, Delete, etc.)

**Functional Checks:**
- [ ] Can search for course
- [ ] Can filter by status
- [ ] Can sort by columns
- [ ] Can view course details
- [ ] Can edit course (if implemented)
- [ ] Can delete course (with confirmation)
- [ ] Create button works

---

## 👥 Admin Student Management (`/admin/students`)

**Visual Checks:**
- [ ] Table of students
- [ ] Columns: Name, Email, Courses, Completion %, Status
- [ ] Search by name/email
- [ ] Filter by status

**Functional Checks:**
- [ ] Can search students
- [ ] Can filter by status
- [ ] Can view student details
- [ ] Can suspend account
- [ ] Can reset password (modal)

---

## 💳 Admin Payments (`/admin/payments`)

**Visual Checks:**
- [ ] Transaction table
- [ ] Columns: ID, Student, Course, Amount, Date, Status
- [ ] Filter by status
- [ ] Date range filter
- [ ] Revenue metrics

**Functional Checks:**
- [ ] Can filter by status
- [ ] Can search transactions
- [ ] Can view receipt
- [ ] Can download invoice
- [ ] Revenue calculations correct

---

## ⚙️ Admin Settings (`/admin/settings`)

**Visual Checks:**
- [ ] Platform settings section
- [ ] Email configuration
- [ ] Payment gateway settings
- [ ] Feature toggles
- [ ] Save button

**Functional Checks:**
- [ ] Can change platform name
- [ ] Can enable/disable features
- [ ] Changes persist

---

## 🌍 Public Pages

### About Page (`/about`)
- [ ] Page loads
- [ ] Company mission visible
- [ ] Team members displayed
- [ ] Achievements listed

### Contact Page (`/contact`)
- [ ] Contact form visible
- [ ] All fields present
- [ ] Form validates
- [ ] Can submit (or shows success)

### FAQ Page (`/faq`)
- [ ] Questions listed
- [ ] Can expand questions
- [ ] Answers display correctly
- [ ] Search works (if implemented)

---

## 🔐 Authentication & Security

**Test Cases:**
- [ ] Can't access `/dashboard` without login (redirect to `/login`)
- [ ] Can't access `/admin` without admin role
- [ ] After logout, redirects to home
- [ ] Session persists on page refresh (within same session)
- [ ] Passwords display as dots (not visible)
- [ ] Form validation prevents invalid submissions

---

## 📱 Responsive Design

**Mobile Test** (F12 → Device Toolbar → iPhone 12):
- [ ] Header responsive
- [ ] Navigation collapses to hamburger menu
- [ ] Course cards stack vertically
- [ ] Buttons full width
- [ ] Text readable (not too small)
- [ ] Images scale correctly
- [ ] Forms responsive

**Tablet Test** (iPad Pro):
- [ ] Layout uses 2-column grid where appropriate
- [ ] Sidebar visible or hideable
- [ ] Touch-friendly buttons (at least 44x44px)

**Desktop Test** (1920x1080):
- [ ] Full layout displayed
- [ ] Multiple columns visible
- [ ] Proper spacing
- [ ] No horizontal scroll

---

## 🎨 Visual/UI Checks

**Colors:**
- [ ] Primary color is deep blue (buttons, links)
- [ ] Background is light (not pure white)
- [ ] Text is dark on light background
- [ ] Accent green visible on success elements

**Typography:**
- [ ] Headings are bold
- [ ] Body text is readable
- [ ] Font is consistent throughout

**Animations:**
- [ ] Page transitions smooth
- [ ] Buttons have hover effects
- [ ] Loading states visible
- [ ] Toast notifications appear

---

## 🚨 Error Handling

**Test These Errors:**
- [ ] Invalid login → Error message
- [ ] Empty form → Validation error
- [ ] Missing field → Required message
- [ ] Network error → Handled gracefully
- [ ] 404 page → Shows when route not found

---

## ⚡ Performance

**Console Checks** (F12 → Console):
- [ ] No red errors
- [ ] No yellow warnings (if possible)
- [ ] No 404s for resources
- [ ] No CORS errors

**Network Tab** (F12 → Network):
- [ ] All requests 200-300 status
- [ ] Images load
- [ ] CSS loads
- [ ] JavaScript loads
- [ ] No failed requests

**Page Load** (F12 → Performance):
- [ ] Homepage loads in < 2 seconds
- [ ] Dashboard loads in < 1 second
- [ ] Smooth scrolling

---

## 🎯 Complete User Flow Test

Follow this complete flow to verify everything works:

1. [ ] Start at homepage (/)
2. [ ] Click "Browse Courses"
3. [ ] Search for "web development"
4. [ ] Click a course
5. [ ] Read description
6. [ ] Click "Add to Cart"
7. [ ] Click cart icon
8. [ ] Review cart items
9. [ ] Click "Proceed to Checkout"
10. [ ] Fill billing information
11. [ ] Click "Complete Purchase"
12. [ ] See payment success
13. [ ] Click "Go to Dashboard"
14. [ ] See enrolled course in My Courses
15. [ ] Click "Learn"
16. [ ] Go through course player
17. [ ] Mark lessons complete
18. [ ] See progress update
19. [ ] Go to Certificates
20. [ ] Download certificate
21. [ ] Click user avatar
22. [ ] Click Profile
23. [ ] Update preferences
24. [ ] Logout
25. [ ] Login again with same email
26. [ ] Verify data persisted
27. [ ] Login as admin (admin@example.com)
28. [ ] Go to /admin
29. [ ] See student enrollments
30. [ ] View payment records

**✅ If all 30 steps work → System is 100% functional!**

---

## 📋 Final Checklist

### System Works If:
- [ ] Homepage loads and looks professional
- [ ] Can navigate between all pages
- [ ] Can register and login
- [ ] Can browse and search courses
- [ ] Can add courses to cart
- [ ] Can checkout (mock payment)
- [ ] Can access student dashboard
- [ ] Can take a course
- [ ] Can access admin features
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Database operations work

### Deployment Ready If:
- [ ] All above items checked
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] Environment variables set
- [ ] Ready to push to Vercel/AWS

---

## 🎉 Verification Complete!

When you can check all boxes above, your LearnHub LMS system is:
- ✅ Fully installed
- ✅ Completely functional
- ✅ Visually polished
- ✅ Ready to deploy
- ✅ Ready to customize

**Congratulations! Your LMS is complete!** 🚀

---

## Next Steps

1. Deploy to Vercel
2. Customize with your branding
3. Replace mock data with real database
4. Add real payment processing
5. Start selling courses!

---

**Date Verified:** _______________
**Verified By:** _______________
**Status:** ✅ COMPLETE
