import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * POST /api/admin/users/[id]/unfreeze
 * Unfreeze user account
 * 
 * Request body:
 * - reason: string (required)
 * 
 * Returns:
 * - 200: { success: true, user }
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const beforeState = {
      frozen: user.frozen,
      restrictionReason: user.restrictionReason,
    };

    user.frozen = false;
    user.restrictionReason = null;
    user.restrictionExpiresAt = null;
    user.restrictedBy = null;

    await user.save();

    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetUserId: id,
      targetUserRole: user.role as "TALENT" | "DIRECTOR",
      actionType: "ACCOUNT_UNFROZEN",
      beforeState,
      afterState: {
        frozen: false,
        restrictionReason: null,
      },
      reason: reason.trim(),
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        frozen: user.frozen,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to unfreeze user:", error);
    return NextResponse.json(
      { error: "Failed to unfreeze user." },
      { status: 500 }
    );
  }
}



