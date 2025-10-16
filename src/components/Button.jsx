// src/components/Button.jsx
import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "medium",
}) {
  const baseClasses = `
    ${fullWidth ? "w-full" : "w-auto"}
    inline-flex items-center justify-center
    font-medium
    border border-transparent
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${className}
  `;

  const sizeClasses = {
    small: "h-8 px-3 text-sm rounded-md",
    medium: "h-10 px-4 text-sm rounded-lg",
    large: "h-12 px-6 text-base rounded-lg",
  };

  const variantClasses = {
    primary: `
      text-white
      bg-blue-600
      hover:bg-blue-700
      active:bg-blue-800
      focus:ring-blue-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      text-gray-700
      bg-white
      hover:bg-gray-50
      active:bg-gray-100
      border-gray-300
      focus:ring-gray-500
      shadow-sm hover:shadow-md
    `,
    success: `
      text-white
      bg-green-600
      hover:bg-green-700
      active:bg-green-800
      focus:ring-green-500
      shadow-sm hover:shadow-md
    `,
    danger: `
      text-white
      bg-red-600
      hover:bg-red-700
      active:bg-red-800
      focus:ring-red-500
      shadow-sm hover:shadow-md
    `,
    ghost: `
      text-gray-700
      bg-transparent
      hover:bg-gray-100
      active:bg-gray-200
      focus:ring-gray-500
    `,
    outline: `
      text-blue-600
      bg-transparent
      hover:bg-blue-50
      active:bg-blue-100
      border-blue-300
      focus:ring-blue-500
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.primary}`}
    >
      {children}
    </button>
  );
}
