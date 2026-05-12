"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";
import { Heart } from "lucide-react";

export default function Footer() {
    const [currentYear] = useState(() => new Date().getFullYear());

    return (
        <footer className="bg-charcoal text-ivory mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Brand column */}
                    <div className="space-y-6">
                        <div className="relative w-[215px] h-14">
                            <Image
                                src="/logo-main-white.svg"
                                alt="CareSutra Logo"
                                fill
                                className="object-contain"
                                sizes="215px"
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-soft-gold text-lg font-serif font-medium">
                                Har Zarurat Ka Sahi Margdarshan
                            </p>
                            <p className="text-ivory/80 text-sm">
                                Aapke saath, har kadam.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-soft-gold/20">
                            <p className="text-ivory/70 text-sm">
                                Simple, trustworthy guidance for insurance, loans, and wellness services.
                            </p>
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h3 className="font-serif text-xl font-medium text-ivory mb-6 pb-2 border-b border-heritage-gold/30">
                            Services
                        </h3>
                        <ul className="space-y-4">
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
                        <h3 className="font-serif text-xl font-medium text-ivory mb-6 pb-2 border-b border-heritage-gold/30">
                            Company
                        </h3>
                        <ul className="space-y-4">
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
                        <h3 className="font-serif text-xl font-medium text-ivory mb-6 pb-2 border-b border-heritage-gold/30">
                            Contact
                        </h3>
                        <ul className="space-y-4 text-ivory/80">
                            <li className="flex items-start">
                                <span className="font-medium text-heritage-gold mr-2">Email:</span>
                                info@caresutra.com
                            </li>
                            <li className="flex items-start">
                                <span className="font-medium text-heritage-gold mr-2">Phone:</span>
                                +91 98765 43210
                            </li>
                            <li className="flex items-start">
                                <span className="font-medium text-heritage-gold mr-2">Address:</span>
                                Delhi, India
                            </li>
                        </ul>
                        <div className="mt-8 pt-6 border-t border-soft-gold/20">
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
                <div className="mt-12 pt-8 border-t border-soft-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-ivory/60 text-sm">
                        &copy; {currentYear} CareSutra. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-ivory/60">
                        <Link href="#" className="hover:text-heritage-gold transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-heritage-gold transition-colors">
                            Terms of Service
                        </Link>
                        <div className="flex items-center gap-1">
                            <Heart size={14} className="text-heritage-gold" />
                            <span>Made with care in India</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}