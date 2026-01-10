import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * POST /api/admin/users/[id]/restrictions
 * Apply or remove restrictions (shadow-limit, disable messaging, freeze posting, flag high risk)
 * 
 * Request body:
 * - action: "APPLY" | "REMOVE"
 * - restrictionType: "SHADOW_LIMIT" | "DISABLE_MESSAGING" | "FREEZE_POSTING" | "FLAG_HIGH_RISK"
 * - reason: string (required)
 * - expiresAt?: string (optional ISO date, null = indefinite)
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
    const { action, restrictionType, reason, expiresAt } = body;

    if (!action || !restrictionType || !reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: action, restrictionType, reason" },
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

    const beforeState: any = {
      shadowLimited: user.shadowLimited,
      messagingDisabled: user.messagingDisabled,
      postingFrozen: user.postingFrozen,
      highRisk: user.highRisk,
    };

    const isApplying = action === "APPLY";
    let actionType: string;

    switch (restrictionType) {
      case "SHADOW_LIMIT":
        user.shadowLimited = isApplying;
        actionType = isApplying ? "RESTRICTION_APPLIED" : "RESTRICTION_REMOVED";
        break;
      case "DISABLE_MESSAGING":
        user.messagingDisabled = isApplying;
        actionType = isApplying ? "RESTRICTION_APPLIED" : "RESTRICTION_REMOVED";
        break;
      case "FREEZE_POSTING":
        user.postingFrozen = isApplying;
        actionType = isApplying ? "RESTRICTION_APPLIED" : "RESTRICTION_REMOVED";
        break;
      case "FLAG_HIGH_RISK":
        user.highRisk = isApplying;
        actionType = isApplying ? "FLAG_ADDED" : "FLAG_REMOVED";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid restriction type" },
          { status: 400 }
        );
    }

    if (isApplying) {
      user.restrictionReason = reason.trim();
      user.restrictionExpiresAt = expiresAt ? new Date(expiresAt) : null;
      user.restrictedBy = admin._id.toString();
    } else {
      // Only clear restriction fields if all restrictions are removed
      if (!user.shadowLimited && !user.messagingDisabled && !user.postingFrozen && !user.highRisk) {
        user.restrictionReason = null;
        user.restrictionExpiresAt = null;
        user.restrictedBy = null;
      }
    }

    await user.save();

    const afterState: any = {
      shadowLimited: user.shadowLimited,
      messagingDisabled: user.messagingDisabled,
      postingFrozen: user.postingFrozen,
      highRisk: user.highRisk,
    };

    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetUserId: id,
      targetUserRole: user.role as "TALENT" | "DIRECTOR",
      actionType: actionType as any,
      beforeState,
      afterState,
      reason: reason.trim(),
      metadata: { restrictionType, expiresAt },
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        shadowLimited: user.shadowLimited,
        messagingDisabled: user.messagingDisabled,
        postingFrozen: user.postingFrozen,
        highRisk: user.highRisk,
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
    console.error("Failed to apply restriction:", error);
    return NextResponse.json(
      { error: "Failed to apply restriction." },
      { status: 500 }
    );
  }
}



