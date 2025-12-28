export default function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
      {/* Spinning Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
    </div>
  )
}
