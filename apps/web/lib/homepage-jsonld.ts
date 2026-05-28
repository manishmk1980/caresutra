import { getSiteOrigin } from "@/lib/site-url";

/** ProfessionalService JSON-LD for the public homepage only (no invented fields). */
export function getHomepageProfessionalServiceJsonLd(): Record<string, unknown> {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "CareSutra",
    slogan: "Har Zarurat Ka Sahi Margdarshan",
    description:
      "CareSutra provides human-first guidance for insurance, loans, and health services for families in India.",
    url: origin,
    areaServed: "India",
    serviceType: ["Insurance Guidance", "Loan Assistance", "Health Services Guidance"],
  };
}
