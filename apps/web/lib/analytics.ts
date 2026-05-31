type GtagParams = Record<string, string | number | boolean | null | undefined>

type WindowWithGtag = Window &
  typeof globalThis & {
    gtag?: (command: "event", eventName: string, params: GtagParams) => void
  }

export function trackEvent(eventName: string, params?: GtagParams) {
  if (typeof window === "undefined") return

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  const browserWindow = window as WindowWithGtag

  if (!gaId || typeof browserWindow.gtag !== "function") return

  browserWindow.gtag("event", eventName, params ?? {})
}
