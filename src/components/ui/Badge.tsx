type BadgeVariant = "default" | "success" | "warning" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-[rgba(244,244,242,0.8)]",
  success: "border-[#C6A75E] bg-[rgba(198,167,94,0.08)] text-[#C6A75E]",
  warning: "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-[rgba(244,244,242,0.6)]",
  muted: "border-[rgba(255,255,255,0.08)] bg-transparent text-[rgba(244,244,242,0.4)]",
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
