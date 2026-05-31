export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-white text-slate-950 hover:bg-white/90",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent hover:bg-white/10",
  }

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}