import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

/**
 * POST /api/admin/setup
 * One-time setup endpoint to create admin user
 * This should be called once during initial setup
 * 
 * Request body:
 * - email: string (default: enjayjerey@gmail.com)
 * - password: string (default: password@123)
 * 
 * Returns:
 * - 200: { success: true, message: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminEmail = body.email || "enjayjerey@gmail.com";
    const adminPassword = body.password || "password@123";

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      if (existingAdmin.role === "ADMIN") {
        // Update password
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.emailVerified = new Date();
        await existingAdmin.save();
        return NextResponse.json({
          success: true,
          message: "Admin password updated successfully!",
          email: adminEmail,
        });
      } else {
        // Update role to ADMIN
        existingAdmin.role = "ADMIN";
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.emailVerified = new Date();
        await existingAdmin.save();
        return NextResponse.json({
          success: true,
          message: "User updated to admin successfully!",
          email: adminEmail,
        });
      }
    }

    // Create new admin user
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await User.create({
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      name: "Admin User",
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully!",
      email: adminEmail,
      userId: admin._id.toString(),
    });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin user", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/setup
 * Check if admin user exists
 */
export async function GET() {
  try {
    await connectDB();
    const admin = await User.findOne({ role: "ADMIN", email: "enjayjerey@gmail.com" });
    
    return NextResponse.json({
      exists: !!admin,
      email: admin?.email || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to check admin status", details: error.message },
      { status: 500 }
    );
  }
}

