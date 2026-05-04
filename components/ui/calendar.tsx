"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import "react-day-picker/src/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:gap-4",
        month: "gap-4",
        month_caption: "flex h-9 items-center justify-center px-1 pt-1",
        caption_label: "text-sm font-medium text-charcoal",
        nav: "absolute inset-x-1 top-1 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 border-soft-gold/40 bg-white p-0 opacity-90 hover:bg-ivory",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 border-soft-gold/40 bg-white p-0 opacity-90 hover:bg-ivory",
        ),
        month_grid: "mt-4 w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-[0.8rem] font-normal text-charcoal/60",
        week: "mt-2 flex w-full",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-charcoal aria-selected:opacity-100",
        ),
        selected:
          "rounded-md bg-trust-blue text-white hover:bg-trust-blue hover:text-white focus:bg-trust-blue focus:text-white",
        today: "rounded-md bg-soft-gold/30 text-charcoal",
        outside: "text-charcoal/35 aria-selected:bg-trust-blue/40 aria-selected:text-white",
        disabled: "text-charcoal/25 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4 text-charcoal" />
          ) : (
            <ChevronRight className="h-4 w-4 text-charcoal" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
