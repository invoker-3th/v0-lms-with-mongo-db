import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const reference = searchParams.get("reference")
    const status = searchParams.get("status")
    const currency = searchParams.get("currency")
    const courseId = searchParams.get("courseId")
    const courseIds = searchParams.get("courseIds")

    const db = getDB()
    let payments = reference
      ? await db.getPaymentByReference(reference).then((p) => (p ? [p] : []))
      : await db.getAllPayments()

    if (userId) {
      payments = payments.filter((p) => p.userId === userId)
    }

    if (status) {
      payments = payments.filter((p) => p.status === status)
    }

    if (currency) {
      payments = payments.filter((p) => p.currency === currency)
    }

    if (courseId || courseIds) {
      const ids = courseIds ? courseIds.split(",") : [courseId as string]
      payments = payments.filter((p) => {
        if (ids.includes(p.courseId)) return true
        if (p.courseIds && p.courseIds.some((id) => ids.includes(id))) return true
        return false
      })
    }

    return NextResponse.json({ payments })
  } catch (error) {
    console.error("Get payments error:", error)
    return NextResponse.json({ error: "Failed to get payments" }, { status: 500 })
  }
}
