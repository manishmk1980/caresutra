import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | CareSutra",
  description: "Manage customer activities and leads.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Admin Dashboard | CareSutra",
    description: "Manage customer activities and leads.",
    type: "website",
  },
};

export default function AdminActivityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
