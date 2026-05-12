import { CheckCircle, MessageSquare, FileText, Handshake } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <MessageSquare className="h-7 w-7 md:h-10 md:w-10" aria-hidden />,
    title: "Understand your need",
    description:
      "We start by listening—your goals, worries, and timeline—so guidance matches what you actually need, not a generic script.",
    color: "trust-blue",
  },
  {
    number: "02",
    icon: <FileText className="h-7 w-7 md:h-10 md:w-10" aria-hidden />,
    title: "Explain suitable options",
    description:
      "We walk you through a short list of suitable choices in simple language: what differs, what to watch for, and what paperwork usually looks like.",
    color: "heritage-gold",
  },
  {
    number: "03",
    icon: <Handshake className="h-7 w-7 md:h-10 md:w-10" aria-hidden />,
    title: "Support your next step",
    description:
      "We help you organise documents, follow up on questions, and decide what to do next—with no pressure to rush past your comfort.",
    color: "support-blue",
  },
];

export default function USPSection() {
  return (
    <section className="bg-ivory py-12 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-trust-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-heritage-gold" aria-hidden />
            How CareSutra helps
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold text-charcoal md:mb-6 md:text-5xl">Simple, supportive process</h2>
          <p className="mx-auto max-w-3xl text-base text-charcoal/80 md:text-lg">
            Three clear steps—from listening to your need to supporting your next move.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-16 z-0 hidden h-0.5 w-2/3 -translate-x-1/2 transform bg-soft-gold/30 lg:block" aria-hidden />

          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => {
              const colorMap = {
                "trust-blue": "bg-trust-blue/10 text-trust-blue",
                "support-blue": "bg-support-blue/10 text-support-blue",
                "heritage-gold": "bg-heritage-gold/10 text-heritage-gold",
              };
              return (
                <div
                  key={index}
                  className="group relative min-w-0 rounded-2xl border border-soft-gold/30 bg-white p-5 pt-7 shadow-lg transition-all duration-300 hover:shadow-2xl sm:p-6 sm:pt-8 md:rounded-3xl md:p-8"
                >
                  <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-heritage-gold text-base font-bold text-white md:-top-5 md:h-12 md:w-12 md:text-xl">
                    {step.number}
                  </div>

                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl ${colorMap[step.color as keyof typeof colorMap]} sm:mb-5 md:mb-6 md:h-20 md:w-20 md:rounded-2xl`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="mb-3 text-center text-xl font-bold text-charcoal md:mb-4 md:text-2xl">{step.title}</h3>

                  <p className="mb-4 text-center text-sm leading-relaxed text-charcoal/70 md:mb-6 md:text-base">{step.description}</p>

                  <div className="flex justify-center">
                    <div className="flex items-center text-sm text-charcoal/50">
                      <CheckCircle className="mr-2 h-4 w-4 shrink-0 text-heritage-gold" aria-hidden />
                      <span>Personalized approach</span>
                    </div>
                  </div>

                  {index < steps.length - 1 ? (
                    <div className="absolute -right-4 top-1/2 z-20 hidden h-8 w-8 rounded-full border-4 border-heritage-gold bg-ivory lg:block" aria-hidden />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center md:mt-20">
          <div className="mx-auto inline-block max-w-3xl px-1">
            <div className="relative">
              <div className="absolute -left-1 -top-2 hidden text-5xl text-heritage-gold/20 md:block md:text-6xl" aria-hidden>
                {"\u201c"}
              </div>
              <p className="relative z-10 mb-4 font-serif text-lg italic leading-snug text-charcoal/80 md:mb-6 md:text-2xl">
                We believe in long-term relationships, not one-off transactions. Your trust matters more than a quick close.
              </p>
              <div className="absolute -bottom-2 -right-1 hidden text-5xl text-heritage-gold/20 md:block md:text-6xl" aria-hidden>
                {"\u201d"}
              </div>
            </div>
            <div className="mt-4 md:mt-6">
              <div className="mx-auto mb-3 h-1 w-14 bg-heritage-gold md:mb-4 md:w-16" aria-hidden />
              <p className="text-charcoal/60">— CareSutra team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
