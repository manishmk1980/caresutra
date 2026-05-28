import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";
import { ShieldCheck, IndianRupee, HeartPulse } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-x-hidden bg-gradient-to-b from-ivory to-white py-10 sm:py-14 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 text-left">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full bg-soft-gold/20 px-3 py-1.5 text-xs font-medium text-trust-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-heritage-gold" aria-hidden />
              <span className="leading-snug">Insurance • Loans • Health services</span>
            </div>
            <h1 className="mb-3 font-serif text-3xl font-bold leading-tight text-charcoal sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl">
              Har Zarurat Ka Sahi Margdarshan
            </h1>
            <p className="mb-2 text-base font-medium text-trust-blue md:text-lg">Aapke saath, har kadam.</p>
            <p className="mb-6 max-w-2xl text-base leading-relaxed text-charcoal/80 md:mb-8 md:text-xl">
              CareSutra helps you make confident decisions across insurance, loans, and health services with clear, human-first
              guidance—not a hard sell.
            </p>
            <div className="mb-8 flex w-full flex-col gap-3 sm:mb-10 sm:flex-row sm:gap-4 md:mb-12">
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-trust-blue px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-support-blue hover:shadow-lg sm:w-auto sm:px-8"
              >
                <TrackedBookAppointmentLink location="hero" className="text-center">
                  Book Free Guidance Call
                </TrackedBookAppointmentLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full rounded-full border-trust-blue px-6 py-3 font-medium text-trust-blue hover:bg-trust-blue/5 sm:w-auto sm:px-8"
              >
                <Link href="/#services">Explore services</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-3 text-sm text-charcoal/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 shrink-0 rounded-full bg-heritage-gold" aria-hidden />
                <span>Transparent guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 shrink-0 rounded-full bg-heritage-gold" aria-hidden />
                <span>Human-first advisory</span>
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="rounded-2xl border border-soft-gold/30 bg-white p-5 shadow-xl sm:p-6 md:rounded-3xl md:p-8 lg:p-10">
              <div className="mb-5 text-center sm:mb-6 md:mb-8">
                <h2 className="mb-1 font-serif text-xl font-semibold text-charcoal sm:text-2xl">At a glance</h2>
                <p className="text-sm text-charcoal/70 md:text-base">Where CareSutra can support you</p>
              </div>
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="group flex items-center gap-3 rounded-xl border border-soft-gold/30 bg-ivory p-3 transition-colors hover:border-heritage-gold sm:gap-4 sm:rounded-2xl sm:p-4 md:gap-5 md:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-trust-blue/10 sm:h-12 sm:w-12 md:h-14 md:w-14 md:rounded-xl">
                    <ShieldCheck className="h-5 w-5 text-trust-blue sm:h-6 sm:w-6 md:h-7 md:w-7" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-0.5 font-semibold text-charcoal sm:mb-1">Insurance</h3>
                    <p className="text-xs leading-snug text-charcoal/70 sm:text-sm">
                      Life, health, and motor cover—comparison, renewal, and claim-support guidance.
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-xl border border-soft-gold/30 bg-ivory p-3 transition-colors hover:border-heritage-gold sm:gap-4 sm:rounded-2xl sm:p-4 md:gap-5 md:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-support-blue/10 sm:h-12 sm:w-12 md:h-14 md:w-14 md:rounded-xl">
                    <IndianRupee className="h-5 w-5 text-support-blue sm:h-6 sm:w-6 md:h-7 md:w-7" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-0.5 font-semibold text-charcoal sm:mb-1">Loans</h3>
                    <p className="text-xs leading-snug text-charcoal/70 sm:text-sm">
                      Personal, home, and education loans—eligibility clarity and documentation support.
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-xl border border-soft-gold/30 bg-ivory p-3 transition-colors hover:border-heritage-gold sm:gap-4 sm:rounded-2xl sm:p-4 md:gap-5 md:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-heritage-gold/10 sm:h-12 sm:w-12 md:h-14 md:w-14 md:rounded-xl">
                    <HeartPulse className="h-5 w-5 text-heritage-gold sm:h-6 sm:w-6 md:h-7 md:w-7" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-0.5 font-semibold text-charcoal sm:mb-1">Health services</h3>
                    <p className="text-xs leading-snug text-charcoal/70 sm:text-sm">
                      Wellness, preventive checkups, alternative health, and second-opinion guidance for your family.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t border-soft-gold/20 pt-4 text-center sm:mt-6 sm:pt-5 md:mt-8 md:pt-6">
                <p className="text-xs text-charcoal/60 sm:text-sm">Start with a short guidance call—no pressure.</p>
              </div>
            </div>
            <div className="absolute -right-1 -top-3 -z-10 hidden h-16 w-16 rounded-full bg-heritage-gold/10 sm:block sm:h-20 sm:w-20 md:-right-4 md:-top-4 md:h-24 md:w-24" aria-hidden />
            <div className="absolute -bottom-4 -left-3 -z-10 hidden h-20 w-20 rounded-full bg-support-blue/5 sm:block sm:h-28 sm:w-28 md:-bottom-6 md:-left-6 md:h-32 md:w-32" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
