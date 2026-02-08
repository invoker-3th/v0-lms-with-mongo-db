import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongooseAdapter } from "@/lib/auth-adapter";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
  adapter: MongooseAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@hubmovies-cd.com",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("❌ Missing credentials", { hasEmail: !!credentials?.email, hasPassword: !!credentials?.password });
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          console.log("🔐 Attempting to connect to MongoDB...", { email });
          await connectDB();
          console.log("✅ MongoDB connected");

          const user = await User.findOne({ email });
          console.log("👤 User lookup:", { found: !!user, email });

          if (!user || !user.passwordHash) {
            console.error("❌ User not found or no password hash", { email });
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);
          console.log("🔑 Password validation:", { isValid, email });

          if (!isValid) {
            console.error("❌ Invalid password", { email });
            return null;
          }

          console.log("✅ Credentials verified, returning user object", { email, role: user.role });
          return {
            id: user._id.toString(),
            email: user.email!,
            name: user.name,
            image: user.image,
            role: user.role,
            emailVerified: !!user.emailVerified,
            profileCompletion: user.profileCompletion || 0,
          };
        } catch (error) {
          console.error("❌ Authorize error:", { error: error instanceof Error ? error.message : String(error) });
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth",
    verifyRequest: "/auth/send-otp",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - user object is available
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || (user as any).role;
        token.emailVerified = (user as any).emailVerified || false;
        token.name = (user as any).name;
        token.profileCompletion = (user as any).profileCompletion || 0;
      } else if (token.id) {
        // Refresh user data from database on each request
        await connectDB();
        const dbUser = await User.findById(token.id);
        if (dbUser) {
          token.role = dbUser.role;
          token.emailVerified = !!dbUser.emailVerified;
          token.name = dbUser.name;
          token.profileCompletion = dbUser.profileCompletion || 0;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass token data to session
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).emailVerified = token.emailVerified as boolean;
        (session.user as any).name = token.name as string;
        (session.user as any).profileCompletion = token.profileCompletion as number;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account && user.email) {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        // For email provider, set role if user is new
        if (account.provider === "email" && !existingUser) {
          // Role will be set when user completes signup via /auth/complete
          return true;
        }
      }
      return true;
    },
  },
};

const { handlers, auth } = NextAuth(authOptions);

// Export handlers
export const { GET, POST } = handlers;

// Export auth function for use in server components and API routes
export { auth };
