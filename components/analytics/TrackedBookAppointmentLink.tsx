"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

export type BookAppointmentClickLocation = "header" | "hero" | "footer" | "appointment_page";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  location: BookAppointmentClickLocation;
  href?: string;
};

export default function TrackedBookAppointmentLink({
  location,
  href = "/book-appointment",
  onClick,
  ...props
}: Props) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        trackEvent("book_appointment_click", { location });
        onClick?.(e);
      }}
    />
  );
}
