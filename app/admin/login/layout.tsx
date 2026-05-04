import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | CareSutra",
  description: "Sign in to the CareSutra admin dashboard.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Admin Login | CareSutra",
    description: "Sign in to the CareSutra admin dashboard.",
    type: "website",
  },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
