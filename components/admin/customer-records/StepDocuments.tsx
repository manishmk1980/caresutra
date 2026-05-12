"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";

const docCard =
  "rounded-2xl border border-soft-gold/35 bg-ivory/40 p-3 shadow-sm md:p-4";
const docInput =
  "mt-1.5 w-full rounded-xl border border-soft-gold/40 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition-shadow focus-visible:border-trust-blue/50 focus-visible:ring-2 focus-visible:ring-trust-blue/25 md:mt-2 md:px-4 md:py-3";
const docLabel = "block text-xs font-medium text-charcoal md:text-sm";

export function StepDocuments() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CustomerRecordFormInput>();

  return (
    <div className="space-y-4 md:space-y-5">
      <div>
        <h2 className="text-base font-semibold text-charcoal md:text-xl">Customer documents</h2>
        <p className="mt-0.5 hidden text-sm leading-snug text-charcoal/65 md:mt-1 md:block">
          Add uploaded document paths or URLs for customer verification.
        </p>
      </div>

      <div className={docCard}>
        <label className={docLabel}>Customer Picture URL</label>
        <input
          type="text"
          placeholder="/uploads/customer-photo.jpg"
          {...register("customerPictureUrl")}
          className={docInput}
        />
        {errors.customerPictureUrl && (
          <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.customerPictureUrl.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:gap-4">
        <div className={docCard}>
          <label className={docLabel}>PAN</label>
          <input type="text" placeholder="ABCDE1234F" {...register("pan")} className={docInput} />
          {errors.pan && (
            <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.pan.message)}</p>
          )}
        </div>
        <div className={docCard}>
          <label className={docLabel}>Aadhaar</label>
          <input type="text" placeholder="1234 1234 1234" {...register("aadhaar")} className={docInput} />
          {errors.aadhaar && (
            <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.aadhaar.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <div className={docCard}>
          <label className={docLabel}>PAN Document URL</label>
          <input type="text" placeholder="/uploads/pan.pdf" {...register("panDocumentUrl")} className={docInput} />
          {errors.panDocumentUrl && (
            <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.panDocumentUrl.message)}</p>
          )}
        </div>
        <div className={docCard}>
          <label className={docLabel}>Aadhaar Front URL</label>
          <input
            type="text"
            placeholder="/uploads/aadhaar-front.jpg"
            {...register("aadhaarFrontUrl")}
            className={docInput}
          />
          {errors.aadhaarFrontUrl && (
            <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.aadhaarFrontUrl.message)}</p>
          )}
        </div>
        <div className={docCard}>
          <label className={docLabel}>Aadhaar Back URL</label>
          <input
            type="text"
            placeholder="/uploads/aadhaar-back.jpg"
            {...register("aadhaarBackUrl")}
            className={docInput}
          />
          {errors.aadhaarBackUrl && (
            <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.aadhaarBackUrl.message)}</p>
          )}
        </div>
      </div>

      <div className={docCard}>
        <label className={docLabel}>Other Document URL</label>
        <input
          type="text"
          placeholder="/uploads/other-document.pdf"
          {...register("otherDocumentUrl")}
          className={docInput}
        />
        {errors.otherDocumentUrl && (
          <p className="mt-1.5 text-xs text-red-600 md:text-sm">{String(errors.otherDocumentUrl.message)}</p>
        )}
      </div>
    </div>
  );
}
