// components/product-form/BasicInfoTab.tsx

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, SingleSelect } from "@/components/sharedComponents/reuseableInputs/reuseableInputs";
import { CATEGORY_CONFIG } from "@/config/CategoryConfig";
import { ProductFormData, FormErrors } from "@/types/ProductFormTypes";
import { Info } from "lucide-react";

interface BasicInfoTabProps {
  control: Control<ProductFormData>;
  errors: FormErrors;
  setValue: (name: any, value: any) => void;
}

export default function BasicInfoTab({ control, errors, setValue }: BasicInfoTabProps) {
  const watchedName = useWatch({ control, name: "name" });
  const watchedSlug = useWatch({ control, name: "slug" });

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchedName && !watchedSlug) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [watchedName, watchedSlug, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={20} />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <InputField
            name="name"
            control={control}
            label="Product Name"
            placeholder="e.g., Men's Cotton T-Shirt"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <InputField
            name="slug"
            control={control}
            label="Slug"
            placeholder="e.g., mens-cotton-t-shirt"
            helperText="URL-friendly identifier. Auto-generated from name."
          />
          {errors.slug && (
            <p className="text-xs text-red-500">{errors.slug}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SingleSelect
              name="category"
              control={control}
              label="Category"
              options={Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
                label: config.label,
                value
              }))}
            />
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <InputField
              name="brand"
              control={control}
              label="Brand"
              placeholder="e.g., Nike, Samsung"
            />
            {errors.brand && (
              <p className="text-xs text-red-500">{errors.brand}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <InputField
            name="short_description"
            control={control}
            label="Short Description"
            placeholder="Brief description (max 200 characters)"
            helperText="Used in product listings and cards"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...control.register("description")}
            className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
              errors.description 
                ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                : "border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
            rows={6}
            placeholder="Detailed product description..."
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}