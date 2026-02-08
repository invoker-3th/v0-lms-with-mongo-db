import { type NextRequest, NextResponse } from "next/server"
import { paystackService } from "@/lib/paystack"
import { getDB } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseIds, amount, email, currency = "USD" } = body

    // Validate request
    if (!userId || !courseIds || !amount || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getDB()
    // Check if user exists
    const user = await db.findUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Initialize payment with Paystack
    const paymentInit = await paystackService.initializePayment(
      email,
      amount,
      currency as "NGN" | "USD" | "GBP",
      { userId, courseIds }
    )

    // Create payment record in database
    const payment = await db.createPayment({
      userId,
      courseId: Array.isArray(courseIds) ? courseIds[0] : courseIds,
      amount,
      currency: currency as "NGN" | "USD" | "GBP",
      status: "pending",
      reference: paymentInit.reference,
      paymentMethod: "paystack",
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      payment,
      authorization_url: paymentInit.authorizationUrl,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
