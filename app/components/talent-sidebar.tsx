"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/talent/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/talent/profile", label: "Talent", icon: "profile" },
  { href: "/jobs", label: "Jobs", icon: "jobs" },
  { href: "/talent/inbox", label: "Inbox", icon: "inbox" },
];

function Icon({ name }: { name: "dashboard" | "profile" | "jobs" | "inbox" }) {
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
    case "inbox":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12l3-7h12l3 7v7H3z" />
          <path d="M3 12h6l2 3h2l2-3h6" />
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
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [locationLine, setLocationLine] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "TALENT") return;

    async function fetchPaymentPending() {
      try {
        const res = await fetch("/api/talent/profile");
        if (res.ok) {
          const data = await res.json();
          setPaymentPending(!!data?.profile?.paymentPending);
          setPaymentConfirmed(!!data?.profile?.paymentConfirmed);
          const state = (data?.profile?.locationState || "").trim();
          const country = (data?.profile?.locationCountry || "").trim();
          const line = [state, country].filter(Boolean).join(", ");
          setLocationLine(line);
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
    <>
      <aside className="hidden md:flex flex-col w-56 bg-black/30 border-r border-white/10 min-h-screen pt-6 md:pt-8 px-2 md:px-4">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="relative">
          {user?.image ? (
            <img
              src={user.image}
              alt={user?.name || "Talent"}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/20 object-cover"
            />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)] text-xs font-medium">
              {(user?.name || user?.email || "T")[0].toString().toUpperCase()}
            </div>
          )}
          {paymentConfirmed && (
            <span
              title="Verified"
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"
            />
          )}
          {!paymentConfirmed && paymentPending && (
            <span
              title="Payment Pending"
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--accent-gold)] border-2 border-black rounded-full"
            />
          )}
        </div>
        <div className="hidden md:block">
          <p className="text-sm text-white font-medium truncate max-w-[140px]">
            {user?.name || user?.email}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {locationLine || "Location not set"}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Status:{" "}
            <span className="text-white">
              {paymentConfirmed ? "Verified" : paymentPending ? "Pending" : "Unverified"}
            </span>
          </p>
        </div>
      </div>
      <p className="hidden md:block text-xs tracking-[0.2em] text-[var(--accent-gold)] mb-4">TALENT</p>
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
              <span className="hidden md:inline">{item.label}</span>
              {showPending && (
                <span className="ml-auto text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] hidden md:inline">
                  Pending
                </span>
              )}
            </Link>
          );
        })}
        <div className="my-2 border-t border-white/10" />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded border text-sm transition bg-white/5 text-[var(--text-secondary)] border-white/10 hover:border-white/30 hover:text-white"
        >
          <span className="inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          </span>
          <span className="hidden md:inline">Home</span>
        </Link>
        <button
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
              router.refresh();
            });
          }}
          className="flex items-center gap-3 px-3 py-2 rounded border text-sm transition bg-white/5 text-[var(--text-secondary)] border-white/10 hover:border-white/30 hover:text-white text-left"
        >
          <span className="inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </span>
          <span className="hidden md:inline">Sign Out</span>
        </button>
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/70 backdrop-blur border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const showPending = item.href === "/jobs" && paymentPending;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[10px] ${
                  active ? "text-[var(--accent-gold)]" : "text-[var(--text-secondary)]"
                }`}
              >
                <div className="relative">
                  <Icon name={item.icon as any} />
                  {showPending && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-[var(--accent-gold)] rounded-full" />
                  )}
                </div>
                {active ? (
                  <span className="text-[10px]">{item.label}</span>
                ) : (
                  <span className="sr-only">{item.label}</span>
                )}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-[10px] text-[var(--text-secondary)]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
          <button
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/");
                router.refresh();
              });
            }}
            className="flex flex-col items-center gap-1 text-[10px] text-[var(--text-secondary)]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            <span className="sr-only">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
