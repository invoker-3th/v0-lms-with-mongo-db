import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/job";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * POST /api/admin/jobs/[id]/actions
 * Admin actions on jobs: close early, hide/unhide
 * 
 * Request body:
 * - action: "CLOSE_EARLY" | "HIDE" | "UNHIDE"
 * - reason: string (required)
 * 
 * Returns:
 * - 200: { success: true, job }
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { action, reason } = body;

    if (!action || !reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: action, reason" },
        { status: 400 }
      );
    }

    await connectDB();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const beforeState = {
      status: job.status,
      hidden: job.hidden,
      closedEarly: job.closedEarly,
    };

    let actionType: string;

    switch (action) {
      case "CLOSE_EARLY":
        job.status = "closed";
        job.closedEarly = true;
        job.adminActionReason = reason.trim();
        job.adminActionBy = admin._id.toString();
        actionType = "JOB_CLOSED_EARLY";
        break;
      case "APPROVE":
        job.approvalStatus = "approved";
        job.adminActionReason = reason.trim();
        job.adminActionBy = admin._id.toString();
        // Make job visible/open when approved
        job.status = "open";
        actionType = "JOB_APPROVED";
        break;
      case "REJECT":
        job.approvalStatus = "rejected";
        job.adminActionReason = reason.trim();
        job.adminActionBy = admin._id.toString();
        // Close job when rejected
        job.status = "closed";
        actionType = "JOB_REJECTED";
        break;
      case "HIDE":
        job.hidden = true;
        job.adminActionReason = reason.trim();
        job.adminActionBy = admin._id.toString();
        actionType = "JOB_HIDDEN";
        break;
      case "UNHIDE":
        job.hidden = false;
        job.adminActionReason = null;
        job.adminActionBy = null;
        actionType = "JOB_UNHIDDEN";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    await job.save();

    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetJobId: id,
      actionType: actionType as any,
      beforeState,
      afterState: {
        status: job.status,
        hidden: job.hidden,
        closedEarly: job.closedEarly,
      },
      reason: reason.trim(),
      metadata: { action },
    });

    return NextResponse.json({
      success: true,
      job: {
        _id: job._id.toString(),
        status: job.status,
        hidden: job.hidden,
        closedEarly: job.closedEarly,
        adminActionReason: job.adminActionReason,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to perform job action:", error);
    return NextResponse.json(
      { error: "Failed to perform job action." },
      { status: 500 }
    );
  }
}
