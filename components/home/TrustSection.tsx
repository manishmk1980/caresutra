import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield, Heart, Handshake } from "lucide-react";

const trustPoints = [
    {
        icon: <Shield className="h-8 w-8 text-blue-600" />,
        title: "Transparent Guidance",
        description: "No hidden charges, no confusing jargon. We explain everything in simple terms.",
    },
    {
        icon: <Handshake className="h-8 w-8 text-blue-600" />,
        title: "Relationship-First Approach",
        description: "We prioritize long-term relationships over short‑term sales.",
    },
    {
        icon: <Users className="h-8 w-8 text-blue-600" />,
        title: "Multi‑Domain Support",
        description: "From insurance to loans to health—we cover all your essential needs.",
    },
    {
        icon: <Target className="h-8 w-8 text-blue-600" />,
        title: "Long‑Term Customer Assistance",
        description: "We stay with you even after the purchase, helping with claims, renewals, and queries.",
    },
    {
        icon: <Heart className="h-8 w-8 text-blue-600" />,
        title: "Help in Choosing the Right Option",
        description: "We don’t push products; we help you select what’s genuinely best for you.",
    },
];

export default function TrustSection() {
    return (
        <section id="why" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Trust CareSutra?
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Our values and practices are designed to earn your confidence every step of the way.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trustPoints.map((point, index) => (
                        <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        {point.icon}
                                    </div>
                                    <CardTitle className="text-lg">{point.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{point.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <p className="text-gray-700 max-w-3xl mx-auto">
                        Thousands of families across India have trusted CareSutra for their insurance, loan, and health service decisions. Join them today.
                    </p>
                </div>
            </div>
        </section>
    );
}