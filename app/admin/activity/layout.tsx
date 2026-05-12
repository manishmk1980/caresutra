import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Customer Records | CareSutra Admin" },
  description: "Manage CareSutra customers, service details, and renewal follow-ups.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Customer Records | CareSutra Admin",
    description: "Manage CareSutra customers, service details, and renewal follow-ups.",
    type: "website",
  },
};

export default function AdminActivityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
