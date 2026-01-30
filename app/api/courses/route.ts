import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const search = searchParams.get("search")

    let courses = mockDB.courses.filter((c) => c.status === "published")

    if (category && category !== "all") {
      courses = courses.filter((c) => c.category.toLowerCase() === category.toLowerCase())
    }

    if (level && level !== "all") {
      courses = courses.filter((c) => c.level.toLowerCase() === level.toLowerCase())
    }

    if (search) {
      const query = search.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.instructor.toLowerCase().includes(query),
      )
    }

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    return NextResponse.json({ error: "Failed to get courses" }, { status: 500 })
  }
}
