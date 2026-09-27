import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva("w-full rounded-md border-l-4 px-4 py-3 text-sm", {
  variants: {
    variant: {
      default: "border-l-foreground/40 bg-muted",
      info: "border-l-primary bg-primary-soft",
      success: "border-l-success bg-success-soft",
      warning: "border-l-warning bg-warning-soft",
      destructive: "border-l-destructive bg-primary-soft text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role={variant === "destructive" ? "alert" : undefined}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-semibold", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-0.5 leading-relaxed", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
