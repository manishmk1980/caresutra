"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, title: "Personal Details", short: "Personal" },
  { n: 2, title: "Address Details", short: "Address" },
  { n: 3, title: "Documents & KYC", short: "KYC" },
  { n: 4, title: "Service Details", short: "Service" },
  { n: 5, title: "Review & Submit", short: "Review" },
] as const;

type Props = {
  currentStep: number;
  /** highest step index reached (0-based) — reserved for future “visited” styling */
  maxReached: number;
};

export function CustomerRecordStepper({ currentStep, maxReached: _maxReached }: Props) {
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
                    "mt-2 text-center text-[11px] font-medium leading-tight max-w-full px-0.5 md:text-xs",
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
      <div className="md:hidden -mx-1 border-b border-soft-gold/25 pb-3">
        <div
          className="overflow-x-auto px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="navigation"
          aria-label="Form steps"
        >
          <div className="flex w-max min-w-full items-center gap-1.5">
            {STEPS.map((s, idx) => {
              const active = idx === currentStep;
              const complete = idx < currentStep;
              return (
                <div
                  key={s.title}
                  className={cn(
                    "flex min-w-max shrink-0 items-center rounded-full border",
                    active &&
                      !complete &&
                      "gap-1.5 border-trust-blue bg-trust-blue px-2 py-1 text-white shadow-md",
                    !active &&
                      "h-8 w-8 justify-center border-soft-gold/40 bg-white p-0 text-charcoal/55",
                    complete &&
                      !active &&
                      "border-trust-blue/35 bg-soft-gold/15 text-trust-blue",
                  )}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${s.title}${active ? " (current)" : ""}${complete ? " (completed)" : ""}`}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      active && !complete && "h-6 w-6 bg-white/20",
                      !active && "h-full w-full",
                      complete &&
                        !active &&
                        "h-full w-full bg-transparent [&>svg]:mx-auto",
                    )}
                  >
                    {complete && !active ? (
                      <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <span className={cn(active && !complete ? "leading-none" : "")}>{s.n}</span>
                    )}
                  </span>
                  {active && !complete ? (
                    <span className="whitespace-nowrap pr-1 text-xs font-semibold">{s.short}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
