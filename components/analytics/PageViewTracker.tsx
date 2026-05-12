"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  useEffect(() => {
    if (!gaId || !pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (typeof window.gtag !== "function") return;
    window.gtag("config", gaId, { page_path: pagePath });
  }, [pathname, searchParams, gaId]);

  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
