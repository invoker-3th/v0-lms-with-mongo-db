"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import type { Enrollment, Course } from "@/lib/types"
import Link from "next/link"
import { formatDuration } from "@/lib/utils/format"

export default function MyCoursesPage() {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course | undefined })[]>([])

  useEffect(() => {
    if (!user) return
    const loadEnrollments = async () => {
      try {
        const res = await fetch(`/api/enrollments?userId=${user.id}`)
        const data = await res.json()
        setEnrollments(data.enrollments || [])
      } catch (error) {
        console.error("Failed to load enrollments:", error)
        setEnrollments([])
      }
    }
    loadEnrollments()
  }, [user])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">My Courses</h1>
        <p className="text-muted-foreground mt-2">Continue where you left off</p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <div className="relative">
                <img
                  src={enrollment.course?.thumbnail || "/placeholder.svg"}
                  alt={enrollment.course?.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {enrollment.progress}% complete
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{enrollment.course?.title}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  {formatDuration(enrollment.course?.totalDuration || 0)} • {enrollment.course?.level}
                </div>
                <Progress value={enrollment.progress} className="h-2 mb-4" />
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/courses/${enrollment.courseId}/learn`}>
                    <Play className="h-4 w-4 mr-2" />
                    {enrollment.progress === 0 ? "Start Course" : "Continue Learning"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No enrolled courses</h3>
            <p className="text-muted-foreground mb-4">Browse our course catalog and start learning today</p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
