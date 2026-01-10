import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/job";
import Application from "@/models/application";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * GET /api/admin/jobs
 * Get all jobs (including hidden ones) for admin review
 * 
 * Query parameters:
 * - directorId?: string - Filter by director
 * - status?: string - Filter by status
 * - hidden?: boolean - Filter by hidden status
 * 
 * Returns:
 * - 200: { jobs: Job[] }
 */
export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const directorId = searchParams.get("directorId");
    const status = searchParams.get("status");
    const hidden = searchParams.get("hidden");

    await connectDB();

    const query: any = {};
    if (directorId) query.directorId = directorId;
    if (status) query.status = status;
    if (hidden !== null) query.hidden = hidden === "true";

    const jobs = await Job.find(query).sort({ createdAt: -1 }).limit(100);

    // Get application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ jobId: job._id.toString() });
        return {
          _id: job._id.toString(),
          directorId: job.directorId,
          title: job.title,
          type: job.type,
          location: job.location,
          budget: job.budget,
          deadline: job.deadline,
          description: job.description,
          status: job.status,
          hidden: job.hidden,
          closedEarly: job.closedEarly,
          adminActionReason: job.adminActionReason,
          applicationCount,
          createdAt: job.createdAt,
        };
      })
    );

    return NextResponse.json({ jobs: jobsWithCounts });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}



