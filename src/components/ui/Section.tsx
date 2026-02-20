import { type ReactNode } from "react";

export default function Section({
  title,
  children,
  id,
  className = "",
}: {
  title: string;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`space-y-4 ${className}`} aria-labelledby={id ? `${id}-heading` : undefined}>
      <h2
        id={id ? `${id}-heading` : undefined}
        className="text-lg font-semibold text-zinc-100"
      >
        {title}
      </h2>
      <div className="h-px bg-zinc-800" role="presentation" />
      <div className="pt-1">{children}</div>
    </section>
  );
}
