"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { customerStatusOptions, customerTypeOptions } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateSelect } from "@/components/admin/DateSelect";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";

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
    <div className="space-y-6">
      <p className="text-sm text-charcoal/70">Status, type, and policy / loan details.</p>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-trust-blue">Service classification</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="customerStatus"
          render={({ field, fieldState }) => (
            <FormItem data-rhf-field="customerStatus">
              <FormLabel>Customer Status *</FormLabel>
              <Select value={(field.value as string | undefined) ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "rounded-xl border-soft-gold/40 bg-white",
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
              <FormLabel>Customer Type *</FormLabel>
              <Select value={(field.value as string | undefined) ?? "INSURANCE"} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "rounded-xl border-soft-gold/40 bg-white",
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
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-trust-blue">Provider and dates</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FormField
          control={control}
          name="providerCompanyName"
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-2 xl:col-span-3" data-rhf-field="providerCompanyName">
              <FormLabel>Provider Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Company whose service is opted"
                  {...field}
                  value={field.value ?? ""}
                  className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidFieldRing)}
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
              <p className="text-xs text-charcoal/65">Format: DD-MM-YYYY (calendar below).</p>
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
              <p className="text-xs text-charcoal/65">Must be on or after service start.</p>
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
                />
              </FormControl>
              <FormMessage className="text-amber-900" />
            </FormItem>
          )}
        />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-trust-blue">Financial details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? ""}
                  className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidFieldRing)}
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
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? ""}
                  className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidFieldRing)}
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
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? ""}
                  className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidFieldRing)}
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
