"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, useFormState, useWatch } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Link2, Camera, ImageIcon, Loader2 } from "lucide-react";
import {
  customerRecordSchema,
  customerStatusOptions,
  customerTypeOptions,
  type CustomerRecordFormInput,
} from "@/lib/validations/customerRecordSchema";
import { focusFirstInvalidCustomerField, orderedValidationMessages } from "@/lib/customerRecordFormErrors";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerField } from "@/components/ui/date-picker";
import { DateSelect } from "@/components/admin/DateSelect";
import { FormErrorSummary } from "@/components/admin/FormErrorSummary";
import { cn } from "@/lib/utils";

const defaultValues: CustomerRecordFormInput = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobile: "",
  alternativeMobile: "",
  dateOfBirth: "",
  pan: "",
  aadhaar: "",
  addressLine: "",
  floor: "",
  street: "",
  city: "",
  state: "",
  pinCode: "",
  customerPictureUrl: "",
  customerStatus: "PROSPECT",
  customerType: "INSURANCE",
  providerCompanyName: "",
  serviceCommencedDate: "",
  expiryDate: "",
  insuranceLoanAmount: undefined,
  premiumEmi: undefined,
  coverFinalPayout: undefined,
};

const invalidRing = "border-amber-600 focus-visible:ring-amber-500/60 focus-visible:ring-2";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-soft-gold/35 bg-ivory/40 p-4 md:p-5 space-y-4">
      <h3 className="font-serif text-xl font-semibold text-charcoal">{title}</h3>
      {children}
    </section>
  );
}

export default function CustomerActivityForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const scrollToValidationSummary = () => {
    document.getElementById("customer-record-validation-summary")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const form = useForm<CustomerRecordFormInput>({
    resolver: zodResolver(customerRecordSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { errors } = useFormState({ control: form.control });
  const validationMessages = useMemo(() => orderedValidationMessages(errors), [errors]);

  const imagePreview = useWatch({
    control: form.control,
    name: "customerPictureUrl",
  }) || "";

  async function uploadFile(file: File) {
    setUploadState(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetchWithTimeout("/api/customer-records/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Image upload failed.");
      }
      form.setValue("customerPictureUrl", data.url, { shouldValidate: true, shouldTouch: true });
      setUploadState("Image uploaded successfully.");
    } catch (error) {
      setUploadState(error instanceof Error ? error.message : "Image upload failed.");
    }
  }

  function handleReset() {
    form.reset(defaultValues);
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitAttempted(false);
    setUploadState(null);
    setUrlInput("");
  }

  function onInvalid(fieldErrors: FieldErrors<CustomerRecordFormInput>) {
    setSubmitAttempted(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    scrollToValidationSummary();
    window.requestAnimationFrame(() => {
      focusFirstInvalidCustomerField(fieldErrors);
    });
  }

  async function onSubmit(values: CustomerRecordFormInput) {
    setSubmitAttempted(false);
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await fetchWithTimeout("/api/customer-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (!res.ok) {
        if (process.env.NODE_ENV === "development") {
          console.error("CUSTOMER_RECORD_POST_FAILED", {
            status: res.status,
            message: result?.message ?? result?.error,
          });
        }
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to save customer record. Please try again.",
        );
      }
      setSubmitSuccess("Customer record saved successfully.");
      setUrlInput("");
      form.reset(defaultValues);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save customer record. Please try again.",
      );
      scrollToValidationSummary();
    } finally {
      setSubmitting(false);
    }
  }

  const statusLabels = useMemo(
    () => ({
      ACTIVE: "Active",
      INACTIVE: "Inactive",
      PROSPECT: "Prospect",
    }),
    [],
  );

  const typeLabels = useMemo(
    () => ({
      INSURANCE: "Insurance",
      LOAN: "Loan",
      HEALTHCARE: "Healthcare",
    }),
    [],
  );

  const showValidationBanner = submitAttempted && validationMessages.length > 0;
  const errorCount = validationMessages.length;

  return (
    <Form {...form}>
      <form
        id="customer-record-form"
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6 pb-28 md:pb-32"
      >
        <div id="customer-record-validation-summary" className="space-y-3 scroll-mt-24">
          {submitError ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-300/90 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm"
            >
              <p className="font-semibold">Unable to save customer record.</p>
              <p className="mt-1 text-red-800/95">{submitError}</p>
            </div>
          ) : null}
          {submitSuccess ? (
            <div
              role="status"
              className="rounded-2xl border border-green-300/90 bg-green-50 px-4 py-3 text-sm text-green-900 shadow-sm"
            >
              {submitSuccess}
            </div>
          ) : null}
          {showValidationBanner ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-charcoal">
                Please correct the highlighted fields before saving.
                {errorCount > 0 ? (
                  <span className="font-medium text-charcoal/80">
                    {" "}
                    ({errorCount} {errorCount === 1 ? "issue" : "issues"})
                  </span>
                ) : null}
              </p>
              <FormErrorSummary messages={validationMessages} />
            </div>
          ) : null}
        </div>

        <Section title="1. Personal Details">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="firstName">
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ravi"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="middleName">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kumar"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="lastName">
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sharma"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="email">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ravi@example.com"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="mobile">
                  <FormLabel>Mobile *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="9876543210 (spaces ok)"
                      {...field}
                      value={String(field.value ?? "")}
                      inputMode="numeric"
                      autoComplete="tel"
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <p className="text-xs text-charcoal/60">10 digits — spaces or dashes are removed automatically.</p>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternativeMobile"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="alternativeMobile">
                  <FormLabel>Alternative Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="9123456789"
                      {...field}
                      value={field.value ?? ""}
                      inputMode="numeric"
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pan"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="pan">
                  <FormLabel>PAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCDE1234F"
                      {...field}
                      value={(field.value as string | undefined) ?? ""}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className={cn("rounded-xl border-soft-gold/40 font-mono", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aadhaar"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="aadhaar">
                  <FormLabel>AADHAAR</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 1234 1234"
                      {...field}
                      value={(field.value as string | undefined) ?? ""}
                      inputMode="numeric"
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <p className="text-xs text-charcoal/60">Optional — 12 digits; spaces removed automatically.</p>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="dateOfBirth">
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DateSelect
                      label="Date of Birth"
                      omitLabel
                      value={(field.value as string | undefined) ?? ""}
                      onChange={field.onChange}
                      error={fieldState.invalid}
                      mode="past"
                      minYear={1920}
                      maxYear={new Date().getFullYear()}
                      allowClear
                      summaryPrefix="Selected DOB"
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section title="2. Address Details">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(
              [
                ["addressLine", "Home / Apartment / Flat *", "Flat 202, Sai Residency"],
                ["floor", "Floor", "2"],
                ["street", "Street / Locality *", "Andheri West"],
                ["city", "City *", "Mumbai"],
                ["state", "State *", "Maharashtra"],
                ["pinCode", "PIN Code *", "400053"],
              ] as const
            ).map(([name, label, placeholder]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field, fieldState }) => (
                  <FormItem data-rhf-field={name}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder}
                        {...field}
                        value={(field.value as string | number | undefined) ?? ""}
                        className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                      />
                    </FormControl>
                    <FormMessage className="text-amber-900" />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </Section>

        <Section title="3. Customer Picture">
          <div
            className="rounded-xl border-2 border-dashed border-soft-gold/50 bg-white p-5 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) void uploadFile(file);
            }}
          >
            <ImageIcon className="h-8 w-8 text-support-blue mx-auto mb-2" />
            <p className="text-sm text-charcoal/70">
              Drag and drop image here (JPG, JPEG, PNG, WEBP up to 2MB)
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadFile(file);
                }}
              />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload from device
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadState("Camera capture will be enabled in next phase.");
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take picture
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <Input
              placeholder="Add image URL (https://...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="rounded-xl border-soft-gold/40"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setValue("customerPictureUrl", urlInput.trim(), {
                  shouldValidate: true,
                  shouldTouch: true,
                });
                setUploadState("Image URL added.");
              }}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Add by URL
            </Button>
          </div>

          <FormField
            control={form.control}
            name="customerPictureUrl"
            render={({ field, fieldState }) => (
              <FormItem data-rhf-field="customerPictureUrl">
                <FormLabel>Picture URL / Path</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)} />
                </FormControl>
                <FormMessage className="text-amber-900" />
              </FormItem>
            )}
          />

          {uploadState ? <p className="text-sm text-support-blue">{uploadState}</p> : null}

          {imagePreview ? (
            <div className="rounded-xl border border-soft-gold/35 bg-white p-3 w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Customer preview" className="h-28 w-28 object-cover rounded-lg" />
            </div>
          ) : null}
        </Section>

        <Section title="4. Customer Status & Type">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerStatus"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="customerStatus">
                  <FormLabel>Customer Status *</FormLabel>
                  <Select value={(field.value as string | undefined) ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "rounded-xl border-soft-gold/40 bg-white",
                          fieldState.invalid && invalidRing,
                        )}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerType"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="customerType">
                  <FormLabel>Customer Type *</FormLabel>
                  <Select value={(field.value as string | undefined) ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "rounded-xl border-soft-gold/40 bg-white",
                          fieldState.invalid && invalidRing,
                        )}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {typeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section title="5. Service Details">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="providerCompanyName"
              render={({ field, fieldState }) => (
                <FormItem className="xl:col-span-3" data-rhf-field="providerCompanyName">
                  <FormLabel>Provider Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company whose service is opted"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceCommencedDate"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="serviceCommencedDate">
                  <FormLabel>Date of Service Commenced</FormLabel>
                  <p className="text-xs text-charcoal/65">Format: DD-MM-YYYY — pick using the calendar.</p>
                  <FormControl>
                    <DatePickerField
                      value={(field.value as string | undefined) ?? ""}
                      onChange={field.onChange}
                      placeholder="Pick commencement date"
                      invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="expiryDate">
                  <FormLabel>Expiry Date</FormLabel>
                  <p className="text-xs text-charcoal/65">Format: DD-MM-YYYY — must be on or after service start.</p>
                  <FormControl>
                    <DatePickerField
                      value={(field.value as string | undefined) ?? ""}
                      onChange={field.onChange}
                      placeholder="Pick expiry date"
                      invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceLoanAmount"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="insuranceLoanAmount">
                  <FormLabel>Insurance / Loan Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="premiumEmi"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="premiumEmi">
                  <FormLabel>Premium / EMI</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverFinalPayout"
              render={({ field, fieldState }) => (
                <FormItem data-rhf-field="coverFinalPayout">
                  <FormLabel>Cover / Final Payout</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                      className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidRing)}
                    />
                  </FormControl>
                  <FormMessage className="text-amber-900" />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-soft-gold/25 pt-4">
          <p className="text-sm text-charcoal/60">
            Required fields are marked with <span className="text-charcoal font-medium">*</span>. Scroll up if you see a validation summary.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="rounded-xl border-soft-gold/50" onClick={handleReset}>
              Reset form
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-trust-blue hover:bg-support-blue text-white px-8"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Saving...
                </>
              ) : (
                "Save Customer Record"
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pt-2 md:px-8">
        <div className="pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-soft-gold/40 bg-white/95 p-3 shadow-lg backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-xl border-soft-gold/50 text-charcoal"
            onClick={handleReset}
            disabled={submitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="customer-record-form"
            disabled={submitting}
            className="min-w-0 flex-1 rounded-xl bg-trust-blue hover:bg-support-blue text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" aria-hidden />
                Saving...
              </>
            ) : (
              "Save Customer Record"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
