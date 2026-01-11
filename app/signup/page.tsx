"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"TALENT" | "DIRECTOR">("TALENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Check for role query parameter
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "DIRECTOR") {
      setRole("DIRECTOR");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Store role in sessionStorage for use in complete page
      sessionStorage.setItem("authRole", role);

      // Send sign-in email via NextAuth email provider
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/auth/complete",
      });

      if (result?.error) {
        setError("Failed to send verification email. Please try again.");
      } else {
        setMessage("Verification email sent! Please check your inbox and click the link to complete your registration.");
        // Redirect to check email page after a short delay
        setTimeout(() => {
          router.push("/auth/check-email");
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative flex items-center justify-center p-8">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading text-white mb-2">Create Account</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Join HubMovies Cast as a Talent or Director
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-white/5 border border-red-500/30 rounded text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-white/5 border border-green-500/30 rounded text-sm text-green-400">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-3 font-body">
              I am a <span className="text-[var(--accent-gold)]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("TALENT")}
                className={`px-4 py-3 rounded border transition font-medium ${
                  role === "TALENT"
                    ? "bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                Talent
              </button>
              <button
                type="button"
                onClick={() => setRole("DIRECTOR")}
                className={`px-4 py-3 rounded border transition font-medium ${
                  role === "DIRECTOR"
                    ? "bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                Director
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              {role === "TALENT"
                ? "Apply for roles and showcase your portfolio"
                : "Post casting calls and find talent"}
            </p>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 font-body">
              Email <span className="text-[var(--accent-gold)]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-gold)]/50 font-body"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[var(--accent-gold)] text-black font-medium rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-body"
          >
            {loading ? "Sending..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/auth/password" className="text-[var(--accent-gold)] hover:underline font-body">
              Sign In
            </Link>
          </p>
          <Link
            href="/auth"
            className="block text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
          >
            ← Back to start
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

