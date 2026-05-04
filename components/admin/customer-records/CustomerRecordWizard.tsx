"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { ZodIssue } from "zod";
import {
  customerRecordDraftSchema,
  customerRecordStep1Schema,
  customerRecordStep2Schema,
  customerRecordStep3Schema,
  customerRecordStep4Schema,
  customerRecordSubmitSchema,
  CUSTOMER_RECORD_STEP_FIELDS,
  type CustomerRecordFormInput,
} from "@/lib/validations/customerRecordSchema";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { normalizeCustomerRecordBody } from "@/lib/normalizeCustomerRecordBody";
import {
  apiRecordToFormValues,
  emptyWizardValues,
  inferInitialWizardStep,
  type ApiCustomerRecord,
} from "@/lib/customerRecordLoadRecord";
import { orderedValidationMessagesForStep, focusFirstZodPath } from "@/lib/customerRecordFormErrors";
import { formatTimeOnly } from "@/lib/formatDateTime";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CustomerRecordStepper } from "./CustomerRecordStepper";
import { StepPersonalDetails } from "./StepPersonalDetails";
import { StepAddressDetails } from "./StepAddressDetails";
import { StepCustomerPicture } from "./StepCustomerPicture";
import { StepServiceDetails } from "./StepServiceDetails";
import { StepReviewSubmit } from "./StepReviewSubmit";
import { FormErrorSummary } from "./FormErrorSummary";

const STEP_SCHEMAS = [
  customerRecordStep1Schema,
  customerRecordStep2Schema,
  customerRecordStep3Schema,
  customerRecordStep4Schema,
] as const;

type Props = {
  onSuccess?: () => void;
  /** When set, wizard loads this record (draft or submitted) */
  initialRecord?: ApiCustomerRecord | null;
  /** Called after initialRecord has been applied to the form */
  onInitialRecordApplied?: () => void;
};

export type CustomerRecordWizardHandle = {
  /** Returns false if the user cancels the discard dialog. */
  confirmDiscardIfDirty: () => boolean;
};

const CustomerRecordWizard = forwardRef<CustomerRecordWizardHandle, Props>(function CustomerRecordWizard(
  { onSuccess, initialRecord, onInitialRecordApplied },
  ref,
) {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [currentRecordId, setCurrentRecordId] = useState<number | null>(null);
  const [draftBanner, setDraftBanner] = useState<string | null>(null);
  const [submitBanner, setSubmitBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [stepValidationBanner, setStepValidationBanner] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewIssues, setReviewIssues] = useState<readonly ZodIssue[]>([]);

  const form = useForm<CustomerRecordFormInput>({
    defaultValues: emptyWizardValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { formState } = form;

  useImperativeHandle(
    ref,
    () => ({
      confirmDiscardIfDirty() {
        if (!formState.isDirty) return true;
        return window.confirm(
          "You have unsaved changes on this form. Leave and discard those edits?",
        );
      },
    }),
    [formState.isDirty],
  );
  const stepMessages = useMemo(
    () => orderedValidationMessagesForStep(form.formState.errors, step),
    [form.formState.errors, step],
  );

  useEffect(() => {
    if (!initialRecord) return;
    form.reset(apiRecordToFormValues(initialRecord));
    setCurrentRecordId(initialRecord.id);
    const s = inferInitialWizardStep(initialRecord);
    setStep(s);
    setMaxReached(s);
    setDraftBanner(null);
    setSubmitBanner(null);
    setErrorBanner(null);
    setStepValidationBanner(false);
    setReviewIssues([]);
    onInitialRecordApplied?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load when record identity changes
  }, [initialRecord?.id, initialRecord?.updatedAt]);

  useEffect(() => {
    if (!formState.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formState.isDirty]);

  const applyZodIssues = useCallback(
    (issues: readonly ZodIssue[]) => {
      issues.forEach((issue) => {
        const p = issue.path[0];
        if (typeof p === "string") {
          form.setError(p as keyof CustomerRecordFormInput, {
            type: "manual",
            message: issue.message,
          });
        }
      });
    },
    [form],
  );

  const goNext = useCallback(() => {
    if (step >= 4) return;
    setErrorBanner(null);
    setSubmitBanner(null);
    setDraftBanner(null);
    const fields = [...CUSTOMER_RECORD_STEP_FIELDS[step]];
    fields.forEach((f) => form.clearErrors(f));
    const schema = STEP_SCHEMAS[step];
    const r = schema.safeParse(form.getValues());
    if (!r.success) {
      setStepValidationBanner(true);
      applyZodIssues(r.error.issues);
      window.requestAnimationFrame(() => focusFirstZodPath(r.error.issues));
      return;
    }
    setStepValidationBanner(false);
    setReviewIssues([]);
    setStep((s) => {
      const n = s + 1;
      setMaxReached((m) => Math.max(m, n));
      return n;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, form, applyZodIssues]);

  const goBack = useCallback(() => {
    setStepValidationBanner(false);
    setReviewIssues([]);
    setErrorBanner(null);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const saveDraft = useCallback(async () => {
    setSavingDraft(true);
    setErrorBanner(null);
    setSubmitBanner(null);
    setDraftBanner(null);
    setStepValidationBanner(false);
    try {
      const raw = { id: currentRecordId ?? undefined, ...form.getValues() };
      const parsed = customerRecordDraftSchema.safeParse(normalizeCustomerRecordBody(raw));
      if (!parsed.success) {
        applyZodIssues(parsed.error.issues);
        setReviewIssues([]);
        setStepValidationBanner(true);
        focusFirstZodPath(parsed.error.issues);
        throw new Error("Unable to save draft. Please fix the highlighted fields.");
      }
      const res = await fetchWithTimeout("/api/customer-records/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        record?: { id: number };
      } | null;
      if (!res.ok || !result?.success || !result.record) {
        throw new Error(result?.message || "Unable to save draft. Please try again.");
      }
      setCurrentRecordId(result.record.id);
      const time = formatTimeOnly(new Date());
      setDraftBanner(`Draft saved successfully.\nDraft saved at ${time}`);
      onSuccess?.();
    } catch (e) {
      setErrorBanner(e instanceof Error ? e.message : "Unable to save draft. Please try again.");
    } finally {
      setSavingDraft(false);
    }
  }, [currentRecordId, form, applyZodIssues, onSuccess]);

  const submitFinal = useCallback(async () => {
    setSubmitting(true);
    setErrorBanner(null);
    setSubmitBanner(null);
    setDraftBanner(null);
    setStepValidationBanner(false);
    setReviewIssues([]);
    CUSTOMER_RECORD_STEP_FIELDS.flat().forEach((f) => form.clearErrors(f));
    try {
      const raw = { ...form.getValues() };
      const parsed = customerRecordSubmitSchema.safeParse(normalizeCustomerRecordBody(raw));
      if (!parsed.success) {
        applyZodIssues(parsed.error.issues);
        setStepValidationBanner(true);
        setReviewIssues(parsed.error.issues);
        throw new Error("Some required details are missing or invalid.");
      }
      const body = { ...(currentRecordId ? { id: currentRecordId } : {}), ...parsed.data };
      const res = await fetchWithTimeout("/api/customer-records/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!res.ok || !result?.success) {
        if (process.env.NODE_ENV === "development") {
          console.error("CUSTOMER_RECORD_SUBMIT_FAILED", { status: res.status, message: result?.message });
        }
        throw new Error(result?.message || "Unable to submit. Please try again.");
      }
      setSubmitBanner("Customer record submitted successfully.");
      form.reset(emptyWizardValues);
      setCurrentRecordId(null);
      setStep(0);
      setMaxReached(0);
      setReviewIssues([]);
      onSuccess?.();
    } catch (e) {
      setErrorBanner(e instanceof Error ? e.message : "Unable to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [currentRecordId, form, onSuccess, applyZodIssues]);

  const resetForm = useCallback(() => {
    if (formState.isDirty && !window.confirm("Discard unsaved changes and reset the form?")) return;
    form.reset(emptyWizardValues);
    setStep(0);
    setMaxReached(0);
    setCurrentRecordId(null);
    setDraftBanner(null);
    setSubmitBanner(null);
    setErrorBanner(null);
    setStepValidationBanner(false);
    setReviewIssues([]);
  }, [form, formState.isDirty]);

  const goToFirstIssue = useCallback(() => {
    const firstIssue = reviewIssues.find((issue) => typeof issue.path?.[0] === "string");
    const firstField = firstIssue?.path?.[0];
    if (typeof firstField !== "string") return;
    const stepIndex = CUSTOMER_RECORD_STEP_FIELDS.findIndex((fields) =>
      (fields as readonly string[]).includes(firstField),
    );
    if (stepIndex >= 0) {
      setStep(stepIndex);
      setMaxReached((m) => Math.max(m, stepIndex));
    }
    window.requestAnimationFrame(() => focusFirstZodPath(reviewIssues));
  }, [reviewIssues]);

  const stepTitle = ["Personal details", "Address", "Picture", "Status & service", "Review & save"][step];

  return (
    <FormProvider {...form}>
      <div className="space-y-5 pb-32">
        <CustomerRecordStepper currentStep={step} maxReached={maxReached} />

        <div className="rounded-2xl border border-soft-gold/30 bg-ivory/30 px-3 py-2 md:px-4">
          <p className="text-xs font-semibold text-trust-blue uppercase tracking-wide">Step {step + 1} of 5</p>
          <h2 className="font-serif text-lg md:text-xl font-semibold text-charcoal">{stepTitle}</h2>
        </div>

        <div id="wizard-validation-summary" className="space-y-2 scroll-mt-20">
          {errorBanner ? (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{errorBanner}</div>
          ) : null}
          {draftBanner ? (
            <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 whitespace-pre-line">
              {draftBanner}
            </div>
          ) : null}
          {submitBanner ? (
            <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
              {submitBanner}
            </div>
          ) : null}
          {step === 4 && reviewIssues.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-charcoal">Some required details are missing or invalid.</p>
              <FormErrorSummary
                title="Please fix the following before final submit:"
                messages={reviewIssues.map((issue) => issue.message)}
              />
              <Button type="button" variant="outline" className="rounded-xl" onClick={goToFirstIssue}>
                Go to first issue
              </Button>
            </div>
          ) : null}
          {stepValidationBanner && stepMessages.length > 0 && step !== 4 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-charcoal">
                Please fix the highlighted fields before moving ahead.
              </p>
              <FormErrorSummary messages={stepMessages} />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-soft-gold/35 bg-white p-4 md:p-6 shadow-sm">
          {step === 0 ? <StepPersonalDetails /> : null}
          {step === 1 ? <StepAddressDetails /> : null}
          {step === 2 ? <StepCustomerPicture /> : null}
          {step === 3 ? <StepServiceDetails /> : null}
          {step === 4 ? <StepReviewSubmit onEditStep={setStep} /> : null}
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-3 pt-2 md:px-6">
          <div className="pointer-events-auto flex w-full max-w-3xl flex-wrap items-stretch justify-center gap-2 rounded-2xl border border-soft-gold/40 bg-white/95 p-2 shadow-lg backdrop-blur-sm md:gap-3 md:p-3">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="min-h-11 flex-1 rounded-xl border-soft-gold/50 md:flex-none md:min-w-[100px]"
                onClick={goBack}
                disabled={savingDraft || submitting}
              >
                Back
              </Button>
            ) : (
              <div className="hidden md:block md:w-[100px]" aria-hidden />
            )}
            <Button
              type="button"
              variant="outline"
              className="min-h-11 flex-1 rounded-xl border-heritage-gold/60 text-charcoal md:flex-none md:min-w-[120px]"
              onClick={() => void saveDraft()}
              disabled={savingDraft || submitting}
            >
              {savingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save Draft"
              )}
            </Button>
            {step < 4 ? (
              <Button
                type="button"
                className="min-h-11 flex-1 rounded-xl bg-trust-blue hover:bg-support-blue text-white md:flex-none md:min-w-[120px]"
                onClick={goNext}
                disabled={savingDraft || submitting}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                className="min-h-11 flex-1 rounded-xl bg-trust-blue hover:bg-support-blue text-white md:flex-none md:min-w-[160px]"
                onClick={() => void submitFinal()}
                disabled={savingDraft || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  "Submit Customer Record"
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 w-full text-charcoal/70 md:w-auto md:px-3"
              onClick={resetForm}
              disabled={savingDraft || submitting}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
});

export default CustomerRecordWizard;
