"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";

const ROWS = [
  ["addressLine", "Home / Apartment / Flat *", "Flat 202, Sai Residency"],
  ["floor", "Floor", "2"],
  ["street", "Street / Locality *", "Andheri West"],
  ["city", "City *", "Mumbai"],
  ["state", "State *", "Maharashtra"],
  ["pinCode", "PIN Code *", "400053"],
] as const;

export function StepAddressDetails() {
  const { control } = useFormContext<CustomerRecordFormInput>();

  return (
    <div className="space-y-3 md:space-y-4">
      <p className="hidden text-sm leading-snug text-charcoal/70 md:block">Where the customer stays. Required fields are marked *.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {ROWS.map(([name, label, placeholder]) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field, fieldState }) => (
              <FormItem data-rhf-field={name}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
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
        ))}
      </div>
    </div>
  );
}
