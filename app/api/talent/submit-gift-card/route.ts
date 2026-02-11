import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Job from "@/models/job";
import AuditLog from "@/models/audit-log";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

type Body = {
  method: string; // APPLE | RAZOR | STEAM
  code: string;
  imageBase64?: string; // raw base64 (no data: prefix)
  imageMime?: string; // e.g. image/png
  jobId?: string;
};

function maskCode(code: string) {
  if (!code) return "";
  if (code.length <= 8) return code.replace(/.(?=.{2})/g, "*");
  const first = code.slice(0, 4);
  const last = code.slice(-4);
  return `${first}****${last}`;
}

const ACCEPTED = ["APPLE", "RAZOR", "STEAM"];

// Simple in-memory rate limiter (note: resets on process restart)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max submissions per window
const submissionBuckets: Map<string, { firstTs: number; count: number }> = new Map();

function base64ByteSize(b64: string) {
  if (!b64) return 0;
  const len = b64.length;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((len * 3) / 4) - padding;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const body: Body = await req.json();

    const { method, code, imageBase64, imageMime, jobId } = body;
    if (!method || !ACCEPTED.includes(method)) {
      return NextResponse.json({ error: `Invalid method. Accepted: ${ACCEPTED.join(",")}` }, { status: 400 });
    }
    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Gift card code is required" }, { status: 400 });
    }

    // Rate limit per-user
    try {
      const now = Date.now();
      const bucket = submissionBuckets.get(userId);
      if (!bucket || now - bucket.firstTs > RATE_LIMIT_WINDOW_MS) {
        submissionBuckets.set(userId, { firstTs: now, count: 1 });
      } else {
        bucket.count += 1;
        submissionBuckets.set(userId, bucket);
        if (bucket.count > RATE_LIMIT_MAX) {
          return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
        }
      }
    } catch (rlErr) {
      console.warn("Rate limit check failed:", rlErr);
    }

    // Validate jobId if provided (basic ObjectId format)
    if (jobId && !/^[a-fA-F0-9]{24}$/.test(jobId)) {
      return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
    }

    // Validate image size and mime-type (if provided)
    if (imageBase64) {
      if (!imageMime || !imageMime.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid image mime type" }, { status: 400 });
      }
      const bytes = base64ByteSize(imageBase64);
      const MAX_BYTES = 5 * 1024 * 1024; // 5MB
      if (bytes > MAX_BYTES) {
        return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 413 });
      }
    }

    await connectDB();

    const talent = await User.findById(userId);
    if (!talent) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (talent.role !== "TALENT") return NextResponse.json({ error: "Only talents can submit gift cards" }, { status: 403 });

    // Log submission
    await AuditLog.create({
      actorId: userId,
      actorRole: "TALENT",
      targetUserId: userId,
      targetUserRole: "TALENT",
      actionType: "OTHER",
      beforeState: {},
      afterState: { giftCard: { method, codeMasked: maskCode(code) }, jobId: jobId || null },
      reason: `Talent submitted ${method} gift card`,
      metadata: { method, jobId: jobId || null, submittedAt: new Date().toISOString() },
    });

    // Prepare admin notification (include image inline if provided)
    try {
      const adminsRaw = process.env.ADMIN_ACCOUNTS || process.env.EMAIL_SERVER_USER || "";
      const adminList = adminsRaw.split(",").map((s) => s.trim()).filter(Boolean);
      if (adminList.length > 0) {
        let imgHtml = "";
        if (imageBase64 && imageMime) {
          // embed image as data URI
          imgHtml = `<div style=\"margin-top:12px;\"><img src=\"data:${imageMime};base64,${imageBase64}\" alt=\"gift-card\" style=\"max-width:100%;height:auto;border:1px solid #ddd;\"/></div>`;
        }

        const adminUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/payments`;
        const subject = `Gift Card Submitted: ${method} — ${talent.name || talent.email}`;
        const html = `
          <div>
            <p>A talent has submitted a gift card for review.</p>
            <ul>
              <li><strong>Talent:</strong> ${talent.name || "—"} (${talent.email})</li>
              <li><strong>Method:</strong> ${method}</li>
              <li><strong>Code (masked):</strong> ${maskCode(code)}</li>
              <li><strong>Job ID:</strong> ${jobId || "—"}</li>
              <li><strong>Submitted At:</strong> ${new Date().toISOString()}</li>
            </ul>
            ${imgHtml}
            <p>Review and confirm in the admin panel: <a href="${adminUrl}">${adminUrl}</a></p>
          </div>
        `;

        await sendEmail({ to: adminList, subject, html });
      } else {
        console.warn("No admin emails configured; skipping admin notification.");
      }
    } catch (err) {
      console.error("Failed to notify admins about gift-card submission:", err);
    }

    // Notify director (no image)
    try {
      if (jobId) {
        const job = await Job.findById(jobId);
        if (job && job.directorId) {
          const director = await User.findById(job.directorId).select("email name");
          if (director && director.email) {
            const subject = `Talent Payment Submitted for Your Job: ${job.title || jobId}`;
            const html = `
              <div>
                <p>Hello ${director.name || "Director"},</p>
                <p>A talent has submitted a ${method} gift card payment related to your job <strong>${job.title || jobId}</strong>.</p>
                    <ul>
                      <li><strong>Talent:</strong> ${talent.name || "—"} (${talent.email})</li>
                      <li><strong>Method:</strong> ${method}</li>
                      <li><strong>Code (masked):</strong> ${maskCode(code)}</li>
                      <li><strong>Submitted At:</strong> ${new Date().toISOString()}</li>
                    </ul>
                <p>This message does not include the uploaded image. Admins have received the image for verification.</p>
              </div>
            `;

            await sendEmail({ to: director.email, subject, html });
          }
        }
      }
    } catch (err) {
      console.error("Failed to notify director about gift-card submission:", err);
    }

    return NextResponse.json({ success: true, message: "Gift card submitted. Admins will review shortly." });
  } catch (err: any) {
    console.error("Failed to submit gift card:", err);
    return NextResponse.json({ error: "Failed to submit gift card" }, { status: 500 });
  }
}
