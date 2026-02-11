import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { getDB } from "@/lib/db"
import { courseUpdateSchema } from "@/lib/validation"
import { authService } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = getDB()

    const course = await db.getCourseById(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Mask videoUrl for unauthorized users
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    let user = null
    if (token) {
      user = await authService.getCurrentUser(token)
    }

    const isAdmin = user?.role === "admin"
    const isInstructorOwner = user?.role === "instructor" && course.instructorId === user.id

    const safeCourse = JSON.parse(JSON.stringify(course))
    if (!(isAdmin || isInstructorOwner)) {
      for (const mod of safeCourse.modules || []) {
        for (const lesson of mod.lessons || []) {
          if (lesson.content?.videoUrl) {
            const url = lesson.content.videoUrl as string
            const ytMatch = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/)
            if (ytMatch && ytMatch[1]) {
              lesson.content.videoId = ytMatch[1]
            }
            delete lesson.content.videoUrl
          }
        }
      }
    }

    return NextResponse.json({ course: safeCourse })
  } catch (error) {
    console.error("Get course error:", error)
    return NextResponse.json({ error: "Failed to get course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Get auth token from headers
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - no token" }, { status: 401 })
    }

    // Verify token and get user
    const user = await authService.getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized - invalid token" }, { status: 401 })
    }

    // Check if user has permission to edit courses
    const canEdit = ["admin", "instructor", "finance"].includes(user.role)
    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden - only admin, instructor, or finance can edit courses" }, { status: 403 })
    }

    const db = getDB()
    const course = await db.getCourseById(id)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // If not admin and not the course instructor, cannot edit
    if (user.role !== "admin" && course.instructorId !== user.id) {
      return NextResponse.json({ error: "Forbidden - you can only edit your own courses" }, { status: 403 })
    }

    // Parse and validate updates
    const validated = courseUpdateSchema.parse(body)

    // Only admin can approve courses
    if (body.approved !== undefined && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - only admin can approve courses" }, { status: 403 })
    }

    const updated = await db.updateCourse(id, validated)

    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course: updated })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error("Update course error:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get auth token from headers
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - no token" }, { status: 401 })
    }

    // Verify token and get user
    const user = await authService.getCurrentUser(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - only admin can delete courses" }, { status: 403 })
    }

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
