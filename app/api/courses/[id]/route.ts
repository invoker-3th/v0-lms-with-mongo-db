import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mock-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = getDB()

    const course = await db.getCourseById(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Get course error:", error)
    return NextResponse.json({ error: "Failed to get course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const db = getDB()
    const updated = await db.updateCourse(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course: updated })
  } catch (error) {
    console.error("Update course error:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = getDB()

    const success = await db.deleteCourse(id)

    if (!success) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete course error:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
