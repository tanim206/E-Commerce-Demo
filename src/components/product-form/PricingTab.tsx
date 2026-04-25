// components/product-form/PricingTab.tsx

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InputField } from "@/components/sharedComponents/reuseableInputs/reuseableInputs";
import { ProductFormData, FormErrors } from "@/types/ProductFormTypes";
import { DollarSign } from "lucide-react";

interface PricingTabProps {
  control: Control<ProductFormData>;
  errors: FormErrors;
  setValue: (name: any, value: any) => void;
}

export default function PricingTab({
  control,
  errors,
  setValue,
}: PricingTabProps) {
  const isFeatured = useWatch({ control, name: "is_featured" });
  const isActive = useWatch({ control, name: "is_active" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign size={20} />
          Pricing & Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <InputField
              name="price"
              control={control}
              label="Regular Price"
              type="number"
              placeholder="0"
              rules={{
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              }}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <InputField
              name="discount_price"
              control={control}
              label="Discount Price"
              type="number"
              placeholder="0"
              helperText="Leave empty if no discount"
              rules={{
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              }}
            />
            {errors.discount_price && (
              <p className="text-xs text-red-500">{errors.discount_price}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <InputField
              name="sku"
              control={control}
              label="SKU"
              placeholder="e.g., PROD-001"
            />
            {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
          </div>

          <div className="space-y-2">
            <InputField
              name="stock"
              control={control}
              label="Stock Quantity"
              type="number"
              placeholder="0"
              rules={{
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              }}
            />
            {errors.stock && (
              <p className="text-xs text-red-500">{errors.stock}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={isFeatured}
              onCheckedChange={(checked) => setValue("is_featured", checked)}
            />
            <Label className="text-sm font-medium">Feature this product</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label className="text-sm font-medium">Active product</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
