"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Controller, Control, RegisterOptions, useWatch, FieldValues, PathValue, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCloudinaryUpload } from "@/components/sharedComponents/uploadFiles/uploadCloudinary";
import { Calendar, Upload, X } from 'lucide-react';

// Common styles
const commonInputClasses = "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200";
const errorClasses = "border-red-500 focus:ring-red-200 focus:border-red-500";
const labelClasses = "block mb-2 text-sm font-medium text-gray-700";
const helperTextClasses = "mt-1.5 text-xs text-gray-500";
const errorTextClasses = "mt-1.5 text-xs text-red-500";

interface BaseFieldProps<T extends FieldValues = Record<string, unknown>> {
  name: string;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions;
  className?: string;
  disabled?: boolean;
  helperText?: string;
}

interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
  defaultValue?: string | number;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = <T extends FieldValues>({
  name,
  control,
  placeholder,
  rules = {},
  defaultValue = "",
  type = "text",
  className = "",
  disabled = false,
  onChange,
  label,
  helperText,
}: InputFieldProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCalendarClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <Label className={labelClasses}>{label}</Label>}
      <div className="relative">
        <Controller
          name={name as Path<T>}
          control={control}
          defaultValue={defaultValue as PathValue<T, Path<T>>}
          rules={rules as Omit<RegisterOptions<T>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">}
          render={({ field, fieldState: { error } }) => {
            const showFakePlaceholder = type === "date" && !field.value && !isFocused;

            return (
              <>
                {showFakePlaceholder && placeholder && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                    {placeholder}
                  </span>
                )}

                {type === "date" && (
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-emerald-600 transition-colors"
                    onClick={handleCalendarClick}
                  >
                    <Calendar size={20} />
                  </span>
                )}

                <Input
                  disabled={disabled}
                  {...field}
                  value={field.value as string | number | readonly string[] | undefined}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    field.onBlur();
                  }}
                  onChange={(e) => {
                    onChange?.(e);
                    field.onChange(e);
                  }}
                  type={type}
                  placeholder={type !== "date" ? placeholder : undefined}
                  className={`${commonInputClasses} ${error ? errorClasses : ''} ${
                    showFakePlaceholder ? "text-transparent" : ""
                  } ${type === "date" ? "appearance-none" : ""}`}
                  ref={inputRef}
                />

                {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
                {error && <p className={errorTextClasses}>{error.message}</p>}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

interface SelectOption {
  label: string;
  value: string;
}

interface SingleSelectProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  inputClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SingleSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  rules = {},
  placeholder = "Select an option",
  className = "",
  inputClassName = "",
  onChange,
  disabled = false,
  defaultValue,
  helperText,
}: SingleSelectProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevFieldValue = useRef<string | undefined>(undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && <Label className={labelClasses}>{label}</Label>}
      <Controller
        name={name as Path<T>}
        control={control}
        defaultValue={defaultValue as PathValue<T, Path<T>> || (options[0]?.value as PathValue<T, Path<T>>)}
        rules={rules as Omit<RegisterOptions<T>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">}
        render={({ field, fieldState: { error } }) => {
          if (!isTyping && prevFieldValue.current !== field.value) {
            const currentOption = options.find(opt => opt.value === field.value);
            setInputValue(currentOption?.label || "");
            prevFieldValue.current = field.value;
          }

          return (
            <>
              <div className="relative">
                <input
                  list={`${name}-options`}
                  disabled={disabled}
                  value={inputValue}
                  onChange={(e) => {
                    setIsTyping(true);
                    setInputValue(e.target.value);
                    onChange?.(e);
                  }}
                  onBlur={(e) => {
                    setIsTyping(false);
                    const selectedOption = options.find(
                      opt => opt.label === e.target.value || opt.value === e.target.value
                    );
                    if (selectedOption) {
                      field.onChange(selectedOption.value);
                      setInputValue(selectedOption.label);
                    } else {
                      const currentValidOption = options.find(
                        opt => opt.value === field.value
                      );
                      setInputValue(currentValidOption?.label || "");
                    }
                    field.onBlur();
                  }}
                  placeholder={placeholder}
                  className={`${commonInputClasses} ${inputClassName} ${error ? errorClasses : ''} pr-10`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <datalist id={`${name}-options`}>
                {options.map((option) => (
                  <option key={option.value} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </datalist>
              
              {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
              {error && <p className={errorTextClasses}>{error.message}</p>}
            </>
          );
        }}
      />
    </div>
  );
};

interface MultiSelectProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
}

const MultiSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  rules = {},
  className = "",
  helperText,
}: MultiSelectProps<T>) => (
  <div className={`w-full ${className}`}>
    {label && <Label className={labelClasses}>{label}</Label>}
    <Controller
      name={name as Path<T>}
      control={control}
      rules={rules as Omit<RegisterOptions<T, Path<T>>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <select
            multiple
            value={(Array.isArray(value) ? value : (value as string | number | readonly string[] | undefined)) || []}
            onChange={(e) =>
              onChange(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className={`${commonInputClasses} min-h-[100px] ${error ? errorClasses : ''}`}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="px-4 py-2 hover:bg-emerald-50"
              >
                {option.label}
              </option>
            ))}
          </select>
          {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
          {error && <p className={errorTextClasses}>{error.message}</p>}
        </>
      )}
    />
  </div>
);

interface FileUploadFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  accept?: string;
  multiple?: boolean;
  placeholder?: string;
  buttonText?: string;
  buttonClassName?: string;
  buttonIcon?: React.ReactNode;
  previewContainerClassName?: string;
  previewItemClassName?: string;
  buttonContainerClassName?: string;
  showPreview?: boolean;
  maxFiles?: number;
}

const FileUploadField = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  accept = "image/*",
  className = "",
  multiple = false,
  placeholder = "No file chosen",
  buttonText = "Upload Files",
  buttonClassName = "bg-emerald-600 hover:bg-emerald-700 text-white",
  buttonIcon = <Upload size={16} />,
  previewContainerClassName = "",
  previewItemClassName = "",
  buttonContainerClassName = "border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-lg",
  showPreview = true,
  maxFiles,
  helperText,
}: FileUploadFieldProps<T>) => {
  const { uploadToCloudinary } = useCloudinaryUpload();
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fieldValue = useWatch({
    control,
    name: name as Path<T>,
    defaultValue: (multiple ? [] : null) as PathValue<T, Path<T>>,
  });

  useEffect(() => {
    if (!fieldValue) {
      setPreviewUrls([]);
    } else {
      setPreviewUrls(Array.isArray(fieldValue) ? fieldValue : [fieldValue]);
    }
  }, [fieldValue]);

  const handleRemoveImage = (index: number) => {
    const updated = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updated);
    return multiple ? updated : updated[0] || null;
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url);
  };

  const isPdf = (url: string) => {
    return /\.(pdf)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(url);
  };

  const getFileTypeIcon = (url: string) => {
    if (isPdf(url)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="bg-red-50 p-3 rounded-lg mb-2">
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">PDF</span>
        </div>
      );
    }
    if (isVideo(url)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="bg-purple-50 p-3 rounded-lg mb-2">
            <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Video</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-blue-50 p-3 rounded-lg mb-2">
          <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs text-gray-600">File</span>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <Label className={labelClasses}>{label}</Label>}
      <Controller
        name={name as Path<T>}
        control={control}
        rules={{
          ...rules,
          validate: {
            ...(rules.validate || {}),
            maxFiles: (value: PathValue<T, Path<T>>) => {
              if (!maxFiles) return true;
              const files = Array.isArray(value) ? value : (value ? [value] : []);
              return files.length <= maxFiles || `Maximum ${maxFiles} files allowed`;
            }
          },
          deps: rules.deps as Path<T> | Path<T>[] | undefined
        }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            {/* Hidden file input */}
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={uploading}
              ref={inputRef}
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                if (maxFiles && fieldValue && 
                    (Array.isArray(fieldValue) ? fieldValue.length : 1) + files.length > maxFiles) {
                  alert(`You can only upload up to ${maxFiles} files`);
                  return;
                }

                setUploading(true);
                try {
                  const urls: string[] = [];
                  for (const file of files) {
                    const url = await uploadToCloudinary(file);
                    if (url) urls.push(url);
                  }

                  if (urls.length) {
                    const newValue = multiple
                      ? [...(Array.isArray(fieldValue) ? fieldValue : []), ...urls]
                      : urls[0];

                    setPreviewUrls(Array.isArray(newValue) ? newValue : [newValue]);
                    onChange(newValue);
                  }
                } catch (err) {
                  console.error("Upload failed:", err);
                } finally {
                  setUploading(false);
                  if (inputRef.current) inputRef.current.value = '';
                }
              }}
              className="hidden"
            />

            {/* Upload trigger */}
            <div className="relative">
              <div
                onClick={() => inputRef.current?.click()}
                className={`
                  ${buttonContainerClassName}
                  cursor-pointer rounded-lg transition
                  flex flex-col items-center justify-center p-6 gap-2
                  ${error ? "border-red-500" : ""}
                  ${uploading ? "opacity-70" : ""}
                `}
              >
                <button
                  type="button"
                  className={`${buttonClassName} inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  {buttonIcon}
                  {buttonText}
                </button>
                <p className="text-gray-500 text-sm">
                  {placeholder}
                </p>
              </div>
            </div>

            {/* Helper text */}
            {helperText && !error && (
              <p className={helperTextClasses}>
                {helperText}
              </p>
            )}

            {/* Preview section */}
            {showPreview && previewUrls.length > 0 && (
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4 ${previewContainerClassName}`}>
                {previewUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-lg bg-gray-100 overflow-hidden shadow-sm group ${previewItemClassName}`}
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(handleRemoveImage(index));
                      }}
                      className="absolute top-2 right-2 bg-white hover:bg-red-500 text-gray-700 hover:text-white rounded-full p-1 shadow-sm z-10 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remove file"
                    >
                      <X size={16} />
                    </button>

                    {/* File preview container */}
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      {isImage(url) ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={url}
                            alt={`Preview ${index}`}
                            fill
                            sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, 250px"
                            className="object-cover"
                            priority={index < 3}
                          />
                        </div>
                      ) : isVideo(url) ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-black/10">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        getFileTypeIcon(url)
                      )}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Error message */}
            {error && (
              <p className={errorTextClasses}>
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export { InputField, SingleSelect, MultiSelect, FileUploadField };