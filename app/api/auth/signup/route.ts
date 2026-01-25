import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";
import VerificationToken from "@/models/verification-token";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const userRole = (role === "DIRECTOR" ? "DIRECTOR" : "TALENT") as "TALENT" | "DIRECTOR";

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with password (email not verified yet)
    const user = await User.create({
      email,
      passwordHash,
      role: userRole,
      emailVerified: null, // Will be verified when they click the email link
      verificationTier: "BASIC",
    });

    // Generate verification token
    const token = randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hour expiry

    await VerificationToken.create({
      identifier: email,
      token,
      expires,
    });

    // Send verification email with callback URL that includes token
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendVerificationEmail(email, verificationUrl);

    return NextResponse.json({
      success: true,
      message: "Account created. Please check your email to verify your account.",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle duplicate email error
    if (error.code === 11000 || error.message?.includes("duplicate")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

