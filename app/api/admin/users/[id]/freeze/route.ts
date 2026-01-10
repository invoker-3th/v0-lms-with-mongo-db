import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * POST /api/admin/users/[id]/freeze
 * Freeze user account (talent or director)
 * 
 * Request body:
 * - reason: string (required)
 * - expiresAt?: string (optional ISO date, null = indefinite)
 * 
 * Returns:
 * - 200: { success: true, user }
 * - 400: Invalid request
 * - 401: Unauthorized
 * - 403: Forbidden (not admin)
 * - 404: User not found
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { reason, expiresAt } = body;

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
      restrictionExpiresAt: user.restrictionExpiresAt,
    };

    user.frozen = true;
    user.restrictionReason = reason.trim();
    user.restrictionExpiresAt = expiresAt ? new Date(expiresAt) : null;
    user.restrictedBy = admin._id.toString();

    await user.save();

    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetUserId: id,
      targetUserRole: user.role as "TALENT" | "DIRECTOR",
      actionType: "ACCOUNT_FROZEN",
      beforeState,
      afterState: {
        frozen: true,
        restrictionReason: reason.trim(),
        restrictionExpiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      reason: reason.trim(),
      metadata: { expiresAt },
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        frozen: user.frozen,
        restrictionReason: user.restrictionReason,
        restrictionExpiresAt: user.restrictionExpiresAt,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to freeze user:", error);
    return NextResponse.json(
      { error: "Failed to freeze user." },
      { status: 500 }
    );
  }
}



