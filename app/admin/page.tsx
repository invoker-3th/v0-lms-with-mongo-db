"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      router.push("/auth");
      return;
    }

    const user = session.user as any;
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    // Redirect to jobs management by default
    router.replace("/admin/jobs");
  }, [router, session, status]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
      <p className="text-[var(--text-secondary)]">Redirecting to admin dashboard...</p>
    </div>
  );
}

