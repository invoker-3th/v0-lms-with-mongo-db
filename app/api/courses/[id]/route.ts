import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const course = mockDB.courses.find((c) => c.id === id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Get course error:", error)
    return NextResponse.json({ error: "Failed to get course" }, { status: 500 })
  }
}
