// config/CategoryConfig.ts

import { AttributeField } from "@/types/ProductFormTypes";

export const CATEGORY_CONFIG: Record<string, {
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
    hasVariants: false,
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
    hasVariants: false,
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
    hasVariants: false,
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
    hasVariants: false,
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

export const getCategoryAttributes = (category: string): AttributeField[] => {
  return CATEGORY_CONFIG[category]?.attributes || [];
};

export const categoryHasVariants = (category: string): boolean => {
  return CATEGORY_CONFIG[category]?.hasVariants || false;
};