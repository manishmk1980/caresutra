"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  messages: string[];
  className?: string;
};

const MAX = 5;

export function FormErrorSummary({
  title = "Please fix the following before saving:",
  messages,
  className,
}: Props) {
  if (messages.length === 0) return null;

  const shown = messages.slice(0, MAX);
  const extra = messages.length - shown.length;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-amber-300/90 bg-amber-50/95 px-4 py-3 text-charcoal shadow-sm",
        className,
      )}
    >
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" aria-hidden />
        <div className="min-w-0 space-y-2">
          <p className="font-semibold text-charcoal text-sm">{title}</p>
          <ul className="list-disc pl-4 space-y-1 text-sm text-charcoal/90">
            {shown.map((msg, i) => (
              <li key={`${i}-${msg.slice(0, 24)}`}>{msg}</li>
            ))}
          </ul>
          {extra > 0 ? (
            <p className="text-sm text-charcoal/75">And {extra} more issue{extra === 1 ? "" : "s"}.</p>
          ) : null}
          <p className="text-sm text-charcoal/80 border-t border-amber-200/80 pt-2 mt-1">
            Review the highlighted fields below.
          </p>
        </div>
      </div>
    </div>
  );
}
