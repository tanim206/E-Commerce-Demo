// components/product-form/MediaSection.tsx

import React from "react";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, FileUploadField } from "@/components/sharedComponents/reuseableInputs/reuseableInputs";
import { ProductFormData, FormErrors } from "@/types/ProductFormTypes";
import { Image as ImageIcon } from "lucide-react";

interface MediaSectionProps {
  control: Control<ProductFormData>;
  errors: FormErrors;
}

export default function MediaSection({ control, errors }: MediaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={20} />
          Product Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <FileUploadField
            name="images"
            control={control}
            label="Product Images"
            multiple
            maxFiles={10}
            accept="image/*"
            placeholder="Upload product images (max 10)"
            buttonText="Upload Images"
            showPreview={true}
          />
          {errors.images && (
            <p className="text-xs text-red-500">{errors.images}</p>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <InputField
            name="thumbnail"
            control={control}
            label="Thumbnail URL"
            placeholder="Main product image URL"
            helperText="If not specified, first image will be used as thumbnail"
          />
        </div>
      </CardContent>
    </Card>
  );
}