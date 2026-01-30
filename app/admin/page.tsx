"use client"

import { Button } from "@/components/ui/button"
import { mockDB } from "@/lib/mock-db" // Import mockDB here

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, TrendingUp, Award, Activity } from "lucide-react"
import { db } from "@/lib/mock-db"
import { formatCurrency } from "@/lib/utils/format"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    totalRevenue: 0,
    completionRate: 0,
    newEnrollments: 0,
    avgRating: 0,
  })

  const [revenueData, setRevenueData] = useState<any[]>([])
  const [enrollmentData, setEnrollmentData] = useState<any[]>([])

  useEffect(() => {
    // Calculate stats
    const students = db.users.filter((u) => u.role === "student")
    const courses = db.courses.filter((c) => c.status === "published")
    const enrollments = db.enrollments
    const payments = db.payments.filter((p) => p.status === "success")

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

    const completedEnrollments = enrollments.filter((e) => e.progress === 100)
    const completionRate = enrollments.length > 0 ? (completedEnrollments.length / enrollments.length) * 100 : 0

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentEnrollments = enrollments.filter((e) => new Date(e.enrolledAt) > thirtyDaysAgo)

    const allRatings = courses.flatMap((c) => c.ratings || [])
    const avgRating = allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length : 0

    setStats({
      totalStudents: students.length,
      activeCourses: courses.length,
      totalRevenue,
      completionRate: Math.round(completionRate),
      newEnrollments: recentEnrollments.length,
      avgRating: Number(avgRating.toFixed(1)),
    })

    // Generate revenue chart data (last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString("default", { month: "short" })

      const monthPayments = payments.filter((p) => {
        const paymentDate = new Date(p.createdAt)
        return paymentDate.getMonth() === date.getMonth() && paymentDate.getFullYear() === date.getFullYear()
      })

      monthlyRevenue.push({
        month: monthName,
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0) / 100,
      })
    }
    setRevenueData(monthlyRevenue)

    // Generate enrollment chart data
    const courseEnrollments = courses.slice(0, 5).map((course) => ({
      name: course.title.substring(0, 20) + "...",
      enrollments: enrollments.filter((e) => e.courseId === course.id).length,
    }))
    setEnrollmentData(courseEnrollments)
  }, [])

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      icon: Users,
      trend: "+12%",
      color: "text-blue-600",
    },
    {
      title: "Active Courses",
      value: stats.activeCourses.toString(),
      icon: BookOpen,
      trend: "+3",
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      trend: "+18%",
      color: "text-emerald-600",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: Award,
      trend: "+5%",
      color: "text-purple-600",
    },
    {
      title: "New Enrollments",
      value: stats.newEnrollments.toString(),
      icon: TrendingUp,
      trend: "+28%",
      color: "text-orange-600",
    },
    {
      title: "Average Rating",
      value: stats.avgRating.toString(),
      icon: Activity,
      trend: "+0.3",
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor your online academy performance and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${value}`} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="w-full" asChild>
              <a href="/admin/courses/new">Create Course</a>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="/admin/students">View Students</a>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="/admin/payments">View Payments</a>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="/admin/settings">Settings</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
