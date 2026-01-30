import { type NextRequest, NextResponse } from "next/server"
import { paystackService } from "@/lib/paystack"
import { mockDB } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseIds, amount, email } = body

    // Validate request
    if (!userId || !courseIds || !amount || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    const user = mockDB.users.find((u) => u.id === userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Initialize payment
    const payment = await paystackService.initializePayment({
      userId,
      courseIds,
      amount,
      email,
    })

    return NextResponse.json({
      success: true,
      payment,
      authorization_url: `https://paystack.com/pay/${payment.reference}`,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
