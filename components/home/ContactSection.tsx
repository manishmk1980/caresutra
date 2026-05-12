import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, MessageCircle } from "lucide-react";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";

export default function ContactSection() {
  return (
    <section id="contact" className="overflow-x-hidden bg-trust-blue py-12 text-white md:py-28">
      <div id="appointment" className="scroll-mt-24 md:scroll-mt-28" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-heritage-gold" aria-hidden />
              Guidance first
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:mb-6 md:text-5xl">Speak with CareSutra before you decide</h2>
            <div className="mb-6 h-1 w-16 bg-heritage-gold md:mb-8 md:w-20" aria-hidden />
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/90 md:mb-10 md:text-xl">
              Whether you are comparing policies, checking loan options, or exploring health support, start with a simple guidance call.
            </p>
            <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none">
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-white px-8 py-5 text-base font-medium text-trust-blue transition-all duration-300 hover:bg-ivory hover:shadow-2xl sm:w-fit sm:px-10 sm:py-6 sm:text-lg"
              >
                <TrackedBookAppointmentLink location="home_contact" className="inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                  Book Free Guidance Call
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
                </TrackedBookAppointmentLink>
              </Button>
              <p className="text-sm text-white/80">
                Prefer a callback? Share your number in the booking form—we will reach out on your chosen channel.
              </p>
              <p className="text-sm text-white/70">Aapke saath, har kadam.</p>
            </div>
          </div>

          <div className="min-w-0 space-y-5 md:space-y-8">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6 md:rounded-3xl md:p-8">
              <h3 className="mb-5 text-xl font-bold text-white md:mb-8 md:text-2xl">How to reach us</h3>
              <div className="space-y-5 md:space-y-6">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4 md:gap-5">
                  <div className="flex shrink-0 rounded-lg bg-heritage-gold/20 p-3 md:rounded-xl md:p-4">
                    <Mail className="h-5 w-5 text-heritage-gold md:h-6 md:w-6" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 text-base font-bold text-white md:text-lg">Start with the form or Calendly</h4>
                    <p className="text-sm leading-relaxed text-white/85 md:text-base">
                      Verified phone and email for your booking are confirmed when we respond. This keeps public listings accurate and
                      avoids placeholder contact lines.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
                  Serving families across India with remote guidance. On-site visits only when mutually agreed.
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-heritage-gold/30 bg-heritage-gold/20 p-4 backdrop-blur-sm sm:p-5 md:rounded-3xl md:p-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-heritage-gold sm:h-12 sm:w-12">
                  <MessageCircle className="h-5 w-5 text-charcoal md:h-6 md:w-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white sm:text-base">Guidance call</h4>
                  <p className="text-xs text-white/80 sm:text-sm">No pressure—just clear next steps you can act on.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
