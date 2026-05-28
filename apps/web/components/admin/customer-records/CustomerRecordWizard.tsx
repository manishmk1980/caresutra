"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
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
import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Loader2, ArrowLeft, Save, ArrowRight, RotateCcw } from "lucide-react";
import { CustomerRecordStepper } from "./CustomerRecordStepper";
import { StepPersonalDetails } from "./StepPersonalDetails";
import { StepAddressDetails } from "./StepAddressDetails";
import { StepDocuments } from "./StepDocuments";
import { StepServiceDetails } from "./StepServiceDetails";
import { StepReviewSubmit } from "./StepReviewSubmit";
import { FormErrorSummary } from "./FormErrorSummary";
import { WIZARD_STEP_META } from "./wizardStepMeta";

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
  const [pendingConfirmation, setPendingConfirmation] = useState<"save-draft" | "submit-final" | "reset-form" | null>(null);
  const [reviewIssues, setReviewIssues] = useState<readonly ZodIssue[]>([]);
  const [showActionBar, setShowActionBar] = useState(true);
  const wizardRootRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<CustomerRecordFormInput>({
    defaultValues: emptyWizardValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { formState } = form;
  const activeStepMeta = WIZARD_STEP_META[step] ?? WIZARD_STEP_META[0]!

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
    const fields = [...(CUSTOMER_RECORD_STEP_FIELDS[step] ?? [])];
    fields.forEach((f) => form.clearErrors(f));
    const schema = STEP_SCHEMAS[step] ?? STEP_SCHEMAS[0];
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
      setDraftBanner(`DRAFT_OK|${time}`);
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
    // Confirmation is handled by the contextual AlertDialog before this function runs.
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

  useEffect(() => {
    const checkVisibility = () => {
      const el = wizardRootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const visible = rect.top < viewport - 120 && rect.bottom > 220;
      setShowActionBar(visible);
    };
    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <FormProvider {...form}>
      <div ref={wizardRootRef} className="space-y-3 pb-32 md:space-y-5 md:pb-44">
        <CustomerRecordStepper currentStep={step} maxReached={maxReached} />

        <div className="rounded-2xl border border-soft-gold/30 bg-ivory/30 px-2 py-1.5 md:px-4">
          <p className="text-[10px] font-semibold text-trust-blue uppercase tracking-wide md:text-xs">Step {step + 1} of 5</p>
          <h2 className="font-serif text-base font-semibold leading-snug text-charcoal md:text-xl">
            {activeStepMeta.title}
          </h2>
          <p className="mt-0.5 text-[11px] leading-snug text-charcoal/60 md:mt-1 md:text-sm md:text-charcoal/65">
            {activeStepMeta.description}
          </p>
        </div>

        <div id="wizard-validation-summary" className="space-y-2 scroll-mt-20">
          {errorBanner ? (
            <div
              role="alert"
              className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-charcoal shadow-sm"
            >
              {errorBanner}
            </div>
          ) : null}
          {draftBanner ? (
            <div className="rounded-2xl border border-green-200/90 bg-green-50/90 px-4 py-3 text-sm text-charcoal shadow-sm">
              {draftBanner.startsWith("DRAFT_OK|") ? (
                <>
                  <p className="font-medium text-green-900">Draft saved successfully.</p>
                  <p className="mt-0.5 text-xs text-charcoal/60">Saved at {draftBanner.slice("DRAFT_OK|".length)}</p>
                </>
              ) : (
                draftBanner
              )}
            </div>
          ) : null}
          {submitBanner ? (
            <div className="rounded-2xl border border-green-200/90 bg-green-50/90 px-4 py-3 text-sm font-medium text-green-900 shadow-sm">
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
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={goToFirstIssue}
                aria-label="Go to first validation issue"
              >
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

        <div className="rounded-2xl border border-soft-gold/35 bg-white p-2 shadow-sm sm:p-3 md:p-6">
          {step === 0 ? <StepPersonalDetails /> : null}
          {step === 1 ? <StepAddressDetails /> : null}
          {step === 2 ? <StepDocuments customerId={initialRecord?.id} /> : null}
          {step === 3 ? <StepServiceDetails /> : null}
          {step === 4 ? <StepReviewSubmit onEditStep={setStep} /> : null}
        </div>

        {showActionBar ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-1.5 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 sm:px-6 sm:pb-3 sm:pt-2">
            <div className="pointer-events-auto flex w-full max-w-[820px] flex-nowrap items-center gap-1.5 rounded-xl border border-soft-gold/40 bg-white/95 px-1.5 py-1 shadow-lg backdrop-blur-sm sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-xl">
            {step > 0 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 min-h-11 w-11 min-w-11 shrink-0 rounded-xl border-soft-gold/50 sm:hidden"
                  onClick={goBack}
                  disabled={savingDraft || submitting}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="hidden min-h-11 rounded-xl border-soft-gold/50 sm:flex sm:min-w-[100px] sm:flex-none"
                  onClick={goBack}
                  disabled={savingDraft || submitting}
                >
                  Back
                </Button>
              </>
            ) : (
              <>
                <div className="h-11 w-11 shrink-0 sm:hidden" aria-hidden />
                <div className="hidden sm:block sm:w-[100px]" aria-hidden />
              </>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 min-h-11 w-11 min-w-11 shrink-0 rounded-xl border-charcoal/15 bg-white text-charcoal/80 hover:bg-ivory sm:hidden"
              onClick={() => setPendingConfirmation("save-draft")}
              disabled={savingDraft || submitting}
              aria-label="Save draft"
            >
              {savingDraft ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Save className="h-4 w-4" aria-hidden />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="hidden min-h-11 rounded-xl border-charcoal/15 bg-white text-charcoal/80 hover:bg-ivory sm:flex sm:min-w-[120px] sm:flex-none"
              onClick={() => setPendingConfirmation("save-draft")}
              disabled={savingDraft || submitting}
            >
              {savingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Savingâ€¦
                </>
              ) : (
                "Save Draft"
              )}
            </Button>
            {step < 4 ? (
              <Button
                type="button"
                className="h-11 min-h-11 min-w-0 flex-1 gap-1 rounded-xl bg-trust-blue px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-support-blue sm:h-auto sm:min-h-11 sm:flex-none sm:min-w-[120px] sm:gap-1.5 sm:px-4"
                onClick={goNext}
                disabled={savingDraft || submitting}
                aria-label="Go to next step"
              >
                Next
                <ArrowRight className="hidden h-4 w-4 shrink-0 opacity-90 sm:block" aria-hidden />
              </Button>
            ) : (
              <Button
                type="button"
                className="h-11 min-h-11 min-w-0 flex-1 gap-1 rounded-xl bg-trust-blue px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-support-blue sm:h-auto sm:min-h-11 sm:flex-none sm:min-w-[160px] sm:gap-1.5 sm:px-4"
                onClick={() => setPendingConfirmation("submit-final")}
                disabled={savingDraft || submitting}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    <span className="truncate">Submittingâ€¦</span>
                  </>
                ) : (
                  <>
                    <span className="truncate sm:hidden">Submit</span>
                    <span className="hidden truncate sm:inline">Submit Customer Record</span>
                  </>
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 min-h-11 w-11 min-w-11 shrink-0 rounded-xl text-charcoal/70 sm:hidden"
              onClick={() => setPendingConfirmation("reset-form")}
              disabled={savingDraft || submitting}
              aria-label="Reset form"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="hidden min-h-11 text-charcoal/70 sm:flex sm:w-auto sm:px-3"
              onClick={() => setPendingConfirmation("reset-form")}
              disabled={savingDraft || submitting}
            >
              Reset
            </Button>
            </div>
          </div>
        ) : null}
      </div>
    </FormProvider>
  );
});

export default CustomerRecordWizard;






