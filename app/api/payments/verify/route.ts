import { type NextRequest, NextResponse } from "next/server"
import { paystackService } from "@/lib/paystack"
import { mockDB } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    // Verify payment
    const isVerified = await paystackService.verifyPayment(reference)

    if (!isVerified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Get payment details
    const payment = mockDB.payments.find((p) => p.reference === reference)

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      verified: true,
      payment,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
