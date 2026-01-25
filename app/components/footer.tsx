"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block mb-4 font-heading text-xl sm:text-2xl tracking-wide text-white hover:text-[var(--accent-gold)] transition"
            >
              Hub<span className="text-[var(--accent-gold)]">Movies</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed max-w-xs">
              A global casting marketplace connecting actors, filmmakers, and creative professionals with producers, studios, and brands.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-heading text-white mb-4 sm:mb-6 text-sm tracking-wide uppercase">
              Navigation
            </h3>
            <nav className="flex flex-col gap-3 sm:gap-4">
              <Link
                href="/jobs"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Jobs
              </Link>
              <Link
                href="/talents"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Talents
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-heading text-white mb-4 sm:mb-6 text-sm tracking-wide uppercase">
              Resources
            </h3>
            <nav className="flex flex-col gap-3 sm:gap-4">
              <Link
                href="/auth"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Create Account
              </Link>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Reset Password
              </Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-heading text-white mb-4 sm:mb-6 text-sm tracking-wide uppercase">
              Legal
            </h3>
            <nav className="flex flex-col gap-3 sm:gap-4">
              <Link
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-12 border-t border-[var(--border-subtle)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body text-center sm:text-left">
              © {currentYear} HubMovies. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition font-body"
                aria-label="Twitter"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition font-body"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition font-body"
                aria-label="Instagram"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

