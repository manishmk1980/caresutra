import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment Requests | CareSutra Admin",
  description: "View and manage incoming appointment requests from the CareSutra website.",
  robots: { index: false, follow: false },
};

export default function AdminAppointmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
