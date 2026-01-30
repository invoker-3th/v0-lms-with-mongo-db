import type React from "react"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimatedBackground />
      <div className="flex min-h-screen flex-col bg-background">
        <PublicHeader />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <PublicFooter />
      </div>
    </>
  )
}
