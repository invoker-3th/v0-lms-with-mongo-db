import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const db = getDB()
    const enrollments = await db.getEnrollmentsByUserId(userId)

    // Add course details to each enrollment
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await db.getCourseById(enrollment.courseId)
        return {
          ...enrollment,
          course,
        }
      })
    )

    return NextResponse.json({ enrollments: enrichedEnrollments })
  } catch (error) {
    console.error("Get enrollments error:", error)
    return NextResponse.json({ error: "Failed to get enrollments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId } = body

    if (!userId || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getDB()
    // Check if already enrolled
    const existing = await db.getEnrollment(userId, courseId)

    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    // Create enrollment
    const enrollment = await db.createEnrollment({
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      status: "active",
      enrolledAt: new Date(),
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error("Create enrollment error:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }
}
