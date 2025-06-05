// src/components/ui/Card.jsx
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-gray-800 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}
