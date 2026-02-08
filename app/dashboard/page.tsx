"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import type { Enrollment, Course } from "@/lib/types"
import Link from "next/link"
import { formatDuration } from "@/lib/utils/format"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course | undefined })[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0,
  })

  useEffect(() => {
    if (!user) return
    const loadEnrollments = async () => {
      try {
        const res = await fetch(`/api/enrollments?userId=${user.id}`)
        const data = await res.json()
        const enriched = data.enrollments || []
        setEnrollments(enriched)

        const completed = enriched.filter((e: Enrollment) => e.status === "completed").length
        const inProgress = enriched.filter((e: Enrollment) => e.status === "active").length
        const totalMinutes = enriched.reduce((sum: number, e: Enrollment & { course?: Course }) => {
          return sum + (e.course?.totalDuration || 0)
        }, 0)

        setStats({
          totalCourses: enriched.length,
          inProgress,
          completed,
          totalHours: Math.round(totalMinutes / 60),
        })
      } catch (error) {
        console.error("Failed to load enrollments:", error)
        setEnrollments([])
      }
    }

    loadEnrollments()
  }, [user])

  const statCards = [
    { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-blue-600" },
    { title: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "text-orange-600" },
    { title: "Completed", value: stats.completed, icon: Award, color: "text-green-600" },
    { title: "Learning Hours", value: stats.totalHours, icon: Clock, color: "text-purple-600" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Continue Learning */}
      {enrollments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollments
                .filter((e) => e.status === "active")
                .slice(0, 3)
                .map((enrollment) => (
                  <div key={enrollment.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={enrollment.course?.thumbnail || "/placeholder.svg"}
                      alt={enrollment.course?.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{enrollment.course?.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{enrollment.progress}% complete</span>
                        <span>•</span>
                        <span>{formatDuration(enrollment.course?.totalDuration || 0)}</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/courses/${enrollment.courseId}/learn`}>Continue</Link>
                    </Button>
                  </div>
                ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/dashboard/courses">View All Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
