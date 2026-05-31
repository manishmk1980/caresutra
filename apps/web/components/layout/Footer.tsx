"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";
import { Heart } from "lucide-react";

export default function Footer() {
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <footer className="mt-auto min-w-0 bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-4 md:space-y-6">
            <div className="relative h-11 w-[168px] sm:h-12 sm:w-[190px] md:h-14 md:w-[215px]">
              <Image
                src="/brand/caresutra-hr-logo.svg"
                alt="CareSutra Logo"
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 170px, 215px"
              />
            </div>
            <div className="space-y-2 md:space-y-3">
              <p className="font-serif text-base font-medium text-soft-gold md:text-lg">Har Zarurat Ka Sahi Margdarshan</p>
              <p className="text-sm text-ivory/80">Aapke saath, har kadam.</p>
            </div>
            <div className="border-t border-soft-gold/20 pt-3 md:pt-4">
              <p className="text-sm text-ivory/70">
                CareSutra offers guidance-first support for insurance, loans, and health servicesâ€”clear, respectful, and built for Indian
                families.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 border-b border-heritage-gold/30 pb-2 font-serif text-lg font-medium text-ivory md:mb-6 md:text-xl">
              Services
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link href="/#services" className="flex items-center text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2">
                  <span className="mr-3 h-1.5 w-1.5 rounded-full bg-heritage-gold opacity-0" aria-hidden />
                  Insurance guidance
                </Link>
              </li>
              <li>
                <Link href="/#services" className="flex items-center text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2">
                  <span className="mr-3 h-1.5 w-1.5 rounded-full bg-heritage-gold opacity-0" aria-hidden />
                  Loan assistance
                </Link>
              </li>
              <li>
                <Link href="/#services" className="flex items-center text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2">
                  <span className="mr-3 h-1.5 w-1.5 rounded-full bg-heritage-gold opacity-0" aria-hidden />
                  Health &amp; wellness guidance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 border-b border-heritage-gold/30 pb-2 font-serif text-lg font-medium text-ivory md:mb-6 md:text-xl">
              Company
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link href="/#why" className="text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2">
                  Why CareSutra
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2">
                  Contact
                </Link>
              </li>
              <li>
                <TrackedBookAppointmentLink
                  location="footer"
                  href="/book-appointment"
                  className="text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2"
                >
                  Book a guidance call
                </TrackedBookAppointmentLink>
              </li>
              <li>
                <Link href="/admin/login" className="text-ivory/80 transition-all duration-300 hover:text-heritage-gold hover:pl-2">
                  Admin login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 border-b border-heritage-gold/30 pb-2 font-serif text-lg font-medium text-ivory md:mb-6 md:text-xl">
              Contact
            </h3>
            <p className="text-sm leading-relaxed text-ivory/80">
              The fastest way to reach CareSutra is to book a guidance call or submit the appointment formâ€”we reply with confirmed next
              steps.
            </p>
            <div className="mt-6 border-t border-soft-gold/20 pt-4 md:mt-8 md:pt-6">
              <p className="text-sm text-ivory/60">Ready to compare options with clarity?</p>
              <TrackedBookAppointmentLink
                location="footer"
                href="/book-appointment"
                className="mt-3 inline-block rounded-full bg-heritage-gold px-6 py-2.5 font-medium text-charcoal transition-colors duration-300 hover:bg-soft-gold"
              >
                Book Free Guidance Call
              </TrackedBookAppointmentLink>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-soft-gold/20 bg-charcoal/80 p-4 text-xs leading-relaxed text-ivory/70 md:mt-10 md:p-5 md:text-sm">
          CareSutra provides guidance and support services. Final approval, pricing, policy issuance, loan sanction, or medical advice
          depends on the respective provider, lender, insurer, or qualified professional.
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-soft-gold/20 pt-6 text-center md:mt-12 md:flex-row md:justify-between md:gap-4 md:pt-8 md:text-left">
          <p className="text-sm text-ivory/60">&copy; {currentYear} CareSutra. All rights reserved.</p>
          <div className="flex w-full max-w-sm flex-col items-center gap-3 text-sm text-ivory/60 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center md:w-auto md:justify-end md:gap-6">
            <Link href="#" className="transition-colors hover:text-heritage-gold">
              Privacy policy
            </Link>
            <Link href="#" className="transition-colors hover:text-heritage-gold">
              Terms of service
            </Link>
            <div className="flex items-center justify-center gap-1.5">
              <Heart className="h-3.5 w-3.5 shrink-0 text-heritage-gold md:h-4 md:w-4" aria-hidden />
              <span className="leading-snug">Made with care in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
