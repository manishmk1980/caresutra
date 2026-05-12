import type { Metadata } from "next";
import BookAppointmentPageContent from "@/components/appointments/BookAppointmentPageContent";

const pageTitle = "Book a Guidance Call";
const pageDescription =
  "Book a CareSutra guidance call for insurance, loan, or health-service support.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: "/book-appointment",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/book-appointment",
    type: "website",
    locale: "en_IN",
    siteName: "CareSutra",
    images: [
      {
        url: "/caresutra-hr-logo.png",
        width: 1200,
        height: 630,
        alt: "CareSutra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/caresutra-hr-logo.png"],
  },
};

export default function BookAppointmentPage() {
  return <BookAppointmentPageContent calendlyUrl={process.env.NEXT_PUBLIC_CALENDLY_URL} />;
}
