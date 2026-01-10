/**
 * Script to create admin user
 * Run with: npx tsx scripts/create-admin.ts
 * Or: ts-node scripts/create-admin.ts
 */

import { connectDB } from "../lib/mongodb";
import User from "../models/user";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    await connectDB();
    console.log("Connected to database");

    const adminEmail = "enjayjerey@gmail.com";
    const adminPassword = "password@123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      if (existingAdmin.role === "ADMIN") {
        console.log("Admin user already exists. Updating password...");
        // Update password
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.emailVerified = new Date();
        await existingAdmin.save();
        console.log("✅ Admin password updated successfully!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
      } else {
        console.log("User exists but is not an admin. Updating role...");
        existingAdmin.role = "ADMIN";
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.emailVerified = new Date();
        await existingAdmin.save();
        console.log("✅ User updated to admin successfully!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
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

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`User ID: ${admin._id}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

