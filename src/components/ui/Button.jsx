const variants = {
  primary:   "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
  danger:    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  ghost:     "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
};

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}