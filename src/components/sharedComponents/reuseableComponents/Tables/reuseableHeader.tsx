// components/SearchInput.jsx
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  heading: string;
  titleClassName?: string; // Add this new prop
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  heading,
  titleClassName = "font-bold text-xl sm:text-2xl lg:text-3xl mb-2 lg:mb-0 text-green-800" // Default value
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 lg:gap-8 px-4 sm:px-6 lg:px-10 py-4 text-black font-semibold">
      {/* Heading Section */}
      <div className="w-full lg:w-auto text-center lg:text-left">
        <h3 className={titleClassName}>
          {heading}
        </h3>
      </div>

      {/* Input Section */}
      <div className="relative w-full md:w-64">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export { SearchInput };