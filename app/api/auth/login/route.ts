import { NextResponse } from "next/server"
import { authService } from "@/lib/auth"
import { loginSchema } from "@/lib/validation"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validated = loginSchema.parse(body)

    // Attempt login
    const result = await authService.login(validated.email, validated.password)

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
