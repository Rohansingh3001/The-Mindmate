// components/ui/Input.jsx
import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={clsx(
          `w-full px-4 py-2 rounded-lg text-sm border 
           border-gray-300 dark:border-gray-700 
           bg-white dark:bg-gray-800 
           text-gray-900 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-gray-500
           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
           transition duration-200`,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
