import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function ContactSection() {
    return (
        <section id="contact" className="py-20 md:py-28 bg-trust-blue text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - CTA content */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white font-medium text-sm px-4 py-2 rounded-full mb-8">
                            <span className="w-2 h-2 bg-heritage-gold rounded-full"></span>
                            Ready to choose with clarity?
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                            Speak with CareSutra
                        </h2>
                        <div className="w-20 h-1 bg-heritage-gold mb-8"></div>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl">
                            Speak with CareSutra for simple, supportive guidance across insurance, loans, and wellness services.
                        </p>
                        <div className="space-y-6">
                            <Button
                                size="lg"
                                className="bg-white text-trust-blue hover:bg-ivory rounded-full px-10 py-6 text-lg font-medium transition-all duration-300 hover:shadow-2xl"
                            >
                                Talk to CareSutra
                                <ArrowRight className="ml-3 h-5 w-5" />
                            </Button>
                            <p className="text-white/70 text-sm">
                                Aapke saath, har kadam.
                            </p>
                        </div>
                    </div>

                    {/* Right side - Contact cards */}
                    <div className="space-y-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-8">
                                Contact Information
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="flex-shrink-0 p-4 bg-heritage-gold/20 rounded-xl">
                                        <Phone className="h-6 w-6 text-heritage-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg mb-1">Call Us</h4>
                                        <p className="text-white/90 text-lg">+91 98765 43210</p>
                                        <p className="text-white/60 text-sm">Mon‑Sat, 9 AM‑7 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="flex-shrink-0 p-4 bg-heritage-gold/20 rounded-xl">
                                        <Mail className="h-6 w-6 text-heritage-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg mb-1">Email</h4>
                                        <p className="text-white/90 text-lg">info@caresutra.com</p>
                                        <p className="text-white/60 text-sm">We respond within 24 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="flex-shrink-0 p-4 bg-heritage-gold/20 rounded-xl">
                                        <MapPin className="h-6 w-6 text-heritage-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg mb-1">Visit Us</h4>
                                        <p className="text-white/90 text-lg">Delhi, India</p>
                                        <p className="text-white/60 text-sm">By appointment only</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-heritage-gold/20 backdrop-blur-sm rounded-3xl p-6 border border-heritage-gold/30">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-heritage-gold rounded-full flex items-center justify-center">
                                    <Phone className="h-6 w-6 text-charcoal" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Free 30‑minute consultation</h4>
                                    <p className="text-white/80 text-sm">No obligation, just clear guidance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}