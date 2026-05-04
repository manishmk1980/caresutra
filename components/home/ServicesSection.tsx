import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Home, Heart } from "lucide-react";

const services = [
    {
        icon: <Shield className="h-10 w-10 text-blue-600" />,
        title: "Insurance",
        description: "Comprehensive insurance solutions for health, life, motor, and home. We help you choose the right coverage with transparent advice.",
    },
    {
        icon: <Home className="h-10 w-10 text-blue-600" />,
        title: "Loans",
        description: "Personal, home, business, and education loans with competitive rates. Simplified process and guidance through eligibility and documentation.",
    },
    {
        icon: <Heart className="h-10 w-10 text-blue-600" />,
        title: "Health Services",
        description: "Wellness and alternative health services, including preventive care, therapy, and holistic treatments tailored to Indian families.",
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Services
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We offer a holistic suite of services designed to meet your family's essential needs with clarity and care.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-center mb-4">
                                    {service.icon}
                                </div>
                                <CardTitle className="text-center text-xl">{service.title}</CardTitle>
                                <CardDescription className="text-center">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn more →
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}