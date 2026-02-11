import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { paymentMethod, paymentReference } = body;

    // Support ETH, BTC, APPLE (Apple Pay) and GIFT (gift card via a different flow)
    if (!paymentMethod || !["ETH", "BTC", "APPLE", "GIFT"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (!paymentReference || !paymentReference.trim()) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "TALENT") {
      return NextResponse.json({ error: "Only talents can submit payments" }, { status: 403 });
    }

    // Record payment submission (not confirmed yet)
    const beforeState = {
      paymentConfirmed: user.paymentConfirmed,
      paymentMethod: user.paymentMethod,
      paymentReference: user.paymentReference,
      frozen: user.frozen,
    };

    user.paymentMethod = paymentMethod;
    user.paymentReference = paymentReference.trim();
    // Keep frozen = true until admin confirms payment
    // paymentConfirmed stays false until admin verifies

    await user.save();

    // Create audit log for payment submission
    await AuditLog.create({
      actorId: userId,
      actorRole: "SYSTEM",
      targetUserId: userId,
      targetUserRole: "TALENT",
      actionType: "OTHER",
      beforeState,
      afterState: {
        paymentMethod: user.paymentMethod,
        paymentReference: user.paymentReference,
        frozen: user.frozen,
      },
      reason: `Talent submitted ${paymentMethod} payment for profile registration`,
      metadata: {
        paymentMethod,
        paymentReference: paymentReference.trim(),
        submittedAt: new Date().toISOString(),
      },
    });

    // Notify admins by email (addresses configured in ADMIN_ACCOUNTS env var)
    try {
      const adminsRaw = process.env.ADMIN_ACCOUNTS || process.env.EMAIL_SERVER_USER || "";
      const adminList = adminsRaw.split(",").map((s) => s.trim()).filter(Boolean);
      if (adminList.length > 0) {
        const adminUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/payments`;
        const subject = `Talent Payment Submitted: ${user.name || user.email}`;
        const html = `
          <p>A talent has submitted a payment for profile registration.</p>
          <ul>
            <li><strong>Name:</strong> ${user.name || "—"}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Method:</strong> ${paymentMethod}</li>
            <li><strong>Reference:</strong> ${paymentReference.trim()}</li>
            <li><strong>Submitted At:</strong> ${new Date().toISOString()}</li>
          </ul>
          <p>Review and confirm the payment in the admin panel: <a href="${adminUrl}">${adminUrl}</a></p>
        `;

        await sendEmail({ to: adminList, subject, html });
      } else {
        console.warn("No admin emails configured in ADMIN_ACCOUNTS or EMAIL_SERVER_USER; skipping admin notification.");
      }
    } catch (emailErr) {
      console.error("Failed to send admin notification for payment submission:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment submitted. An admin will verify and unlock your account shortly.",
    });
  } catch (err: any) {
    console.error("Failed to submit payment:", err);
    return NextResponse.json(
      { error: "Failed to submit payment. Please try again." },
      { status: 500 }
    );
  }
}
