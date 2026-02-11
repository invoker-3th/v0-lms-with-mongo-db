"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function PostLoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const res = await fetch("/api/auth/consume-return", { method: "POST" });
        if (!res.ok) return;
        const data = await res.json();
        const returnTo = data?.returnTo;
        if (returnTo) {
          // Navigate to the saved return URL and replace history
          router.replace(returnTo);
        }
      } catch (err) {
        // Ignore errors
      }
    })();
  }, [status, session, router]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostLoginRedirect />
      {children}
    </SessionProvider>
  );
}



