import { CheckCircle, MessageSquare, FileText, Handshake } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: <MessageSquare className="h-7 w-7 md:h-10 md:w-10" />,
        title: "Understand Your Need",
        description: "We listen carefully to your situation, goals, and concerns through a personalized conversation.",
        color: "trust-blue",
    },
    {
        number: "02",
        icon: <FileText className="h-7 w-7 md:h-10 md:w-10" />,
        title: "Explain Suitable Options",
        description: "We present clear, unbiased options with pros, cons, and costs—no jargon, just simple explanations.",
        color: "heritage-gold",
    },
    {
        number: "03",
        icon: <Handshake className="h-7 w-7 md:h-10 md:w-10" />,
        title: "Support Your Next Step",
        description: "We assist with paperwork, follow‑ups, and ongoing support to ensure a smooth journey.",
        color: "support-blue",
    },
];

export default function USPSection() {
    return (
        <section className="bg-ivory py-12 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center md:mb-16">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-trust-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
                        <span className="h-2 w-2 rounded-full bg-heritage-gold"></span>
                        How CareSutra Helps
                    </div>
                    <h2 className="mb-4 font-serif text-3xl font-bold text-charcoal md:mb-6 md:text-5xl">
                        Simple, Supportive Process
                    </h2>
                    <p className="mx-auto max-w-3xl text-base text-charcoal/80 md:text-lg">
                        Our three‑step approach ensures you receive clear guidance and confident decisions.
                    </p>
                </div>

                {/* Steps - horizontal on desktop, vertical on mobile */}
                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden lg:block absolute top-16 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-soft-gold/30 z-0"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                        {steps.map((step, index) => {
                            const colorMap = {
                                "trust-blue": "bg-trust-blue/10 text-trust-blue",
                                "support-blue": "bg-support-blue/10 text-support-blue",
                                "heritage-gold": "bg-heritage-gold/10 text-heritage-gold",
                            };
                            const borderMap = {
                                "trust-blue": "border-trust-blue/30",
                                "support-blue": "border-support-blue/30",
                                "heritage-gold": "border-heritage-gold/30",
                            };
                            return (
                                <div
                                    key={index}
                                    className="group relative min-w-0 rounded-2xl border border-soft-gold/30 bg-white p-5 pt-7 shadow-lg transition-all duration-300 hover:shadow-2xl sm:p-6 sm:pt-8 md:rounded-3xl md:p-8"
                                >
                                    {/* Number badge */}
                                    <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-heritage-gold text-base font-bold text-white md:-top-5 md:h-12 md:w-12 md:text-xl">
                                        {step.number}
                                    </div>
                                    
                                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl ${colorMap[step.color as keyof typeof colorMap]} sm:mb-5 md:mb-6 md:h-20 md:w-20 md:rounded-2xl`}>
                                        {step.icon}
                                    </div>
                                    
                                    <h3 className="mb-3 text-center text-xl font-bold text-charcoal md:mb-4 md:text-2xl">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="mb-4 text-center text-sm leading-relaxed text-charcoal/70 md:mb-6 md:text-base">
                                        {step.description}
                                    </p>
                                    
                                    <div className="flex justify-center">
                                        <div className="flex items-center text-sm text-charcoal/50">
                                            <CheckCircle className="h-4 w-4 mr-2 text-heritage-gold" />
                                            <span>Personalized approach</span>
                                        </div>
                                    </div>
                                    
                                    {/* Connector dot for desktop */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 bg-ivory border-4 border-heritage-gold rounded-full z-20"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom testimonial */}
                <div className="mt-12 text-center md:mt-20">
                    <div className="mx-auto inline-block max-w-3xl px-1">
                        <div className="relative">
                            <div className="absolute -left-1 -top-2 hidden text-5xl text-heritage-gold/20 md:block md:text-6xl" aria-hidden>
                                {"\u201c"}
                            </div>
                            <p className="relative z-10 mb-4 font-serif text-lg italic leading-snug text-charcoal/80 md:mb-6 md:text-2xl">
                                We believe in building long‑term relationships, not just transactions. Your trust is our biggest asset.
                            </p>
                            <div className="absolute -bottom-2 -right-1 hidden text-5xl text-heritage-gold/20 md:block md:text-6xl" aria-hidden>
                                {"\u201d"}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-6">
                            <div className="mx-auto mb-3 h-1 w-14 bg-heritage-gold md:mb-4 md:w-16"></div>
                            <p className="text-charcoal/60">
                                — CareSutra Team
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}