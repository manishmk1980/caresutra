"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import PageViewTracker from "@/components/analytics/PageViewTracker";

function isPrivateAnalyticsPath(pathname: string | null): boolean {
  if (pathname == null) return false;
  return pathname.startsWith("/admin") || pathname.startsWith("/api");
}

export default function PublicSiteAnalytics() {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  if (!gaId) return null;
  if (isPrivateAnalyticsPath(pathname)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)}, { send_page_view: false });
        `.trim()}
      </Script>
      <PageViewTracker />
    </>
  );
}
