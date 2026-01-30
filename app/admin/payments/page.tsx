"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, DollarSign } from "lucide-react"
import { mockDB } from "@/lib/mock-db"
import type { Payment } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils/format"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
  })

  useEffect(() => {
    const allPayments = mockDB.payments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setPayments(allPayments)
    setFilteredPayments(allPayments)

    // Calculate stats
    const successfulPayments = allPayments.filter((p) => p.status === "success")
    const total = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

    setStats({
      total,
      successful: successfulPayments.length,
      pending: allPayments.filter((p) => p.status === "pending").length,
      failed: allPayments.filter((p) => p.status === "failed").length,
    })
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = payments.filter((payment) => {
        const user = mockDB.users.find((u) => u.id === payment.userId)
        return (
          user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      setFilteredPayments(filtered)
    } else {
      setFilteredPayments(payments)
    }
  }, [searchQuery, payments])

  const getUser = (userId: string) => {
    return mockDB.users.find((u) => u.id === userId)
  }

  const getCourses = (courseIds: string[]) => {
    return courseIds.map((id) => mockDB.courses.find((c) => c.id === id)).filter(Boolean)
  }

  const downloadInvoice = (payment: Payment) => {
    // Simulate invoice download
    alert(`Downloading invoice for payment ${payment.reference}`)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Payment Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
            <p className="text-sm text-muted-foreground">Successful</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-sm text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => {
          const user = getUser(payment.userId)
          const courses = getCourses(payment.courseIds)

          return (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{formatCurrency(payment.amount)}</h3>
                      <Badge
                        variant={
                          payment.status === "success"
                            ? "default"
                            : payment.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm mb-3">
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Student:</span>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-mono text-xs">{payment.reference}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                    </div>

                    {courses.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Courses:</p>
                        <div className="flex flex-wrap gap-2">
                          {courses.map((course) => (
                            <Badge key={course?.id} variant="outline">
                              {course?.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {payment.status === "success" && (
                    <Button variant="outline" size="sm" onClick={() => downloadInvoice(payment)}>
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payments found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "No payments have been made yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
