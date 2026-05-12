"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appointmentRequestSchema, type AppointmentRequestInput } from "@/lib/validations/appointmentSchema";

const SERVICE_OPTIONS = [
  { value: "INSURANCE", label: "Insurance" },
  { value: "LOAN", label: "Loan" },
  { value: "HEALTH_SERVICES", label: "Health Services" },
  { value: "MULTIPLE_SERVICES", label: "Multiple Services" },
  { value: "NEED_GUIDANCE", label: "Not Sure / Need Guidance" },
] as const;

const CONTACT_OPTIONS = [
  { value: "PHONE_CALL", label: "Phone Call" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "TELEGRAM", label: "Telegram" },
] as const;

const SLOT_OPTIONS = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "EVENING", label: "Evening" },
  { value: "FLEXIBLE", label: "Flexible" },
] as const;

type Props = {
  calendlyUrl?: string;
};

export default function BookAppointmentPageContent({ calendlyUrl }: Props) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const calendlyBookingUrl = useMemo(() => calendlyUrl?.trim() || "", [calendlyUrl]);
  const hasCalendly = useMemo(() => Boolean(calendlyBookingUrl), [calendlyBookingUrl]);

  const form = useForm<AppointmentRequestInput>({
    resolver: zodResolver(appointmentRequestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      whatsapp: "",
      telegram: "",
      city: "",
      serviceInterest: undefined,
      preferredContactMethod: undefined,
      preferredDate: "",
      preferredTimeSlot: undefined,
      message: "",
      consentAccepted: false,
    },
  });

  async function onSubmit(values: AppointmentRequestInput) {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        errors?: Record<string, string>;
      } | null;
      if (!res.ok || !payload?.success) {
        if (payload?.errors) {
          Object.entries(payload.errors).forEach(([field, message]) => {
            form.setError(field as keyof AppointmentRequestInput, { type: "server", message });
          });
          const firstServerField = Object.keys(payload.errors)[0] as keyof AppointmentRequestInput | undefined;
          if (firstServerField) {
            form.setFocus(firstServerField);
            const el = document.querySelector<HTMLElement>(`[name="${String(firstServerField)}"]`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
        setErrorMessage(payload?.message || "Please complete the required contact details before submitting.");
        return;
      }
      form.reset();
      setSuccessMessage(
        "Thank you. Your appointment request has been received. CareSutra will contact you soon.\nYou can also book directly using Calendly.",
      );
    } catch {
      setErrorMessage("Unable to submit your appointment request. Please check details and try again.");
    }
  }

  const preferredContactMethod = useWatch({ control: form.control, name: "preferredContactMethod" });
  const mobile = useWatch({ control: form.control, name: "mobile" });
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (!sameAsMobile) return;
    form.setValue("whatsapp", mobile ?? "", { shouldValidate: true, shouldDirty: true });
  }, [sameAsMobile, mobile, form]);

  const onInvalid = (formErrors: typeof errors) => {
    setSuccessMessage(null);
    setErrorMessage("Please complete the required contact details before submitting.");
    const firstErrorField = Object.keys(formErrors)[0] as keyof AppointmentRequestInput | undefined;
    if (!firstErrorField) return;
    form.setFocus(firstErrorField);
    const el = document.querySelector<HTMLElement>(`[name="${String(firstErrorField)}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="appointment" className="min-w-0 bg-ivory pb-12 pt-8 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-soft-gold/35 bg-white p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-trust-blue">Book an Appointment</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl md:text-5xl">
            Book an Appointment
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/75 sm:text-base">
            Share your details and preferred contact method. Our team will connect with you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-2xl border border-trust-blue/25 bg-white p-4 shadow-md sm:rounded-3xl sm:p-5 md:p-7">
            <h2 className="font-serif text-xl text-charcoal sm:text-2xl">Appointment Request Form</h2>
            <p className="mt-1 text-sm text-charcoal/70">No login required. Fields marked * are mandatory.</p>

            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" {...form.register("fullName")} />
                  {errors.fullName ? <p className="text-xs text-red-700">{errors.fullName.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...form.register("email")} />
                  {preferredContactMethod === "EMAIL" ? (
                    <p className="text-xs text-charcoal/60">We&apos;ll use this email for appointment confirmation.</p>
                  ) : null}
                  {errors.email ? <p className="text-xs text-red-700">{errors.email.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input id="mobile" inputMode="numeric" {...form.register("mobile")} />
                  {errors.mobile ? <p className="text-xs text-red-700">{errors.mobile.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" inputMode="numeric" {...form.register("whatsapp")} />
                  <label className="inline-flex items-center gap-2 text-xs text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={(e) => setSameAsMobile(e.target.checked)}
                    />
                    Same as mobile
                  </label>
                  {preferredContactMethod === "WHATSAPP" ? (
                    <p className="text-xs text-charcoal/60">Required because WhatsApp is selected.</p>
                  ) : null}
                  {errors.whatsapp ? <p className="text-xs text-red-700">{errors.whatsapp.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram Username / ID</Label>
                  <Input id="telegram" {...form.register("telegram")} />
                  {preferredContactMethod === "TELEGRAM" ? (
                    <p className="text-xs text-charcoal/60">Required because Telegram is selected.</p>
                  ) : null}
                  {errors.telegram ? <p className="text-xs text-red-700">{errors.telegram.message}</p> : null}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("city")} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serviceInterest">Service Interest *</Label>
                  <select
                    id="serviceInterest"
                    {...form.register("serviceInterest")}
                    className="h-10 w-full rounded-xl border border-soft-gold/40 bg-white px-3 text-sm text-charcoal"
                  >
                    <option value="">Select service interest</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.serviceInterest ? <p className="text-xs text-red-700">{errors.serviceInterest.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod">Preferred Contact Method *</Label>
                  <select
                    id="preferredContactMethod"
                    {...form.register("preferredContactMethod")}
                    className="h-10 w-full rounded-xl border border-soft-gold/40 bg-white px-3 text-sm text-charcoal"
                  >
                    <option value="">Select contact method</option>
                    {CONTACT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.preferredContactMethod ? (
                    <p className="text-xs text-red-700">{errors.preferredContactMethod.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input id="preferredDate" type="date" {...form.register("preferredDate")} />
                  <p className="text-xs text-charcoal/60">Choose your preferred date. Our team will confirm availability.</p>
                  {errors.preferredDate ? <p className="text-xs text-red-700">{errors.preferredDate.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTimeSlot">Preferred Time Slot</Label>
                  <select
                    id="preferredTimeSlot"
                    {...form.register("preferredTimeSlot")}
                    className="h-10 w-full rounded-xl border border-soft-gold/40 bg-white px-3 text-sm text-charcoal"
                  >
                    <option value="">Select time slot</option>
                    {SLOT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message">Message / Requirement</Label>
                  <Textarea id="message" rows={4} {...form.register("message")} />
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-soft-gold/30 bg-ivory/40 p-3 text-sm text-charcoal">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-soft-gold/50" {...form.register("consentAccepted")} />
                <span>I agree to be contacted by CareSutra regarding my appointment request.</span>
              </label>
              {errors.consentAccepted ? <p className="text-xs text-red-700">{errors.consentAccepted.message}</p> : null}

              {successMessage ? (
                <p className="whitespace-pre-line rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {successMessage}
                </p>
              ) : null}
              {errorMessage ? (
                <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-trust-blue text-white hover:bg-support-blue md:h-10 md:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Appointment Request"}
              </Button>
            </form>
          </div>

          <div className="min-w-0 space-y-5 lg:space-y-6">
            <div className="rounded-2xl border border-soft-gold/35 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-7">
              <h2 className="font-serif text-xl text-charcoal sm:text-2xl">Prefer choosing a slot yourself?</h2>
              <p className="mt-2 text-sm text-charcoal/70">
                Book directly on Calendly in a new secure tab.
              </p>
              {hasCalendly ? (
                <>
                  <div className="mt-4 space-y-3">
                    <Button asChild className="w-full rounded-xl bg-trust-blue hover:bg-support-blue text-white">
                      <a href={calendlyBookingUrl} target="_blank" rel="noopener noreferrer">
                      Book on Calendly
                      </a>
                    </Button>
                    {!showEmbed ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-soft-gold/50"
                        onClick={() => setShowEmbed(true)}
                      >
                        Show calendar on this page
                      </Button>
                    ) : null}
                  </div>
                  {showEmbed ? (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-charcoal/60">
                        Calendly may load third-party scheduling scripts.
                      </p>
                      <iframe
                        src={calendlyBookingUrl}
                        title="Book a CareSutra appointment"
                        className="h-[min(70vh,520px)] w-full rounded-2xl border border-soft-gold/30 bg-white sm:h-[600px] md:h-[700px]"
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-4 rounded-xl border border-soft-gold/30 bg-ivory/40 p-4">
                  <p className="text-sm text-charcoal/75">
                    Calendly link will be added soon. Please use the appointment form.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-soft-gold/35 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-7">
              <h3 className="font-serif text-lg text-charcoal sm:text-xl">Why book with CareSutra</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-charcoal/80 sm:grid-cols-2">
                <p className="rounded-xl bg-ivory/50 p-3">No obligation</p>
                <p className="rounded-xl bg-ivory/50 p-3">Simple guidance</p>
                <p className="rounded-xl bg-ivory/50 p-3">Personal support</p>
                <p className="rounded-xl bg-ivory/50 p-3">Response within 24 hours</p>
              </div>
              <div className="mt-5">
                <Button asChild variant="outline" className="h-11 w-full rounded-xl border-soft-gold/50 sm:h-10 sm:w-auto">
                  <Link href="/#contact">Call CareSutra</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
