import { type ReactNode } from "react";

export default function Card({
  children,
  className = "",
  ...props
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:-translate-y-px sm:p-8 ${className}`}
      style={{
        boxShadow: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      }}
      {...props}
    >
      {children}
    </section>
  );
}
