import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { getSiteOrigin } from "@/lib/site-url";

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

const siteTitleDefault = "CareSutra | Insurance, Loans & Health Services Guidance";
const siteDescription =
  "CareSutra helps individuals and families find the right guidance for insurance, loans, and alternative health services.";
const keywords = [
  "CareSutra",
  "insurance guidance India",
  "loan assistance India",
  "health services",
  "alternative health services",
  "financial guidance",
  "customer support",
  "Har Zarurat Ka Sahi Margdarshan",
];

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: siteTitleDefault,
    template: "%s | CareSutra",
  },
  description: siteDescription,
  applicationName: "CareSutra",
  keywords,
  authors: [{ name: "CareSutra", url: siteOrigin }],
  creator: "CareSutra",
  publisher: "CareSutra",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "CareSutra",
    locale: "en_IN",
    url: siteOrigin,
    title: siteTitleDefault,
    description: siteDescription,
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
    title: siteTitleDefault,
    description: siteDescription,
    images: ["/caresutra-hr-logo.png"],
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
      suppressHydrationWarning
    >
      <body
        className="font-sans min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
        <PageViewTracker />
      </body>
    </html>
  );
}
