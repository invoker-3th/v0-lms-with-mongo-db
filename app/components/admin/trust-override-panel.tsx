"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type UserData = {
  _id: string;
  email: string;
  name?: string;
  verificationTier?: string;
  trustScore?: number;
  trustLevel?: string;
  frozen?: boolean;
  shadowLimited?: boolean;
  messagingDisabled?: boolean;
  postingFrozen?: boolean;
  highRisk?: boolean;
};

type TrustOverridePanelProps = {
  user: UserData;
  userRole: "TALENT" | "DIRECTOR";
  onAction: (action: {
    actionType: string;
    beforeState: any;
    afterState: any;
    reason: string;
    metadata?: any;
    endpoint?: string;
    method?: string;
  }) => void;
};

export default function TrustOverridePanel({
  user,
  userRole,
  onAction,
}: TrustOverridePanelProps) {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [trustScoreOverride, setTrustScoreOverride] = useState<string>("");
  const [reason, setReason] = useState("");
  const [restrictionDuration, setRestrictionDuration] = useState<string>("");
  const [freezeReason, setFreezeReason] = useState("");
  const [freezeDuration, setFreezeDuration] = useState<string>("");
  const [restrictionType, setRestrictionType] = useState<string>("");

  const handleTierChange = (direction: "promote" | "demote") => {
    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    const tiers = userRole === "TALENT"
      ? ["BASIC", "COMPLETE", "VERIFIED", "FEATURED"]
      : ["NEW_DIRECTOR", "TRUSTED_DIRECTOR", "VERIFIED_STUDIO"];
    
    const currentTier = userRole === "TALENT" ? user.verificationTier : user.trustLevel;
    const currentIndex = tiers.indexOf(currentTier || tiers[0]);
    
    let newTier: string;
    if (direction === "promote") {
      newTier = tiers[Math.min(currentIndex + 1, tiers.length - 1)];
    } else {
      newTier = tiers[Math.max(currentIndex - 1, 0)];
    }

    if (newTier === currentTier) {
      alert(`Cannot ${direction === "promote" ? "promote" : "demote"} - already at ${direction === "promote" ? "highest" : "lowest"} tier`);
      return;
    }

    const beforeState = userRole === "TALENT"
      ? { verificationTier: user.verificationTier }
      : { trustLevel: user.trustLevel };

    const afterState = userRole === "TALENT"
      ? { verificationTier: newTier }
      : { trustLevel: newTier };

    onAction({
      actionType: userRole === "TALENT" ? "VERIFICATION_TIER_CHANGE" : "TRUST_TIER_CHANGE",
      beforeState,
      afterState,
      reason: reason.trim(),
      metadata: { direction },
    });
  };

  const handleFreeze = (action: "freeze" | "unfreeze") => {
    if (!freezeReason.trim()) {
      alert("Please provide a reason");
      return;
    }

    const beforeState = { frozen: user.frozen };
    const afterState = { frozen: action === "freeze" };

    onAction({
      actionType: action === "freeze" ? "ACCOUNT_FROZEN" : "ACCOUNT_UNFROZEN",
      beforeState,
      afterState,
      reason: freezeReason.trim(),
      metadata: { expiresAt: freezeDuration ? new Date(freezeDuration).toISOString() : null },
      endpoint: action === "freeze" 
        ? `/api/admin/users/${user._id}/freeze`
        : `/api/admin/users/${user._id}/unfreeze`,
      method: "POST",
    });
  };

  const handleRestriction = (restrictionType: string, action: "APPLY" | "REMOVE") => {
    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    const beforeState: any = {
      shadowLimited: user.shadowLimited,
      messagingDisabled: user.messagingDisabled,
      postingFrozen: user.postingFrozen,
      highRisk: user.highRisk,
    };

    onAction({
      actionType: action === "APPLY" ? "RESTRICTION_APPLIED" : "RESTRICTION_REMOVED",
      beforeState,
      afterState: beforeState, // Will be updated by API
      reason: reason.trim(),
      metadata: { 
        restrictionType, 
        expiresAt: restrictionDuration ? new Date(restrictionDuration).toISOString() : null 
      },
      endpoint: `/api/admin/users/${user._id}/restrictions`,
      method: "POST",
    });
  };

  const talentTiers = ["BASIC", "COMPLETE", "VERIFIED", "FEATURED"];
  const directorTiers = ["NEW_DIRECTOR", "TRUSTED_DIRECTOR", "VERIFIED_STUDIO"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-heading font-semibold text-white mb-4">
        Admin Override Actions
      </h2>

      {/* 1. Change Trust/Verification Tier */}
      <div className="p-4 bg-white/5 rounded border border-white/10">
        <h3 className="text-lg font-medium text-white mb-3">
          1. Change {userRole === "TALENT" ? "Verification" : "Trust"} Tier
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Current Tier: <span className="text-white">{userRole === "TALENT" ? user.verificationTier : user.trustLevel}</span>
            </label>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you're making this change..."
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white min-h-[80px]"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleTierChange("promote")}
              disabled={!reason.trim()}
              className="flex-1 px-4 py-2 bg-[var(--accent-gold)] text-black font-medium rounded hover:bg-[var(--accent-gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Promote Tier
            </button>
            <button
              onClick={() => handleTierChange("demote")}
              disabled={!reason.trim()}
              className="flex-1 px-4 py-2 border border-[var(--accent-gold)] text-[var(--accent-gold)] font-medium rounded hover:bg-[var(--accent-gold)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Demote Tier
            </button>
          </div>
        </div>
      </div>

      {/* 2. Trust Score Override (Directors only) */}
      {userRole === "DIRECTOR" && (
        <div className="p-4 bg-white/5 rounded border border-white/10">
          <h3 className="text-lg font-medium text-white mb-3">2. Override Trust Score</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Current Score: <span className="text-white">{user.trustScore || 0}%</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={trustScoreOverride}
                onChange={(e) => setTrustScoreOverride(e.target.value)}
                placeholder="Enter new trust score (0-100)"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you're overriding the trust score..."
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white min-h-[80px]"
                required
              />
            </div>
            <button
              onClick={() => {
                const score = parseInt(trustScoreOverride);
                if (isNaN(score) || score < 0 || score > 100) {
                  alert("Trust score must be between 0 and 100");
                  return;
                }
                onAction({
                  actionType: "TRUST_SCORE_OVERRIDE",
                  beforeState: { trustScore: user.trustScore },
                  afterState: { trustScore: score },
                  reason: reason.trim(),
                });
              }}
              disabled={!trustScoreOverride || !reason.trim()}
              className="w-full px-4 py-2 bg-[var(--accent-gold)] text-black font-medium rounded hover:bg-[var(--accent-gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Override Score
            </button>
          </div>
        </div>
      )}

      {/* 3. Freeze/Unfreeze Account */}
      <div className="p-4 bg-white/5 rounded border border-white/10">
        <h3 className="text-lg font-medium text-white mb-3">
          3. {user.frozen ? "Unfreeze" : "Freeze"} Account
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Status: <span className={user.frozen ? "text-red-400" : "text-green-400"}>
                {user.frozen ? "FROZEN" : "ACTIVE"}
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              placeholder="Explain why you're freezing/unfreezing this account..."
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white min-h-[80px]"
              required
            />
          </div>
          {!user.frozen && (
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Expires At (optional, leave empty for indefinite)
              </label>
              <input
                type="datetime-local"
                value={freezeDuration}
                onChange={(e) => setFreezeDuration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          )}
          <button
            onClick={() => handleFreeze(user.frozen ? "unfreeze" : "freeze")}
            disabled={!freezeReason.trim()}
            className={`w-full px-4 py-2 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed ${
              user.frozen
                ? "bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {user.frozen ? "Unfreeze Account" : "Freeze Account"}
          </button>
        </div>
      </div>

      {/* 4. Apply Restrictions */}
      {userRole === "TALENT" ? (
        <div className="p-4 bg-white/5 rounded border border-white/10">
          <h3 className="text-lg font-medium text-white mb-3">4. Apply Restrictions (Talent)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Restriction Type
              </label>
              <select
                value={restrictionType}
                onChange={(e) => setRestrictionType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              >
                <option value="">Select Restriction</option>
                <option value="SHADOW_LIMIT" className="bg-[var(--bg-main)]">
                  Shadow-Limit (Reduce Visibility)
                </option>
              </select>
            </div>
            {restrictionType && (
              <>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Current: <span className={user.shadowLimited ? "text-red-400" : "text-green-400"}>
                      {user.shadowLimited ? "SHADOW-LIMITED" : "NORMAL"}
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Reason <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you're applying this restriction..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white min-h-[80px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Expires At (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={restrictionDuration}
                    onChange={(e) => setRestrictionDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRestriction(restrictionType, user.shadowLimited ? "REMOVE" : "APPLY")}
                    disabled={!reason.trim()}
                    className={`flex-1 px-4 py-2 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                      user.shadowLimited
                        ? "bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90"
                        : "border border-orange-500 text-orange-500 hover:bg-orange-500/10"
                    }`}
                  >
                    {user.shadowLimited ? "Remove Restriction" : "Apply Restriction"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white/5 rounded border border-white/10">
          <h3 className="text-lg font-medium text-white mb-3">4. Apply Restrictions (Director)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Restriction Type
              </label>
              <select
                value={restrictionType}
                onChange={(e) => setRestrictionType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              >
                <option value="">Select Restriction</option>
                <option value="FREEZE_POSTING" className="bg-[var(--bg-main)]">
                  Freeze Job Posting
                </option>
                <option value="DISABLE_MESSAGING" className="bg-[var(--bg-main)]">
                  Disable Messaging
                </option>
                <option value="FLAG_HIGH_RISK" className="bg-[var(--bg-main)]">
                  Flag as High Risk (Internal)
                </option>
              </select>
            </div>
            {restrictionType && (
              <>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Current Status:
                  </label>
                  <div className="text-xs space-y-1">
                    {restrictionType === "FREEZE_POSTING" && (
                      <span className={user.postingFrozen ? "text-red-400" : "text-green-400"}>
                        Posting: {user.postingFrozen ? "FROZEN" : "ALLOWED"}
                      </span>
                    )}
                    {restrictionType === "DISABLE_MESSAGING" && (
                      <span className={user.messagingDisabled ? "text-red-400" : "text-green-400"}>
                        Messaging: {user.messagingDisabled ? "DISABLED" : "ENABLED"}
                      </span>
                    )}
                    {restrictionType === "FLAG_HIGH_RISK" && (
                      <span className={user.highRisk ? "text-red-400" : "text-green-400"}>
                        High Risk: {user.highRisk ? "FLAGGED" : "NOT FLAGGED"}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Reason <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you're applying this restriction..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white min-h-[80px]"
                    required
                  />
                </div>
                {restrictionType !== "FLAG_HIGH_RISK" && (
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">
                      Expires At (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={restrictionDuration}
                      onChange={(e) => setRestrictionDuration(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const isActive = restrictionType === "FREEZE_POSTING" ? user.postingFrozen
                        : restrictionType === "DISABLE_MESSAGING" ? user.messagingDisabled
                        : user.highRisk;
                      handleRestriction(restrictionType, isActive ? "REMOVE" : "APPLY");
                    }}
                    disabled={!reason.trim()}
                    className={`flex-1 px-4 py-2 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                      (restrictionType === "FREEZE_POSTING" && user.postingFrozen) ||
                      (restrictionType === "DISABLE_MESSAGING" && user.messagingDisabled) ||
                      (restrictionType === "FLAG_HIGH_RISK" && user.highRisk)
                        ? "bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90"
                        : restrictionType === "FLAG_HIGH_RISK"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "border border-orange-500 text-orange-500 hover:bg-orange-500/10"
                    }`}
                  >
                    {(restrictionType === "FREEZE_POSTING" && user.postingFrozen) ||
                    (restrictionType === "DISABLE_MESSAGING" && user.messagingDisabled) ||
                    (restrictionType === "FLAG_HIGH_RISK" && user.highRisk)
                      ? "Remove Restriction"
                      : "Apply Restriction"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}



