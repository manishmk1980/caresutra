"use client";

import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link2, Camera, ImageIcon } from "lucide-react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { cn } from "@/lib/utils";
import { invalidFieldRing } from "./fieldStyles";
import { SafeCustomerImage } from "@/components/admin/SafeCustomerImage";

export function StepCustomerPicture() {
  const { control, setValue } = useFormContext<CustomerRecordFormInput>();
  const [uploadState, setUploadState] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const imagePreview = useWatch({ control, name: "customerPictureUrl" }) || "";

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
      if (!res.ok || !data.url) throw new Error(data.error || "Image upload failed.");
      setValue("customerPictureUrl", data.url, { shouldValidate: true, shouldTouch: true });
      setUploadState("Image uploaded successfully.");
    } catch (error) {
      setUploadState(error instanceof Error ? error.message : "Image upload failed.");
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-charcoal/70">Optional — add a customer photo for easier recognition.</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
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
          <p className="text-sm text-charcoal/70">Drag and drop (JPG, PNG, WEBP up to 2MB)</p>
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
              onClick={() => setUploadState("Camera capture coming soon.")}
            >
              <Camera className="h-4 w-4 mr-2" />
              Take picture
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
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
                setValue("customerPictureUrl", urlInput.trim(), { shouldValidate: true, shouldTouch: true });
                setUploadState("Image URL added.");
              }}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-soft-gold/35 bg-white p-4">
          <p className="text-sm font-medium text-charcoal">Preview</p>
          {imagePreview ? (
            <>
              <div className="mt-3 w-fit rounded-lg border border-soft-gold/35 bg-ivory/40 p-2">
                <SafeCustomerImage
                  src={imagePreview}
                  alt="Customer preview"
                  className="h-28 w-28 rounded-lg object-cover"
                  fallbackClassName="h-28 w-28 rounded-lg"
                  fallbackText="Preview unavailable"
                />
              </div>
              <p className="mt-3 break-all text-xs text-charcoal/65">{imagePreview}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  Replace image
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-charcoal/75"
                  onClick={() => {
                    setValue("customerPictureUrl", "", { shouldValidate: true, shouldTouch: true });
                    setUploadState("Image removed.");
                  }}
                >
                  Remove image
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-xs text-charcoal/60">No image selected yet.</p>
          )}
        </div>
      </div>
      <FormField
        control={control}
        name="customerPictureUrl"
        render={({ field, fieldState }) => (
          <FormItem data-rhf-field="customerPictureUrl">
            <FormLabel>Picture URL / Path</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                className={cn("rounded-xl border-soft-gold/40", fieldState.invalid && invalidFieldRing)}
              />
            </FormControl>
            <FormMessage className="text-amber-900" />
          </FormItem>
        )}
      />
      {uploadState ? <p className="text-sm text-support-blue">{uploadState}</p> : null}
    </div>
  );
}
