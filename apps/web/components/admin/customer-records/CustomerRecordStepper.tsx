"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { n: 1, title: "Personal Details", short: "Personal" },
  { n: 2, title: "Address Details", short: "Address" },
  { n: 3, title: "Documents & KYC", short: "KYC" },
  { n: 4, title: "Service Details", short: "Service" },
  { n: 5, title: "Review & Submit", short: "Review" },
] as const

type Props = {
  currentStep: number
  maxReached: number
}

export function CustomerRecordStepper({ currentStep, maxReached }: Props) {
  const activeStep = STEPS[currentStep] ?? STEPS[0]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="w-full rounded-2xl border border-soft-gold/35 bg-white p-3 shadow-sm md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-trust-blue">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <p className="truncate text-sm font-semibold text-charcoal">
              {activeStep.title}
            </p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-trust-blue text-sm font-bold text-white">
            {activeStep.n}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft-gold/25">
          <div
            className="h-full rounded-full bg-trust-blue transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5" aria-label="Form steps">
          {STEPS.map((s, idx) => {
            const active = idx === currentStep
            const complete = idx < currentStep
            const reached = idx <= maxReached

            return (
              <div
                key={s.title}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-1.5 text-center",
                  active && "border-trust-blue bg-trust-blue text-white",
                  complete && !active && "border-green-200 bg-green-50 text-green-700",
                  !active && !complete && reached && "border-soft-gold/50 bg-ivory/45 text-charcoal/70",
                  !active && !complete && !reached && "border-slate-200 bg-white text-charcoal/45"
                )}
                aria-current={active ? "step" : undefined}
              >
                <span className="flex size-5 items-center justify-center rounded-full text-[11px] font-bold">
                  {complete ? <Check className="size-3.5" aria-hidden /> : s.n}
                </span>
                <span className="w-full truncate text-[10px] font-semibold leading-none">
                  {s.short}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="hidden items-start justify-between gap-2 md:flex">
        {STEPS.map((s, idx) => {
          const active = idx === currentStep
          const complete = idx < currentStep
          const connectorState =
            idx < currentStep - 1 ? "complete" : idx === currentStep - 1 ? "active" : "pending"
          return (
            <div key={s.title} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    complete && "border-green-600 bg-green-100 text-green-700",
                    active && !complete && "border-trust-blue bg-trust-blue text-white shadow-md",
                    !active && !complete && "border-soft-gold/50 bg-white text-charcoal/50"
                  )}
                >
                  {complete ? <Check className="size-5 text-green-700" aria-hidden /> : s.n}
                </div>
                <span
                  className={cn(
                    "mt-2 max-w-full px-0.5 text-center text-xs font-medium leading-tight",
                    complete && "text-green-700",
                    active && "text-trust-blue",
                    !active && !complete && "text-charcoal/65"
                  )}
                >
                  {s.title}
                </span>
              </div>
              {idx < STEPS.length - 1 ? (
                <div className="mx-2 mt-5 h-[3px] flex-1 rounded-full bg-soft-gold/35">
                  <div
                    className={cn(
                      "h-full rounded-full transition-colors",
                      connectorState === "complete" && "bg-green-500",
                      connectorState === "active" && "bg-trust-blue",
                      connectorState === "pending" && "bg-soft-gold/45"
                    )}
                  />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
