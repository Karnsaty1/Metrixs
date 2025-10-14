// src/components/Button.jsx
import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  fullWidth = false,
  variant = "primary", // Added a variant prop
}) {
  // Base classes for the button
  const baseClasses = `
    ${fullWidth ? "w-full" : "w-auto"} 
    h-12 px-6 
    flex items-center justify-center // Added flex for better content centering
    rounded-xl // Slightly larger rounding for a softer look
    font-medium // Slightly lighter font weight
    tracking-wide // Added letter spacing for better readability
    transition-all duration-300 ease-in-out 
    focus:outline-none focus:ring-4 focus:ring-offset-2 // Improved focus state for accessibility
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className} // Apply custom classes last
  `;

  // Variant-specific classes
  const variantClasses = {
    primary: `
      text-white 
      bg-blue-600 
      hover:bg-blue-700 
      active:bg-blue-800 // Added active state for a more tactile feel
      shadow-lg hover:shadow-xl // Stronger shadow for depth
      focus:ring-blue-500
    `,
    secondary: `
      text-gray-700 
      bg-gray-200 
      hover:bg-gray-300 
      active:bg-gray-400
      border border-gray-300
      shadow-sm hover:shadow-md
      focus:ring-gray-300
    `,
    danger: `
      text-white 
      bg-red-600 
      hover:bg-red-700 
      active:bg-red-800
      shadow-lg hover:shadow-xl
      focus:ring-red-500
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary}`}
    >
      {children}
    </button>
  );
}