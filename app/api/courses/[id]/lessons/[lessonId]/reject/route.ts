import { NextResponse } from "next/server"
import { authService } from "@/lib/auth"
import { getDB } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string; lessonId: string } }) {
  try {
    const { id, lessonId } = params
    const body = await request.json()
    const note = (body.note || "").toString()

    const authHeader = (request.headers.get("authorization") || "")
    const token = authHeader.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await authService.getCurrentUser(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - admin only" }, { status: 403 })
    }

    const db = getDB()
    const course = await db.getCourseById(id)
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    let changed = false
    for (const mod of course.modules || []) {
      for (const lesson of mod.lessons || []) {
        if (lesson.id === lessonId) {
          lesson.pendingApproval = false
          lesson.approved = false
          lesson.content = lesson.content || {}
          lesson.content.rejectionNote = note
          changed = true
        }
      }
    }

    if (!changed) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

    const updated = await db.updateCourse(id, { modules: course.modules })
    if (!updated) return NextResponse.json({ error: "Failed to update course" }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reject lesson error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
