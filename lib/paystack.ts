// Mock Paystack payment gateway
import type { Currency } from "./types"

export interface PaymentInitialization {
  reference: string
  authorizationUrl: string
  accessCode: string
}

export interface PaymentVerification {
  status: "success" | "failed"
  reference: string
  amount: number
  currency: Currency
  paidAt: Date
}

// Mock Paystack service
export const paystackService = {
  async initializePayment(
    email: string,
    amount: number,
    currency: Currency,
    metadata?: Record<string, unknown>,
  ): Promise<PaymentInitialization> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return {
      reference,
      authorizationUrl: `/checkout/verify?reference=${reference}`,
      accessCode: `ACC-${reference}`,
    }
  },

  async verifyPayment(reference: string): Promise<PaymentVerification> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful payment (90% success rate)
    const isSuccess = Math.random() > 0.1

    return {
      status: isSuccess ? "success" : "failed",
      reference,
      amount: 0, // Would be returned from Paystack
      currency: "USD",
      paidAt: new Date(),
    }
  },

  async processRefund(reference: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  },
}
