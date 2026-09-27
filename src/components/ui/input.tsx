import * as React from "react"

import { cn } from "@/lib/utils"

const fieldClasses =
  "w-full rounded-md border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn(fieldClasses, "h-10", className)} {...props} />
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClasses, "min-h-24 py-2", className)} {...props} />
}

export { Input, Textarea, fieldClasses }
