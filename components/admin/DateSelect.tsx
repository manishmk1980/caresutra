"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS: { value: string; label: string }[] = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function daysInMonth(year: number, month1to12: number): number {
  if (!year || !month1to12) return 31;
  return new Date(year, month1to12, 0).getDate();
}

function parseYmd(value: string): { y: string; m: string; d: string } {
  const t = value?.trim() ?? "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!match) return { y: "", m: "", d: "" };
  return { y: match[1]!, m: match[2]!, d: match[3]! };
}

function buildYmd(y: string, m: string, d: string): string {
  if (!y || !m || !d) return "";
  const yi = Number(y);
  const mi = Number(m);
  const di = Number(d);
  if (!Number.isFinite(yi) || !Number.isFinite(mi) || !Number.isFinite(di)) return "";
  const maxDay = daysInMonth(yi, mi);
  if (di < 1 || di > maxDay) return "";
  return `${y}-${m}-${d}`;
}

export type DateSelectMode = "past" | "future";

export type DateSelectProps = {
  /** Shown only when omitLabel is false */
  label: string;
  omitLabel?: boolean;
  /** YYYY-MM-DD or "" */
  value: string;
  onChange: (next: string) => void;
  error?: boolean;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
  mode?: DateSelectMode;
  helperText?: string;
  /** Prefix for summary line, e.g. "Selected DOB" */
  summaryPrefix?: string;
  allowClear?: boolean;
  id?: string;
};

export const DateSelect = React.forwardRef<HTMLDivElement, DateSelectProps>(function DateSelect(
  {
    label,
    omitLabel = false,
    value,
    onChange,
    error,
    required,
    minYear = 1920,
    maxYear,
    mode = "past",
    helperText,
    summaryPrefix = "Selected",
    allowClear = false,
    id,
  },
  ref,
) {
  const now = new Date();
  const cy = now.getFullYear();
  const defaultMax = mode === "past" ? cy : cy + 30;
  const defaultMin = mode === "future" ? 2000 : minYear;
  const maxY = maxYear ?? defaultMax;
  const minY = minYear ?? defaultMin;

  const parsed = React.useMemo(() => parseYmd(value), [value]);
  const [y, setY] = React.useState(parsed.y);
  const [m, setM] = React.useState(parsed.m);
  const [d, setD] = React.useState(parsed.d);

  React.useEffect(() => {
    const p = parseYmd(value);
    setY(p.y);
    setM(p.m);
    setD(p.d);
  }, [value]);

  const yi = y ? Number(y) : 0;
  const mi = m ? Number(m) : 0;
  const maxDay = yi && mi ? daysInMonth(yi, mi) : 31;
  const dayOptions = React.useMemo(
    () => Array.from({ length: maxDay }, (_, i) => String(i + 1).padStart(2, "0")),
    [maxDay],
  );

  const years = React.useMemo(() => {
    const list: number[] = [];
    for (let yr = maxY; yr >= minY; yr--) list.push(yr);
    return list;
  }, [minY, maxY]);

  const emit = React.useCallback(
    (nextY: string, nextM: string, nextD: string) => {
      let nextDay = nextD;
      if (nextY && nextM && nextD) {
        const maxD = daysInMonth(Number(nextY), Number(nextM));
        if (Number(nextD) > maxD) nextDay = String(maxD).padStart(2, "0");
      }
      onChange(buildYmd(nextY, nextM, nextDay));
    },
    [onChange],
  );

  const handleYear = (v: string) => {
    setY(v);
    let nextD = d;
    if (v && m && d) {
      const maxD = daysInMonth(Number(v), Number(m));
      if (Number(d) > maxD) nextD = String(maxD).padStart(2, "0");
    }
    if (nextD !== d) setD(nextD);
    emit(v, m, nextD);
  };

  const handleMonth = (v: string) => {
    setM(v);
    let nextD = d;
    if (y && v && d) {
      const maxD = daysInMonth(Number(y), Number(v));
      if (Number(d) > maxD) nextD = String(maxD).padStart(2, "0");
    }
    if (nextD !== d) setD(nextD);
    emit(y, v, nextD);
  };

  const handleDay = (v: string) => {
    setD(v);
    emit(y, m, v);
  };

  const built = y && m && d ? buildYmd(y, m, d) : "";
  const display = built ? `${d}-${m}-${y}` : null;

  const clear = () => {
    setY("");
    setM("");
    setD("");
    onChange("");
  };

  return (
    <div ref={ref} className="space-y-2">
      {!omitLabel ? (
        <Label
          className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-600")}
          id={id}
        >
          {label}
        </Label>
      ) : null}
      {helperText ? <p className="text-xs text-charcoal/65">{helperText}</p> : null}
      <div className="grid grid-cols-3 gap-2">
        <Select value={d || undefined} onValueChange={handleDay}>
          <SelectTrigger
            id={id ? `${id}-day` : undefined}
            className={cn(
              "rounded-xl border-soft-gold/40 bg-white",
              error && "border-amber-600 ring-1 ring-amber-500/50 focus-visible:ring-amber-500",
            )}
          >
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {dayOptions.map((day) => (
              <SelectItem key={day} value={day}>
                {Number(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={m || undefined} onValueChange={handleMonth}>
          <SelectTrigger
            id={id ? `${id}-month` : undefined}
            className={cn(
              "rounded-xl border-soft-gold/40 bg-white",
              error && "border-amber-600 ring-1 ring-amber-500/50 focus-visible:ring-amber-500",
            )}
          >
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((mo) => (
              <SelectItem key={mo.value} value={mo.value}>
                {mo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={y || undefined} onValueChange={handleYear}>
          <SelectTrigger
            id={id ? `${id}-year` : undefined}
            className={cn(
              "rounded-xl border-soft-gold/40 bg-white",
              error && "border-amber-600 ring-1 ring-amber-500/50 focus-visible:ring-amber-500",
            )}
          >
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {display ? (
          <p className="text-sm text-charcoal/75">
            {summaryPrefix}: <span className="font-medium text-charcoal">{display}</span>{" "}
            <span className="text-charcoal/55">(DD-MM-YYYY)</span>
          </p>
        ) : (
          <p className="text-xs text-charcoal/55">Optional — leave blank if unknown.</p>
        )}
        {allowClear && built ? (
          <Button type="button" variant="ghost" size="sm" className="h-8 text-support-blue" onClick={clear}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
});

DateSelect.displayName = "DateSelect";
