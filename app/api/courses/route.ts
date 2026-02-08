import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const search = searchParams.get("search")

    const db = getDB()
    let courses = await db.getAllCourses()

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
          c.description.toLowerCase().includes(query),
      )
    }

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    return NextResponse.json({ error: "Failed to get courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      level,
      price,
      thumbnail,
      instructorId,
      published = false,
      modules = [],
      totalDuration = 0,
      enrollmentCount = 0,
      rating = 0,
    } = body

    // Validate required fields
    if (!title || !description || !category || !level || !price || !instructorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate price structure
    if (!price.NGN || !price.USD || !price.GBP) {
      return NextResponse.json(
        { error: "Price must include NGN, USD, and GBP" },
        { status: 400 }
      )
    }

    const db = getDB()

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingCourse = await db.getCourseBySlug(slug)
    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this title already exists" },
        { status: 409 }
      )
    }

    // Create course
    const course = await db.createCourse({
      title,
      slug,
      description,
      category,
      level,
      instructorId,
      price,
      thumbnail,
      published,
      modules,
      totalDuration,
      enrollmentCount,
      rating,
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Create course error:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}
