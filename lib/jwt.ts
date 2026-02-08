// JWT helpers for API routes
import type { NextRequest } from "next/server"

export function getTokenFromRequest(request: Request | NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }

  const cookie = request.headers.get("cookie")
  if (!cookie) return null

  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}
