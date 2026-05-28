import { Button } from "@workspace/ui/components/button";
import TrackedBookAppointmentLink from "@/components/analytics/TrackedBookAppointmentLink";
import { ArrowRight } from "lucide-react";

const blocks = [
  {
    heading: "Insurance guidance",
    body: "Choosing cover should feel clear, not rushed. We walk you through life, health, and motor options in everyday language—so you can compare with confidence.",
    bullets: ["Life, health, and motor cover explained simply", "Policy comparison and renewal pointers", "Claim and paperwork guidance from the insurer's lens"],
  },
  {
    heading: "Loan assistance",
    body: "Borrowing is a big step. We help you understand eligibility, documents, and what different lenders typically look for—before you commit.",
    bullets: ["Personal, home, and education loan basics", "Eligibility and documentation support", "Next steps without pressure to rush"],
  },
  {
    heading: "Health & wellness guidance",
    body: "From preventive checkups to alternative health routes, we help you ask the right questions and find sensible next steps—with respect for your family’s context.",
    bullets: ["Wellness and preventive health checkups", "Alternative health and second-opinion guidance", "Family-focused, practical suggestions"],
  },
] as const;

export default function GuidanceAcrossDecisionsSection() {
  return (
    <section className="border-t border-soft-gold/25 bg-white py-12 md:py-24" aria-labelledby="guidance-across-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-trust-blue">How we help</p>
          <h2 id="guidance-across-heading" className="font-serif text-3xl font-bold text-charcoal md:text-4xl lg:text-5xl">
            Guidance across life&apos;s important decisions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal/75 md:text-lg">
            CareSutra is guidance-first: we listen, explain options plainly, and support your next step—across insurance, loans, and health services.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {blocks.map((block) => (
            <div
              key={block.heading}
              className="flex min-w-0 flex-col rounded-2xl border border-soft-gold/35 bg-ivory/50 p-5 shadow-sm md:rounded-3xl md:p-6"
            >
              <h3 className="font-serif text-xl font-semibold text-charcoal md:text-2xl">{block.heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75 md:text-base">{block.body}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-charcoal/80 md:text-base">
                {block.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-1 flex-col justify-end">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl border-trust-blue/40 text-trust-blue hover:bg-trust-blue/5 md:w-auto"
                >
                  <TrackedBookAppointmentLink location="home_guidance" className="inline-flex items-center justify-center gap-2">
                    Book Free Guidance Call
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </TrackedBookAppointmentLink>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
