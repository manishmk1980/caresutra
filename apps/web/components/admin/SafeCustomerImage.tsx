"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export type SafeCustomerImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Same footprint as the image so layout does not shift */
  fallbackClassName?: string;
  fallbackText?: string;
};

/**
 * Renders a customer photo URL; on load error (e.g. missing /uploads file), shows a placeholder once
 * so the browser does not retry the broken URL on every render.
 */
export function SafeCustomerImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackText = "—",
}: SafeCustomerImageProps) {
  const safeSrc = src.trim();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const hasFailed = Boolean(safeSrc) && failedSrc === safeSrc;

  const handleError = useCallback(() => {
    if (safeSrc) {
      setFailedSrc(safeSrc);
    }
  }, [safeSrc]);

  if (!safeSrc || hasFailed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center border border-soft-gold/30 bg-ivory text-center text-[10px] font-medium leading-tight text-charcoal/45",
          fallbackClassName,
        )}
        role="img"
        aria-label={`${alt} (unavailable)`}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin/record URLs
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
}
