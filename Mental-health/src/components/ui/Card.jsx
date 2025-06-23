// src/components/ui/Card.jsx

import React from "react";
import clsx from "clsx";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white dark:bg-gray-800 shadow-md transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={clsx("p-5", className)} {...props}>
      {children}
    </div>
  );
}
