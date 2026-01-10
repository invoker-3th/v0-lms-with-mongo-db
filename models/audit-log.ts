import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: String,
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ["ADMIN", "SYSTEM"],
      required: true,
    },
    targetUserId: {
      type: String,
      required: false,
      index: true,
    },
    targetUserRole: {
      type: String,
      enum: ["TALENT", "DIRECTOR"],
      required: false,
    },
    targetJobId: {
      type: String,
      required: false,
      index: true,
    },
    actionType: {
      type: String,
      enum: [
        "TRUST_TIER_CHANGE",
        "TRUST_SCORE_OVERRIDE",
        "RESTRICTION_APPLIED",
        "RESTRICTION_REMOVED",
        "FLAG_ADDED",
        "FLAG_REMOVED",
        "ACCOUNT_FROZEN",
        "ACCOUNT_UNFROZEN",
        "PROFILE_EDITED",
        "JOB_CLOSED_EARLY",
        "JOB_HIDDEN",
        "JOB_UNHIDDEN",
        "VERIFICATION_TIER_CHANGE",
        "OTHER",
      ],
      required: true,
      index: true,
    },
    beforeState: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    afterState: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Performance indexes
AuditLogSchema.index({ targetUserId: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ actionType: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);



