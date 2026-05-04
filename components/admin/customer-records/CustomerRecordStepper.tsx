"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, title: "Personal" },
  { n: 2, title: "Address" },
  { n: 3, title: "Picture" },
  { n: 4, title: "Service" },
  { n: 5, title: "Review" },
] as const;

type Props = {
  currentStep: number;
  /** highest step index reached (0-based) — reserved for future “visited” styling */
  maxReached: number;
};

export function CustomerRecordStepper({ currentStep }: Props) {
  return (
    <div className="w-full">
      <div className="hidden md:flex items-center justify-between gap-2">
        {STEPS.map((s, idx) => {
          const active = idx === currentStep;
          const complete = idx < currentStep;
          return (
            <div key={s.title} className="flex flex-1 flex-col items-center min-w-0">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  complete && "border-heritage-gold bg-heritage-gold/20 text-charcoal",
                  active && !complete && "border-trust-blue bg-trust-blue text-white shadow-md",
                  !active && !complete && "border-charcoal/20 bg-white text-charcoal/50",
                )}
              >
                {complete ? <Check className="h-5 w-5 text-charcoal" aria-hidden /> : s.n}
              </div>
              <span
                className={cn(
                  "mt-2 text-center text-xs font-medium truncate max-w-full",
                  active ? "text-trust-blue" : "text-charcoal/65",
                )}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
      <div className="md:hidden overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-2 min-w-min">
          {STEPS.map((s, idx) => {
            const active = idx === currentStep;
            const complete = idx < currentStep;
            return (
              <div
                key={s.title}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium",
                  complete && "border-heritage-gold bg-heritage-gold/15 text-charcoal",
                  active && !complete && "border-trust-blue bg-trust-blue text-white",
                  !active && !complete && "border-charcoal/20 bg-white text-charcoal/55",
                )}
              >
                {s.n}. {s.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
