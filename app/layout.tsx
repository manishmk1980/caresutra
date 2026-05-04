import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareSutra - Insurance, Loans & Health Services Guidance in India",
  description:
    "CareSutra helps individuals and families choose the right insurance, loan, and health service options with simple, trustworthy, and personalized guidance.",
  keywords: ["insurance", "loans", "health services", "India", "guidance", "personalized"],
  authors: [{ name: "CareSutra" }],
  openGraph: {
    title: "CareSutra - Insurance, Loans & Health Services Guidance in India",
    description:
      "CareSutra helps individuals and families choose the right insurance, loan, and health service options with simple, trustworthy, and personalized guidance.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
