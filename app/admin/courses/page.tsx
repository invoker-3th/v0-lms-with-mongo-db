"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, CheckCircle2, XCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/types"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/courses")
      const data = await res.json()
      setCourses(data.courses ?? [])
    }
    load()
  }, [])

  const filtered = courses.filter(c =>
    (c.title + c.description + c.category)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const togglePublish = async (course: Course) => {
    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    })
    if (!res.ok) return
    const data = await res.json()
    setCourses(prev => prev.map(c => (c.id === course.id ? data.course : c)))
  }

  const deleteCourse = async (course: Course) => {
    if (!confirm("Delete this course?")) return
    const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" })
    if (!res.ok) return
    setCourses(prev => prev.filter(c => c.id !== course.id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Approval</h1>
          <p className="text-muted-foreground">
            Review, approve, and manage all courses on the platform.
          </p>
        </div>
      </div>

      <div className="max-w-md mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by title, description, or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map(course => (
          <Card key={course.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.category} • {course.level}
                </p>
              </div>
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? "Published" : "Draft"}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground line-clamp-2 md:max-w-xl">
                {course.description}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/courses/${course.slug}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Link>
                </Button>
                <Button
                  variant={course.published ? "outline" : "default"}
                  size="sm"
                  onClick={() => togglePublish(course)}
                >
                  {course.published ? (
                    <>
                      <XCircle className="h-4 w-4 mr-1" /> Unpublish
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Approve / Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCourse(course)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">No courses found.</p>
        )}
      </div>
    </div>
  )
}