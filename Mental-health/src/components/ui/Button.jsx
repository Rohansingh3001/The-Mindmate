// src/components/ui/Button.jsx

import React from "react";
import clsx from "clsx";

export function Button({
  children,
  className = "",
  variant = "default",
  disabled = false,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
    outline:
      "border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 focus:ring-purple-500",
    ghost:
      "text-purple-600 hover:text-purple-700 bg-transparent hover:bg-purple-50 dark:hover:bg-gray-800 focus:ring-purple-500",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
