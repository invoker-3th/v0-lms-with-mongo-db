import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/job";
import Application from "@/models/application";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * GET /api/admin/jobs/[id]/applications
 * View all applications for a job (read-only, admin access)
 * 
 * Returns:
 * - 200: { applications: Application[] }
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await connectDB();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const applications = await Application.find({ jobId: id }).sort({ createdAt: -1 });

    const formattedApplications = applications.map((app) => ({
      _id: app._id.toString(),
      jobId: app.jobId,
      talentId: app.talentId,
      answer: app.answer,
      mediaUrl: app.mediaUrl,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({ applications: formattedApplications });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}

