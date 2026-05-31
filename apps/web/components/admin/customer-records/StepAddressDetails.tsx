"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";
import { FieldHint, RequiredMark } from "./formFieldHints";

const inputClass = "h-12 rounded-xl border-soft-gold/40 text-base md:h-9 md:text-sm";

const ROWS = [
  {
    name: "addressLine" as const,
    label: "Home / apartment / flat",
    placeholder: "e.g. Flat 202, Sai Residency",
    required: true,
  },
  {
    name: "floor" as const,
    label: "Floor",
    placeholder: "e.g. 2nd floor or Ground floor",
    required: false,
  },
  {
    name: "street" as const,
    label: "Street / locality",
    placeholder: "e.g. Andheri West, near station",
    required: true,
  },
  {
    name: "city" as const,
    label: "City",
    placeholder: "e.g. Mumbai",
    required: true,
  },
  {
    name: "state" as const,
    label: "State",
    placeholder: "e.g. Maharashtra",
    required: true,
  },
  {
    name: "pinCode" as const,
    label: "PIN code",
    placeholder: "6-digit area PIN",
    required: true,
    helper: "Only 6 digits are stored.",
  },
];

export function StepAddressDetails() {
  const { control } = useFormContext<CustomerRecordFormInput>();

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-ivory/70 px-3 py-2 text-xs leading-snug text-charcoal/70 md:hidden">
        Use the current residential address. If a detail is not applicable, choose the closest useful context.
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
                    className={cn(inputClass, fieldState.invalid && invalidFieldRing)}
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
