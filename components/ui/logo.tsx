import { BookOpen } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold text-xl ${className}`}>
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <BookOpen className="w-5 h-5" />
      </div>
      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">LearnHub</span>
    </Link>
  )
}
