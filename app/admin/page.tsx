"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, BookOpen, CreditCard, TrendingUp, Users } from "lucide-react"
import type { Payment, User, Course, Enrollment } from "@/lib/types"
import { formatDate } from "@/lib/utils/format"

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const [usersRes, enrollmentsRes, paymentsRes, coursesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/enrollments?all=true"),
        fetch("/api/payments"),
        fetch("/api/courses?includeDrafts=true"),
      ])

      const usersData = await usersRes.json()
      const enrollmentsData = await enrollmentsRes.json()
      const paymentsData = await paymentsRes.json()
      const coursesData = await coursesRes.json()

      setUsers(usersData.users || [])
      setEnrollments(enrollmentsData.enrollments || [])
      setPayments(paymentsData.payments || [])
      setCourses(coursesData.courses || [])
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  const stats = useMemo(() => {
    const students = users.filter((u) => u.role === "student")
    const instructors = users.filter((u) => u.role === "instructor")
    const completedPayments = payments.filter(
      (p) => p.status === "completed" || p.status === "success"
    )
    const pendingPayments = payments.filter((p) => p.status === "pending")

    const totalRevenue = completedPayments.reduce((sum, p) => {
      if (p.currency === "NGN") return sum + p.amount
      if (p.currency === "USD") return sum + p.amount * 1250
      if (p.currency === "GBP") return sum + p.amount * 1580
      return sum
    }, 0)

    return {
      totalUsers: users.length,
      totalStudents: students.length,
      totalInstructors: instructors.length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalRevenue,
      pendingPayments: pendingPayments.length,
    }
  }, [users, courses, enrollments, payments])

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform overview and operational metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Manage Courses
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/payments">
              <CreditCard className="h-4 w-4 mr-2" />
              View Payments
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudents} students â€¢ {stats.totalInstructors} instructors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">â‚¦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingPayments} pending payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest transactions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="text-sm font-semibold">{payment.reference}</div>
                      <div className="text-xs text-muted-foreground">
                        {payment.userId} â€¢ {formatDate(payment.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{payment.currency} {payment.amount}</div>
                      <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New accounts created recently</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/courses">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Approve, edit, or archive courses.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/students">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Student Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Monitor student activity and status.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/payments">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Oversight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Review transactions and handle refunds.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
