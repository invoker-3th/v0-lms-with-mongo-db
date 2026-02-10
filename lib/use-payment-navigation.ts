"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UsePaymentNavigationOptions = {
  redirectTo?: string;
};

export function usePaymentNavigation(options: UsePaymentNavigationOptions = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const goToPayment = async () => {
    if (loading) return;
    setLoading(true);

    let delayMs = 800;

    while (aliveRef.current) {
      try {
        const res = await fetch("/api/admin/payment", { cache: "no-store" });
        if (res.ok) {
          router.push(options.redirectTo || "/auth/payment");
          return;
        }
      } catch {
        // Keep retrying until the settings endpoint responds.
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs = Math.min(3000, delayMs + 400);
    }
  };

  return { goToPayment, loading };
}
