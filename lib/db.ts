// Mock Database Layer
// In production, replace with actual MongoDB connection using Prisma

export interface User {
  id: string
  email: string
  password: string // In production, this would be hashed
  name: string
  role: "student" | "admin" | "instructor" | "finance"
  avatar?: string
  enrolledCourses: string[]
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  price: {
    NGN: number
    USD: number
    GBP: number
  }
  instructorId: string
  thumbnail: string
  duration: string
  students: number
  rating: number
  published: boolean
  modules: Module[]
  createdAt: string
}

export interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  type: "video" | "pdf" | "quiz" | "assignment"
  duration: string
  content: string
  order: number
  completed?: boolean
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number
  status: "active" | "completed"
  completedLessons: string[]
  enrolledAt: string
  completedAt?: string
}

export interface Payment {
  id: string
  userId: string
  courseId: string
  amount: number
  currency: "NGN" | "USD" | "GBP"
  status: "pending" | "success" | "failed" | "refunded"
  reference: string
  paymentMethod: "paystack" | "card"
  createdAt: string
}

export interface Certificate {
  id: string
  userId: string
  courseId: string
  certificateUrl: string
  issuedAt: string
}

export interface Quiz {
  id: string
  lessonId: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export interface QuizSubmission {
  id: string
  userId: string
  quizId: string
  answers: number[]
  score: number
  submittedAt: string
}

// Mock Database Store (in-memory)
class MockDatabase {
  users: User[] = []
  courses: Course[] = []
  enrollments: Enrollment[] = []
  payments: Payment[] = []
  certificates: Certificate[] = []
  quizSubmissions: QuizSubmission[] = []

  constructor() {
    this.seedData()
  }

  seedData() {
    // Seed Users
    this.users = [
      {
        id: "1",
        email: "student@academy.com",
        password: "password123",
        name: "John Student",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        enrolledCourses: ["1", "2"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        email: "admin@academy.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        email: "instructor@academy.com",
        password: "instructor123",
        name: "Jane Instructor",
        role: "instructor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        email: "finance@academy.com",
        password: "finance123",
        name: "Finance Manager",
        role: "finance",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Finance",
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      },
    ]

    // Seed Courses
    this.courses = [
      {
        id: "1",
        title: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node.js and more",
        category: "Web Development",
        level: "beginner",
        price: { NGN: 45000, USD: 99, GBP: 79 },
        instructorId: "3",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
        duration: "40 hours",
        students: 1250,
        rating: 4.8,
        published: true,
        modules: [
          {
            id: "m1",
            title: "Introduction to Web Development",
            order: 1,
            lessons: [
              {
                id: "l1",
                title: "What is Web Development?",
                type: "video",
                duration: "15:30",
                content: "https://example.com/video1",
                order: 1,
              },
              {
                id: "l2",
                title: "Setting Up Your Environment",
                type: "video",
                duration: "20:45",
                content: "https://example.com/video2",
                order: 2,
              },
              {
                id: "l3",
                title: "HTML Basics Quiz",
                type: "quiz",
                duration: "10:00",
                content: "quiz-1",
                order: 3,
              },
            ],
          },
          {
            id: "m2",
            title: "HTML & CSS Fundamentals",
            order: 2,
            lessons: [
              {
                id: "l4",
                title: "HTML Elements",
                type: "video",
                duration: "25:15",
                content: "https://example.com/video3",
                order: 1,
              },
              {
                id: "l5",
                title: "CSS Styling",
                type: "video",
                duration: "30:20",
                content: "https://example.com/video4",
                order: 2,
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Advanced JavaScript & TypeScript",
        description: "Master modern JavaScript and TypeScript development",
        category: "Programming",
        level: "advanced",
        price: { NGN: 55000, USD: 129, GBP: 99 },
        instructorId: "3",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop",
        duration: "35 hours",
        students: 890,
        rating: 4.9,
        published: true,
        modules: [
          {
            id: "m3",
            title: "Advanced JavaScript Concepts",
            order: 1,
            lessons: [
              {
                id: "l6",
                title: "Closures and Scope",
                type: "video",
                duration: "18:30",
                content: "https://example.com/video5",
                order: 1,
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "UI/UX Design Masterclass",
        description: "Learn professional UI/UX design from scratch",
        category: "Design",
        level: "intermediate",
        price: { NGN: 40000, USD: 89, GBP: 69 },
        instructorId: "3",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        duration: "28 hours",
        students: 650,
        rating: 4.7,
        published: true,
        modules: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        title: "Digital Marketing Complete Course",
        description: "Master SEO, social media, email marketing and more",
        category: "Marketing",
        level: "beginner",
        price: { NGN: 35000, USD: 79, GBP: 59 },
        instructorId: "3",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        duration: "32 hours",
        students: 1100,
        rating: 4.6,
        published: true,
        modules: [],
        createdAt: new Date().toISOString(),
      },
    ]

    // Seed Enrollments for student
    this.enrollments = [
      {
        id: "e1",
        userId: "1",
        courseId: "1",
        progress: 35,
        status: "active",
        completedLessons: ["l1", "l2"],
        enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "e2",
        userId: "1",
        courseId: "2",
        progress: 15,
        status: "active",
        completedLessons: ["l6"],
        enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Seed Payments
    this.payments = [
      {
        id: "p1",
        userId: "1",
        courseId: "1",
        amount: 45000,
        currency: "NGN",
        status: "success",
        reference: "PAY-001-" + Date.now(),
        paymentMethod: "paystack",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "p2",
        userId: "1",
        courseId: "2",
        amount: 55000,
        currency: "NGN",
        status: "success",
        reference: "PAY-002-" + Date.now(),
        paymentMethod: "paystack",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  // User methods
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email)
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: String(this.users.length + 1),
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  // Course methods
  getAllCourses(): Course[] {
    return this.courses.filter((c) => c.published)
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find((c) => c.id === id)
  }

  // Enrollment methods
  getUserEnrollments(userId: string): Enrollment[] {
    return this.enrollments.filter((e) => e.userId === userId)
  }

  createEnrollment(enrollment: Omit<Enrollment, "id">): Enrollment {
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: "e" + (this.enrollments.length + 1),
    }
    this.enrollments.push(newEnrollment)
    return newEnrollment
  }

  // Payment methods
  createPayment(payment: Omit<Payment, "id">): Payment {
    const newPayment: Payment = {
      ...payment,
      id: "p" + (this.payments.length + 1),
    }
    this.payments.push(newPayment)
    return newPayment
  }

  getUserPayments(userId: string): Payment[] {
    return this.payments.filter((p) => p.userId === userId)
  }

  getAllPayments(): Payment[] {
    return this.payments
  }

  // Certificate methods
  createCertificate(certificate: Omit<Certificate, "id">): Certificate {
    const newCert: Certificate = {
      ...certificate,
      id: "cert" + (this.certificates.length + 1),
    }
    this.certificates.push(newCert)
    return newCert
  }

  getUserCertificates(userId: string): Certificate[] {
    return this.certificates.filter((c) => c.userId === userId)
  }
}

// Singleton instance
let dbInstance: MockDatabase | null = null

export function getDatabase(): MockDatabase {
  if (!dbInstance) {
    dbInstance = new MockDatabase()
  }
  return dbInstance
}
