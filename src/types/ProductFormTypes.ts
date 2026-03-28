// types/ProductFormTypes.ts

export interface AttributeField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "textarea";
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface Variant {
  variant_id?: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  sku: string;
  images?: string[];
}

export interface ProductFormData {
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

export interface FormErrors {
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