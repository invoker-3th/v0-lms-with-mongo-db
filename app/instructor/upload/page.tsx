"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Upload } from "lucide-react"

export default function InstructorUploadPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/instructor">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upload Course Assets</h1>
        <p className="text-muted-foreground mt-2">
          Upload videos, PDFs, or supplemental files for your course.
        </p>
      </div>

      <Alert className="mb-6">
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This is a placeholder upload screen. Connect it to your storage provider when ready.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Select files to attach to your course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Input type="file" multiple />
            <p className="text-xs text-muted-foreground">
              Supported: MP4, MOV, PDF, ZIP. Max 2GB per file.
            </p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
