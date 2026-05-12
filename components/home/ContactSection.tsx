import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
    return (
        <section id="contact" className="overflow-x-hidden bg-trust-blue py-12 text-white md:py-28">
            <div id="appointment" className="scroll-mt-24 md:scroll-mt-28" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Left side - CTA content */}
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-heritage-gold"></span>
                            Ready to choose with clarity?
                        </div>
                        <h2 className="mb-4 font-serif text-3xl font-bold text-white md:mb-6 md:text-5xl">
                            Speak with CareSutra
                        </h2>
                        <div className="mb-6 h-1 w-16 bg-heritage-gold md:mb-8 md:w-20"></div>
                        <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/90 md:mb-10 md:text-xl">
                            Speak with CareSutra for simple, supportive guidance across insurance, loans, and wellness services.
                        </p>
                        <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none">
                            <Button
                                asChild
                                size="lg"
                                className="w-full rounded-full bg-white px-8 py-5 text-base font-medium text-trust-blue transition-all duration-300 hover:bg-ivory hover:shadow-2xl sm:w-fit sm:px-10 sm:py-6 sm:text-lg"
                            >
                                <Link href="/book-appointment" className="inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                                  Book an Appointment
                                  <ArrowRight className="h-5 w-5 shrink-0" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="w-full rounded-full border-white/70 bg-transparent px-8 py-5 text-base font-medium text-white hover:bg-white/10 sm:w-fit sm:px-10 sm:py-6 sm:text-lg"
                            >
                                <a href="tel:+919876543210" className="block w-full text-center sm:inline sm:w-auto">Call CareSutra</a>
                            </Button>
                            <p className="text-white/70 text-sm">
                                Aapke saath, har kadam.
                            </p>
                        </div>
                    </div>

                    {/* Right side - Contact cards */}
                    <div className="min-w-0 space-y-5 md:space-y-8">
                        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6 md:rounded-3xl md:p-8">
                            <h3 className="mb-5 text-xl font-bold text-white md:mb-8 md:text-2xl">
                                Contact Information
                            </h3>
                            <div className="space-y-5 md:space-y-8">
                                <div className="flex min-w-0 items-start gap-3 sm:gap-4 md:gap-5">
                                    <div className="flex shrink-0 rounded-lg bg-heritage-gold/20 p-3 md:rounded-xl md:p-4">
                                        <Phone className="h-5 w-5 text-heritage-gold md:h-6 md:w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="mb-0.5 text-base font-bold text-white md:mb-1 md:text-lg">Call Us</h4>
                                        <p className="break-words text-base text-white/90 md:text-lg">+91 98765 43210</p>
                                        <p className="text-xs text-white/60 md:text-sm">Mon‑Sat, 9 AM‑7 PM</p>
                                    </div>
                                </div>
                                <div className="flex min-w-0 items-start gap-3 sm:gap-4 md:gap-5">
                                    <div className="flex shrink-0 rounded-lg bg-heritage-gold/20 p-3 md:rounded-xl md:p-4">
                                        <Mail className="h-5 w-5 text-heritage-gold md:h-6 md:w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="mb-0.5 text-base font-bold text-white md:mb-1 md:text-lg">Email</h4>
                                        <p className="break-all text-base text-white/90 md:break-words md:text-lg">info@caresutra.com</p>
                                        <p className="text-xs text-white/60 md:text-sm">We respond within 24 hours</p>
                                    </div>
                                </div>
                                <div className="flex min-w-0 items-start gap-3 sm:gap-4 md:gap-5">
                                    <div className="flex shrink-0 rounded-lg bg-heritage-gold/20 p-3 md:rounded-xl md:p-4">
                                        <MapPin className="h-5 w-5 text-heritage-gold md:h-6 md:w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="mb-0.5 text-base font-bold text-white md:mb-1 md:text-lg">Visit Us</h4>
                                        <p className="text-base text-white/90 md:text-lg">Delhi, India</p>
                                        <p className="text-xs text-white/60 md:text-sm">By appointment only</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-heritage-gold/30 bg-heritage-gold/20 p-4 backdrop-blur-sm sm:p-5 md:rounded-3xl md:p-6">
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-heritage-gold sm:h-12 sm:w-12">
                                    <Phone className="h-5 w-5 text-charcoal md:h-6 md:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-white sm:text-base">Free 30‑minute consultation</h4>
                                    <p className="text-xs text-white/80 sm:text-sm">No obligation, just clear guidance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}