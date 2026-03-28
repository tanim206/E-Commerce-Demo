'use client';

import React, { useMemo } from 'react';
import Select, { StylesConfig } from 'react-select';

type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  options: Option[];
  value: Option | Option[] | null;
  onChange: (value: Option | Option[] | null) => void;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  isDisabled?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
};

const ReactSelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onChange,
  isMulti = false,
  className = '',
  placeholder = 'Select...',
  isDisabled = false,
  error = false,
  label,
  helperText,
}) => {
  const memoizedOptions = useMemo(() => options, [options]);

  const customStyles: StylesConfig<Option, boolean> = {
    control: (base, { isFocused }) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: error ? '#ef4444' : isFocused ? '#10b981' : '#d1d5db',
      borderWidth: '1px',
      borderRadius: '0.5rem',
      minHeight: '42px',
      padding: '0 0.5rem',
      boxShadow: isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
      '&:hover': {
        borderColor: error ? '#ef4444' : '#10b981',
      },
      transition: 'all 0.2s ease',
    }),
    input: (base) => ({
      ...base,
      color: '#111827',
      fontSize: '0.875rem',
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#111827',
      fontSize: '0.875rem',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#d1fae5',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#065f46',
      fontSize: '0.875rem',
      padding: '0.25rem 0.5rem',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#ef4444',
      borderRadius: '0 0.25rem 0.25rem 0',
      ':hover': {
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? '#10b981'
        : isFocused
        ? '#d1fae5'
        : 'white',
      color: isSelected ? 'white' : '#111827',
      fontSize: '0.875rem',
      padding: '0.5rem 1rem',
      ':active': {
        backgroundColor: '#059669',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 50,
    }),
    dropdownIndicator: (base, { isFocused }) => ({
      ...base,
      color: isFocused ? '#10b981' : '#9ca3af',
      ':hover': {
        color: '#10b981',
      },
      padding: '0 0.25rem',
    }),
    clearIndicator: (base) => ({
      ...base,
      color: '#9ca3af',
      ':hover': {
        color: '#ef4444',
      },
      padding: '0 0.25rem',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Select
        options={memoizedOptions}
        value={value}
        onChange={(newValue) => {
          if (Array.isArray(newValue)) {
            onChange(newValue.map(option => ({ ...option })));
          } else if (newValue) {
            onChange(newValue as Option | null);
          } else {
            onChange(null);
          }
        }}
        isMulti={isMulti}
        styles={customStyles}
        isClearable
        placeholder={placeholder}
        classNamePrefix="react-select"
        isDisabled={isDisabled}
        components={{
          IndicatorSeparator: null,
        }}
      />
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500">Please select a valid option</p>
      )}
    </div>
  );
};

export { ReactSelectInput };