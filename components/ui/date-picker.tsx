"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DatePickerFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Highlights trigger when validation failed */
  invalid?: boolean;
};

function parseYyyyMmDd(s: string | undefined): Date | undefined {
  if (!s?.trim()) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toYyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const DatePickerField = React.forwardRef<HTMLButtonElement, DatePickerFieldProps>(
  function DatePickerField(
    { value, onChange, placeholder = "Pick a date", disabled, id, className, invalid },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);
    const selected = parseYyyyMmDd(value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start rounded-xl border-soft-gold/40 bg-white text-left font-normal text-charcoal hover:bg-ivory/80",
              !value?.trim() && "text-charcoal/50",
              invalid && "border-amber-600 ring-1 ring-amber-500/50",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-support-blue" />
            {selected ? format(selected, "dd MMM yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              onChange(d ? toYyyyMmDd(d) : "");
              setOpen(false);
            }}
            defaultMonth={selected}
          />
          <div className="flex items-center justify-between gap-2 border-t border-soft-gold/30 px-2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-charcoal/70 hover:text-charcoal"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-trust-blue hover:text-support-blue"
              onClick={() => {
                onChange(toYyyyMmDd(new Date()));
                setOpen(false);
              }}
            >
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

DatePickerField.displayName = "DatePickerField";
