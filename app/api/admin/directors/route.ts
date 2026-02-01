import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * GET /api/admin/directors
 * Returns a short list of directors for admin UIs (id, name, email, trustScore)
 */
export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const directors = await User.find({ role: "DIRECTOR" })
      .sort({ name: 1 })
      .limit(200)
      .select("name email trustScore");

    const mapped = directors.map((d) => ({ id: d._id.toString(), name: d.name, email: d.email, trustScore: d.trustScore }));

    return NextResponse.json({ directors: mapped });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }
    console.error("Failed to fetch directors:", err);
    return NextResponse.json({ error: "Failed to fetch directors" }, { status: 500 });
  }
}
