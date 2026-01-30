"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold mb-3 text-balance">Payment Failed</h1>
          <p className="text-muted-foreground mb-8">
            Unfortunately, your payment could not be processed. Please try again or contact support if the issue
            persists.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3">Common issues:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Network connection issues</li>
              <li>• Card not enabled for online transactions</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/checkout">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Need help? Contact us at{" "}
            <a href="mailto:support@lmsacademy.com" className="text-primary hover:underline">
              support@lmsacademy.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
