import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import USPSection from "@/components/home/USPSection";
import TrustSection from "@/components/home/TrustSection";
import ContactSection from "@/components/home/ContactSection";
import JsonLd from "@/components/seo/JsonLd";
import { getHomepageProfessionalServiceJsonLd } from "@/lib/homepage-jsonld";

const pageTitle = "CareSutra | Har Zarurat Ka Sahi Margdarshan";
const pageDescription =
  "Get trusted guidance for insurance, loans, and alternative health services with CareSutra — Aapke saath, har kadam.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/",
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

export default function Home() {
  return (
    <>
      <JsonLd data={getHomepageProfessionalServiceJsonLd()} />
      <HeroSection />
      <ServicesSection />
      <USPSection />
      <TrustSection />
      <ContactSection />
    </>
  );
}
