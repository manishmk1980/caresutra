"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateSelect } from "@/components/admin/DateSelect";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";
import { FieldHint, RequiredMark } from "./formFieldHints";

export function StepPersonalDetails() {
  const { control } = useFormContext<CustomerRecordFormInput>();

  return (
    <div className="space-y-3 md:space-y-4">
      <p className="text-[11px] leading-snug text-charcoal/65 md:hidden">
        Required fields are marked with an asterisk (<span className="text-support-blue">*</span>).
      </p>
      <p className="hidden text-sm leading-snug text-charcoal/70 md:block">
        Enter the customer&apos;s legal name and best contact numbers. Required fields are marked with an asterisk.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <FormField
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="firstName">
              <FormLabel className="text-charcoal">
                First name
                <RequiredMark />
              </FormLabel>
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
              <FormLabel className="text-charcoal">Middle name</FormLabel>
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
              <FormLabel className="text-charcoal">
                Last name
                <RequiredMark />
              </FormLabel>
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
              <FormLabel className="text-charcoal">Email address</FormLabel>
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
              <FormLabel className="text-charcoal">
                Mobile
                <RequiredMark />
              </FormLabel>
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
              <FieldHint>10-digit number — non-digits are removed when you save.</FieldHint>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="alternativeMobile"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="alternativeMobile">
              <FormLabel className="text-charcoal">Alternative mobile</FormLabel>
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
              <FieldHint>10-digit number, if provided.</FieldHint>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="dateOfBirth">
              <FormLabel className="text-charcoal">Date of birth</FormLabel>
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
