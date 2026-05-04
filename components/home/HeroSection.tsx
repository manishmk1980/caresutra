import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
                    Har Zarurat Ka Sahi Margdarshan
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                    Aapke saath, har kadam.
                </p>
                <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                    CareSutra is your trusted partner for insurance, loans, and health services guidance in India. We provide simple, transparent, and personalized support for your family's needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                        Talk to CareSutra
                    </Button>
                    <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8">
                        Explore Services
                    </Button>
                </div>
            </div>
        </section>
    );
}