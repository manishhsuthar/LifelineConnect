import * as React from "react"

import { cn } from "@/lib/utils"
import { fieldClasses } from "@/components/ui/input"

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(fieldClasses, "select-native h-10", className)} {...props} />
}

export { Select }
