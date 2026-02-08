// Authentication utilities with bcrypt and JWT
import { getDB } from "./mock-db"
import type { User } from "./types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export interface SessionData {
  userId: string
  email: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

// Password hashing utility
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Password verification utility
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  )
}

// Verify JWT token
function verifyToken(token: string): SessionData | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionData
    return decoded
  } catch (error) {
    return null
  }
}

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const db = getDB()
    const user = await db.findUserByEmail(email)

    if (!user) {
      return null
    }

    // Check if password is hashed (starts with $2a$ or $2b$) or plain text (for migration)
    const isHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$")
    
    let passwordValid = false
    if (isHashed) {
      passwordValid = await verifyPassword(password, user.password)
    } else {
      // Legacy: compare plain text (for existing users)
      passwordValid = user.password === password
      // If valid, hash the password for future use
      if (passwordValid) {
        const hashedPassword = await hashPassword(password)
        await db.updateUser(user.id, { password: hashedPassword })
      }
    }

    if (!passwordValid) {
      return null
    }

    // Generate JWT token
    const token = generateToken(user)

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword as User, token }
  },

  async register(
    email: string,
    password: string,
    name: string,
    role: "student" | "instructor" | "admin" | "finance" = "student"
  ): Promise<{ user: User; token: string }> {
    const db = getDB()
    const existingUser = await db.findUserByEmail(email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password)

    const user = await db.createUser({
      email,
      password: hashedPassword,
      name,
      role,
      enrolledCourses: [],
    })

    // Generate JWT token
    const token = generateToken(user)

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword as User, token }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const db = getDB()
      const decoded = verifyToken(token)
      
      if (!decoded) {
        return null
      }

      const user = await db.findUserById(decoded.userId)
      
      if (!user) {
        return null
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch {
      return null
    }
  },

  decodeToken(token: string): SessionData | null {
    return verifyToken(token)
  },
}
