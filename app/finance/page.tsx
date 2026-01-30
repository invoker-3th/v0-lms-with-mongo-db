"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { db } from "@/lib/mock-db"
import type { Payment } from "@/lib/types"
import { paystackService } from "@/lib/paystack"

export default function FinanceDashboard() {
  const { user } = useAuthStore()
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPaymentsNGN: 0,
    totalPaymentsUSD: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    totalStudents: 0,
  })

  useEffect(() => {
    const allPayments = db.payments
    setPayments(allPayments)

    const successfulPayments = allPayments.filter((p) => p.status === "success")
    const pendingPayments = allPayments.filter((p) => p.status === "pending")

    const totalRevenueNGN = successfulPayments
      .filter((p) => p.currency === "NGN")
      .reduce((sum, p) => sum + p.amount, 0)

    const totalRevenueUSD = successfulPayments
      .filter((p) => p.currency === "USD")
      .reduce((sum, p) => sum + p.amount, 0)

    const uniqueStudents = new Set(allPayments.map((p) => p.userId)).size

    setStats({
      totalRevenue: totalRevenueNGN + totalRevenueUSD,
      totalPaymentsNGN: totalRevenueNGN,
      totalPaymentsUSD: totalRevenueUSD,
      successfulTransactions: successfulPayments.length,
      pendingTransactions: pendingPayments.length,
      totalStudents: uniqueStudents,
    })
  }, [user])

  const statCards = [
    {
      title: "Total Revenue (NGN)",
      value: `₦${stats.totalPaymentsNGN.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Revenue (USD)",
      value: `$${stats.totalPaymentsUSD.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Successful Transactions",
      value: stats.successfulTransactions,
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Unique Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor revenue and payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Reference</th>
                  <th className="text-left p-2">Student</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Currency</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((payment) => {
                  const student = db.users.find((u) => u.id === payment.userId)
                  return (
                    <tr key={payment.id} className="border-b hover:bg-accent/50">
                      <td className="p-2 font-mono text-xs">{payment.reference.slice(0, 12)}...</td>
                      <td className="p-2">{student?.name || "Unknown"}</td>
                      <td className="p-2">{payment.amount.toLocaleString()}</td>
                      <td className="p-2">
                        <Badge variant="outline">{payment.currency}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant={payment.status === "success" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
