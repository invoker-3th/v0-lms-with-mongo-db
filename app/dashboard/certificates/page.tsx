"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award } from "lucide-react"

export default function CertificatesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">My Certificates</h1>
        <p className="text-muted-foreground mt-2">Your earned certificates and achievements</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
          <p className="text-muted-foreground">Complete a course to earn your first certificate</p>
        </CardContent>
      </Card>
    </div>
  )
}
