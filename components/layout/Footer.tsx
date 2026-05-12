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
                    {/* Brand column */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="relative h-11 w-[168px] sm:h-12 sm:w-[190px] md:h-14 md:w-[215px]">
                            <Image
                                src="/logo-main-white.svg"
                                alt="CareSutra Logo"
                                fill
                                className="object-contain object-left"
                                sizes="(max-width: 768px) 170px, 215px"
                            />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <p className="font-serif text-base font-medium text-soft-gold md:text-lg">
                                Har Zarurat Ka Sahi Margdarshan
                            </p>
                            <p className="text-ivory/80 text-sm">
                                Aapke saath, har kadam.
                            </p>
                        </div>
                        <div className="border-t border-soft-gold/20 pt-3 md:pt-4">
                            <p className="text-ivory/70 text-sm">
                                Simple, trustworthy guidance for insurance, loans, and wellness services.
                            </p>
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h3 className="mb-4 border-b border-heritage-gold/30 pb-2 font-serif text-lg font-medium text-ivory md:mb-6 md:text-xl">
                            Services
                        </h3>
                        <ul className="space-y-3 md:space-y-4">
                            <li>
                                <Link
                                    href="/#services"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300 flex items-center"
                                >
                                    <span className="w-1.5 h-1.5 bg-heritage-gold rounded-full mr-3 opacity-0 group-hover:opacity-100"></span>
                                    Insurance
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#services"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300 flex items-center"
                                >
                                    <span className="w-1.5 h-1.5 bg-heritage-gold rounded-full mr-3 opacity-0 group-hover:opacity-100"></span>
                                    Loans
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#services"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300 flex items-center"
                                >
                                    <span className="w-1.5 h-1.5 bg-heritage-gold rounded-full mr-3 opacity-0 group-hover:opacity-100"></span>
                                    Health Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company column */}
                    <div>
                        <h3 className="mb-4 border-b border-heritage-gold/30 pb-2 font-serif text-lg font-medium text-ivory md:mb-6 md:text-xl">
                            Company
                        </h3>
                        <ul className="space-y-3 md:space-y-4">
                            <li>
                                <Link
                                    href="/#why"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300"
                                >
                                    Why CareSutra
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#contact"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <TrackedBookAppointmentLink
                                    location="footer"
                                    href="/book-appointment"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300"
                                >
                                    Book an Appointment
                                </TrackedBookAppointmentLink>
                            </li>
                            <li>
                                <Link
                                    href="/admin/login"
                                    className="text-ivory/80 hover:text-heritage-gold hover:pl-2 transition-all duration-300"
                                >
                                    Admin Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h3 className="mb-4 border-b border-heritage-gold/30 pb-2 font-serif text-lg font-medium text-ivory md:mb-6 md:text-xl">
                            Contact
                        </h3>
                        <ul className="min-w-0 space-y-3 text-ivory/80 md:space-y-4">
                            <li className="flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1">
                                <span className="shrink-0 font-medium text-heritage-gold">Email:</span>
                                <span className="min-w-0 break-all">info@caresutra.com</span>
                            </li>
                            <li className="flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1">
                                <span className="shrink-0 font-medium text-heritage-gold">Phone:</span>
                                <span className="min-w-0 break-words">+91 98765 43210</span>
                            </li>
                            <li className="flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1">
                                <span className="shrink-0 font-medium text-heritage-gold">Address:</span>
                                <span className="min-w-0">Delhi, India</span>
                            </li>
                        </ul>
                        <div className="mt-6 border-t border-soft-gold/20 pt-4 md:mt-8 md:pt-6">
                            <p className="text-ivory/60 text-sm">
                                Ready to choose with clarity?
                            </p>
                            <TrackedBookAppointmentLink
                                location="footer"
                                href="/book-appointment"
                                className="inline-block mt-3 bg-heritage-gold hover:bg-soft-gold text-charcoal font-medium py-2.5 px-6 rounded-full transition-colors duration-300"
                            >
                                Book an Appointment
                            </TrackedBookAppointmentLink>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 flex flex-col items-center gap-4 border-t border-soft-gold/20 pt-6 text-center md:mt-12 md:flex-row md:justify-between md:gap-4 md:pt-8 md:text-left">
                    <p className="text-sm text-ivory/60">
                        &copy; {currentYear} CareSutra. All rights reserved.
                    </p>
                    <div className="flex w-full max-w-sm flex-col items-center gap-3 text-sm text-ivory/60 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center md:w-auto md:justify-end md:gap-6">
                        <Link href="#" className="hover:text-heritage-gold transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-heritage-gold transition-colors">
                            Terms of Service
                        </Link>
                        <div className="flex items-center justify-center gap-1.5">
                            <Heart className="h-3.5 w-3.5 shrink-0 text-heritage-gold md:h-4 md:w-4" />
                            <span className="leading-snug">Made with care in India</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}