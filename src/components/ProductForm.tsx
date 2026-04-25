// components/ProductForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCategoryAttributes,
  categoryHasVariants,
  CATEGORY_CONFIG,
} from "@/config/CategoryConfig";
import { ProductFormData, FormErrors } from "@/types/ProductFormTypes";
import BasicInfoTab from "@/components/product-form/BasicInfoTab";
import PricingTab from "@/components/product-form/PricingTab";
import AttributesTab from "@/components/product-form/AttributesTab";
import VariantsTab from "@/components/product-form/VariantsTab";
import MediaSection from "@/components/product-form/MediaSection";
import SummarySidebar from "@/components/product-form/SummarySidebar";
import { Info, DollarSign, Settings, Layers } from "lucide-react";
import axios from "axios";

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit?: (data: ProductFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit: externalSubmit,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const form = useForm<ProductFormData>({
    defaultValues: initialData || {
      name: "",
      slug: "",
      short_description: "",
      description: "",
      price: 0,
      discount_price: undefined,
      currency: "BDT",
      category: "clothing",
      brand: "",
      sku: "",
      stock: 0,
      images: [],
      thumbnail: "",
      is_featured: false,
      is_active: true,
      attributes: {},
      variants: [],
    },
  });

  const { control, handleSubmit, watch, setValue, getValues, reset } = form;
  const watchedCategory = watch("category");

  // Get current category attributes and config
  const currentAttributes = getCategoryAttributes(watchedCategory);
  const hasVariants = categoryHasVariants(watchedCategory);
  const categoryConfig =
    CATEGORY_CONFIG[watchedCategory] || CATEGORY_CONFIG.clothing;

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Reset attributes when category changes (only for new products)
  useEffect(() => {
    if (!isEdit && watchedCategory) {
      const newAttributes: Record<string, any> = {};
      currentAttributes.forEach((attr) => {
        if (attr.type === "multiselect") {
          newAttributes[attr.key] = [];
        } else {
          newAttributes[attr.key] = "";
        }
      });
      setValue("attributes", newAttributes);
    }
  }, [watchedCategory, setValue, isEdit, currentAttributes]);

  // Validation function
  const validateForm = (data: ProductFormData): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Basic validation
    if (!data.name || data.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
      isValid = false;
    } else if (data.name.length > 200) {
      newErrors.name = "Product name must be less than 200 characters";
      isValid = false;
    }

    if (!data.slug || data.slug.length < 3) {
      newErrors.slug = "Slug must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      newErrors.slug = "Slug must be URL-friendly";
      isValid = false;
    }

    if (!data.description || data.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
      isValid = false;
    }

    if (data.price < 0) {
      newErrors.price = "Price must be greater than or equal to 0";
      isValid = false;
    }

    if (data.discount_price && data.discount_price >= data.price) {
      newErrors.discount_price =
        "Discount price must be less than regular price";
      isValid = false;
    }

    if (!data.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (!data.brand) {
      newErrors.brand = "Brand is required";
      isValid = false;
    }

    if (!data.sku) {
      newErrors.sku = "SKU is required";
      isValid = false;
    }

    if (data.stock < 0) {
      newErrors.stock = "Stock must be greater than or equal to 0";
      isValid = false;
    }

    if (!data.images || data.images.length === 0) {
      newErrors.images = "At least one product image is required";
      isValid = false;
    }

    // Attribute validation
    const attributeErrors: Record<string, string> = {};
    currentAttributes.forEach((attr) => {
      const value = data.attributes[attr.key];
      if (attr.required) {
        if (attr.type === "multiselect") {
          if (!value || value.length === 0) {
            attributeErrors[attr.key] = `${attr.label} is required`;
            isValid = false;
          }
        } else {
          if (!value || value === "") {
            attributeErrors[attr.key] = `${attr.label} is required`;
            isValid = false;
          }
        }
      }

      if (attr.type === "number" && value && value < 0) {
        attributeErrors[attr.key] = `${attr.label} must be at least 0`;
        isValid = false;
      }
    });

    if (Object.keys(attributeErrors).length > 0) {
      newErrors.attributes = attributeErrors;
    }

    // Variant validation
    if (data.variants && data.variants.length > 0) {
      const variantErrors: {
        [key: number]: { price?: string; stock?: string; sku?: string };
      } = {};
      data.variants.forEach((variant, index) => {
        const variantError: { price?: string; stock?: string; sku?: string } =
          {};

        if (variant.price < 0) {
          variantError.price = "Price must be greater than or equal to 0";
          isValid = false;
        }

        if (variant.stock < 0) {
          variantError.stock = "Stock must be greater than or equal to 0";
          isValid = false;
        }

        if (!variant.sku) {
          variantError.sku = "SKU is required";
          isValid = false;
        }

        if (Object.keys(variantError).length > 0) {
          variantErrors[index] = variantError;
        }
      });

      if (Object.keys(variantErrors).length > 0) {
        newErrors.variants = variantErrors;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!validateForm(data)) {
      const firstError = document.querySelector(".text-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    console.log("Form Data:", data);
    try {
      const res = await axios.post("/api/add-products", data);
      console.log(res.data);
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Failed to ${isEdit ? "update" : "save"} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Info size={16} />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSign size={16} />
                Pricing
              </TabsTrigger>
              <TabsTrigger
                value="attributes"
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                Attributes
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex items-center gap-2">
                <Layers size={16} />
                Variants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <BasicInfoTab
                control={control}
                errors={errors}
                setValue={setValue}
              />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <PricingTab
                control={control}
                errors={errors}
                setValue={setValue}
              />
            </TabsContent>

            <TabsContent value="attributes" className="space-y-6">
              <AttributesTab
                control={control}
                errors={errors}
                attributes={currentAttributes}
                categoryLabel={categoryConfig.label}
              />
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <VariantsTab
                control={control}
                errors={errors}
                attributes={currentAttributes}
                hasVariants={hasVariants}
                categoryLabel={categoryConfig.label}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          <MediaSection control={control} errors={errors} />
          <SummarySidebar
            control={control}
            categoryLabel={categoryConfig.label}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
          />
        </div>
      </div>
    </form>
  );
}
