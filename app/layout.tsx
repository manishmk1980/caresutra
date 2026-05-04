import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`h-full ${montserrat.variable} ${cormorantGaramond.variable}`}
    >
      <body
        className="font-sans min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
