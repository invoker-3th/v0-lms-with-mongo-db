import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { paymentRefundSchema } from "@/lib/validation"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const validated = paymentRefundSchema.parse(body)

    const db = getDB()
    const updated = await db.updatePayment(id, validated)

    if (!updated) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({ payment: updated })
  } catch (error) {
    console.error("Update payment error:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}
