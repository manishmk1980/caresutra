"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { customerStatusOptions, customerTypeOptions } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { DateSelect } from "@/components/admin/DateSelect";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";
import { RequiredMark } from "./formFieldHints";

export function StepServiceDetails() {
  const { control } = useFormContext<CustomerRecordFormInput>();
  const cy = new Date().getFullYear();

  const statusLabels = useMemo(
    () => ({ ACTIVE: "Active", INACTIVE: "Inactive", PROSPECT: "Prospect" } as const),
    [],
  );
  const typeLabels = useMemo(
    () => ({ INSURANCE: "Insurance", LOAN: "Loan", HEALTHCARE: "Healthcare" } as const),
    [],
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <p className="rounded-xl bg-ivory/70 px-3 py-2 text-xs leading-snug text-charcoal/70 md:hidden">
        Pick the service category first. Dates and amounts can stay blank when they are not confirmed.
      </p>
      <p className="hidden text-sm leading-snug text-charcoal/70 md:block">
        Classify the customer, capture the servicing company, and key dates and financials when available.
      </p>
      <div className="space-y-2 md:space-y-3">
        <h3 className="text-xs font-semibold text-trust-blue md:text-sm">Service classification</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <FormField
          control={control}
          name="customerStatus"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="customerStatus">
              <FormLabel className="text-charcoal">
                Customer status
                <RequiredMark />
              </FormLabel>
              <Select value={(field.value as string | undefined) ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "h-12 min-h-12 rounded-xl border-soft-gold/40 bg-white text-base md:h-9 md:min-h-0 md:text-sm",
                      fieldState.invalid && invalidFieldRing,
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
          control={control}
          name="customerType"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="customerType">
              <FormLabel className="text-charcoal">
                Customer type
                <RequiredMark />
              </FormLabel>
              <Select value={(field.value as string | undefined) ?? "INSURANCE"} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "h-12 min-h-12 rounded-xl border-soft-gold/40 bg-white text-base md:h-9 md:min-h-0 md:text-sm",
                      fieldState.invalid && invalidFieldRing,
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
      </div>
      <div className="space-y-2 md:space-y-3">
        <h3 className="text-xs font-semibold text-trust-blue md:text-sm">Provider and dates</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <FormField
          control={control}
          name="providerCompanyName"
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-2 xl:col-span-3" data-rhf-field="providerCompanyName">
              <FormLabel>Provider Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. LIC, HDFC Bank, Apollo Health"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-12 rounded-xl border-soft-gold/40 text-base md:h-9 md:text-sm",
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
          name="serviceCommencedDate"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="serviceCommencedDate">
              <FormLabel>Date of Service Commenced</FormLabel>
              <p className="mt-0.5 text-[11px] leading-snug text-charcoal/65 md:mt-1 md:text-xs">Choose the service start date when confirmed.</p>
              <FormControl>
                <DateSelect
                  label="Service commenced"
                  omitLabel
                  value={(field.value as string | undefined) ?? ""}
                  onChange={field.onChange}
                  error={fieldState.invalid}
                  mode="future"
                  minYear={2000}
                  maxYear={cy + 30}
                  allowClear
                  summaryPrefix="Selected date"
                  emptyText="Not confirmed yet - leave blank"
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="expiryDate"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="expiryDate">
              <FormLabel>Expiry Date</FormLabel>
              <p className="mt-0.5 text-[11px] leading-snug text-charcoal/65 md:mt-1 md:text-xs">Must be on or after service start.</p>
              <FormControl>
                <DateSelect
                  label="Expiry"
                  omitLabel
                  value={(field.value as string | undefined) ?? ""}
                  onChange={field.onChange}
                  error={fieldState.invalid}
                  mode="future"
                  minYear={2000}
                  maxYear={cy + 30}
                  allowClear
                  summaryPrefix="Selected date"
                  emptyText="Not confirmed yet - leave blank"
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        </div>
      </div>
      <div className="space-y-2 md:space-y-3">
        <h3 className="text-xs font-semibold text-trust-blue md:text-sm">Financial details</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <FormField
          control={control}
          name="insuranceLoanAmount"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="insuranceLoanAmount">
              <FormLabel>Insurance / Loan Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500000"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-12 rounded-xl border-soft-gold/40 text-base md:h-9 md:text-sm",
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
          name="premiumEmi"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="premiumEmi">
              <FormLabel>Premium / EMI</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 12500"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-12 rounded-xl border-soft-gold/40 text-base md:h-9 md:text-sm",
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
          name="coverFinalPayout"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="coverFinalPayout">
              <FormLabel>Cover / Final Payout</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 750000"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "h-12 rounded-xl border-soft-gold/40 text-base md:h-9 md:text-sm",
                    fieldState.invalid && invalidFieldRing,
                  )}
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        </div>
      </div>
    </div>
  );
}
