"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificationBell from "./notifications/notification-bell";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg sm:text-xl tracking-wide text-white flex-shrink-0"
        >
          Hub<span className="text-[var(--accent-gold)]">Movies</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm tracking-wide">
          <Link href="/jobs" className="text-[var(--text-secondary)] hover:text-white transition">
            Jobs
          </Link>
          <Link href="/talents" className="text-[var(--text-secondary)] hover:text-white transition">
            Talents
          </Link>
          <Link href="/how-it-works" className="text-[var(--text-secondary)] hover:text-white transition">
            How It Works
          </Link>
          <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-white transition">
            Pricing
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {status === "loading" ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <>
              <NotificationBell />
              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3">
                {user?.role === "ADMIN" ? (
                  <span className="text-xs sm:text-sm text-white font-medium">Welcome Admin</span>
                ) : (
                  <>
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[var(--accent-gold)] text-xs font-medium">
                          {(user?.name || user?.email || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-xs sm:text-sm text-white font-medium hidden sm:block max-w-[100px] truncate">
                      {user?.name || user?.email?.split("@")[0] || "User"}
                    </span>
                  </>
                )}
                <button
                  onClick={() => {
                    signOut({ redirect: false }).then(() => {
                      router.push("/");
                      router.refresh();
                    });
                  }}
                  className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition"
                >
                  Sign Out
                </button>
              </div>
              {/* Dashboard Link based on role */}
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin/jobs"
                  className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition hidden lg:block"
                >
                  Admin Dashboard
                </Link>
              ) : user?.role === "DIRECTOR" ? (
                <Link
                  href="/director/dashboard"
                  className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition hidden lg:block"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/talent/dashboard"
                  className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition hidden lg:block"
                >
                  Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <NotificationBell />
              <Link
                href="/auth/password"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[var(--accent-gold)] text-[var(--accent-gold)] text-xs sm:text-sm hover:bg-[var(--accent-gold)] hover:text-black transition whitespace-nowrap"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
