"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, TrendingUp, Award } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { db } from "@/lib/mock-db"
import type { Course } from "@/lib/types"
import Link from "next/link"

export default function InstructorDashboard() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    avgRating: 0,
  })

  useEffect(() => {
    if (user) {
      // Get instructor's courses
      const instructorCourses = db.courses.filter(
        (c) => c.instructor === user.name || c.instructorId === user.id
      )
      setCourses(instructorCourses)

      // Calculate stats
      const enrollments = db.enrollments.filter((e) =>
        instructorCourses.some((c) => c.id === e.courseId)
      )

      const enrolledStudents = new Set(enrollments.map((e) => e.userId)).size

      const allRatings = instructorCourses.flatMap((c) => c.ratings || [])
      const avgRating =
        allRatings.length > 0
          ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
          : 0

      setStats({
        totalCourses: instructorCourses.length,
        totalStudents: enrolledStudents,
        totalEnrollments: enrollments.length,
        avgRating: Number(avgRating.toFixed(1)),
      })
    }
  }, [user])

  const statCards = [
    { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-blue-600" },
    { title: "Total Students", value: stats.totalStudents, icon: Users, color: "text-green-600" },
    { title: "Total Enrollments", value: stats.totalEnrollments, icon: TrendingUp, color: "text-purple-600" },
    { title: "Avg Rating", value: `${stats.avgRating} ★`, icon: Award, color: "text-orange-600" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Manage your courses and track student progress</p>
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

      {/* My Courses Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <Link href="/instructor/upload">
            <Button>Upload New Course</Button>
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const courseEnrollments = db.enrollments.filter((e) => e.courseId === course.id)
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Students:</span> {courseEnrollments.length}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span className="capitalize">{course.status}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> ₦{course.priceNGN.toLocaleString()} / ${course.priceUSD}
                      </p>
                    </div>
                    <Link href={`/instructor/courses/${course.id}`}>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        Manage Course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No courses yet. Create your first course!</p>
              <div className="text-center mt-4">
                <Link href="/instructor/upload">
                  <Button>Upload Your First Course</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
