// components/product-form/SummarySidebar.tsx

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProductFormData } from "@/types/ProductFormTypes";
import { Save } from "lucide-react";

interface SummarySidebarProps {
  control: Control<ProductFormData>;
  categoryLabel: string;
  isSubmitting: boolean;
  isEdit: boolean;
}

export default function SummarySidebar({ control, categoryLabel, isSubmitting, isEdit }: SummarySidebarProps) {
  const router = useRouter();
  const price = useWatch({ control, name: "price" });
  const discountPrice = useWatch({ control, name: "discount_price" });
  const stock = useWatch({ control, name: "stock" });
  const isActive = useWatch({ control, name: "is_active" });
  const isFeatured = useWatch({ control, name: "is_featured" });

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Product Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Category:</span>
          <Badge variant="outline">{categoryLabel}</Badge>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold">
            {price > 0 ? `BDT ${price}` : "Not set"}
          </span>
        </div>
        {discountPrice && discountPrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="text-green-600 font-semibold">
              BDT {discountPrice}
            </span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Stock:</span>
          <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
            {stock > 0 ? `${stock} units` : "Out of stock"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {isFeatured && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Featured:</span>
            <Badge variant="outline" className="bg-yellow-50">Yes</Badge>
          </div>
        )}
      </CardContent>
      <div className="p-6 pt-0 flex gap-3">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          <Save size={16} className="mr-2" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}