// components/product-form/VariantsTab.tsx

import React from "react";
import { Control, useFieldArray, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField, SingleSelect, FileUploadField } from "@/components/sharedComponents/reuseableInputs/reuseableInputs";
import { AttributeField, ProductFormData, FormErrors, Variant } from "@/types/ProductFormTypes";
import { Plus, Trash2, Package } from "lucide-react";

interface VariantsTabProps {
  control: Control<ProductFormData>;
  errors: FormErrors;
  attributes: AttributeField[];
  hasVariants: boolean;
  categoryLabel: string;
}

export default function VariantsTab({ control, errors, attributes, hasVariants, categoryLabel }: VariantsTabProps) {
  const { fields: variantFields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const addVariant = () => {
    const newAttributes: Record<string, string> = {};
    attributes.forEach(attr => {
      if (attr.type === "select" || attr.type === "text") {
        newAttributes[attr.key] = "";
      }
    });
    append({
      attributes: newAttributes,
      price: 0,
      stock: 0,
      sku: "",
      images: []
    });
  };

  if (!hasVariants) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Package size={48} className="mx-auto mb-3 opacity-50" />
          <p>Variants are not available for this category</p>
          <p className="text-sm mt-2">Select a category that supports variants (Clothing, Electronics)</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={20} />
            Product Variants
          </div>
          <Button type="button" size="sm" onClick={addVariant}>
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
              onClick={addVariant}
            >
              <Plus size={16} className="mr-1" />
              Add First Variant
            </Button>
          </div>
        ) : (
          variantFields.map((field, index) => (
            <VariantItem
              key={field.id}
              index={index}
              control={control}
              errors={errors}
              attributes={attributes}
              remove={remove}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface VariantItemProps {
  index: number;
  control: Control<ProductFormData>;
  errors: FormErrors;
  attributes: AttributeField[];
  remove: UseFieldArrayRemove;
}

function VariantItem({ index, control, errors, attributes, remove }: VariantItemProps) {
  const selectableAttributes = attributes.filter(attr => attr.type === "select" || attr.type === "text");

  return (
    <div className="border rounded-lg p-4 space-y-4">
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
        {selectableAttributes.map(attr => (
          <SingleSelect
            key={`${index}-${attr.key}`}
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
  );
}