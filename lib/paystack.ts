// Mock Paystack payment gateway with multi-currency support (NGN & USD)
import type { Currency } from "./types"

export interface PaymentInitialization {
  reference: string
  authorizationUrl: string
  accessCode: string
  currency: Currency
  amount: number
}

export interface PaymentVerification {
  status: "success" | "failed"
  reference: string
  amount: number
  currency: Currency
  paidAt: Date
  transactionId?: string
}

// Exchange rates (mock - in production these would be fetched from a real API)
export const exchangeRates: Record<Currency, number> = {
  NGN: 1,
  USD: 1,
  GBP: 1,
}

// Currency configuration
export const currencyConfig: Record<Currency, { symbol: string; name: string; decimals: number }> = {
  NGN: { symbol: "₦", name: "Nigerian Naira", decimals: 0 },
  USD: { symbol: "$", name: "US Dollar", decimals: 2 },
  GBP: { symbol: "£", name: "British Pound", decimals: 2 },
}

// Mock Paystack service with proper multi-currency support
export const paystackService = {
  async initializePayment(
    email: string,
    amount: number,
    currency: Currency = "USD",
    metadata?: Record<string, unknown>,
  ): Promise<PaymentInitialization> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Validate currency
    if (!currencyConfig[currency]) {
      throw new Error(`Unsupported currency: ${currency}`)
    }

    const reference = `PC-${currency}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // In production, this would call Paystack API with the proper currency
    const paystackUrl =
      process.env.NEXT_PUBLIC_PAYSTACK_URL || "https://checkout.paystack.com"

    return {
      reference,
      authorizationUrl: `/checkout/verify?reference=${reference}`,
      accessCode: `ACC-${reference}`,
      currency,
      amount,
    }
  },

  async verifyPayment(
    reference: string,
    expectedAmount: number,
    expectedCurrency: Currency,
  ): Promise<PaymentVerification> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful payment (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (!isSuccess) {
      return {
        status: "failed",
        reference,
        amount: expectedAmount,
        currency: expectedCurrency,
        paidAt: new Date(),
      }
    }

    return {
      status: "success",
      reference,
      amount: expectedAmount,
      currency: expectedCurrency,
      paidAt: new Date(),
      transactionId: `TXN-${Date.now()}`,
    }
  },

  async processRefund(reference: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  },

  // Format amount for display based on currency
  formatAmount(amount: number, currency: Currency): string {
    const config = currencyConfig[currency]
    const formatted = amount.toFixed(config.decimals)

    if (currency === "NGN") {
      return `${config.symbol} ${parseInt(formatted).toLocaleString()}`
    }

    return `${config.symbol} ${parseFloat(formatted).toLocaleString(undefined, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    })}`
  },

  // Convert between currencies (mock rates)
  convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
    if (fromCurrency === toCurrency) return amount

    // Mock conversion rates (in production, use real API)
    const conversionRates: Record<string, number> = {
      "NGN-USD": 0.0008, // 1 NGN = 0.0008 USD
      "USD-NGN": 1250, // 1 USD = 1250 NGN
      "GBP-USD": 1.27,
      "USD-GBP": 0.79,
    }

    const key = `${fromCurrency}-${toCurrency}`
    const rate = conversionRates[key] || 1

    return amount * rate
  },
}
