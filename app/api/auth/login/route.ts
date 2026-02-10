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
      return NextResponse.json({ error: "Invalid credentials or email not verified" }, { status: 401 })
    }

    const isAdminLogin = request.headers.get("x-admin-login") === "true"
    if (result.user.role === "admin" && !isAdminLogin) {
      return NextResponse.json({ error: "Admins must use /login-admin" }, { status: 403 })
    }
    if (result.user.role !== "admin" && isAdminLogin) {
      return NextResponse.json({ error: "Only admins can use /login-admin" }, { status: 403 })
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
