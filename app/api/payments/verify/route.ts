import { type NextRequest, NextResponse } from "next/server"
import { paystackService } from "@/lib/paystack"
import { getDB } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    const db = getDB()
    // Get payment details first
    const payment = await db.getPaymentByReference(reference)

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Verify payment with Paystack
    const verification = await paystackService.verifyPayment(
      reference,
      payment.amount,
      payment.currency
    )

    if (verification.status === "success") {
      // Update payment status
      await db.updatePaymentByReference(reference, {
        status: "completed",
        completedAt: new Date(),
      })

      // Auto-enroll user in course if not already enrolled
      const enrollment = await db.getEnrollment(payment.userId, payment.courseId)
      if (!enrollment) {
        await db.createEnrollment({
          userId: payment.userId,
          courseId: payment.courseId,
          progress: 0,
          completedLessons: [],
          status: "active",
          enrolledAt: new Date(),
        })
      }
    } else {
      await db.updatePaymentByReference(reference, {
        status: "failed",
      })
    }

    const updatedPayment = await db.getPaymentByReference(reference)

    return NextResponse.json({
      success: true,
      verified: verification.status === "success",
      payment: updatedPayment,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
