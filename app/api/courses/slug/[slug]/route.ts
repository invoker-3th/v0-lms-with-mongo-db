import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const db = getDB()
    const course = await db.getCourseBySlug(slug)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const instructor = await db.findUserById(course.instructorId)
    const { password: _, ...safeInstructor } = instructor || {}

    return NextResponse.json({ course, instructor: instructor ? safeInstructor : null })
  } catch (error) {
    console.error("Get course by slug error:", error)
    return NextResponse.json({ error: "Failed to get course" }, { status: 500 })
  }
}
