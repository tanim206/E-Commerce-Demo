"use client";



import React, { useEffect, useState } from "react";

import { useForm, useFieldArray } from "react-hook-form";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Switch } from "@/components/ui/switch";

import { Label } from "@/components/ui/label";

import { 

  Plus, 

  Trash2, 

  Save, 

  Package,

  Image as ImageIcon,

  Settings,

  Info,

  DollarSign,

  Layers

} from "lucide-react";

import { InputField, SingleSelect, MultiSelect, FileUploadField } from "@/components/sharedComponents/reuseableInputs/reuseableInputs";



// ============= Types =============



interface AttributeField {

  key: string;

  label: string;

  type: "text" | "number" | "select" | "multiselect" | "textarea";

  required?: boolean;

  options?: { label: string; value: string }[];

  placeholder?: string;

}



interface Variant {

  variant_id?: string;

  attributes: Record<string, string>;

  price: number;

  stock: number;

  sku: string;

  images?: string[];

}



interface ProductFormData {

  name: string;

  slug: string;

  short_description?: string;

  description: string;

  price: number;

  discount_price?: number;

  currency: string;

  category: string;

  brand: string;

  sku: string;

  stock: number;

  images: string[];

  thumbnail?: string;

  is_featured: boolean;

  is_active: boolean;

  attributes: Record<string, any>;

  variants?: Variant[];

}



interface FormErrors {

  name?: string;

  slug?: string;

  description?: string;

  price?: string;

  discount_price?: string;

  category?: string;

  brand?: string;

  sku?: string;

  stock?: string;

  images?: string;

  attributes?: Record<string, string>;

  variants?: { [key: number]: { price?: string; stock?: string; sku?: string } };

}



// ============= Category Configuration =============



const CATEGORY_CONFIG: Record<string, {

  label: string;

  attributes: AttributeField[];

  hasVariants?: boolean;

}> = {

  clothing: {

    label: "Clothing & Apparel",

    hasVariants: true,

    attributes: [

      { key: "size", label: "Size", type: "select", required: true, options: [

        { label: "XS", value: "XS" },

        { label: "S", value: "S" },

        { label: "M", value: "M" },

        { label: "L", value: "L" },

        { label: "XL", value: "XL" },

        { label: "XXL", value: "XXL" }

      ]},

      { key: "color", label: "Color", type: "select", required: true, options: [

        { label: "Black", value: "Black" },

        { label: "White", value: "White" },

        { label: "Blue", value: "Blue" },

        { label: "Red", value: "Red" },

        { label: "Green", value: "Green" },

        { label: "Yellow", value: "Yellow" }

      ]},

      { key: "material", label: "Material", type: "text", placeholder: "e.g., Cotton, Polyester" },

      { key: "gender", label: "Gender", type: "select", options: [

        { label: "Male", value: "Male" },

        { label: "Female", value: "Female" },

        { label: "Unisex", value: "Unisex" }

      ]},

      { key: "fit", label: "Fit", type: "select", options: [

        { label: "Regular", value: "Regular" },

        { label: "Slim", value: "Slim" },

        { label: "Loose", value: "Loose" }

      ]}

    ]

  },

  electronics: {

    label: "Electronics",

    hasVariants: true,

    attributes: [

      { key: "brand", label: "Brand", type: "text", required: true, placeholder: "e.g., Samsung, Apple" },

      { key: "model", label: "Model", type: "text", required: true, placeholder: "e.g., Galaxy S23" },

      { key: "storage", label: "Storage", type: "select", options: [

        { label: "64GB", value: "64GB" },

        { label: "128GB", value: "128GB" },

        { label: "256GB", value: "256GB" },

        { label: "512GB", value: "512GB" },

        { label: "1TB", value: "1TB" }

      ]},

      { key: "ram", label: "RAM", type: "select", options: [

        { label: "4GB", value: "4GB" },

        { label: "6GB", value: "6GB" },

        { label: "8GB", value: "8GB" },

        { label: "12GB", value: "12GB" },

        { label: "16GB", value: "16GB" }

      ]},

      { key: "battery", label: "Battery", type: "text", placeholder: "e.g., 5000mAh" },

      { key: "warranty", label: "Warranty", type: "text", placeholder: "e.g., 1 Year" },

      { key: "color", label: "Color", type: "select", options: [

        { label: "Black", value: "Black" },

        { label: "White", value: "White" },

        { label: "Blue", value: "Blue" },

        { label: "Silver", value: "Silver" },

        { label: "Gold", value: "Gold" }

      ]}

    ]

  },

  furniture: {

    label: "Furniture",

    attributes: [

      { key: "material", label: "Material", type: "text", required: true, placeholder: "e.g., Wood, Metal" },

      { key: "color", label: "Color", type: "select", options: [

        { label: "Brown", value: "Brown" },

        { label: "Black", value: "Black" },

        { label: "White", value: "White" },

        { label: "Gray", value: "Gray" }

      ]},

      { key: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g., 120x60x75 cm" },

      { key: "weight", label: "Weight", type: "text", placeholder: "e.g., 15 kg" },

      { key: "assembly_required", label: "Assembly Required", type: "select", options: [

        { label: "Yes", value: "yes" },

        { label: "No", value: "no" }

      ]}

    ]

  },

  books: {

    label: "Books",

    attributes: [

      { key: "author", label: "Author", type: "text", required: true },

      { key: "publisher", label: "Publisher", type: "text" },

      { key: "isbn", label: "ISBN", type: "text" },

      { key: "pages", label: "Pages", type: "number" },

      { key: "language", label: "Language", type: "text", placeholder: "e.g., English" },

      { key: "edition", label: "Edition", type: "text" }

    ]

  },

  beauty: {

    label: "Beauty & Personal Care",

    attributes: [

      { key: "brand", label: "Brand", type: "text", required: true },

      { key: "type", label: "Product Type", type: "text", required: true },

      { key: "skin_type", label: "Skin Type", type: "multiselect", options: [

        { label: "Normal", value: "Normal" },

        { label: "Oily", value: "Oily" },

        { label: "Dry", value: "Dry" },

        { label: "Combination", value: "Combination" },

        { label: "Sensitive", value: "Sensitive" }

      ]},

      { key: "ingredients", label: "Ingredients", type: "textarea" },

      { key: "expiry_date", label: "Expiry Date", type: "text", placeholder: "e.g., 24 months" }

    ]

  },

  sports: {

    label: "Sports & Outdoors",

    attributes: [

      { key: "brand", label: "Brand", type: "text", required: true },

      { key: "sport_type", label: "Sport Type", type: "text", required: true },

      { key: "size", label: "Size", type: "select", options: [

        { label: "S", value: "S" },

        { label: "M", value: "M" },

        { label: "L", value: "L" },

        { label: "XL", value: "XL" }

      ]},

      { key: "material", label: "Material", type: "text" }

    ]

  }

};



// ============= Main Component =============



export default function ProductFormPage() {

  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("clothing");

  const [activeTab, setActiveTab] = useState("basic");

  const [showVariants, setShowVariants] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  

  const categoryConfig = CATEGORY_CONFIG[selectedCategory] || CATEGORY_CONFIG.clothing;

  

  const form = useForm<ProductFormData>({

    defaultValues: {

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

      variants: []

    }

  });

  

  const { control, handleSubmit, watch, setValue, getValues } = form;

  const { fields: variantFields, append, remove } = useFieldArray({

    control,

    name: "variants"

  });

  

  const watchedCategory = watch("category");

  const watchedName = watch("name");

  

  // Auto-generate slug from name

  useEffect(() => {

    if (watchedName && !getValues("slug")) {

      const slug = watchedName

        .toLowerCase()

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/^-+|-+$/g, "");

      setValue("slug", slug);

    }

  }, [watchedName, setValue, getValues]);

  

  // Update category config when category changes

  useEffect(() => {

    if (watchedCategory && CATEGORY_CONFIG[watchedCategory]) {

      setSelectedCategory(watchedCategory);

      // Reset attributes when category changes

      const newAttributes: Record<string, any> = {};

      CATEGORY_CONFIG[watchedCategory].attributes.forEach(attr => {

        if (attr.type === "multiselect") {

          newAttributes[attr.key] = [];

        } else {

          newAttributes[attr.key] = "";

        }

      });

      setValue("attributes", newAttributes);

      setShowVariants(!!CATEGORY_CONFIG[watchedCategory].hasVariants);

    }

  }, [watchedCategory, setValue]);

  

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

      newErrors.discount_price = "Discount price must be less than regular price";

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

    categoryConfig.attributes.forEach(attr => {

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

      const variantErrors: { [key: number]: { price?: string; stock?: string; sku?: string } } = {};

      data.variants.forEach((variant, index) => {

        const variantError: { price?: string; stock?: string; sku?: string } = {};

        

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

      // Scroll to first error

      const firstError = document.querySelector(".text-red-500");

      if (firstError) {

        firstError.scrollIntoView({ behavior: "smooth", block: "center" });

      }

      return;

    }

    

    setIsSubmitting(true);

    try {

      console.log("Form Data:", data);

      // API call to save product

      // await fetch('/api/products', { method: 'POST', body: JSON.stringify(data) });

      // alert("Product saved successfully!");

      // router.push("/products");

    } catch (error) {

      console.error("Error saving product:", error);

      alert("Failed to save product");

    } finally {

      setIsSubmitting(false);

    }

  };

  

  const renderAttributeField = (attr: AttributeField) => {

    const hasError = errors.attributes?.[attr.key];

    

    switch (attr.type) {

      case "number":

        return (

          <div key={attr.key} className="space-y-2">

            <InputField

              name={`attributes.${attr.key}`}

              control={control}

              label={attr.label}

              type="number"

              placeholder={attr.placeholder}

              rules={{ 

                setValueAs: (v) => v === "" ? undefined : Number(v)

              }}

            />

            {hasError && (

              <p className="text-xs text-red-500">{hasError}</p>

            )}

          </div>

        );

        

      case "select":

        return (

          <div key={attr.key} className="space-y-2">

            <SingleSelect

              name={`attributes.${attr.key}`}

              control={control}

              label={attr.label}

              options={attr.options || []}

              placeholder={`Select ${attr.label.toLowerCase()}`}

            />

            {hasError && (

              <p className="text-xs text-red-500">{hasError}</p>

            )}

          </div>

        );

        

      case "multiselect":

        return (

          <div key={attr.key} className="space-y-2">

            <MultiSelect

              name={`attributes.${attr.key}`}

              control={control}

              label={attr.label}

              options={attr.options || []}

            />

            {hasError && (

              <p className="text-xs text-red-500">{hasError}</p>

            )}

          </div>

        );

        

      case "textarea":

        return (

          <div key={attr.key} className="space-y-2">

            <label className="block text-sm font-medium text-gray-700">

              {attr.label} {attr.required && <span className="text-red-500">*</span>}

            </label>

            <textarea

              {...control.register(`attributes.${attr.key}`)}

              className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${

                hasError 

                  ? "border-red-500 focus:ring-red-200 focus:border-red-500" 

                  : "border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

              }`}

              rows={3}

              placeholder={attr.placeholder}

            />

            {hasError && (

              <p className="text-xs text-red-500">{hasError}</p>

            )}

          </div>

        );

        

      default:

        return (

          <div key={attr.key} className="space-y-2">

            <InputField

              name={`attributes.${attr.key}`}

              control={control}

              label={attr.label}

              placeholder={attr.placeholder}

            />

            {hasError && (

              <p className="text-xs text-red-500">{hasError}</p>

            )}

          </div>

        );

    }

  };

  

  return (

    <div className="container mx-auto py-8 px-4 max-w-7xl">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>

        <p className="text-gray-600 mt-2">Create a new product with detailed information and specifications</p>

      </div>

      

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form - Left Side */}

          <div className="lg:col-span-2 space-y-6">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

              <TabsList className="grid w-full grid-cols-4 mb-6">

                <TabsTrigger value="basic" className="flex items-center gap-2">

                  <Info size={16} />

                  Basic Info

                </TabsTrigger>

                <TabsTrigger value="pricing" className="flex items-center gap-2">

                  <DollarSign size={16} />

                  Pricing

                </TabsTrigger>

                <TabsTrigger value="attributes" className="flex items-center gap-2">

                  <Settings size={16} />

                  Attributes

                </TabsTrigger>

                <TabsTrigger value="variants" className="flex items-center gap-2">

                  <Layers size={16} />

                  Variants

                </TabsTrigger>

              </TabsList>

              

              {/* Basic Info Tab */}

              <TabsContent value="basic" className="space-y-6">

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

              </TabsContent>

              

              {/* Pricing Tab */}

              <TabsContent value="pricing" className="space-y-6">

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

                            setValueAs: (v) => v === "" ? 0 : Number(v)

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

                            setValueAs: (v) => v === "" ? undefined : Number(v)

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

                        {errors.sku && (

                          <p className="text-xs text-red-500">{errors.sku}</p>

                        )}

                      </div>

                      

                      <div className="space-y-2">

                        <InputField

                          name="stock"

                          control={control}

                          label="Stock Quantity"

                          type="number"

                          placeholder="0"

                          rules={{ 

                            setValueAs: (v) => v === "" ? 0 : Number(v)

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

                          checked={watch("is_featured")}

                          onCheckedChange={(checked) => setValue("is_featured", checked)}

                        />

                        <Label className="text-sm font-medium">Feature this product</Label>

                      </div>

                      

                      <div className="flex items-center gap-2">

                        <Switch

                          checked={watch("is_active")}

                          onCheckedChange={(checked) => setValue("is_active", checked)}

                        />

                        <Label className="text-sm font-medium">Active product</Label>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              </TabsContent>

              

              {/* Attributes Tab */}

              <TabsContent value="attributes" className="space-y-6">

                <Card>

                  <CardHeader>

                    <CardTitle className="flex items-center gap-2">

                      <Settings size={20} />

                      Product Specifications

                    </CardTitle>

                    <p className="text-sm text-gray-500 mt-1">

                      Custom attributes for {categoryConfig.label} category

                    </p>

                  </CardHeader>

                  <CardContent className="space-y-4">

                    {categoryConfig.attributes.map(attr => renderAttributeField(attr))}

                  </CardContent>

                </Card>

              </TabsContent>

              

              {/* Variants Tab */}

              <TabsContent value="variants" className="space-y-6">

                {showVariants ? (

                  <Card>

                    <CardHeader>

                      <CardTitle className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <Layers size={20} />

                          Product Variants

                        </div>

                        <Button

                          type="button"

                          size="sm"

                          onClick={() => {

                            const attributes: Record<string, string> = {};

                            categoryConfig.attributes.forEach(attr => {

                              if (attr.type === "select" || attr.type === "text") {

                                attributes[attr.key] = "";

                              }

                            });

                            append({

                              attributes,

                              price: 0,

                              stock: 0,

                              sku: "",

                              images: []

                            });

                          }}

                        >

                          <Plus size={16} className="mr-1" />

                          Add Variant

                        </Button>

                      </CardTitle>

                    </CardHeader>

                    <CardContent className="space-y-4">

                      {variantFields.length === 0 ? (

                        <div className="text-center py-8 text-gray-500">

                          <Package size={48} className="mx-auto mb-3 opacity-50" />

                          <p>No variants added yet</p>

                          <Button

                            type="button"

                            variant="outline"

                            className="mt-3"

                            onClick={() => {

                              const attributes: Record<string, string> = {};

                              categoryConfig.attributes.forEach(attr => {

                                if (attr.type === "select" || attr.type === "text") {

                                  attributes[attr.key] = "";

                                }

                              });

                              append({

                                attributes,

                                price: 0,

                                stock: 0,

                                sku: "",

                                images: []

                              });

                            }}

                          >

                            <Plus size={16} className="mr-1" />

                            Add First Variant

                          </Button>

                        </div>

                      ) : (

                        variantFields.map((field, index) => (

                          <div key={field.id} className="border rounded-lg p-4 space-y-4">

                            <div className="flex justify-between items-center">

                              <h4 className="font-medium">Variant {index + 1}</h4>

                              <Button

                                type="button"

                                variant="ghost"

                                size="sm"

                                onClick={() => remove(index)}

                                className="text-red-500 hover:text-red-700"

                              >

                                <Trash2 size={16} />

                              </Button>

                            </div>

                            

                            <div className="grid grid-cols-2 gap-4">

                              {categoryConfig.attributes

                                .filter(attr => attr.type === "select" || attr.type === "text")

                                .map(attr => (

                                  <SingleSelect

                                    key={`${field.id}-${attr.key}`}

                                    name={`variants.${index}.attributes.${attr.key}`}

                                    control={control}

                                    label={attr.label}

                                    options={attr.options || []}

                                    placeholder={`Select ${attr.label}`}

                                  />

                                ))}

                            </div>

                            

                            <div className="grid grid-cols-3 gap-4">

                              <div className="space-y-2">

                                <InputField

                                  name={`variants.${index}.price`}

                                  control={control}

                                  label="Price"

                                  type="number"

                                  placeholder="0"

                                  rules={{ 

                                    setValueAs: (v) => v === "" ? 0 : Number(v)

                                  }}

                                />

                                {errors.variants?.[index]?.price && (

                                  <p className="text-xs text-red-500">{errors.variants[index].price}</p>

                                )}

                              </div>

                              

                              <div className="space-y-2">

                                <InputField

                                  name={`variants.${index}.stock`}

                                  control={control}

                                  label="Stock"

                                  type="number"

                                  placeholder="0"

                                  rules={{ 

                                    setValueAs: (v) => v === "" ? 0 : Number(v)

                                  }}

                                />

                                {errors.variants?.[index]?.stock && (

                                  <p className="text-xs text-red-500">{errors.variants[index].stock}</p>

                                )}

                              </div>

                              

                              <div className="space-y-2">

                                <InputField

                                  name={`variants.${index}.sku`}

                                  control={control}

                                  label="SKU"

                                  placeholder="SKU"

                                />

                                {errors.variants?.[index]?.sku && (

                                  <p className="text-xs text-red-500">{errors.variants[index].sku}</p>

                                )}

                              </div>

                            </div>

                            

                            <FileUploadField

                              name={`variants.${index}.images`}

                              control={control}

                              label="Variant Images"

                              multiple

                              maxFiles={3}

                              placeholder="Upload variant specific images"

                            />

                          </div>

                        ))

                      )}

                    </CardContent>

                  </Card>

                ) : (

                  <Card>

                    <CardContent className="py-12 text-center text-gray-500">

                      <Package size={48} className="mx-auto mb-3 opacity-50" />

                      <p>Variants are not available for this category</p>

                      <p className="text-sm mt-2">Select a category that supports variants (Clothing, Electronics)</p>

                    </CardContent>

                  </Card>

                )}

              </TabsContent>

            </Tabs>

          </div>

          

          {/* Sidebar - Right Side */}

          <div className="space-y-6">

            {/* Images Upload */}

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

            

            {/* Summary Card */}

            <Card className="sticky top-6">

              <CardHeader>

                <CardTitle>Product Summary</CardTitle>

              </CardHeader>

              <CardContent className="space-y-3">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600">Category:</span>

                  <Badge variant="outline">{categoryConfig.label}</Badge>

                </div>

                <Separator />

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600">Price:</span>

                  <span className="font-semibold">

                    {watch("price") > 0 ? `BDT ${watch("price")}` : "Not set"}

                  </span>

                </div>

                {watch("discount_price") && (

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-600">Discount:</span>

                    <span className="text-green-600 font-semibold">

                      BDT {watch("discount_price")}

                    </span>

                  </div>

                )}

                <Separator />

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600">Stock:</span>

                  <span className={watch("stock") > 0 ? "text-green-600" : "text-red-600"}>

                    {watch("stock") > 0 ? `${watch("stock")} units` : "Out of stock"}

                  </span>

                </div>

                <Separator />

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600">Status:</span>

                  <Badge variant={watch("is_active") ? "default" : "secondary"}>

                    {watch("is_active") ? "Active" : "Inactive"}

                  </Badge>

                </div>

                {watch("is_featured") && (

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-600">Featured:</span>

                    <Badge variant="outline" className="bg-yellow-50">Yes</Badge>

                  </div>

                )}

              </CardContent>

              <div className="p-6 pt-0 flex gap-3">

                <Button type="submit" className="flex-1" disabled={isSubmitting}>

                  <Save size={16} className="mr-2" />

                  {isSubmitting ? "Saving..." : "Save Product"}

                </Button>

                <Button type="button" variant="outline" onClick={() => router.back()}>

                  Cancel

                </Button>

              </div>

            </Card>

          </div>

        </div>

      </form>

    </div>

  );

}