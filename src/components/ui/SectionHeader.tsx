import { type ReactNode } from "react";

/**
 * Editorial section: small-caps label, large title, optional thin rule, children.
 */
export default function SectionHeader({
  label,
  title,
  children,
  className = "",
}: {
  label: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-[rgba(244,244,242,0.5)]">
        {label}
      </span>
      <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-[#F4F4F2] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-3 h-px w-12 bg-[#C6A75E]" />
      {children && (
        <p className="mt-4 max-w-xl text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}
