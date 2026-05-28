import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Subtle helper under inputs (admin forms). */
export function FieldHint({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[11px] leading-snug text-charcoal/55 md:text-xs", className)}>{children}</p>;
}

/** Required field marker — use with visible label text, not as sole indicator. */
export function RequiredMark() {
  return (
    <span className="ml-0.5 text-support-blue" aria-hidden="true">
      *
    </span>
  );
}
