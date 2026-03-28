// components/product-form/AttributesTab.tsx

import React from "react";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, SingleSelect, MultiSelect } from "@/components/sharedComponents/reuseableInputs/reuseableInputs";
import { AttributeField, ProductFormData, FormErrors } from "@/types/ProductFormTypes";
import { Settings } from "lucide-react";

interface AttributesTabProps {
  control: Control<ProductFormData>;
  errors: FormErrors;
  attributes: AttributeField[];
  categoryLabel: string;
}

export default function AttributesTab({ control, errors, attributes, categoryLabel }: AttributesTabProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={20} />
          Product Specifications
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Custom attributes for {categoryLabel} category
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {attributes.map(attr => renderAttributeField(attr))}
      </CardContent>
    </Card>
  );
}