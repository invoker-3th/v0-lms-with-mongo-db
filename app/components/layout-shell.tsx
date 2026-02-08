"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { usePathname } from "next/navigation";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/talent/") || pathname.startsWith("/jobs");
  const hideFooter = hideHeader;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && (
        <>
          <Header />
          {/* Spacer to push content below fixed header - matches header height exactly */}
          <div className="h-[64px] sm:h-[72px] flex-shrink-0" aria-hidden="true" />
        </>
      )}
      <main className="flex-1 w-full">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
