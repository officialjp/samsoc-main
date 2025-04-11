import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  id?: string
  className?: string
  children: ReactNode
  background?: string
}

export function SectionContainer({ id, className, children, background = "bg-white" }: SectionContainerProps) {
  return (
    <section id={id} className={cn("w-full py-12 md:py-24 lg:py-32", background, className)}>
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">{children}</div>
    </section>
  )
}
