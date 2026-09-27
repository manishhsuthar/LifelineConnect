import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Only allow same-site relative paths as post-login redirects. */
export function safeRedirect(target: string | null, fallback: string) {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return fallback
  }
  return target
}
