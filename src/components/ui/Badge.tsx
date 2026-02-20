type BadgeVariant = "default" | "success" | "warning" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-zinc-600 bg-zinc-800 text-zinc-200",
  success: "border-zinc-500 bg-zinc-700 text-zinc-100",
  warning: "border-zinc-600 bg-zinc-800 text-zinc-300",
  muted: "border-zinc-700 bg-zinc-800/50 text-zinc-400",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
