import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "outline";

const baseClasses =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[#C6A75E] bg-transparent text-[#F4F4F2] hover:bg-[rgba(198,167,94,0.08)] hover:shadow-[0_0_20px_rgba(198,167,94,0.08)]",
  ghost:
    "text-[rgba(244,244,242,0.6)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F4F4F2]",
  outline:
    "border border-[rgba(255,255,255,0.12)] bg-transparent text-[rgba(244,244,242,0.8)] hover:border-[#C6A75E] hover:text-[#C6A75E] hover:bg-[rgba(198,167,94,0.04)]",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
