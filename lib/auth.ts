// Authentication utilities
import { db } from "./mock-db"
import type { User } from "./types"

export interface SessionData {
  userId: string
  email: string
  role: string
}

// In a real app, this would use cookies or JWT
// For mock purposes, we'll use sessionStorage on client
export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = await db.findUserByEmail(email)

    if (!user || user.password !== password) {
      return null
    }

    // Generate mock token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role }))

    return { user, token }
  },

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const existingUser = await db.findUserByEmail(email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    const user = await db.createUser({
      email,
      password,
      name,
      role: "student",
      enrolledCourses: [],
    })

    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role }))

    return { user, token }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const decoded = JSON.parse(atob(token)) as SessionData
      const user = await db.findUserById(decoded.userId)
      return user || null
    } catch {
      return null
    }
  },

  decodeToken(token: string): SessionData | null {
    try {
      return JSON.parse(atob(token)) as SessionData
    } catch {
      return null
    }
  },
}
