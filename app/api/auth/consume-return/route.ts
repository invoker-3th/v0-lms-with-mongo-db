import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getUserId } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const returnTo = user.pendingReturnUrl || null;

    // Clear the pendingReturnUrl
    user.pendingReturnUrl = undefined;
    await user.save();

    return NextResponse.json({ returnTo });
  } catch (err) {
    console.error("consume-return error:", err);
    return NextResponse.json({ error: "Failed to consume return url" }, { status: 500 });
  }
}
