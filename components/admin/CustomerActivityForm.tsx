"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Link2, Camera, ImageIcon } from "lucide-react";
import {
  customerRecordSchema,
  customerStatusOptions,
  customerTypeOptions,
  type CustomerRecordFormInput,
} from "@/lib/validations/customerRecordSchema";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerField } from "@/components/ui/date-picker";

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
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<CustomerRecordFormInput>({
    resolver: zodResolver(customerRecordSchema),
    defaultValues,
    mode: "onTouched",
  });

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

  async function onSubmit(values: CustomerRecordFormInput) {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await fetchWithTimeout("/api/customer-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(
          body.message ||
            body.error ||
            "Unable to save customer record. Please check details and try again.",
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
          : "Unable to save customer record. Please check details and try again.",
      );
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Section title="1. Personal Details">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              ["firstName", "First Name *", "Ravi"],
              ["middleName", "Middle Name", "Kumar"],
              ["lastName", "Last Name *", "Sharma"],
              ["email", "Email Address", "ravi@example.com"],
              ["mobile", "Mobile *", "9876543210"],
              ["alternativeMobile", "Alternative Mobile", "9123456789"],
              ["pan", "PAN", "ABCDE1234F"],
              ["aadhaar", "AADHAAR", "123412341234"],
            ].map(([name, label, placeholder]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof CustomerRecordFormInput}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder}
                        {...field}
                        value={(field.value as string | number | undefined) ?? ""}
                        className="rounded-xl border-soft-gold/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePickerField
                      value={(field.value as string | undefined) ?? ""}
                      onChange={field.onChange}
                      placeholder="Pick date of birth"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section title="2. Address Details">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              ["addressLine", "Home / Apartment / Flat *", "Flat 202, Sai Residency"],
              ["floor", "Floor", "2"],
              ["street", "Street / Locality *", "Andheri West"],
              ["city", "City *", "Mumbai"],
              ["state", "State *", "Maharashtra"],
              ["pinCode", "PIN Code *", "400053"],
            ].map(([name, label, placeholder]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof CustomerRecordFormInput}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder}
                        {...field}
                        value={(field.value as string | number | undefined) ?? ""}
                        className="rounded-xl border-soft-gold/40"
                      />
                    </FormControl>
                    <FormMessage />
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Picture URL / Path</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} className="rounded-xl border-soft-gold/40" />
                </FormControl>
                <FormMessage />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Status *</FormLabel>
                  <Select
                    value={(field.value as string | undefined) ?? ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-soft-gold/40">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type *</FormLabel>
                  <Select
                    value={(field.value as string | undefined) ?? ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-soft-gold/40">
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
                  <FormMessage />
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
              render={({ field }) => (
                <FormItem className="xl:col-span-3">
                  <FormLabel>Provider Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company whose service is opted"
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-xl border-soft-gold/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceCommencedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Service Commenced</FormLabel>
                  <FormControl>
                    <DatePickerField
                      value={(field.value as string | undefined) ?? ""}
                      onChange={field.onChange}
                      placeholder="Pick commencement date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <DatePickerField
                      value={(field.value as string | undefined) ?? ""}
                      onChange={field.onChange}
                      placeholder="Pick expiry date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceLoanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance / Loan Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-xl border-soft-gold/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="premiumEmi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium / EMI</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-xl border-soft-gold/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverFinalPayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover / Final Payout</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-xl border-soft-gold/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        {submitError ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">{submitError}</div>
        ) : null}
        {submitSuccess ? (
          <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            {submitSuccess}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto bg-trust-blue hover:bg-support-blue text-white rounded-xl"
        >
          {submitting ? "Saving..." : "Save Customer Record"}
        </Button>
      </form>
    </Form>
  );
}