import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mock-db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { progress, completedLessons } = body

    const db = getDB()
    const enrollment = await db.getEnrollmentById(id)
    
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    const updated = await db.updateEnrollment(id, {
      progress,
      completedLessons,
    })

    if (!updated) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    return NextResponse.json({ enrollment: updated })
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
