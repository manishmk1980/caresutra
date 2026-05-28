"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";
import { FieldHint, RequiredMark } from "./formFieldHints";

const ROWS = [
  { name: "addressLine" as const, label: "Home / apartment / flat", placeholder: "Flat 202, Sai Residency", required: true },
  { name: "floor" as const, label: "Floor", placeholder: "2", required: false },
  { name: "street" as const, label: "Street / locality", placeholder: "Andheri West", required: true },
  { name: "city" as const, label: "City", placeholder: "Mumbai", required: true },
  { name: "state" as const, label: "State", placeholder: "Maharashtra", required: true },
  { name: "pinCode" as const, label: "PIN code", placeholder: "400053", required: true, helper: "6 digits" as const },
];

export function StepAddressDetails() {
  const { control } = useFormContext<CustomerRecordFormInput>();

  return (
    <div className="space-y-3 md:space-y-4">
      <p className="text-[11px] leading-snug text-charcoal/65 md:hidden">
        Use the customer&apos;s current residential address. Required fields show an asterisk.
      </p>
      <p className="hidden text-sm leading-snug text-charcoal/70 md:block">
        Enter the customer&apos;s current residential address. Required fields are marked with an asterisk.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {ROWS.map(({ name, label, placeholder, required, helper }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field, fieldState }) => (
              <FormItem data-rhf-field={name}>
                <FormLabel className="text-charcoal">
                  {label}
                  {required ? <RequiredMark /> : null}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                    inputMode={name === "pinCode" ? "numeric" : undefined}
                    className={cn(
                      "h-11 rounded-xl border-soft-gold/40 py-2.5 md:h-9 md:py-1",
                      fieldState.invalid && invalidFieldRing,
                    )}
                  />
                </FormControl>
                {helper ? <FieldHint>{helper}</FieldHint> : null}
                <FormMessage className="text-amber-900" />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
