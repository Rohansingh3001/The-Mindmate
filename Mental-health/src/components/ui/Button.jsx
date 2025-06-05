// src/components/ui/Button.jsx
export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  let base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200";

  let variants = {
    default: "bg-purple-600 hover:bg-purple-700 text-white",
    outline:
      "border border-purple-600 text-purple-400 hover:bg-gray-700",
    ghost:
      "text-purple-400 hover:text-purple-300 bg-transparent hover:bg-gray-700",
  };

  return (
    <button
      className={`${base} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
