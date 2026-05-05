import type { Metadata } from "next";
import BookAppointmentPageContent from "@/components/appointments/BookAppointmentPageContent";

export const metadata: Metadata = {
  title: "Book an Appointment with CareSutra",
  description:
    "Book a CareSutra appointment for guidance on insurance, loans, and health services. Share your contact details or schedule directly through Calendly.",
  openGraph: {
    title: "Book an Appointment with CareSutra",
    description:
      "Book a CareSutra appointment for guidance on insurance, loans, and health services. Share your contact details or schedule directly through Calendly.",
    type: "website",
  },
};

export default function BookAppointmentPage() {
  return <BookAppointmentPageContent calendlyUrl={process.env.NEXT_PUBLIC_CALENDLY_URL} />;
}
