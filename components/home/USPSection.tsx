import { CheckCircle } from "lucide-react";

const usps = [
    "One trusted guidance point for multiple needs",
    "Personalized support tailored to your situation",
    "Simple explanation before decision",
    "Human-first advisory, not automated",
    "Local Indian context and understanding",
];

export default function USPSection() {
    return (
        <section className="py-20 bg-blue-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose CareSutra?
                        </h2>
                        <p className="text-gray-700 text-lg">
                            Our unique approach makes us the preferred partner for families across India.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {usps.map((usp, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{usp}</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        We ensure you receive clear, unbiased advice that puts your interests first.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <p className="text-gray-700 italic">
                            "We believe in building long-term relationships, not just transactions. Your trust is our biggest asset."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}