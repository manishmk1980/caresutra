import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";
import { ShieldCheck, IndianRupee, HeartPulse, ArrowRight } from "lucide-react";

const services = [
  {
    icon: <ShieldCheck className="h-8 w-8 md:h-12 md:w-12" aria-hidden />,
    title: "Insurance",
    description:
      "Life, health, and motor insurance with plain-language policy comparison, renewal pointers, and claim-support guidance—aligned to what you actually need.",
    color: "trust-blue",
  },
  {
    icon: <IndianRupee className="h-8 w-8 md:h-12 md:w-12" aria-hidden />,
    title: "Loans",
    description:
      "Personal, home, and education loans with eligibility guidance, documentation support, and a clear view of sensible next steps.",
    color: "support-blue",
  },
  {
    icon: <HeartPulse className="h-8 w-8 md:h-12 md:w-12" aria-hidden />,
    title: "Health services",
    description:
      "Wellness support, preventive health checkups, alternative health guidance, second-opinion pointers, and family-focused health conversations.",
    color: "heritage-gold",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-ivory py-12 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-trust-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-heritage-gold" aria-hidden />
            What we offer
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold text-charcoal md:mb-6 md:text-5xl">Insurance, loans &amp; health support</h2>
          <p className="mx-auto max-w-3xl text-base text-charcoal/80 md:text-lg">
            Practical guidance for Indian families—so you can compare options, understand paperwork, and move forward with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8 lg:gap-10">
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
                className={`group border ${borderMap[service.color as keyof typeof borderMap]} rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:rounded-3xl`}
              >
                <CardHeader className="space-y-1 p-4 pb-3 sm:p-5 md:p-6 md:pb-4">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl ${bgMap[service.color as keyof typeof bgMap]} transition-transform duration-300 group-hover:scale-110 sm:mb-5 md:mb-6 md:h-20 md:w-20 md:rounded-2xl`}
                  >
                    <div className={textMap[service.color as keyof typeof textMap]}>{service.icon}</div>
                  </div>
                  <CardTitle className="mb-2 text-center text-xl font-bold text-charcoal md:mb-3 md:text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-center text-sm text-charcoal/70 md:text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
                  <div className="text-center">
                    <Button
                      asChild
                      variant="ghost"
                      className={`inline-flex items-center gap-2 ${textMap[service.color as keyof typeof textMap]} font-medium hover:gap-3 hover:bg-transparent`}
                    >
                      <TrackedBookAppointmentLink location="home_services" className="inline-flex items-center gap-2">
                        Book Free Guidance Call
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                      </TrackedBookAppointmentLink>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 text-center md:mt-16">
          <p className="mx-auto max-w-2xl text-sm text-charcoal/60 md:text-base">
            Tell us your situation on a call or via the form—we explain options in simple language and help with sensible next steps.
          </p>
        </div>
      </div>
    </section>
  );
}
