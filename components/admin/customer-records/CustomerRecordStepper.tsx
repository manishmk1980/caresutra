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
          const connectorState =
            idx < currentStep - 1 ? "complete" : idx === currentStep - 1 ? "active" : "pending";
          return (
            <div key={s.title} className="flex flex-1 items-start min-w-0">
              <div className="flex w-full flex-col items-center min-w-0">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    complete && "border-green-600 bg-green-100 text-green-700",
                    active && !complete && "border-trust-blue bg-trust-blue text-white shadow-md",
                    !active && !complete && "border-soft-gold/50 bg-white text-charcoal/50",
                  )}
                >
                  {complete ? <Check className="h-5 w-5 text-green-700" aria-hidden /> : s.n}
                </div>
                <span
                  className={cn(
                    "mt-2 text-center text-xs font-medium truncate max-w-full",
                    complete && "text-green-700",
                    active && "text-trust-blue",
                    !active && !complete && "text-charcoal/65",
                  )}
                >
                  {s.title}
                </span>
              </div>
              {idx < STEPS.length - 1 ? (
                <div className="mt-5 h-[3px] flex-1 rounded-full bg-soft-gold/35 mx-2">
                  <div
                    className={cn(
                      "h-full rounded-full transition-colors",
                      connectorState === "complete" && "bg-green-500",
                      connectorState === "active" && "bg-trust-blue",
                      connectorState === "pending" && "bg-soft-gold/45",
                    )}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="md:hidden overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-center gap-2 min-w-min">
          {STEPS.map((s, idx) => {
            const active = idx === currentStep;
            const complete = idx < currentStep;
            return (
              <div key={s.title} className="flex items-center gap-2">
                <div
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium",
                    complete && "border-green-500 bg-green-100 text-green-700",
                    active && !complete && "border-trust-blue bg-trust-blue text-white",
                    !active && !complete && "border-soft-gold/50 bg-white text-charcoal/55",
                  )}
                >
                  {s.n}. {s.title}
                </div>
                {idx < STEPS.length - 1 ? (
                  <div
                    className={cn(
                      "h-[2px] w-6 rounded-full",
                      idx < currentStep - 1 && "bg-green-500",
                      idx === currentStep - 1 && "bg-trust-blue",
                      idx >= currentStep && "bg-soft-gold/45",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
