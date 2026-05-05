import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, IndianRupee, HeartPulse } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-white py-16 md:py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left column */}
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 bg-soft-gold/20 text-trust-blue font-medium text-sm px-4 py-2 rounded-full mb-6">
                            <span className="w-2 h-2 bg-heritage-gold rounded-full"></span>
                            Insurance • Loans • Health Services
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6">
                            Har Zarurat Ka Sahi Margdarshan
                        </h1>
                        <p className="text-lg md:text-xl text-charcoal/80 mb-8 max-w-2xl">
                            CareSutra helps families and individuals make confident decisions across insurance, loans, and wellness services with simple, trustworthy guidance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button
                                asChild
                                size="lg"
                                className="bg-trust-blue hover:bg-support-blue text-white rounded-full px-8 py-3 font-medium transition-all duration-300 hover:shadow-lg"
                            >
                                <Link href="/book-appointment">Book Appointment</Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-trust-blue text-trust-blue hover:bg-trust-blue/5 rounded-full px-8 py-3 font-medium"
                            >
                                <Link href="/#services">Explore Services</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-charcoal/60">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-heritage-gold rounded-full"></div>
                                <span>Transparent Guidance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-heritage-gold rounded-full"></div>
                                <span>Human‑First Advisory</span>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Brand card visual */}
                    <div className="relative">
                        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-soft-gold/30">
                            <div className="text-center mb-8">
                                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-2">
                                    Your Guidance Card
                                </h3>
                                <p className="text-charcoal/70">
                                    Simple, supportive steps for your needs
                                </p>
                            </div>
                            <div className="space-y-6">
                                {/* Service card 1 */}
                                <div className="flex items-center gap-5 p-5 rounded-2xl bg-ivory border border-soft-gold/30 hover:border-heritage-gold transition-colors group">
                                    <div className="flex-shrink-0 w-14 h-14 bg-trust-blue/10 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="w-7 h-7 text-trust-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-charcoal mb-1">Insurance</h4>
                                        <p className="text-sm text-charcoal/70">
                                            Life, health, motor, and home insurance with clear comparisons.
                                        </p>
                                    </div>
                                </div>
                                {/* Service card 2 */}
                                <div className="flex items-center gap-5 p-5 rounded-2xl bg-ivory border border-soft-gold/30 hover:border-heritage-gold transition-colors group">
                                    <div className="flex-shrink-0 w-14 h-14 bg-support-blue/10 rounded-xl flex items-center justify-center">
                                        <IndianRupee className="w-7 h-7 text-support-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-charcoal mb-1">Loans</h4>
                                        <p className="text-sm text-charcoal/70">
                                            Personal, home, education loans with best‑fit recommendations.
                                        </p>
                                    </div>
                                </div>
                                {/* Service card 3 */}
                                <div className="flex items-center gap-5 p-5 rounded-2xl bg-ivory border border-soft-gold/30 hover:border-heritage-gold transition-colors group">
                                    <div className="flex-shrink-0 w-14 h-14 bg-heritage-gold/10 rounded-xl flex items-center justify-center">
                                        <HeartPulse className="w-7 h-7 text-heritage-gold" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-charcoal mb-1">Health Services</h4>
                                        <p className="text-sm text-charcoal/70">
                                            Wellness programs, medical second opinions, and health checkups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-soft-gold/20 text-center">
                                <p className="text-sm text-charcoal/60">
                                    Start with a free 30‑minute consultation
                                </p>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-heritage-gold/10 rounded-full -z-10"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-support-blue/5 rounded-full -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}