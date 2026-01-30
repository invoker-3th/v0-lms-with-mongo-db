import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const enrollments = mockDB.enrollments.filter((e) => e.userId === userId)

    // Add course details to each enrollment
    const enrichedEnrollments = enrollments.map((enrollment) => {
      const course = mockDB.courses.find((c) => c.id === enrollment.courseId)
      return {
        ...enrollment,
        course,
      }
    })

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

    // Check if already enrolled
    const existing = mockDB.enrollments.find((e) => e.userId === userId && e.courseId === courseId)

    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    // Create enrollment
    const enrollment = mockDB.createEnrollment({
      userId,
      courseId,
      progress: 0,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error("Create enrollment error:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }
}
