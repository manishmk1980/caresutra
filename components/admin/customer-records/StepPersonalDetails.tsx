"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateSelect } from "@/components/admin/DateSelect";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";

export function StepPersonalDetails() {
  const { control } = useFormContext<CustomerRecordFormInput>();

  return (
    <div className="space-y-3 md:space-y-4">
      <p className="hidden text-sm leading-snug text-charcoal/70 md:block">Tell us who the customer is. Fields marked * are required before submit.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <FormField
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="firstName">
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ravi"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="middleName"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="middleName">
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kumar"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="lastName">
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sharma"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
                  className={cn(
                    "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mobile"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="mobile">
              <FormLabel>Mobile *</FormLabel>
              <FormControl>
                <Input
                  placeholder="9876543210"
                  {...field}
                  value={String(field.value ?? "")}
                  inputMode="numeric"
                  autoComplete="tel"
                  className={cn(
                    "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <p className="text-xs text-charcoal/60">10 digits — spaces or dashes are removed when you save.</p>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
                  className={cn(
                    "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
       
        <FormField
          control={control}
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
    </div>
  );
}
