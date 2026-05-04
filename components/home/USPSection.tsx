import { CheckCircle, MessageSquare, FileText, Handshake } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: <MessageSquare className="h-10 w-10" />,
        title: "Understand Your Need",
        description: "We listen carefully to your situation, goals, and concerns through a personalized conversation.",
        color: "trust-blue",
    },
    {
        number: "02",
        icon: <FileText className="h-10 w-10" />,
        title: "Explain Suitable Options",
        description: "We present clear, unbiased options with pros, cons, and costs—no jargon, just simple explanations.",
        color: "heritage-gold",
    },
    {
        number: "03",
        icon: <Handshake className="h-10 w-10" />,
        title: "Support Your Next Step",
        description: "We assist with paperwork, follow‑ups, and ongoing support to ensure a smooth journey.",
        color: "support-blue",
    },
];

export default function USPSection() {
    return (
        <section className="py-20 md:py-28 bg-ivory">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white text-trust-blue font-medium text-sm px-4 py-2 rounded-full mb-6">
                        <span className="w-2 h-2 bg-heritage-gold rounded-full"></span>
                        How CareSutra Helps
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6">
                        Simple, Supportive Process
                    </h2>
                    <p className="text-lg text-charcoal/80 max-w-3xl mx-auto">
                        Our three‑step approach ensures you receive clear guidance and confident decisions.
                    </p>
                </div>

                {/* Steps - horizontal on desktop, vertical on mobile */}
                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden lg:block absolute top-16 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-soft-gold/30 z-0"></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 relative z-10">
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
                                    className="relative bg-white rounded-3xl p-8 border border-soft-gold/30 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Number badge */}
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-heritage-gold text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {step.number}
                                    </div>
                                    
                                    <div className={`flex items-center justify-center w-20 h-20 ${colorMap[step.color as keyof typeof colorMap]} rounded-2xl mb-6 mx-auto`}>
                                        {step.icon}
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-charcoal text-center mb-4">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="text-charcoal/70 text-center mb-6">
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
                <div className="mt-20 text-center">
                    <div className="inline-block max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="absolute -top-3 -left-3 text-6xl text-heritage-gold/20" aria-hidden>
                                {"\u201c"}
                            </div>
                            <p className="text-2xl font-serif text-charcoal/80 italic mb-6 relative z-10">
                                We believe in building long‑term relationships, not just transactions. Your trust is our biggest asset.
                            </p>
                            <div className="absolute -bottom-3 -right-3 text-6xl text-heritage-gold/20" aria-hidden>
                                {"\u201d"}
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="w-16 h-1 bg-heritage-gold mx-auto mb-4"></div>
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