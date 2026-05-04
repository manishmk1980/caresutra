import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield, Heart, Handshake, CheckCircle } from "lucide-react";

const trustPoints = [
    {
        icon: <Shield className="h-10 w-10" />,
        title: "Transparent Guidance",
        description: "No hidden charges, no confusing jargon. We explain everything in simple terms.",
        color: "trust-blue",
    },
    {
        icon: <Handshake className="h-10 w-10" />,
        title: "Human‑First Advisory",
        description: "We prioritize long‑term relationships over short‑term sales.",
        color: "heritage-gold",
    },
    {
        icon: <Users className="h-10 w-10" />,
        title: "Multi‑Domain Support",
        description: "From insurance to loans to health—we cover all your essential needs.",
        color: "support-blue",
    },
    {
        icon: <Target className="h-10 w-10" />,
        title: "Long‑Term Relationship",
        description: "We stay with you even after the purchase, helping with claims, renewals, and queries.",
        color: "heritage-gold",
    },
    {
        icon: <Heart className="h-10 w-10" />,
        title: "Right Option Before Quick Selling",
        description: "We don't push products; we help you select what's genuinely best for you.",
        color: "trust-blue",
    },
    {
        icon: <CheckCircle className="h-10 w-10" />,
        title: "Local Indian Context",
        description: "Solutions tailored for Indian families, regulations, and cultural nuances.",
        color: "support-blue",
    },
];

export default function TrustSection() {
    return (
        <section id="why" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-ivory text-trust-blue font-medium text-sm px-4 py-2 rounded-full mb-6">
                        <span className="w-2 h-2 bg-heritage-gold rounded-full"></span>
                        Our Values
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6">
                        Why Trust CareSutra?
                    </h2>
                    <p className="text-lg text-charcoal/80 max-w-3xl mx-auto">
                        Our values and practices are designed to earn your confidence every step of the way.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                className={`border ${borderMap[point.color as keyof typeof borderMap]} bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-heritage-gold/50 group`}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start gap-5">
                                        <div className={`flex-shrink-0 p-3 ${colorMap[point.color as keyof typeof colorMap]} rounded-xl`}>
                                            {point.icon}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-charcoal mb-2">
                                                {point.title}
                                            </CardTitle>
                                            <p className="text-charcoal/70">
                                                {point.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center text-sm text-charcoal/50">
                                        <CheckCircle className="h-4 w-4 mr-2 text-heritage-gold" />
                                        <span>Trust‑building practice</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="mt-16 text-center">
                    <div className="inline-block bg-ivory rounded-2xl p-8 max-w-3xl mx-auto border border-soft-gold/30">
                        <p className="text-xl text-charcoal/80 mb-4">
                            Thousands of families across India have trusted CareSutra for their insurance, loan, and health service decisions.
                        </p>
                        <p className="text-lg font-medium text-heritage-gold">
                            Join them today for simple, supportive guidance.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}