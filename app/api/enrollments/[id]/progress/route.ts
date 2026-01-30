import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { progress, completedLessons } = body

    const enrollment = mockDB.enrollments.find((e) => e.id === id)

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Update enrollment progress
    const updated = mockDB.updateEnrollment(id, {
      progress,
      completedLessons,
      lastAccessedAt: new Date().toISOString(),
    })

    return NextResponse.json({ enrollment: updated })
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
