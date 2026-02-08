"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, ArrowRight } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import Link from "next/link"
import type { Payment } from "@/lib/types"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get("reference")
  const [payment, setPayment] = useState<Payment | null>(null)
  const [courseTitle, setCourseTitle] = useState<string>("")

  useEffect(() => {
    if (!reference) {
      router.push("/courses")
      return
    }

    const loadPayment = async () => {
      try {
        const res = await fetch(`/api/payments?reference=${reference}`)
        const data = await res.json()
        const foundPayment = data.payments?.[0] || null
        setPayment(foundPayment)

        if (foundPayment?.courseId) {
          const courseRes = await fetch(`/api/courses/${foundPayment.courseId}`)
          if (courseRes.ok) {
            const courseData = await courseRes.json()
            setCourseTitle(courseData.course?.title || foundPayment.courseId)
          }
        }
      } catch (error) {
        console.error("Failed to load payment:", error)
      }
    }

    loadPayment()
  }, [reference, router])

  if (!payment) {
    return null
  }

  const downloadInvoice = () => {
    alert(`Invoice ${payment.reference} downloaded`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-3 text-balance">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. You now have lifetime access to your courses.
          </p>

          {/* Payment Details */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Reference</span>
                <span className="font-mono font-medium">{payment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{formatDate(payment.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span>Paystack</span>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="mb-8 text-left">
            <h3 className="font-semibold mb-3">Enrolled Courses:</h3>
            <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <img
                src="/placeholder.svg"
                alt={courseTitle || "Course"}
                className="w-16 h-12 object-cover rounded"
              />
              <span className="font-medium">{courseTitle || payment.courseId}</span>
            </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadInvoice} className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard/courses">
                Start Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
