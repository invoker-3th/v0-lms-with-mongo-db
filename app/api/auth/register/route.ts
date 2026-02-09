import { NextResponse } from "next/server"
import { authService } from "@/lib/auth"
import { registerSchema } from "@/lib/validation"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validated = registerSchema.parse(body)

    // Attempt registration
    const result = await authService.register(
      validated.email,
      validated.password,
      validated.name,
      validated.role || "student"
    )

    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
