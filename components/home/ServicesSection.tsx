import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, IndianRupee, HeartPulse, ArrowRight } from "lucide-react";

const services = [
    {
        icon: <ShieldCheck className="h-12 w-12" />,
        title: "Insurance",
        description: "Life, health, motor, and home insurance with clear comparisons and transparent advice tailored to your needs.",
        color: "trust-blue",
    },
    {
        icon: <IndianRupee className="h-12 w-12" />,
        title: "Loans",
        description: "Personal, home, education loans with best‑fit recommendations, simplified process, and documentation guidance.",
        color: "support-blue",
    },
    {
        icon: <HeartPulse className="h-12 w-12" />,
        title: "Health Services",
        description: "Wellness programs, medical second opinions, health checkups, and holistic treatments for Indian families.",
        color: "heritage-gold",
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-20 md:py-28 bg-ivory">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white text-trust-blue font-medium text-sm px-4 py-2 rounded-full mb-6">
                        <span className="w-2 h-2 bg-heritage-gold rounded-full"></span>
                        What We Offer
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6">
                        Premium Services
                    </h2>
                    <p className="text-lg text-charcoal/80 max-w-3xl mx-auto">
                        We offer a holistic suite of services designed to meet your{" "}
                        {"family's"} essential needs with clarity and care.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {services.map((service, index) => {
                        const bgMap = {
                            "trust-blue": "bg-trust-blue/10",
                            "support-blue": "bg-support-blue/10",
                            "heritage-gold": "bg-heritage-gold/10",
                        };
                        const textMap = {
                            "trust-blue": "text-trust-blue",
                            "support-blue": "text-support-blue",
                            "heritage-gold": "text-heritage-gold",
                        };
                        const borderMap = {
                            "trust-blue": "border-trust-blue/30",
                            "support-blue": "border-support-blue/30",
                            "heritage-gold": "border-heritage-gold/30",
                        };
                        return (
                            <Card
                                key={index}
                                className={`border ${borderMap[service.color as keyof typeof borderMap]} bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group`}
                            >
                                <CardHeader className="pb-4">
                                    <div className={`flex items-center justify-center w-20 h-20 ${bgMap[service.color as keyof typeof bgMap]} rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                        <div className={textMap[service.color as keyof typeof textMap]}>
                                            {service.icon}
                                        </div>
                                    </div>
                                    <CardTitle className="text-center text-2xl font-bold text-charcoal mb-3">
                                        {service.title}
                                    </CardTitle>
                                    <CardDescription className="text-center text-charcoal/70 text-base">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <button className={`inline-flex items-center gap-2 ${textMap[service.color as keyof typeof textMap]} font-medium hover:gap-3 transition-all duration-300`}>
                                            Learn more
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="text-center mt-16">
                    <p className="text-charcoal/60 max-w-2xl mx-auto">
                        Each service includes a free initial consultation, personalized recommendations, and ongoing support.
                    </p>
                </div>
            </div>
        </section>
    );
}