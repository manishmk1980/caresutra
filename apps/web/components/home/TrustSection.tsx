import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Users, Target, Shield, Heart, Handshake, CheckCircle } from "lucide-react";

const trustPoints = [
  {
    icon: <Shield className="h-8 w-8 md:h-10 md:w-10" aria-hidden />,
    title: "Transparent guidance",
    description: "We explain fees, trade-offs, and timelines in plain language—so you know what you are deciding.",
    color: "trust-blue",
  },
  {
    icon: <Handshake className="h-8 w-8 md:h-10 md:w-10" aria-hidden />,
    title: "Human-first advisory",
    description: "We focus on what fits your life—not on pushing the fastest sale.",
    color: "heritage-gold",
  },
  {
    icon: <Users className="h-8 w-8 md:h-10 md:w-10" aria-hidden />,
    title: "Multi-domain support",
    description: "Insurance, loans, and health services under one guidance-led approach for your household.",
    color: "support-blue",
  },
  {
    icon: <Target className="h-8 w-8 md:h-10 md:w-10" aria-hidden />,
    title: "Long-term relationship",
    description: "We aim to stay available for renewals, follow-ups, and questions as your needs change.",
    color: "heritage-gold",
  },
  {
    icon: <Heart className="h-8 w-8 md:h-10 md:w-10" aria-hidden />,
    title: "Right option before quick selling",
    description: "You get space to compare; we help you weigh suitability before you commit.",
    color: "trust-blue",
  },
  {
    icon: <CheckCircle className="h-8 w-8 md:h-10 md:w-10" aria-hidden />,
    title: "Local Indian context",
    description: "Guidance that respects how families here plan, save, and seek care.",
    color: "support-blue",
  },
];

export default function TrustSection() {
  return (
    <section id="why" className="bg-white py-12 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5 text-xs font-medium text-trust-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-heritage-gold" aria-hidden />
            Our values
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold text-charcoal md:mb-6 md:text-5xl">Why trust CareSutra?</h2>
          <p className="mx-auto max-w-3xl text-base text-charcoal/80 md:text-lg">
            Honest, practical guidance for Indian families—without inflated claims or confusing jargon.
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
                    <div
                      className={`flex shrink-0 rounded-lg p-2 sm:p-2.5 md:rounded-xl md:p-3 ${colorMap[point.color as keyof typeof colorMap]}`}
                    >
                      {point.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="mb-1.5 text-lg font-bold text-charcoal md:mb-2 md:text-xl">{point.title}</CardTitle>
                      <p className="text-sm leading-relaxed text-charcoal/70 md:text-base">{point.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="min-w-0 p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
                  <div className="flex items-center text-sm text-charcoal/50">
                    <CheckCircle className="mr-2 h-4 w-4 shrink-0 text-heritage-gold" aria-hidden />
                    <span>Trust-building practice</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 text-center md:mt-16">
          <div className="mx-auto inline-block max-w-3xl rounded-2xl border border-soft-gold/30 bg-ivory p-5 sm:p-6 md:p-8">
            <p className="mb-3 text-base leading-relaxed text-charcoal/80 md:mb-4 md:text-xl">
              CareSutra is built to support Indian families with practical, easy-to-understand guidance across insurance, loans, and
              health services.
            </p>
            <p className="text-base font-medium text-heritage-gold md:text-lg">When you are ready, we are here to listen.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
