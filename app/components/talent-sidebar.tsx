"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/talent/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/talent/profile", label: "Talent", icon: "profile" },
  { href: "/jobs", label: "Jobs", icon: "jobs" },
];

function Icon({ name }: { name: "dashboard" | "profile" | "jobs" }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 13h8V3H3z" />
          <path d="M13 21h8v-8h-8z" />
          <path d="M13 3h8v6h-8z" />
          <path d="M3 21h8v-6H3z" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c2-3 5-5 8-5s6 2 8 5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      );
  }
}

export default function TalentSidebar() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const pathname = usePathname();
  const [paymentPending, setPaymentPending] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "TALENT") return;

    async function fetchPaymentPending() {
      try {
        const res = await fetch("/api/talent/profile");
        if (res.ok) {
          const data = await res.json();
          setPaymentPending(!!data?.profile?.paymentPending);
        }
      } catch (error) {
        // Silent fallback
      }
    }

    fetchPaymentPending();
  }, [user]);

  if (!user || user.role !== "TALENT") {
    return null;
  }

  return (
    <aside className="hidden md:flex flex-col w-56 bg-black/30 border-r border-white/10 min-h-screen pt-28 px-4">
      <p className="text-xs tracking-[0.2em] text-[var(--accent-gold)] mb-6">TALENT</p>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const showPending = item.href === "/jobs" && paymentPending;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded border text-sm transition ${
                active
                  ? "bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border-[var(--accent-gold)]/30"
                  : "bg-white/5 text-[var(--text-secondary)] border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="inline-flex items-center justify-center">{<Icon name={item.icon as any} />}</span>
              <span>{item.label}</span>
              {showPending && (
                <span className="ml-auto text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-[var(--accent-gold)]/40 text-[var(--accent-gold)]">
                  Pending
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
