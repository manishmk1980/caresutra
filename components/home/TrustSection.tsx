import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield, Heart, Handshake, CheckCircle } from "lucide-react";

const trustPoints = [
    {
        icon: <Shield className="h-8 w-8 md:h-10 md:w-10" />,
        title: "Transparent Guidance",
        description: "No hidden charges, no confusing jargon. We explain everything in simple terms.",
        color: "trust-blue",
    },
    {
        icon: <Handshake className="h-8 w-8 md:h-10 md:w-10" />,
        title: "Human‑First Advisory",
        description: "We prioritize long‑term relationships over short‑term sales.",
        color: "heritage-gold",
    },
    {
        icon: <Users className="h-8 w-8 md:h-10 md:w-10" />,
        title: "Multi‑Domain Support",
        description: "From insurance to loans to health—we cover all your essential needs.",
        color: "support-blue",
    },
    {
        icon: <Target className="h-8 w-8 md:h-10 md:w-10" />,
        title: "Long‑Term Relationship",
        description: "We stay with you even after the purchase, helping with claims, renewals, and queries.",
        color: "heritage-gold",
    },
    {
        icon: <Heart className="h-8 w-8 md:h-10 md:w-10" />,
        title: "Right Option Before Quick Selling",
        description: "We don't push products; we help you select what's genuinely best for you.",
        color: "trust-blue",
    },
    {
        icon: <CheckCircle className="h-8 w-8 md:h-10 md:w-10" />,
        title: "Local Indian Context",
        description: "Solutions tailored for Indian families, regulations, and cultural nuances.",
        color: "support-blue",
    },
];

export default function TrustSection() {
    return (
        <section id="why" className="bg-white py-12 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center md:mb-16">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5 text-xs font-medium text-trust-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
                        <span className="h-2 w-2 rounded-full bg-heritage-gold"></span>
                        Our Values
                    </div>
                    <h2 className="mb-4 font-serif text-3xl font-bold text-charcoal md:mb-6 md:text-5xl">
                        Why Trust CareSutra?
                    </h2>
                    <p className="mx-auto max-w-3xl text-base text-charcoal/80 md:text-lg">
                        Our values and practices are designed to earn your confidence every step of the way.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {trustPoints.map((point, index) => {
                        const colorMap = {
                            "trust-blue": "bg-trust-blue/10 text-trust-blue",
                            "support-blue": "bg-support-blue/10 text-support-blue",
                            "heritage-gold": "bg-heritage-gold/10 text-heritage-gold",
                        };
                        const borderMap = {
                            "trust-blue": "border-trust-blue/20",
                            "support-blue": "border-support-blue/20",
                            "heritage-gold": "border-heritage-gold/20",
                        };
                        return (
                            <Card
                                key={index}
                                className={`group min-w-0 border ${borderMap[point.color as keyof typeof borderMap]} rounded-2xl bg-white shadow-lg transition-all duration-300 hover:border-heritage-gold/50 hover:shadow-xl md:rounded-3xl`}
                            >
                                <CardHeader className="space-y-1 p-4 pb-3 sm:p-5 md:p-6 md:pb-4">
                                    <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                                        <div className={`flex shrink-0 rounded-lg p-2 sm:p-2.5 md:rounded-xl md:p-3 ${colorMap[point.color as keyof typeof colorMap]}`}>
                                            {point.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="mb-1.5 text-lg font-bold text-charcoal md:mb-2 md:text-xl">
                                                {point.title}
                                            </CardTitle>
                                            <p className="text-sm leading-relaxed text-charcoal/70 md:text-base">
                                                {point.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="min-w-0 p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
                                    <div className="flex items-center text-sm text-charcoal/50">
                                        <CheckCircle className="h-4 w-4 mr-2 text-heritage-gold" />
                                        <span>Trust‑building practice</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="mt-10 text-center md:mt-16">
                    <div className="mx-auto inline-block max-w-3xl rounded-2xl border border-soft-gold/30 bg-ivory p-5 sm:p-6 md:p-8">
                        <p className="mb-3 text-base leading-relaxed text-charcoal/80 md:mb-4 md:text-xl">
                            Thousands of families across India have trusted CareSutra for their insurance, loan, and health service decisions.
                        </p>
                        <p className="text-base font-medium text-heritage-gold md:text-lg">
                            Join them today for simple, supportive guidance.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}