"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, Users, BookOpen } from "lucide-react"
import { mockDB } from "@/lib/mock-db"
import { formatCurrency } from "@/lib/utils/format"
import Link from "next/link"
import type { Course } from "@/lib/types"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  useEffect(() => {
    setCourses(mockDB.courses)
    setFilteredCourses(mockDB.courses)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCourses(filtered)
    } else {
      setFilteredCourses(courses)
    }
  }, [searchQuery, courses])

  const handleDelete = (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      mockDB.deleteCourse(courseId)
      setCourses(courses.filter((c) => c.id !== courseId))
    }
  }

  const togglePublish = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      const newStatus = course.status === "published" ? "draft" : "published"
      mockDB.updateCourse(courseId, { status: newStatus })
      setCourses(courses.map((c) => (c.id === courseId ? { ...c, status: newStatus } : c)))
    }
  }

  const getEnrollmentCount = (courseId: string) => {
    return mockDB.enrollments.filter((e) => e.courseId === courseId).length
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Course Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage your academy courses</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Course Image */}
                <div className="flex-shrink-0">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Course Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {course.instructor} • {course.category}
                      </p>
                    </div>
                    <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{getEnrollmentCount(course.id)} students</span>
                    </div>
                    <div>
                      {course.modules.length} modules • {course.totalLessons} lessons
                    </div>
                    <div className="font-semibold text-foreground">{formatCurrency(course.price)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${course.slug}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => togglePublish(course.id)}>
                      {course.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Get started by creating your first course"}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/admin/courses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
